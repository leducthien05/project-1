const focusMenu = document.querySelectorAll(".menu-item");

if(focusMenu.length > 0){
    const currentPath = window.location.pathname; // lấy URL hiện tại
    focusMenu.forEach(item =>{
        const linka = item.querySelector("a");
        const valuePath = linka.getAttribute("href"); // sửa path -> href
        // nếu trùng URL thì thêm active
        if(currentPath.startsWith(valuePath)){
            linka.classList.add("active");
        }
    });
}