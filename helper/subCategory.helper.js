const Category = require("../model/category.model");
const subCategory = async (parent_id) => {
    const sub = await Category.find({
        parent_id: parent_id,
        status: "active",
        deleted: false
    });
    //Lấy các danh mục con của danh mục cha
    let allSub = [...sub];
    //Lặp để lấy các danh mục con ở cấp thấp hơn
    for (const item of allSub) {
        const children = await subCategory(item._id);
        if (children.length > 0) {
            allSub.concat(children);
        }
    }
    return allSub;
}
module.exports.subCategory = async (parent_id) => {
    const category = await subCategory(parent_id);
    return category;
}