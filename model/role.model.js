const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    permission: {
        type: Array,
        default: []
    },
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
const Role =  mongoose.model('Role', roleSchema, 'role');
module.exports = Role;