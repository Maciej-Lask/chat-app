const express = require('express');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/client')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const messages = [];



app.get(/\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});