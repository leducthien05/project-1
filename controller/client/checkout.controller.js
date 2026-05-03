const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");
const Order = require("../../model/order.model");

const axios = require("axios");
const crypto = require("crypto");

const paymentHelper = require("../../helper/payment.helper");
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
    } else {
        return res.redirect(req.get("referer"));
    }
    res.render("client/page/checkout/index", {
        myCart: cart,
        titlePage: "Thanh toán"
    });
}
// [POST] /checkout
module.exports.payment = async (req, res) => {
    // Tìm kiếm giỏ hàng
    const cart = await Cart.findOne({
        _id: req.cookies.cartID
    });
    if (!cart || cart.product.length === 0) {
        req.flash("error", "Giỏ hàng trống");
        return res.redirect("/cart");
    }
    // Tính tổng tiền
    const totalPrice = cart.product.reduce((sum, item) => {
        const priceAfterDiscount = item.price * (1 - item.discountPercentage / 100);
        const totalItem = item.quantity * priceAfterDiscount;
        return sum + totalItem;
    }, 0);
    // Tạo đơn hàng
    const order_id = `DH${Date.now()}`;
    const order = {
        userInfo: {
            userName: req.body.userName,
            phone: req.body.phone,
            address: req.body.address
        },
        order_id: order_id,
        product: cart.product,
        paymentMethod: req.body.paymentMethod,
        totalPrice: totalPrice,
        status: "pending"
    }
    if (res.locals.user) {
        const user_id = res.locals.user.id;
        const createdBy = {
            user_id: user_id,
            createdAt: new Date()
        }
        if (user_id) {
            order.user_id = user_id;
            createdBy.user_id = user_id;
            order.createdBy = createdBy;
        }
    }


    const infoOrder = new Order(order);
    await infoOrder.save();
    console.log("đã chạy vào controller")
    // ==============================
    // 💳 THANH TOÁN MOMO
    // ==============================
    if (req.body.paymentMethod === "momo") {
        console.log("Thanh toán bằng MOMO")
        await paymentHelper.momo(order_id, totalPrice);
    }
    // ==============================
    // 💳 THANH TOÁN VNPAY
    // ==============================
    if(req.body.paymentMethod === "vnpay"){
        const url = await paymentHelper.vnpay(order_id, totalPrice);
        return res.redirect(url);
    }
    // ==============================
    // 💵 COD (Thanh toán khi nhận hàng)
    // ==============================
    if (req.body.paymentMethod == "moneycash") {
        await Order.updateOne(
            { order_id },
            { status: "pending" }
        );
        // Cập nhật số lượng tồn kho
        for (const product of cart.product) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("name");
            const updateProduct = await Product.updateOne({
                _id: product.product_id,
                stock: { $gte: product.quantity } //So sánh số lượng trong kho: lớn hơn hoặc bằng
            }, {
                $inc: { stock: -product.quantity } // trừ trực tiếp vào trong database
            });
            if (updateProduct.modifiedCount === 0) {
                req.flash("error", `Sản phẩm ${productInfo.name} không đủ hàng`);
                return res.redirect("/cart");
            }
        }
        await Cart.updateOne({
            _id: req.cookies.cartID
        }, {
            $set: {
                product: []
            }
        });
        res.redirect(`/checkout/success/${order._id}`);
    }
}

// [GET] /checkout/payment-momo/return
module.exports.return = async (req, res) => {
    if (req.query.resultCode == 0) {
        res.redirect(`/checkout/payment/notify?reusultCode=0&&order_id=${order.order_id}`);
    } else {
        res.send("Thanh toán thất bại");
    }
}

// [POST] /checkout/payment-momo/notify
module.exports.notify = async (req, res) => {
    const { resultCode, orderId } = req.body;

    if (resultCode == 0) {
        const order = await Order.findOne({ order_id: orderId });

        // trừ kho
        for (const product of order.product) {
            await Product.updateOne(
                {
                    _id: product.product_id,
                    stock: { $gte: product.quantity }
                },
                {
                    $inc: { stock: -product.quantity }
                }
            );
        }

        // ✅ update trạng thái
        await Order.updateOne(
            { order_id: orderId },
            { status: "paid" }
        );
        await Cart.updateOne({
            _id: req.cookies.cartID
        }, {
            $set: {
                product: []
            }
        });
    } else {
        await Order.updateOne(
            { order_id: orderId },
            { status: "failed" }
        );
    }

    res.status(200).json({ message: "OK" });
}

// [POST] /checkout/payment-vnpay
module.exports.vnpay = async (req, res) => {
    const responseCode = req.query.vnp_ResponseCode;
    const transactionStatus = req.query.vnp_TransactionStatus;
    order_id = req.query.vnp_OrderInfo
    if ( responseCode === "00" && transactionStatus === "00") {
        const order = await Order.findOne({ order_id: order_id });

        // trừ kho
        for (const product of order.product) {
            await Product.updateOne(
                {
                    _id: product.product_id,
                    stock: { $gte: product.quantity }
                },
                {
                    $inc: { stock: -product.quantity }
                }
            );
        }

        // ✅ update trạng thái
        await Order.updateOne(
            { order_id: order_id },
            { status: "paid" }
        );
        await Cart.updateOne({
            _id: req.cookies.cartID
        }, {
            $set: {
                product: []
            }
        });
        return res.redirect(`/checkout/success/${order._id}`);
    } else {
        await Order.updateOne(
            { order_id: order_id },
            { status: "pending" }
        );
        return res.redirect("/checkout");
    }
}

// [POST] /checkout/success/:id
module.exports.success = async (req, res) => {
    const idOrder = req.params.id
    const order = await Order.findOne({
        _id: idOrder
    });
    res.render("client/page/checkout/success", {
        titlePage: "Đặt hàng thành công",
        order: order
    });
}


