module.exports.criteria = (query)=>{
    //Sắp xếp sản phẩm
    const sort = {};
    if(query.sortKey && query.sortValue){
        sort[query.sortKey] = query.sortValue;
    }else{
        sort.position = "desc"
    }
    return sort;
}