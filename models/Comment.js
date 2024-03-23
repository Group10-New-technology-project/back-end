const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới ID của người dùng
        ref: 'User', // Tham chiếu tới collection 'User'
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    like: {
        type: Number,
        default: 0
    }
});

const Comment = mongoose.model('Comment', commentSchema); // Tên collection là "Comment"
module.exports = Comment;
