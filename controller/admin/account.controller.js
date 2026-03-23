const Account = require("../../model/account.model");
const Role = require("../../model/role.model");

const filterStatus = require("../../helper/filterStatus.helper");
const searchHelper = require("../../helper/search.helper");
const sort = require("../../helper/criteria.helper");
const pagination = require("../../helper/pagination.helper");
const passwordHelper = require("../../helper/password.helper");
const prefix = require("../../config/system");

// [GET] admin/accounts
module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    //Lọc trạng thái
    const listStatus = filterStatus.filter(req.query);
   if(req.query.status){
        if(req.query.status == "deleted"){
            find.deleted = true;
        }else{
            find.status= req.query.status;
        }
    }
    //Tìm kiếm
    const search = searchHelper.search(req.query);
    if(req.query.keyword){
        find.fullName = search.regex;
    }
    //Xắp sếp
    const sortRecord = sort.criteria(req.query); 
    //Phân trang
    const countDocument = await Account.countDocuments(find);
    const objectPagination = pagination.pagination(req.query, countDocument);
    const account = await Account.find(find).sort(sortRecord).limit(objectPagination.limit).skip(objectPagination.skipRecord);
    account.forEach((item, index) =>{
        item.indexRecord =  objectPagination.skipRecord + index + 1;
    });
    if(account){
        for(item of account){
            const role_id = item.role_id;
            const role = await Role.findOne({
                _id: role_id
            }).select("name");
            item.role = role.name;
        }
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
module.exports.create = async (req, res)=>{
    const role = await Role.find({
        deleted: false
    });
    res.render("admin/page/account/create", {
        titlePage: "Tạo tài khoản",
        role: role
    });
}
// [POST] admin/accounts/create
module.exports.createPost = async (req, res)=>{
    try {
        const existEmail = await Account.findOne({
            email: req.body.email,
            deleted: false
        });
        if(existEmail){
            req.flash("error", "Email đã tồn tại, vui lòng nhập một email khác!");
            res.redirect(req.get("referer") || "/");
            return;
        }else{
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
module.exports.changeStatus = async (req, res)=>{
    const id = req.params.id;
    const status = req.params.status;
    await Account.updateOne({
        _id: id
    }, {status: status});
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
// [PATCH] admin/accounts/change-multi-status
module.exports.changeMulti = async (req, res)=>{
    const ids = req.body.ids.split(", ");
    const status = req.body.status;
    console.log(status);
    console.log(ids)
    
    try {
        switch (status) {
            case "active":
                await Account.updateMany({
                    _id: ids
                }, {status: status});
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            case "inactive":
                await Account.updateMany({
                    _id: ids
                }, {status: status});
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            case "delete":
                await Account.updateMany({
                    _id: ids
                }, {deleted: true});
                req.flash("success", `Cập nhật thành công ${ids.length} tài khoản`);
                break;
            case "delete-hard":
                await Account.deleteMany({
                    _id: ids
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} tài khoản`);
                break;
            case "un-delete":
                await Account.updateMany({
                    _id: ids
                }, {deleted: false});
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
module.exports.edit = async (req, res)=>{
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
module.exports.editPatch = async (req, res)=>{
    try {
        const existEmail = await Account.findOne({
            email: req.body.email,
            _id: {$ne: req.params.id},
            deleted: false
        });
        if(existEmail){
            req.flash("error", "Email đã tồn tại, vui lòng nhập một email khác!");
            return res.redirect(req.get("referer") || "/");
        }else{
            if(!req.body.password){
                delete req.body.password;
            }else{
                req.body.password = await passwordHelper.hashPassword(req.body.password);
            }
            await Account.updateOne({
                _id: req.params.id
            }, req.body);
        }
    } catch (error) {
        console.log(error)
    }
    res.redirect(`${prefix.prefixAdmin}/accounts`);
}
// [DELETE] admin/accounts/delete/:id
module.exports.delete = async (req, res)=>{
    const id = req.params.id;
    await Account.updateOne({
        _id: id
    }, {deleted: true});
    res.redirect(req.get("referer") || "/");
}
// [GET] admin/accounts/detail/:id
module.exports.detail = async (req, res)=>{
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