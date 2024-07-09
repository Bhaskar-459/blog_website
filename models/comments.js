const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    auth_name: {
        type: String,
        required: true
    },
    comment: {
        type:String,
        required: true,
    },
    blog_id: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }
},{timestamps: true});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;