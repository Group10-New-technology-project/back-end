const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Group', 'Direct'],
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member', // Tham chiếu tới collection 'Member'
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // Tham chiếu tới collection 'Message'
        required: true
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member', // Tham chiếu tới collection 'Member'
        required: true
    },
    createAt: {
        type: Date,
        required: true
    },
    isjoinfromlink: {
        type: Boolean,
        default: false
    },
    groupImage: {
        type: String,
        default: ''
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema); // Tên collection là "Conversation"
module.exports = Conversation;
