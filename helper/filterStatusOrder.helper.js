module.exports.filter = (query)=>{
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