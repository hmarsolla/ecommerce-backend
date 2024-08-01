import express from 'express';

const app = express();

app.get('/', function (req, res) {
  res.send('Hello Ecommerce');
})

console.log('Server started!');
app.listen(3000);