const { dateToString } = require('../../helpers/date')
const Transaction = require('../../models/transaction');
const User = require('../../models/user');

const transactions = async transactionIds => {
    try {
        const transactions = await Transaction.find({_id: {$in: transactionIds}})
        return transactions.map(transformTransaction);
    } catch (err) { 
        throw err; 
    }
};


const users = async userIds => {
  try {
      const users = await User.find({_id: {$in: userIds}})
      return users.map(transformUser);
  } catch (err) { 
      throw err; 
  }
};

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { 
            ...user._doc, 
            _id: user.id, 
            password: null,
            paidTransactions: transactions.bind(this, user._doc.paidTransactions) 
        };
    } catch (err) {
        throw err;
    }    
}

const transformTransaction = transaction => {
    return {
        ...transaction._doc,
        _id: transaction.id, 
        date: dateToString(transaction._doc.date),
        paidBy: user.bind(this, transaction._doc.paidBy),
        approvedBy: users.bind(this, transaction._doc.approvedBy) 
    }
}

const transformUser = user => {
  return {
      ...user._doc,
      _id: user.id, 
      createdAt: dateToString(user._doc.createdAt),
      updatedAt: dateToString(user._doc.updatedAt),
      paidTransactions: transactions.bind(this, user._doc.paidTransactions),
  }
}


// exports.user = user;
// exports.events = events;
exports.transformTransaction = transformTransaction;
exports.transformUser = transformUser;
