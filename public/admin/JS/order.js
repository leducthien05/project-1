const formChangeStatus = document.querySelector("[form-change-status]");
if(formChangeStatus){
    const btnStatus = document.querySelectorAll("[change-status]");
    const path = formChangeStatus.getAttribute("action");
    btnStatus.forEach(btn =>{
        btn.addEventListener("click", ()=>{
            const value = btn.getAttribute("status");
            const id = btn.getAttribute("id");
            let status;
            if (value === "pending") {
                status = "processing";
            } else if (value === "processing") {
                status = "shipping";
            } else if (value === "shipping") {
                status = "completed";
            }
            const action = path + `/${status}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}

