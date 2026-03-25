const Role = require("../../model/role.model");

const searchHelper = require("../../helper/search.helper");
const criteria = require("../../helper/criteria.helper");
const filterStatus = require("../../helper/filterStatus.helper");
const pagination = require("../../helper/pagination.helper");
const prefix = require("../../config/system");

// [GET] admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    // filter
    const filter = filterStatus.filter(req.query);
    if (req.query.status) {
        find.status = req.query.status;
    }

    // search
    const search = searchHelper.search(req.query);
    if (search.keyword) {
        find.name = search.regex;
    }

    // pagination
    const countDocument = await Role.countDocuments(find);
    const objectPagination = pagination.pagination(req.query, countDocument);

    // sort
    const sort = criteria.criteria(req.query);

    // query
    const role = await Role.find(find)
        .sort(sort)
        .limit(objectPagination.limit)
        .skip(objectPagination.skipRecord);

    // index
    role.forEach((item, index) => {
        item.indexItem = index + 1 + objectPagination.skipRecord;
    });

    // render
    res.render("admin/page/role/index", {
        titlePage: "Nhóm quyền",
        role: role,
        listStatus: filter,
        pagination: objectPagination,
        keyword: req.query.keyword
    });
}
// [PATCH] admin/roles/change-multi-status
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const status = req.body.status;

    try {
        switch (status) {
            case "active":
                await Role.updateMany({
                    _id: ids
                }, { status: status });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "inactive":
                await Role.updateMany({
                    _id: ids
                }, { status: status });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete":
                await Role.updateMany({
                    _id: ids
                }, { deleted: true });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete-hard":
                await Role.deleteMany({
                    _id: ids
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} sản phẩm`);
                break;
            case "un-delete":
                await Role.updateMany({
                    _id: ids
                }, { deleted: false });
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(req.get("referer") || "/");
}
// [GET] admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/page/role/create", {
        titlePage: "Thêm nhóm quyền"
    });
}
// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    res.redirect(`${prefix.prefixAdmin}/roles`);
}
//[PATCH] /admin/roles/change-status/:status/:id
module.exports.changeStatus = async (req, res)=>{
    const id = req.params.id;
    const status = req.params.status;
    await Role.updateOne({
        _id: id
    }, {status: status});
    req.flash("success", "Thay đổi trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res)=>{
    const id = req.params.id;
    const role = await Role.findOne({
        _id: id
    });
    res.render("admin/page/role/edit", {
        titlePage: "Chỉnh sửa nhóm quyền",
        role: role
    });
}
//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res)=>{
    const id = req.params.id;
    console.log(req.body);
    try {
        await Roles.updateOne({
            _id: id
        }, req.body);
    } catch (error) {
        console.log(error)
    }
    req.flash("success", "Chỉnh sửa nhóm quyền thành công");
    res.redirect(`${prefix.prefixAdmin}/roles`);
}
//[GET] /admin/roles/permission
module.exports.permission = async (req, res) =>{
    const role = await Role.find({
        deleted: false
    });
    res.render("admin/page/role/permission", {
        titlePage: "Phân quyền",
        role: role
    });
}
//[PATCH] /admin/roles/permission
module.exports.permissionPatch = async (req, res) =>{
    try {
        const permission = req.body.permission;
        const record = JSON.parse(permission);
        for(item of record){
            await Role.updateOne({
                _id: item.id
            }, {permission: item.permission});
        }
    } catch (error) {
        console.log(error);
    }
    req.flash("success", "Phân quyền thành công");
    res.redirect(`${prefix.prefixAdmin}/roles/permissions`);
}
// [GET] /admin/roles/detail
module.exports.detail = async (req, res)=>{
    const role = await Role.findOne({
        _id: req.params.id
    });
    res.render("admin/page/role/detail", {
        titlePage: "Chi tiết nhóm quyền",
        role: role
    })
}

