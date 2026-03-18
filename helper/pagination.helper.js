module.exports.pagination = async (query, find, count)=>{
    const objectPage = {
        limit: 4,
        currentPage: 1
    }
    
    objectPage.totalPage = Math.ceil(count / objectPage.limit);
    if(query.page){
        objectPage.currentPage = parseInt(query.page);
    }
    const skipRecord = (objectPage.currentPage - 1) * objectPage.limit;
    objectPage.skipRecord = skipRecord;
    
    return objectPage;
}