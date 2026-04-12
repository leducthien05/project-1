const inputCheckout = document.querySelectorAll(`input[name="paymentMethod"]`);
if(inputCheckout.length > 0){
    inputCheckout.forEach(input =>{
        input.addEventListener("click", (e)=>{
            if(input.checked){
            }
        });
    });
}