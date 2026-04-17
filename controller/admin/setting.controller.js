const Setting = require("../../model/settinggeneral.model");

// [GET] /admin/settinggeneral
module.exports.index = async (req, res) => {
    const setting = await Setting.findOne({
        deleted: false
    });
    res.render("admin/page/setting/index", {
        titlePage: "Cài đặt chung",
        setting: setting
    });
}
// [PATCH] /admin/settinggeneral
module.exports.create = async (req, res) => {
    await Setting.updateOne({
        deleted: false
    }, {
        $set: {
            title: req.body.title,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            status: req.body.status,
            logo: req.body.logo,
            copyright: req.body.copyright
        }
    });
    const setting = await Setting.findOne({
        deleted: false
    });
    res.redirect("/admin/settinggeneral");
}