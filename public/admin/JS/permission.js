
//Permission
const tablePermission = document.querySelector("[table-permission]");
if(tablePermission){
    const permission = [];
    const buttonSummit = document.querySelector("[button-submit]");
    buttonSummit.addEventListener("click", ()=>{
        const row = document.querySelectorAll("[data-name]");
        row.forEach(item=>{
            const value = item.getAttribute("data-name");
            const inputCheckbox = item.querySelectorAll("input");
            if(value == "id"){
                inputCheckbox.forEach((input) =>{
                    const id = input.value;
                    permission.push({
                        id: id,
                        permission: []
                    });
                });
            }else{
                inputCheckbox.forEach((input, index) =>{
                    const check = input.checked;
                    if(check == true){
                        permission[index].permission.push(value);
                    }
                    console.log(permission);
                });
            }

        });
        const formPermission = document.querySelector("#form-permission");
        const input = formPermission.querySelector("input[name='permission']");
        input.value = JSON.stringify(permission);
        formPermission.submit();
    });
}

//Trả data ra frontend
//Lấy data từ Backend
const data = document.querySelector("[data-role]");
if(data){
    //Chuyển data từ dạng JSON về dạng mảng
    const contentData = JSON.parse(data.getAttribute("data-role"));
    //Lấy Table chứa các checkbox quyền
    const tablePermission = document.querySelector("[table-permission]");
    //Duyệt các nhóm quyền
    contentData.forEach((item, index) =>{
        //Lấy danh sách quyền của role hiện tại
        const permission = item.permission;
        //Duyệt từng permission của role để tick checkbox tương ứng
        permission.forEach((permission) =>{
            //Tìm row có data-name = permission (tương ứng với 1 dòng trong bảng)
            const row = tablePermission.querySelector(`[data-name="${permission}"]`);
            if(row){
                //Lấy checkbox theo cột (index = role) trong dòng đó
                const input = row.querySelectorAll("input")[index];
                input.checked = true;
            }
        });
    });
}