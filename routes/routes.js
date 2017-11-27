var express = require('express');
const db = require('../models');
var router = express.Router();
var request = require('request');
const cheerio = require('cheerio');



router.get('/', (req, res, next) => {
    db.Article.find({}).populate('notes')
        .then((articles) => {
            console.log(articles);
            res.render('index', { article: articles, title: 'Express', })
        })

});

router.get('/scrape', (req, res) => {
    request("https://www.nytimes.com/", (error, response, html) => {
        // console.log(response);
        var $ = cheerio.load(html);

        const createPromises = [];
        $("h2.story.heading").each((i, element) => {
            let result = {};
            result.title = $(this)
                .children("a")
                .text();

            result.link = $(this)
                .children("a")
                .attr("href");
            const promise = db.Article.create(result);
            createPromises.push(promise);

        })
        Promise.all(createPromises).then((timesArticle) => {
                console.log(timesArticle);
                res.json(timesArticle);
            }).catch((err) => {
                console.log(err)
            })
            // res.redirect('/');
    })
});

router.get('/delete', (req, res) => {
    console.log('Commence Delete');
    db.Note.collection.drop()
        .then(() => {
            res.json('Deleted Notes')
        })

    db.Article.collection.drop()
        .then(() => {
            res.json('Deleted Articles')
                // res.redirect('/');
        })
});







module.exports = router;