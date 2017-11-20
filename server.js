const express = require('express'); //installed
const exphbs = require("express-handlebars"); //installed
const logger = require('morgan'); //installed
const bodyParser = require('body-parser'); //installed
const path = require('path'); //installed
const mongoose = require('mongoose'); //installed
const cheerio = require('cheerio'); //installed
const request = require('request'); //installed


const db = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';


app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});


app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view-engine', 'handlebars');

//app routes
app.get("/index", (req, res) => {
    res.render("index", data);
})



app.get("/scrape", (req, res) => {
    request.get("https://www.nytimes.com/").then((response) => {
        var $ = cheerio.load(response.data);

        $("article h2").each((i, element) => {
            let result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result).then((dbArticle) => {
                console.log(result)
                res.send("Scrape Complete!");
            }).catch((err) => {
                console.log(err);
                res.json(err);
            })

        })
    })
})





app.listen(PORT, () => {
    console.log("It's ALIVE!!! " + PORT + ' !!!!');
});