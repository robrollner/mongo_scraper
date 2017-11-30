const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    articleTitle: {
        type: String
            // required: true
    },

    articleLink: {
        type: String,
        unique: true
    },

    image: {
        type: String
    },

    summary: {
        type: String
    },

    author: {
        type: String
    },

    notes: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;