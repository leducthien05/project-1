const Category = require("../../model/category.model");
const Account = require("../../model/account.model");

const prefix = require("../../config/system");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");
const filterCriteria = require("../../helper/criteria.helper");
const createTree = require("../../helper/createTree.helper");

//[GET] /admin/category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    //Lọc trạng thái
    const listStatus = filterStatus.filter(req.query);
    if (req.query.status) {
        if (req.query.status == "deleted") {
            find.deleted = true;
        } else {
            find.status = req.query.status;
        }
    }
    //Tìm kiếm 
    const objectSearch = search.search(req.query);
    if (req.query.keyword) {
        find.name = objectSearch.regex;
    }
    // Lọc theo tiêu chí
    const sort = filterCriteria.criteria(req.query);
    //Lấy danh sách danh mục
    const allCategory = await Category.find(find).sort(sort);
    //Tạo cây in ra giao diện
    const tree = createTree.createTree(allCategory, "");

    //log create 
    const idCreate = allCategory.map(item => item.createdBy.account_id);
    const accountCreate = await Account.find({
        _id: {$in: idCreate}
    }).select("fullName");
    const userCreate = {};
    //Lấy id và tên tài khoản 
    accountCreate.forEach(item => userCreate[item._id] = item.fullName);
    //Gán tên tài khoản vào danh mục
    allCategory.forEach(item =>{
        item.fullName = userCreate[item.createdBy.account_id];
    });
    //Log update
    const idUpdate = allCategory.map(item =>{
        const length = item.updatedBy.length;
        return item.updatedBy[length-1].account_id;
    });
    const accountUpdate = await Account.find({
        _id: {$in: idUpdate}
    }).select("fullName");
    const userUpdate = {};
    //Lấy id và tên tài khoản 
    accountUpdate.forEach(item => userUpdate[item._id] = item.fullName);
    //Gán tên tài khoản vào danh mục
    allCategory.forEach(item =>{
        const length = item.updatedBy.length;
        item.fullNameUpdate = userUpdate[item.updatedBy[length-1].account_id];
        item.updatedAt = item.updatedBy[length-1].updatedAt;
    });
    //Phân trang
    const rootCategory = tree;
    const objectPagination = pagination.pagination(req.query, rootCategory.length);
    const paginatedRoot = rootCategory.slice(
        objectPagination.skipRecord,
        objectPagination.skipRecord + objectPagination.limit
    );
    
    res.render("admin/page/category/index", {
        titlePage: "Danh mục sản phẩm",
        category: paginatedRoot,
        listStatus: listStatus,
        keyword: req.query.keyword,
        pagination: objectPagination
    });
}
//[GET] /admin/categorys/create
module.exports.create = async (req, res) => {
    const category = await Category.find({
        deleted: false
    });
    const newCategory = createTree.createTree(category, "");
    res.render("admin/page/category/create", {
        titlePage: "Thêm danh mục",
        category: newCategory
    });
}
//[POST] /admin/categorys/create
module.exports.createPost = async (req, res) => {
    req.body.createdBy = {
        account_id: res.locals.accountAdmin._id,
        createdAt: new Date()
    }
    const category = new Category(req.body);
    await category.save();
    res.redirect(`${prefix.prefixAdmin}/categorys`);
}
//[PATCH] /admin/categorys/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await Category.updateOne({
        _id: id
    }, {
        $set: { status: status },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Thay đổi trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
//[PATCH] /admin/categorys/change-status/:status/:id
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
                await Category.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { status: status },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "inactive":
                await Category.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { status: status },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "delete":
                await Category.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: true },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "delete-hard":
                await Category.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} danh mục`);
                break;
            case "un-delete":
                await Category.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: false },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "position":
                for (item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Category.updateOne({
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
// [DELETE] admin/categorys/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Category.updateOne({
        _id: id
    }, { deleted: true });
    req.flash("success", `Xóa thành công sản phẩm`);
    res.redirect(req.get("referer") || "/");
}
// [GET] admin/categorys/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findOne({
        _id: id
    });
    const ArrayCategory = await Category.find({
        deleted: false
    });
    const newCategory = createTree.createTree(ArrayCategory, "");
    res.render("admin/page/category/edit", {
        titlePage: "Chỉnh sửa danh mục",
        category: category,
        ArrayCategory: newCategory
    });
}
//[PATCH] /admin/categorys/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    try {
        await Category.updateOne({
            _id: id
        }, {
            $set: req.body,
            $push: { updatedBy: updatedBy }
        });
    } catch (error) {
        console.log(error)
    }
    req.flash("success", "Chỉnh sửa danh mục thành công");
    res.redirect(`${prefix.prefixAdmin}/categorys`);
}

// [GET] /admin/category/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findOne({
        deleted: false,
        _id: id
    });
    res.render("admin/page/category/detail", {
        titlePage: category.name,
        category: category
    });
}
