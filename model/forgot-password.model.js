const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 3
    }
});
const ForgotPassword =  mongoose.model('FogotPassword', forgotPasswordSchema, 'forgotpassword');
module.exports = ForgotPassword;