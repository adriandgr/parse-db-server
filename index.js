require('dotenv').config();
// require('sqreen');

const { check, validationResult } = require('express-validator');
const express    = require('express');
const path       = require('path');
const morgan     = require('morgan');
const session    = require('express-session');
const bodyParser = require('body-parser');
const Parse      = require('parse/node');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');


const port    = process.env.PORT || 8080;
const app     = express();


app.disable('x-powered-by');
app.use(session({
  secret: process.env.SESSION,
  cookie: { 
    maxAge: 604800000, // 7 days 
    httpOnly: true 
  }
}));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(function(req, res, next) {
  var allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', `http://localhost:${port}`];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

Parse.serverURL = process.env.PARSE_SERVER;
Parse.initialize(
    process.env.PARSE_APP_ID, 
    process.env.PARSE_JS_KEY,
    process.env.PARSE_MASTER
  );

app.get('/ping', function (req, res) {
 return res.send('pong');
});
app.get('/save', function (req, res) {
  const MyCustomClass = Parse.Object.extend('Test');
  const myNewObject = new MyCustomClass();
  myNewObject.set('myCustomKey1Name', 'myCustomKey1Value');
  myNewObject.set('myCustomKey2Name', 'myCustomKey2Value');

  myNewObject.save().then(
    (result) => {
      if (typeof document !== 'undefined') document.write(`ParseObject created: ${JSON.stringify(result)}`);
      console.log('ParseObject created', result);
      return res.send('ok');
    },
    (error) => {
      if (typeof document !== 'undefined') document.write(`Error while creating ParseObject: ${JSON.stringify(error)}`);
      console.error('Error while creating ParseObject: ', error);
      return res.send('err!');
    }
  );
 });

// app.use('/api', routes);

app.post('/login', [ 
  check('email').isEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }

    const User = new Parse.User();
    const query = new Parse.Query(User);
    console.log(req.body)
    query.equalTo("email", req.body.email);
    const results = await query.first({useMasterKey:true});
    if (results){
        user_id = results.id
    }



    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "dev@adriandiaz.ca", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return res.status(200).json({ success: "200 OK" });
  
  } catch (e) {
    //this will eventually be handled by your error handling middleware
    console.log(e)
    next(e) 
  }
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});