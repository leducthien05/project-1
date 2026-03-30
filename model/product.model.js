const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const productSchema = new mongoose.Schema({
    name:String,
    slug: {
        type: String,
        slug: "name",
        unique: true
    },
    description:String,
    price:Number,
    discountPercentage:Number,
    stock:Number,
    category_id:String,
    image:String,
    featured: {
        type: String,
        default: "0"
    },
    status: {
        type: String,
        default: 'active'
    },
    position: Number,
    brand_id: String,
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
const Product =  mongoose.model('Product', productSchema, 'product');
module.exports = Product;