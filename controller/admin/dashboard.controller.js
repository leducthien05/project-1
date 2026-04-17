const User = require("../../model/user.model");
const Account = require("../../model/account.model");
const Product = require("../../model/product.model");
const Brand = require("../../model/brand.model");
const Category = require("../../model/category.model");
const Order = require("../../model/order.model");

module.exports.dashboard = async (req, res)=>{
    const statistic = {
        Category: {
            name: "Danh mục",
            total: 0,
            active: 0,
            inactive: 0
        },
        Product: {
            name: "Sản phẩm",
            total: 0,
            active: 0,
            inactive: 0
        },
        Account: {
            name: "Tài khoản",
            total: 0,
            active: 0,
            inactive: 0
        },
        User: {
            name: "Người dùng",
            total: 0,
            active: 0,
            inactive: 0
        },
        Brand: {
            name: "Thương hiệu",
            total: 0,
            active: 0,
            inactive: 0
        }
    }
    order = {
        pending: 0,
        finish: 0,
        shipping: 0,
        total: 0
    }
    // Category
    statistic.Category.total = await Category.countDocuments({
        deleted: false
    });
    statistic.Category.active = await Category.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.Category.inactive = await Category.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // Product
    statistic.Product.total = await Product.countDocuments({
        deleted: false
    });
    statistic.Product.active = await Product.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.Product.inactive = await Product.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // Account 
    statistic.Account.total = await Account.countDocuments({
        deleted: false
    });
    statistic.Account.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.Account.inactive = await Account.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // User
    statistic.User.total = await User.countDocuments({
        deleted: false
    });
    statistic.User.active = await User.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.User.inactive = await User.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // Brand
    statistic.Brand.total = await Brand.countDocuments({
        deleted: false
    });
    statistic.Brand.active = await Brand.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.Brand.inactive = await Brand.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // Order
    order.total = await Order.countDocuments({
        deleted: false,
        status: {$ne: "canceled"}
    });
    order.pending = await Order.countDocuments({
        deleted: false,
        status: "pending"
    });
    order.finish = await Order.countDocuments({
        deleted: false,
        status: "finish"
    });
    order.shipping = await Order.countDocuments({
        deleted: false,
        status: "Shipping"
    });
    res.render("admin/page/dashboard/index", {
        titlePage: "Trang chủ",
        statistic: statistic,
        statisticOrder: order
    });
}
