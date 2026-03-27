const Account = require("../../model/account.model");
const Role = require("../../model/role.model");

const filterStatus = require("../../helper/filterStatus.helper");
const searchHelper = require("../../helper/search.helper");
const sort = require("../../helper/criteria.helper");
const pagination = require("../../helper/pagination.helper");
const passwordHelper = require("../../helper/password.helper");
const prefix = require("../../config/system");

// [GET] admin/accounts
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
    const search = searchHelper.search(req.query);
    if (req.query.keyword) {
        find.fullName = search.regex;
    }
    //Xắp sếp
    const sortRecord = sort.criteria(req.query);
    //Phân trang
    const countDocument = await Account.countDocuments(find);
    const objectPagination = pagination.pagination(req.query, countDocument);
    const account = await Account.find(find).sort(sortRecord).limit(objectPagination.limit).skip(objectPagination.skipRecord);
    account.forEach((item, index) => {
        item.indexRecord = objectPagination.skipRecord + index + 1;
    });
    //Name role
    const roleID = account.map(item => item.role_id);
    const role = await Role.find({
        _id: roleID
    }).select("name");
    const roleMap = {};
    role.forEach(item => {
        roleMap[item._id] = item.name;
    });
    account.forEach(item => {
        item.roleName = roleMap[item.role_id];
    });
    //Log Create
    const idCreate = account.map(item => item.createdBy.account_id);
    const accMap = {};
    const acc = await Account.find({
        _id: { $in: idCreate }
    }).select("fullName");
    acc.forEach(item => {
        accMap[item._id] = item.fullName;
    });
    account.forEach(item => {
        item.accCreate = accMap[item.createdBy.account_id];
        console.log(item.accCreate)
    });
    //Log Update
    const idUpdate = account.map(item => {
        const length = item.updatedBy.length;
        if (length > 0) {
            return item.updatedBy[length - 1].account_id;
        } else {
            return;
        }
    });
    if (idUpdate.length > 0) {
        const accUpdatedMap = {};
        const accUpdate = await Account.find({
            _id: { $in: idUpdate }
        });
        accUpdate.forEach(item => {
            accUpdatedMap[item._id] = item.fullName;
        });
        account.forEach(item => {
            const length = item.updatedBy.length;
            if (length > 0) {
                item.accountUpdated = accUpdatedMap[item.updatedBy[length - 1].account_id];
                item.updatedAt = item.updatedBy[length - 1].updatedAt;
            } else {
                return
            }
        });

    }

    res.render("admin/page/account/index", {
        titlePage: "Tài khoản",
        account: account,
        listStatus: listStatus,
        keyword: req.query.keyword,
        pagination: objectPagination
    });
}
// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
    const role = await Role.find({
        deleted: false
    });
    res.render("admin/page/account/create", {
        titlePage: "Tạo tài khoản",
        role: role
    });
}
// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        const existEmail = await Account.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existEmail) {
            req.flash("error", "Email đã tồn tại, vui lòng nhập một email khác!");
            res.redirect(req.get("referer") || "/");
            return;
        } else {
            req.body.createdBy = {
                account_id: res.locals.accountAdmin._id,
                createdAt: new Date()
            }
            req.body.password = await passwordHelper.hashPassword(req.body.password);
            const record = new Account(req.body);
            await record.save();
        }

    } catch (error) {
        console.log(error)
    }
    res.redirect(`${prefix.prefixAdmin}/accounts`);
}
// [PATCH] admin/accounts/change-status
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await Account.updateOne({
        _id: id
    }, {
        $set: { status: status },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
// [PATCH] admin/accounts/change-multi-status
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const status = req.body.status;
    req.body.updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    try {
        switch (status) {
            case "active":
                await Account.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { status: status },
                    $push: { updatedBy: req.body.updatedBy }
                });
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            case "inactive":
                await Account.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { status: status },
                    $push: { updatedBy: req.body.updatedBy }
                });
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            case "delete":
                await Account.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: true },
                    $push: { updatedBy: req.body.updatedBy }
                });
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            case "delete-hard":
                await Account.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} tài khoản`);
                break;
            case "un-delete":
                await Account.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: false },
                    $push: { updatedBy: req.body.updatedBy }
                });
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(req.get("referer") || "/");
}
// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const role = await Role.find({
        deleted: false
    });
    const account = await Account.findOne({
        _id: req.params.id
    }).select("-password");
    res.render("admin/page/account/edit", {
        titlePage: "Cập nhật tài khoản",
        role: role,
        account: account
    });
}
// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const existEmail = await Account.findOne({
            email: req.body.email,
            _id: { $ne: req.params.id },
            deleted: false
        });
        if (existEmail) {
            req.flash("error", "Email đã tồn tại, vui lòng nhập một email khác!");
            return res.redirect(req.get("referer") || "/");
        } else {
            if (!req.body.password) {
                delete req.body.password;
            } else {
                req.body.password = await passwordHelper.hashPassword(req.body.password);
            }
            const updatedBy = {
                account_id: res.locals.accountAdmin._id,
                updatedAt: new Date()
            }
            await Account.updateOne({
                _id: req.params.id
            }, {
                $set: req.body,
                $push: updatedBy
            });
        }
    } catch (error) {
        console.log(error)
    }
    res.redirect(`${prefix.prefixAdmin}/accounts`);
}
// [DELETE] admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const deletedBy = {
        account_id: res.locals.accountAdmin._id,
        deletedAt: new Date()
    }
    await Account.updateOne({
        _id: id
    }, {
        $set: {
            deleted: true,
            deletedBy: deletedBy
        }
    });
    res.redirect(req.get("referer") || "/");
}
// [GET] admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const account = await Account.findOne({
        _id: id
    });
    const role = await Role.findOne({
        _id: account.role_id
    }).select("name");
    res.render("admin/page/account/detail", {
        titlePage: account.fullName,
        role: role,
        account: account
    });
}