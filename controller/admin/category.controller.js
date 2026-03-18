const Category = require("../../model/category.model");

const prefix = require("../../config/system");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");
const filterCriteria = require("../../helper/criteria.helper");

//[GET] /admin/category
module.exports.index = async (req, res)=>{
    const find = {
        deleted :false
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
    const objectSearch = search.search(req.query);
    if(req.query.keyword){
        find.name = objectSearch.regex;
    }
    //Phân trang
    const countDocument = await Category.countDocuments(find);
    const objectPagination = await pagination.pagination(req.query, find, countDocument);
    //Lọc theo tiêu chí
    const sort = filterCriteria.criteria(req.query)

    const category = await Category.find(find).sort(sort).limit(objectPagination.limit).skip(objectPagination.skipRecord);
    //Index 
    category.forEach((item, index) => {
        item.indexRecord = index + 1 + objectPagination.skipRecord;
        
    });
    res.render("admin/page/category/index", {
        titlePage: "Danh mục sản phẩm",
        category: category,
        listStatus: listStatus,
        keyword: req.query.keyword,
        pagination: objectPagination
    });
}
//[GET] /admin/categorys/create
module.exports.create = async (req, res)=>{
    const category = await Category.find({
        deleted: false
    });
    res.render("admin/page/category/create", {
        titlePage: "Thêm danh mục",
        category: category
    });
}
//[POST] /admin/categorys/create
module.exports.createPost = async (req, res)=>{
    const category = new Category(req.body);
    await category.save();
    res.redirect(`${prefix.prefixAdmin}/categorys`);
}
//[PATCH] /admin/categorys/change-status/:status/:id
module.exports.changeStatus = async (req, res)=>{
    const id = req.params.id;
    const status = req.params.status;
    await Category.updateOne({
        _id: id
    }, {status: status});
    req.flash("success", "Thay đổi trạng thái thành công");
    res.redirect(req.get("referer") || "/");
}
//[PATCH] /admin/categorys/change-status/:status/:id
module.exports.changeMulti = async (req, res)=>{
    const ids = req.body.ids.split(", ");
    const status = req.body.status;
    
    try {
        switch (status) {
            case "active":
                await Category.updateMany({
                    _id: ids
                }, {status: status});
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "inactive":
                await Category.updateMany({
                    _id: ids
                }, {status: status});
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "delete":
                await Category.updateMany({
                    _id: ids
                }, {deleted: true});
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "delete-hard":
                await Category.deleteMany({
                    _id: ids
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} danh mục`);
                break;
            case "un-delete":
                await Category.updateMany({
                    _id: ids
                }, {deleted: false});
                req.flash("success", `Thay đổi thành công ${ids.length} danh mục`);
                break;
            case "position":
                for(item of ids){
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Category.updateOne({
                        _id: id
                    }, {position: position});
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
module.exports.delete = async (req, res)=>{
    const id = req.params.id;
    await Category.updateOne({
        _id: id
    }, {deleted: true});
    req.flash("success", `Xóa thành công sản phẩm`);
    res.redirect(req.get("referer") || "/");
}
// [GET] admin/categorys/edit/:id
module.exports.edit = async (req, res)=>{
    const id = req.params.id;
    const category = await Category.findOne({
        _id: id
    });
    const ArrayCategory = await Category.find({
        deleted: false
    })
    res.render("admin/page/category/edit", {
        titlePage: "Chỉnh sửa danh mục",
        category: category,
        ArrayCategory: ArrayCategory
    });
}
//[PATCH] /admin/categorys/edit/:id
module.exports.editPatch = async (req, res)=>{
    const id = req.params.id;
    console.log(req.body);
    try {
        await Category.updateOne({
            _id: id
        }, req.body);
    } catch (error) {
        console.log(error)
    }
    req.flash("success", "Chỉnh sửa danh mục thành công");
    res.redirect(`${prefix.prefixAdmin}/categorys`);
}

// [GET] /admin/category/detail/:id
module.exports.detail = async (req, res)=>{
    const id = req.params.id;
    const category = await Category.findOne({
        deleted: false
    });
    res.render("admin/page/category/detail", {
        titlePage: category.name,
        category: category
    });
}
