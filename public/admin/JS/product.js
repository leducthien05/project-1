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
    })
}