const btnDelete = document.querySelectorAll("[btn-delete]");
const formDelete = document.querySelector("[form-delete]");
const path = formDelete.getAttribute("action");

if(btnDelete.length > 0){
    btnDelete.forEach(btn =>{
        btn.addEventListener("click", ()=>{
            const id = btn.getAttribute("btn-id");
            const action = path + `${id}?_method=DELETE`;
            formDelete.action = action;
            formDelete.submit();
        });
    });
}