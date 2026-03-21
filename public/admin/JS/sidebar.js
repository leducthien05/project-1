const focusMenu = document.querySelectorAll(".menu-item");
const menu = document.querySelector(".menu")
const prefix = menu.getAttribute("prefix");

if(focusMenu.length > 0){
    const currentPath = window.location.pathname; // lấy URL hiện tại
    focusMenu.forEach(item =>{
        const linka = item.querySelector("a");
        if(currentPath == "/roles/permissions"){
            linka.classList.add("active");
            return;
        }else{
            const valuePath = linka.getAttribute("href"); // sửa path -> href
            if(currentPath.startsWith(valuePath)){
                if(currentPath !== `${prefix}/roles/permissions`){
                    linka.classList.add("active");

                }
            }
        }
        // nếu trùng URL thì thêm active
        
    });
}
const itemPermission = document.querySelector(".menu-item-permission");

if (itemPermission) {
    const currentPath = window.location.pathname;
    const linka = itemPermission.querySelector("a");
    const valuePath = linka.getAttribute("href");

    linka.classList.remove("active");
    console.log(currentPath);
    console.log(valuePath)
    if (currentPath === valuePath) {
        linka.classList.add("active");
    }
}