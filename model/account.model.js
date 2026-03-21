const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    email: String,
    password: String,
    token: String,
    role_id: String,
    avatar: String,
    status: {
        type: String,
        default: 'active'
    },
    departments: [String],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Account =  mongoose.model('Account', accountSchema, 'account');
module.exports = Account;