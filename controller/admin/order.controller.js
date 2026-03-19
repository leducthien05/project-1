const Order = require("../../model/order.model");
const Product = require("../../model/product.model");

const filterStatusOrder = require("../../helper/filterStatusOrder.helper");
const searchOrder = require("../../helper/search.helper");
const criteria = require("../../helper/criteria.helper");


//[GET] /admin/orders
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    //bộ lọc sản phẩm
    const filter = filterStatusOrder.filter(req.query);
    if (req.query.status) {
        find.status = req.query.status
    }
    //Tìm kiếm
    const search = searchOrder.search(req.query);
    if (req.query.keyword) {
        find.$or = [
            { "userInfo.nameUser": search.regex },
            { "order.order_id": search.regex}
        ]
    }
    //Lọc 
    const sort = criteria.criteria(req.query);
    
    const order = await Order.find(find).sort(sort);
    res.render("admin/page/order/index", {
        titlePage: "Đơn hàng",
        order: order,
        listStatusOrder: filter,
        keyword: search.keyword
    });
}
//[PATCH] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await Order.updateOne({
        _id: id
    }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
//[PATCH] /admin/orders/change-multi-status
module.exports.changeMulti = async (req, res) => { 
    const ids = req.body.ids.split(", "); 
    const status = req.body.status; 
    try { 
        switch (status) { 
            case "pending": 
                await Order.updateMany(
                    { _id: ids }, 
                    { status: status }
                ); 
                req.flash("success", `Cập nhật thành công ${ ids.length } đơn hàng`); 
                break; 
            case "processing":
                await Order.updateMany(
                    { _id: ids }, 
                    { status: status }
                ); 
                req.flash("success", `Cập nhật thành công ${ ids.length } đơn hàng`); 
                break; 
            case "completed":
                await Order.updateMany(
                    { _id: ids }, 
                    { status: status }
                ); 
                req.flash("success", `Cập nhật thành công ${ ids.length } đơn hàng`); 
                break; 
            case "cancel": 
                await Order.updateMany(
                    { _id: ids }, 
                    { status: status }
                ); 
                req.flash("success", `Cập nhật thành công ${ ids.length } đơn hàng`);
                break; 
            case "shipping": 
                await Order.updateMany(
                    { _id: ids }, 
                    { status: status }
                ); 
                req.flash("success", `Cập nhật thành công ${ ids.length } đơn hàng`); 
                break;
            case "position":
                for(item of ids){
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Order.updateOne({
                        _id: id
                    }, {position: position});
                }
                req.flash("success", `Cập nhật thành công vị trí của ${ids.lenght}`);
                break; 
            default: 
                break; 
        } 
    }catch (error) { 
        console.log(error); 
    } 
    res.redirect(req.get("referer") || "/"); 
}
//[GET] /admin/orders/detail/:id
module.exports.detail = async (req, res)=>{
    const id = req.params.id;
    const order = await Order.findOne({
        _id: id
    });
    for(item of order.product){
        const product = await Product.findOne({
            _id: item.product_id
        });
        if(!product){
            res.redirect(req.get("referer") || "/"); 
            return;
        }
        item.name = product.name;
    }
    res.render("admin/page/order/detail", {
        titlePage: "Chi tiết đơn hàng", 
        order: order
    });
}