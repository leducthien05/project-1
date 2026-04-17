const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    title: String,
    phone: String,
    email: String,
    logo: String,
    address: String,
    status: String,
    copyright: String,
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
const Setting =  mongoose.model('Setting', settingSchema, 'settinggeneral');
module.exports = Setting;