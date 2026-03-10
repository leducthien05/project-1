module.exports.filter = (query)=>{
    const listStatus = [
        {
            name: "Tất cả",
            class: "active",
            status: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status){
        listStatus.forEach(item =>{
            (item.status === query.status) ? item.class = "active" : item.class = "";
        });
    }
    return listStatus;
}