const express = require('express'); //installed
const exphbs = require("express-handlebars"); //installed
const logger = require('morgan'); //installed
const bodyParser = require('body-parser'); //installed
const path = require('path'); //installed
const mongoose = require('mongoose'); //installed
const cheerio = require('cheerio'); //installed
const request = require('request'); //installed


// var db = require('./models');
const app = express();
const PORT = process.env.PORT || 6666;
// const routes = require('./routes')

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view-engine', 'handlebars');

app.listen(PORT, () => {
    console.log("It's ALIVE!!! " + PORT + ' !!!!');
});