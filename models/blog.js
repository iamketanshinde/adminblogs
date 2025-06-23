const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
},{timestamps:true});

module.exports =model("Blog", blogSchema);
