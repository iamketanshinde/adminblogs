const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: String,
    content: String,
    author: String,

    image: {
        type: String, // file path
    }

}, { timestamps: true });

module.exports = model("blog", blogSchema);