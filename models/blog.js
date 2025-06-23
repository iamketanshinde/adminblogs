const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        trim:true,
        require:true,
    },
    body:{
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
module.exports = blog;
