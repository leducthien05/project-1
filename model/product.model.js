const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const productSchema = new mongoose.Schema({
    name:String,
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description:String,
    price:Number,
    discountPercentage:Number,
    stock:Number,
    category:Number,
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
const Product =  mongoose.model('Product', productSchema, 'product');
module.exports = Product;