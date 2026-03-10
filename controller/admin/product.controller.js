const Product = require("../../model/product.model");

const helprPriceNew = require("../../helper/newPrice.helper");
const filterStatus = require("../../helper/filterStatus.helper");

//[GET] /admin/products
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    }
    const listStatus = filterStatus.filter(req.query);
    if(req.query.status){
        find.status= req.query.status;
    }

    const product = await Product.find(find);
    const newProduct = helprPriceNew.newPriceArray(product);
    res.render("admin/page/product/index", {
        titlePage: "Sản phẩm",
        product: newProduct,
        listStatus: listStatus
    });
}