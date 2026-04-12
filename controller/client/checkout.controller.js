const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");
const Order = require("../../model/order.model");

const priceHelper = require("../../helper/newPrice.helper");
// [GET] /checkout
module.exports.index = async (req, res) => {
    const idCart = req.cookies.cartID;
    const cart = await Cart.findOne({
        _id: idCart
    });
    if (cart.product.length > 0) {
        for (const product of cart.product) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            });
            const newProduct = priceHelper.newPrice(productInfo);
            product.totalPrice = newProduct.newPrice * product.quantity;
            product.productInfo = newProduct;
        }
        cart.totalPrice = cart.product.reduce((sum, item) => {
            return sum + item.totalPrice;
        }, 0);
    }
    console.log(cart.product[0].productInfo.name)
    res.render("client/page/checkout/index", {
        myCart: cart,
        titlePage: "Thanh toán"
    });
}
// [POST] /checkout
module.exports.payment = async (req, res) => {
    console.log(req.body)
    const order_id = `DH${Date.now()}`;
    const cart = await Cart.findOne({
        _id: req.cookies.cartID
    });
    const order = {
        userInfo: {
            userName: req.body.userName,
            phone: req.body.phone,
            address: req.body.address
        },
        order_id: order_id,
        product: cart.product,
        paymentMethod: req.body.paymentMethod,
        totalPrice: req.body.totalPrice,
        position: 1
    }
    const infoOrder = new Order(order);
    await infoOrder.save();
    await Cart.updateOne({
        _id: req.cookies.cartID
    }, {
        $set: {
            product: []
        }
    });
    res.redirect(`/checkout/success/${order.order_id}`);
}
// [POST] /checkout/success/:id
module.exports.success = async (req, res) => {
    const order_id = req.params.id
    const order = await Order.findOne({
        order_id: order_id
    });
    res.render("client/page/checkout/success", {
        titlePage: "Đặt hàng thành công",
        order: order
    });
}


