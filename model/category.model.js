const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const categorySchema = new mongoose.Schema({
    name:String,
    slug: {
        type: String,
        slug: "name",
        unique: true
    },
    description:String,
    parent_id: {
        type: String,
        default:""
    },
    image:String,
    status: {
        type: String,
        default: 'active'
    },
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Category =  mongoose.model('Category', categorySchema, 'category');
module.exports = Category;