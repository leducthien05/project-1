const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: String,
    userInfo: {
        userName: String,
        phone: String,
        address: String
    },
    order_id: String,
    product:[
        {
            product_id: String,
            quantity: Number,
            price: Number,
            discountPercentage: Number,
            image: String
        }
    ],
    paymentMethod: String,
    totalPrice: Number,
    status: {
        type: String,
        default: 'pending'
    },
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        user_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
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
const Order =  mongoose.model('Order', orderSchema, 'order');
module.exports = Order;