// require('sqreen');

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
// const nodemailer = require("nodemailer");

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
// const isAuth = require('./middleware/is-auth')

const port    = process.env.PORT || 8080;
const app     = express();

app.disable('x-powered-by');
app.use(bodyParser.json());

app.use((req, res, next) => {
  // const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', `http://localhost:${port}`];
  // if(allowedOrigins.indexOf(origin) > -1){
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  next();
});

// app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Listening on http://localhost:' + port)
  app.listen(port);
}).catch(err =>{
  console.log(err);
})