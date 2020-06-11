const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { transformUser } = require('./transforms')


module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already')
            }
            const hashedPW = await bcrypt.hash(args.userInput.password, 12)
            
            const user = new User({
                email: args.userInput.email,
                password: hashedPW,
            });
            const result =  await user.save()
            return { ...result._doc, password: null, _id: result.id }
        } catch (err) {
            throw err
        }
    },
    users: async () => {
      try {
        const users = await User.find()
        return users.map(transformUser);
    } catch (err) {
        throw err;
    }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('Auth failed!')
            }
            const isEqual = await bcrypt.compare(password, user.password);

            if (!isEqual) {
                throw new Error('Auth failed!')
            }

            const token = jwt.sign({
                "userId": user.id,
                "scopes": ["user"],
                "sub": user.email
              }, process.env.TOKEN_SECRET, {
                  expiresIn: '1h'
              })

              return {
                  userId: user.id,
                  token: token,
                  tokenExp: 1
              }
        } catch (err) {
            throw err;
        }
    }
};