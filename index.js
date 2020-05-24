require('dotenv').config();

const express = require('express');
const path = require('path');
require('sqreen');
const Parse = require('parse/node');
const port = process.env.PORT || 8080;
const app = express();

console.log(process.env.PARSE_APP_ID)
// the __dirname is the current directory from where the script is running
Parse.serverURL = 'https://parseapi.back4app.com';
Parse.initialize(
    process.env.PARSE_APP_ID, 
    process.env.PARSE_JS_KEY, 
    process.env.PARSE_MASTER // (never use it in the frontend)
  );
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
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
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});app.listen(port);