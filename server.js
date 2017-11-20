const express = require('express'); //installed
const exphbs = require("express-handlebars"); //installed
const logger = require('morgan'); //installed
const bodyParser = require('body-parser'); //installed
const path = require('path'); //installed
const mongoose = require('mongoose'); //installed
const cheerio = require('cheerio'); //installed
const request = require('request'); //installed
const axios = require("axios");


const db = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(express.static('public'));


mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});



app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view-engine', 'exphbs');

//app routes
// app.get("/", (req, res) => {
//     console.log(res);
//     res.sendFile(path.join(__dirname, './views'));
// })



app.get("/scrape", (req, res) => {
    axios.get("https://www.nytimes.com/").then((response) => {
        var $ = cheerio.load(response.data);

        $("article h2").each((i, element) => {
            let result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result).then((dbArticle) => {
                console.log(result)
                return res.send()
                res.send("Scrape Complete!");
            }).catch((err) => {
                console.log(err);
                res.json(err);
            })

        })
    })
});





app.listen(PORT, () => {
    console.log("It's ALIVE!!! " + PORT + ' !!!!');
});