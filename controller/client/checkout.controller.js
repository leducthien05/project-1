const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");
const Order = require("../../model/order.model");

const axios = require("axios");
const crypto = require("crypto");

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

    const infoOrder = new Order(order);
    await infoOrder.save();
    // ==============================
    // 💳 THANH TOÁN MOMO
    // ==============================
    if (req.body.paymentMethod === "momo") {
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

        const requestId = partnerCode + Date.now();
        const orderId = order_id;
        const orderInfo = "pay with MoMo";

        const redirectUrl = "https://project-1-two-sooty.vercel.app/checkout/payment/return";
        const ipnUrl = "https://project-1-two-sooty.vercel.app/checkout/payment/notify";

        const amount = totalPrice.toString(); //Tổng tiền
        const requestType = "captureWallet";
        const extraData = "";

        const rawSignature =
            `accessKey=${accessKey}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&partnerCode=${partnerCode}` +
            `&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}` +
            `&requestType=${requestType}`;

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData,
            requestType,
            signature,
            lang: "vi"
        };

        try {
            const response = await axios.post(
                "https://test-payment.momo.vn/v2/gateway/api/create",
                requestBody
            );

            // 🔥 Quan trọng nhất
            const payUrl = response.data.payUrl;

            return res.redirect(payUrl);

        } catch (error) {
            console.log(error.response?.data || error);
            return res.send("Lỗi thanh toán MoMo");
        }
    }
    // ==============================
    // 💵 COD (Thanh toán khi nhận hàng)
    // ==============================
    if (req.body.payment == "moneycash") {
        await Order.updateOne(
            { order_id },
            { status: "paid" }
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
    }


    res.redirect(`/checkout/success/${order.order_id}`);
}

// [POST] /checkout/payment/return
module.exports.return = async (req, res) => {
    if (req.query.resultCode == 0) {
        res.send("Thanh toán thành công");
    } else {
        res.send("Thanh toán thất bại");
    }
}

// [POST] /checkout/payment/notify
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

// [POST] /checkout/success/:order_id
module.exports.success = async (req, res) => {
    const order_id = req.params.order_id
    const order = await Order.findOne({
        order_id: order_id
    });
    res.render("client/page/checkout/success", {
        titlePage: "Đặt hàng thành công",
        order: order
    });
}


