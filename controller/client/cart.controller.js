const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");

const newPriceHelper = require("../../helper/newPrice.helper");

// [GET] /cart/add/:id
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
    } else {
        let totalQuantity;
        const productAdd = await Product.findOne({
            _id: id
        });
        existProduct.product.forEach(item => {
            if (item.product_id == id) {
                totalQuantity = quantity + item.quantity;
            }
        });
        if (totalQuantity > productAdd.stock) {
            req.flash("error", "Đã quá số sản phẩm tồn kho!");
            res.redirect(req.get("referer") || "/");
            return;
        }
        await Cart.updateOne({
            _id: req.cookies.cartID,
            "product.product_id": id
        }, {
            $set: { "product.$.quantity": totalQuantity }
        });
    }

    res.redirect(req.get("referer") || "/");
}

// [GET] /cart
module.exports.index = async (req, res) => {
    const cart = res.locals.cart;
    //Lấy tổng tiền
    if (cart.product.length > 0) {
        //Lấy thông tin từng sản phẩm
        for (const item of cart.product) {
            const product = await Product.findOne({
                _id: item.product_id,
                status: "active",
                deleted: false
            });
            const newProduct = newPriceHelper.newPrice(product);
            item.productInfo = newProduct;
        }
        //Lẩy tổng tiền phải trả
        const totalPrice = cart.product.reduce((sum, item) => {
            return sum + (item.price * (1 - item.discountPercentage / 100) * item.quantity);
        }, 0);
        cart.totalPrice = totalPrice;
    }
    if(req.query.quantity){
        let[newQuantity, idProduct] = req.query.quantity.split("-");
        newQuantity = parseInt(newQuantity);
        const product = await Product.findOne({
            _id: idProduct
        });
        if(newQuantity <= product.stock){
            await Cart.updateOne({
                _id: cart._id,
                "product.product_id": idProduct
            }, {
                $set: {
                    "product.$.quantity": newQuantity
                }
            });
            req.flash("success", "Cập nhật số lượng thành công!");
        }
    }
    res.render("client/page/cart/index", {
        titlePage: "Giỏ hàng",
        myCart: cart
    });
}

// [DELETE] /cart/delete/:id
module.exports.delete = async (req, res)=>{
    const id = req.params.id;
    await Cart.updateOne({
        _id: res.locals.cart._id
    }, {
        $pull: {
            product: {product_id: id}
        }
    });
    res.redirect(req.get("referer") || "/");
}