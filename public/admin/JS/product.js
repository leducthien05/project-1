const btnStatus = document.querySelectorAll("[button-status]");
if(btnStatus.length > 0){
    btnStatus.forEach((item) =>{
        const url = new URL(window.location.href);
        item.addEventListener("click", ()=>{
            const value = item.getAttribute("data-status");
            if(value == ""){
                url.searchParams.delete("status");
            }
            else{
                url.searchParams.set("status", value);
            }    
            window.location.href = url.href;
        });
    });
}

//Tìm kiếm
const formSearch = document.querySelector("[form-search]");
if(formSearch){
    formSearch.addEventListener("submit", (e)=>{
        e.preventDefault();
        const url = new URL(window.location.href);
        const value = e.target.elements.keyword.value;
        // const input = document.querySelector("[input-search]");
        // console.log(input.value);
        if(value){
            url.searchParams.set("keyword", value);
        }else{
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}

//Phân trang
const btnPage = document.querySelectorAll("[number-page]");
if(btnPage.length > 0){
    btnPage.forEach(btn =>{
        const url = new URL(window.location.href);
        btn.addEventListener("click", ()=>{
            const value = btn.getAttribute("number-page");
            url.searchParams.set("page", value);
            if(value === "1"){
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        });
    });
}

//Thay đổi trạng thái một sản phẩm
const formChangeStatus = document.querySelector("[form-change-status]");
if(formChangeStatus){
    const btnStatus = document.querySelectorAll("[change-status]");
    const path = formChangeStatus.getAttribute("action");
    btnStatus.forEach(btn =>{
        btn.addEventListener("click", ()=>{
            const value = btn.getAttribute("status");
            const id = btn.getAttribute("id");
            const status = value == "active" ? "inactive" : "active";
            const action = path + `/${status}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}

//Change-multi status
const checkboxAll = document.querySelector("[checkbox-all]");
if(checkboxAll){
    const checkboxItem = document.querySelectorAll("[checkbox-item]");
    checkboxAll.addEventListener("click", ()=>{
        checkboxItem.forEach(item =>{
            if(checkboxAll.checked == true){
                item.checked = true;
            }else{
                item.checked = false;
            }         
        });
    });
    checkboxItem.forEach(item =>{
        item.addEventListener("click", ()=>{
            const countChecked = document.querySelectorAll("input[name='id']:checked").length;
            if(countChecked == checkboxItem.length){
                checkboxAll.checked = true;
            }else{
                checkboxAll.checked = false;
            }
        });
    });
}

//Select action
const selectOpton = document.querySelector("[select-option]");
if(selectOpton){
    const url = new URL(window.location.href);
    const status = url.searchParams.get("status");
    if(status == "deleted"){
        selectOpton.add(new Option("Khôi phục", "un-delete"));
        const optionDelete = selectOpton.querySelector("option[value='delete-all']");
        optionDelete.value="delete-hard";
        optionDelete.text="Xóa hoàn toàn";
    }
}

//form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e)=>{
        e.preventDefault();
        // const checkboxAll = document.querySelector("[checkbox-all]");
        const checkboxItem = document.querySelectorAll("input[checkbox-item]:checked");
        const value = e.target.elements.status.value;//Tìm phần tử có tên là status rồi lấy giá trị
        const sum = checkboxItem.length;
        if(value == "delete-all" || value == "deleted-hard"){
            const isconFirm = alert(`Bạn có chắc muốn xóa ${sum} sản phẩm chứ?`);
            if(!isconFirm){
                retrun;
            }
        }

        if(value == "active" || value == "inactive"){
            const ids = [];
            checkboxItem.forEach(item =>{
                const id = item.value;
                ids.push(id);
            });
        }

        if(checkboxItem.length > 0){
            const inputForm = document.querySelector("input[name='ids']");
            const ids = [];
            checkboxItem.forEach(item =>{
                const id = item.value;
                if(value == "position"){
                    const position = item.closest("tr").querySelector("input[name='position']").value;
                    const string = `${id}-${position}`;
                    ids.push(string);
                }else{
                    ids.push(id);
                }
            });
            inputForm.value = ids.join(", ");
        }
        formChangeMulti.submit();
    });
}

const formDelete = document.querySelector("[form-delete]");
if(formDelete){
    const btnDelete = document.querySelectorAll("[btn-delete]");
    const path = formDelete.getAttribute("action");
        btnDelete.forEach((btn)=>{
            btn.addEventListener("click", ()=>{
            const id = btn.getAttribute("btn-id");
            const action = `${path}/${id}?_method=DELETE`;
            console.log(action);
            formDelete.action = action;
            formDelete.submit();
        }); 
    });
}

