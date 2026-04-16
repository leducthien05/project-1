const Order = require("../../model/order.model");
const User = require("../../model/user.model");
const Product = require("../../model/product.model");

const helperPrice = require("../../helper/newPrice.helper");

// [GET] /order
module.exports.index = async (req, res) => {
    const user = await User.findOne({
        _id: res.locals.user._id
    }).select("userName id");
    const order = await Order.find({
        user_id: user.id
    });
    res.render("client/page/order/index", {
        titlePage: "Đơn hàng",
        myOrder: order
    });
}
// [GET] /order/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const order = await Order.findOne({
        _id: id
    });
    for (const product of order.product) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        });
        const newProduct = helperPrice.newPrice(productInfo);
        product.productInfo = newProduct;
    }
    res.render("client/page/order/detail", {
        titlePage: "Đơn hàng",
        myOrder: order
    });
}
// [DELETE] /cacel/:id
module.exports.cacel = async (req, res) => {
    const id = req.params.id;
    try {
        await Order.updateOne({
            _id: id,
            status: "pending"
        }, {
            $set: {
                deleted: true,
                status: "canceled"
            },
        });
    } catch (error) {
        console.log(error)
    }
    const order = await Order.findOne({
        _id: id
    });
    for (const product of order.product) {
        const quantity = product.quantity;
        const productUpdate = await Product.updateOne({
            _id: product.product_id
        }, {
            $inc: {
                stock: + quantity
            }
        });
        if (productUpdate.modifiedCount === 0) {
            req.flash("error", "Không thể hủy đơn hàng!");
            res.redirect(req.get("referer") || "/");
            return;
        }
    }
    res.redirect(req.get("referer") || "/");
}
