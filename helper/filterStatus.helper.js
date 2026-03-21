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
        },
        {
            name:"Xóa mềm",
            status: "deleted",
            class: ""
        }
    ];

    if(query.status){
        listStatus.forEach(item =>{
            (item.status === query.status) ? item.class = "active" : item.class = "";
            return;
        });
    }
    return listStatus;
}

module.exports.filterOrder = (query)=>{
    const listStatusOrder = [
        {
            name: "Tất cả",
            class: "active",
            status: ""
        },
        {
            name: "Chờ xử lý",
            status: "pending",
            class: ""
        },
        {
            name: "Duyệt",
            status: "completed",
            class: ""
        },
        {
            name:"Hủy",
            status: "cencel",
            class: ""
        }
    ];

    if(query.status){
        listStatusOrder.forEach(item =>{
            (item.status === query.status) ? item.class = "active" : item.class = "";
            return;
        });
    }
    return listStatusOrder;
}