const Setting = require("../../model/settinggeneral.model");

module.exports.setting = async (req, res, next)=>{
    const setting = await Setting.findOne({
        deleted: false
    });
    if(setting){
        res.locals.setting = setting;
    }
    next();
}