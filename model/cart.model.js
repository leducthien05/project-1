const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: String,
    product:[
        {
            product_id: String,
            quantity: Number,
            price: Number,
            discountPercentage: Number,
            image: String
        }
    ],
    totalPrice: Number, 
    updatedBy: [
        {  
            account_id: String,
            updatedAt: Date
        }
    ],
    deletedBy: {
        account_id: String,
        deletedBy: {
            type: Date
        }
    },
});
const Cart =  mongoose.model('Cart', cartSchema, 'cart');
module.exports = Cart;