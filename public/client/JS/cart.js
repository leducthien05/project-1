//Xóa sản phẩm khỏi giỏ hàng
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
//Hết Xóa sản phẩm khỏi giỏ hàng

//Thay đổi số lượng sản phẩm giỏ hàng
const inputQuantity = document.querySelectorAll("[quantity-product]");
if(inputQuantity.length > 0){
    inputQuantity.forEach(input =>{
        let url = new URL(window.location.href);
        input.addEventListener("change", (e)=>{
            const value = input.value;
            const id = input.getAttribute("id_product");
            const string = `${value}-${id}`
            url.searchParams.set("quantity", string);
            setTimeout(()=>{
                window.location.href = url.href;
            }, 3000);
        });
    });
}
//Hết Thay số lượng đổi sản phẩm giỏ hàng
