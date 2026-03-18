let count = 0;
const createTree = (arr, parent_id)=>{
    //Tạo mảng chứa
    const tree = [];
    //Tim phần tử cha
    arr.forEach(item =>{
        const newItem = item;
        if(item.parent_id == parent_id){
            count++;
            newItem.index = count;
            const children = createTree(arr, item._id);
            if(children.length > 0){
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}

module.exports.createTree = (arr, parent_id)=>{
    count = 0;
    const tree = createTree(arr, parent_id);
    return tree;
}