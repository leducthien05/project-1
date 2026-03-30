const Brand = require("../../model/brand.model");
const Account = require("../../model/account.model");

const prefix = require("../../config/system");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");
const filterCriteria = require("../../helper/criteria.helper");

// [GET] /admin/brands
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
        find.title = objectSearch.regex;
    }
    const countBrand = await Brand.countDocuments(find);
    const objectPage = await pagination.pagination(req.query, countBrand);
    //Lọc theo tiêu chí
    const sort = filterCriteria.criteria(req.query);
    const brand = await Brand.find(find).limit(objectPage.limit).sort(sort).skip(objectPage.skipRecord);
    brand.forEach((item, index) => {
        item.indexBrand = index + 1 + objectPage.skipRecord;
    });
    //log create 
    const idCreate = brand.map(item => item.createdBy.account_id);
    const accountCreate = await Account.find({
        _id: { $in: idCreate }
    }).select("fullName");
    const userCreate = {};
    //Lấy id và tên tài khoản 
    accountCreate.forEach(item => userCreate[item._id] = item.fullName);
    //Gán tên tài khoản vào danh mục
    brand.forEach(item => {
        item.fullName = userCreate[item.createdBy.account_id];
    });
    //Log update
    const idUpdate = brand.map(item => {
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
    brand.forEach(item => {
        const length = item.updatedBy.length;
        if (length > 0) {
            item.accountUpdated = accUpdatedMap[item.updatedBy[length - 1].account_id];
            item.updatedAt = item.updatedBy[length - 1].updatedAt;
        } else {
            return
        }
    });
    res.render("admin/page/brand/index", {
        titlePage: "Thương hiệu",
        brand: brand,
        listStatus: listStatus,
        keyword: objectSearch.keyword,
        pagination: objectPage
    });
}

//[PATCH] /admin/brands/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await Brand.updateOne({
        _id: id
    }, {
        $set: { status: status },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Thay đổi trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}

//[PATCH] /admin/Brands/change-multi-status
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
                await Brand.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: { status: status },
                        $push: { updatedBy: updatedBy }
                    }
                );
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "inactive":
                await Brand.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: { status: status },
                        $push: { updatedBy: updatedBy }
                    }
                );
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete":
                await Brand.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: true },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete-hard":
                await Brand.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} sản phẩm`);
                break;
            case "un-delete":
                await Brand.updateMany({
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
                    await Brand.updateOne({
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

// [DELETE] admin/brands/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    // await Brand.deleteOne({
    //     _id: id
    // });
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await Brand.updateOne({
        _id: id
    }, {
        $set: { deleted: true },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", `Xóa thành công thương hiệu`);
    res.redirect(req.get("referer") || "/");
}

//[GET] /admin/brands/create
module.exports.create = async (req, res) => {
    res.render("admin/page/brand/create", {
        titlePage: "Thêm thương hiệu",
        count: count
    });
}

//[POST] /admin/Brands/create
module.exports.createPost = async (req, res) => {
    req.body.createdBy = {
        account_id: res.locals.accountAdmin._id,
        createdAt: new Date()
    }
    const brand = new Brand(req.body);
    await brand.save();
    res.redirect("/admin/brands");
}

//[GET] /admin/brands/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const brand = await Brand.findOne({
        _id: id
    });
    const count = await Brand.countDocuments({ deleted: false });
    res.render("admin/page/Brand/edit", {
        titlePage: "Chỉnh sửa sản phẩm",
        brand: brand,
        count: count
    });
}

//[PATCH] /admin/brands/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    try {
        await Brand.updateOne({
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
    req.flash("success", "Chỉnh sửa thương hiệu thành công");
    res.redirect(`${prefix.prefixAdmin}/brands`);
}

// [GET] /admin/brands/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const brand = await Brand.findOne({
        deleted: false,
        _id: id
    });
    res.render("admin/page/brand/detail", {
        titlePage: brand.title,
        brand: brand
    });
}