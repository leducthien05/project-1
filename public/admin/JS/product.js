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