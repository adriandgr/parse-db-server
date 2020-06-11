const Transaction = require('../../models/tansaction');
const User = require('../../models/user');
const { transformTransaction } = require('./transforms');

module.exports = {
  transactions: async () => {
      try {
          const transactions = await Transaction.find()
          return transactions.map(transformTransaction);
      } catch (err) {
          throw err;
      }
  },
  createTransaction: async (args, req) => {
      if (!req.isAuth) {
          throw new Error('Unauthenticated!')
      }
      const transaction = new Transaction({
          amount: args.transactionInput.amount,
          description: args.transactionInput.description,
          date: new Date(args.transactionInput.date),
          paidBy: args.transactionInput.paidBy,
          approvedBy: [req.userId]
      });
      let createdTransaction;
      try {
          const result = await transaction.save()
          createdTransaction = transformTransaction(result)
          const payer = await User.findById(args.transactionInput.paidBy)
          if (!payer) {
              throw new Error('User not found.')
          }
          payer.issuedTransactions.push(transaction);
          await payer.save();
          return createdTransaction;
      } catch (err)  {
          console.log(err);
          throw err;
      }
  },
}