const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    auth_name: {
        type: String,
        required: true
    },
    title: {
        type:String,
        required: true,
    },
    content: {
        type:String,
        required: true,
    },

},{timestamps: true});
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;

