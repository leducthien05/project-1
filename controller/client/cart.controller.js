const Cart = require("../../model/cart.router");
const Product = require("../../model/product.model");

module.exports.add = async (req, res) => {
    const id = req.params.id;
    const quantity = parseInt(req.body.quantity);
    const existProduct = await Cart.findOne({
        _id: req.cookies.cartID,
        "product.product_id": id
    });
    if (!existProduct) {
        
        const product = await Product.findOne({
            _id: id
        });
        const infoProduct = {
            product_id: id,
            quantity: quantity,
            price: product.price,
            discountPercentage: product.discountPercentage,
            image: product.image
        }
        await Cart.updateOne({
            _id: req.cookies.cartID
        }, {
            $push: { product: infoProduct }
        });
    }else{ 
        let totalQuantity;
        const productAdd = await Product.findOne({
            _id: id
        });
        existProduct.product.forEach(item => {
            if(item.product_id == id){
                totalQuantity = quantity + item.quantity;
            }
        });
        if(totalQuantity > productAdd.stock){
            req.flash("error", "Đã quá số sản phẩm tồn kho!");
            res.redirect(req.get("referer") || "/");
            return;
        }
        await Cart.updateOne({
            _id: req.cookies.cartID,
            "product.product_id": id
        }, {
            $set: {"product.$.quantity": totalQuantity}
        });
    }

    res.redirect(req.get("referer") || "/");
}