const express = require('express');
const exphbs = require("express-handlebars");
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
// const request = require('request');
// const axios = require("axios");


const app = express();
const PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/times';

const routes = require('./routes/routes');



mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


app.listen(PORT, () => {
    console.log("It's ALIVE!!! " + PORT + ' !!!!');
});

module.exports = app;