module.exports.search = (query)=>{
    const objectKeyword = {
        keyword: ""
    }

    if(query.keyword){
        objectKeyword.keyword = query.keyword;
        objectKeyword.keyword = objectKeyword.keyword.trim();
        const regex = new RegExp(objectKeyword.keyword, "i");
        objectKeyword.regex = regex;
    }
    
    return objectKeyword;
}