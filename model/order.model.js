const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    totalPrice: Number,
    status: {
        type: String,
        default: 'pending'
    },
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Order =  mongoose.model('Order', orderSchema, 'order');
module.exports = Order;