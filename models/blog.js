const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        trim:true,
        require:true,
    },
    content:{
        type:String,
        trim:true,
        require:true,
    },
    author:{
        type:String,
        require:true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
  }
},{timestamps:true});

const Blog = model("blog",blogSchema);
module.exports = Blog;
