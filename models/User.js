const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    avatar: {
        type: String,
        required: true
    },
    coveravatar: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phoneBook: [{
        type: Schema.Types.ObjectId,
        ref: 'PhoneBook' // Tham chiếu tới collection 'PhoneBook'
    }],
    isDelete: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Tham chiếu tới collection 'User' (chính collection hiện tại)
    }],
    friendRequest: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Tham chiếu tới collection 'User' (chính collection hiện tại)
    }]
});

const User = mongoose.model('User', userSchema); // Tên collection là "User"
module.exports = User;
