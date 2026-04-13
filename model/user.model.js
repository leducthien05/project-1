const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    phone: String,
    password: String,
    tokenUser: {
        type: String,
        default: () => crypto.randomBytes(32).toString("hex")
    },
    status: {
        type: String,
        default: "active"
    },
    requestFriends: Array,
    acceptFriends: Array, 
    listFriends: [
        {
            friend_id: String,
            room_chat_id: String
        }
    ],
    statusOnline: String,
    avatar: String,
    createdAt: Date, 
    updatedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    }
});
const User = mongoose.model('User', userSchema, 'user');
module.exports = User;