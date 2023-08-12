const path = require('path')  //allows to construct paths
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const app = express()

// Check credentials folder to login to MongoDB from terminal
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(error => {
    console.log("Connection failed: " + error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images'))); //turn the image folder static to easily access for requests
//CORS Header Data for Security
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

// forward routing to postRoutes above
app.use('/api/posts', postRoutes);

module.exports = app;
