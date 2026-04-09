const Cart = require("../../model/cart.router");

module.exports.cart = async (req, res, next)=>{
    if(!req.cookies.cartID){
        const cart = new Cart();
        await cart.save();
        res.cookie("cartID", cart._id);
    }else{
        const cartID = req.cookies.cartID;
        const cart = await Cart.findOne({
            _id: cartID
        });
        if(cart){
            if(cart.product.length > 0){
                const quantity = cart.product.reduce((sum, item) =>{
                    return item.quantity + sum;
                }, 0);
                cart.totalQuantity = quantity;
            }
            res.locals.cart = cart;
        }
    }
    next();
}