const Product = require("../../model/product.model");
const Category = require("../../model/category.model");
const Account = require("../../model/account.model");
const Brand = require("../../model/brand.model");

const helprPriceNew = require("../../helper/newPrice.helper");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");
const prefixAdmin = require("../../config/system");
const filterCriteria = require("../../helper/criteria.helper");
const createTree = require("../../helper/createTree.helper");

//[GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    //Lọc sản phẩm theo status
    const listStatus = filterStatus.filter(req.query);
    if (req.query.status) {
        if (req.query.status == "deleted") {
            find.deleted = true;
        } else {
            find.status = req.query.status;
        }
    }
    //Tìm kiếm sản phẩm
    const objectKeyword = search.search(req.query);
    if (req.query.keyword) {
        find.name = objectKeyword.regex;
    }
    //Phân trang
    const countProduct = await Product.countDocuments(find);
    const objectPage = await pagination.pagination(req.query, countProduct);
    console.log(objectPage.skipRecord);
    //Lọc theo tiêu chí
    const sort = filterCriteria.criteria(req.query);
    const product = await Product.find(find).limit(objectPage.limit).sort(sort).skip(objectPage.skipRecord);
    const newProduct = helprPriceNew.newPriceArray(product);
    newProduct.forEach((item, index) => {
        item.indexProduct = index + 1 + objectPage.skipRecord;
    });
    //log create 
    const idCreate = newProduct.map(item => item.createdBy.account_id);
    const accountCreate = await Account.find({
        _id: { $in: idCreate }
    }).select("fullName");
    const userCreate = {};
    //Lấy id và tên tài khoản 
    accountCreate.forEach(item => userCreate[item._id] = item.fullName);
    //Gán tên tài khoản vào danh mục
    newProduct.forEach(item => {
        item.fullName = userCreate[item.createdBy.account_id];
    });
    //Log update
    const idUpdate = newProduct.map(item => {
        const length = item.updatedBy.length;
        if (length > 0) {
            return item.updatedBy[length - 1].account_id;
        }
    });
    const accountUpdate = await Account.find({
        _id: { $in: idUpdate }
    }).select("fullName");
    const accUpdatedMap = {};
    //Lấy id và tên tài khoản 
    accountUpdate.forEach(item => accUpdatedMap[item._id] = item.fullName);
    newProduct.forEach(item => {
        const length = item.updatedBy.length;
        if (length > 0) {
            item.accountUpdated = accUpdatedMap[item.updatedBy[length - 1].account_id];
            item.updatedAt = item.updatedBy[length - 1].updatedAt;
        } else {
            return
        }
    });
    res.render("admin/page/product/index", {
        titlePage: "Sản phẩm",
        product: newProduct,
        listStatus: listStatus,
        keyword: objectKeyword.keyword,
        pagination: objectPage
    });
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await Product.updateOne({
        _id: id
    }, {
        $set: { status: status },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Thay đổi trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}

//[PATCH] /admin/products/change-multi-status
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const status = req.body.status;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    try {
        switch (status) {
            case "active":
                await Product.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: { status: status },
                        $push: { updatedBy: updatedBy }
                    }
                );
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "inactive":
                await Product.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: { status: status },
                        $push: { updatedBy: updatedBy }
                    }
                );
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete":
                await Product.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: true },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete-hard":
                await Product.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} sản phẩm`);
                break;
            case "un-delete":
                await Product.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: false },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "position":
                for (item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Product.updateOne({
                        _id: id
                    }, {
                        $set: { position: position },
                        $push: { updatedBy: updatedBy }
                    });
                }
                req.flash("success", `Thay đổi thành công vị trí của ${ids.lenght}`);
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(req.get("referer") || "/");
}

// [DELETE] admin/products/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({
    //     _id: id
    // });
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await Product.updateOne({
        _id: id
    }, {
        $set: { deleted: true },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", `Xóa thành công sản phẩm`);
    res.redirect(req.get("referer") || "/");
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    const brand = await Brand.find({
        deleted: false
    });
    const category = await Category.find({
        deleted: false
    });
    const newCategory = createTree.createTree(category, "");
    const count = await Product.countDocuments({deleted: false});
    res.render("admin/page/product/create", {
        titlePage: "Thêm sản phẩm",
        category: newCategory,
        count: count,
        brand: brand
    });
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.createdBy = {
        account_id: res.locals.accountAdmin._id,
        createdAt: new Date()
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect("/admin/products");
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id
    });
    const brand = await Brand.find({
        deleted: false
    });
    const category = await Category.find({
        deleted: false
    });
    const newCategory = createTree.createTree(category, "");
    const count = await Product.countDocuments({deleted: false});
    res.render("admin/page/product/edit", {
        titlePage: "Chỉnh sửa sản phẩm",
        product: product,
        category: newCategory,
        count: count,
        brand: brand
    });
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    try {
        await Product.updateOne({
            _id: id
        },
            {
                $set: req.body,
                $push: { updatedBy: updatedBy }
            }
        );
    } catch (error) {
        console.log(error)
    }
    req.flash("success", "Chỉnh sửa sản phẩm thành công");
    res.redirect(`${prefixAdmin.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({
        deleted: false,
        _id: id
    });
    const category = await Category.findOne({
        _id: product.category_id
    });
    const brand = await Brand.findOne({
        _id: product.brand_id
    });
    if(brand){
        product.brand = brand.title;
    }
    if(category){
        product.category = category.name;
    }
    res.render("admin/page/product/detail", {
        titlePage: product.name,
        product: product
    });
}