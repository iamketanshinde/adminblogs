const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: String,
    content: String,
    author: String,
    image: String
}, { timestamps: true });

module.exports = model("blog", blogSchema);