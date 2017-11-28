var express = require('express');
const db = require('../models');
var router = express.Router();
var request = require('request');
const cheerio = require('cheerio');



router.get('/', (req, res, next) => {
    db.Article.find({})
        .populate('notes')
        .then((articles) => {
            console.log(articles);
            res.render('index', { article: articles, title: 'Express', })
        })

});

router.get('/scrape', (req, res) => {
    request("https://www.nytimes.com/", (error, response, html) => {
        // console.log(response);
        const $ = cheerio.load(html);

        $("article.story").each((i, element) => {

            let articleTitle = $(element).find("a").text();
            let articleLink = $(element).find("a").attr("href");

            let image = $(element).find(".thumb").find("img").attr("src");

            db.Article.collection.update(

                { articleLink: articleLink }, { $set: { articleTitle: articleTitle, image: image, dateAdded: Date.now() } }, { upsert: true })
        })

    })
});

router.get('/delete', (req, res) => {
    console.log('Commence Delete');
    db.Note.collection.drop()
        .then(() => {
            console.log('Deleted Notes')
        })

    db.Article.collection.drop()
        .then(() => {
            console.log('Deleted Articles');
            // res.redirect('/');
        })
    res.redirect('/')
});







module.exports = router;