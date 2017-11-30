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
            let author = $(element).find(".byline").text();
            let summary = $(element).find(".summary").text();
            db.Article.collection.update(

                { articleLink: articleLink }, { $set: { articleTitle: articleTitle, author: author, image: image, summary: summary, dateAdded: Date.now() } }, { upsert: true })
        })
    })
    res.render('scrape', {})
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

router.get("/addNote/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("notes")
        .then((dbArticle) => {
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post('/addNote/:id', (req, res) => {
    db.Note.create({ note: req.body.thisNote })
        .then((dbNote) => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true })
        })
        .then((dbArticle) => {
            res.json(dbArticle)
        })
        .catch((err) => {
            res.json(err);
        })
})







module.exports = router;