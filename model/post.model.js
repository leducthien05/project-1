const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    status: {
        type: String,
        default: 'active'
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedBy: {
            type: Date
        }
    },
    updatedBy: [
        {  
            account_id: String,
            updatedAt: Date
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    }
});
const Post =  mongoose.model('Post', postSchema, 'post');
module.exports = Post;