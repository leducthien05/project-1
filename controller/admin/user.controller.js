const User = require("../../model/user.model");

const helprPriceNew = require("../../helper/newPrice.helper");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");
const prefixAdmin = require("../../config/system");
const filterCriteria = require("../../helper/criteria.helper");
const createTree = require("../../helper/createTree.helper");

// [GET] /admin/users
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    }
    //Lọc người dùng theo status
    const listStatus = filterStatus.filter(req.query);
    if (req.query.status) {
        if (req.query.status == "deleted") {
            find.deleted = true;
        } else {
            find.status = req.query.status;
        }
    }
    //Tìm kiếm người dùng
    const objectKeyword = search.search(req.query);
    if (req.query.keyword) {
        find.userName = objectKeyword.regex;
    }
    //Phân trang
    const countUser = await User.countDocuments(find);
    const objectPage = await pagination.pagination(req.query, countUser);
    console.log(objectPage.skipRecord);
    //Lọc theo tiêu chí
    const sort = filterCriteria.criteria(req.query);
    const user = await User.find(find).limit(objectPage.limit).sort(sort).skip(objectPage.skipRecord);
    user.forEach((item, index) => {
        item.indexUser = index + 1 + objectPage.skipRecord;
    });
    console.log(user)
    res.render("admin/page/user/index", {
        titlePage: "Người dùng",
        user: user,
        listStatus: listStatus,
        keyword: objectKeyword.keyword,
        pagination: objectPage
    });
}
//[PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const updatedBy = {
        account_id: res.locals.accountAdmin._id,
        updatedAt: new Date()
    }
    await User.updateOne({
        _id: id
    }, {
        $set: { status: status },
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Thay đổi trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
//[PATCH] /admin/users/change-multi-status
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
                await User.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: { status: status },
                        $push: { updatedBy: updatedBy }
                    }
                );
                req.flash("success", `Thay đổi thành công ${ids.length} người dùng`);
                break;
            case "inactive":
                await User.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: { status: status },
                        $push: { updatedBy: updatedBy }
                    }
                );
                req.flash("success", `Thay đổi thành công ${ids.length} người dùng`);
                break;
            case "delete":
                await User.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: true },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} người dùng`);
                break;
            case "delete-hard":
                await User.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} người dùng`);
                break;
            case "un-delete":
                await User.updateMany({
                    _id: { $in: ids }
                }, {
                    $set: { deleted: false },
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", `Thay đổi thành công ${ids.length} người dùng`);
                break;
            
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(req.get("referer") || "/");
}