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
    })
}