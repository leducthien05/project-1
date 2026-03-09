module.exports.newPriceArray = (array)=>{
    const newProduct = array.map(item => {
        item.newPrice =  item.price * (1 - item.discountPercentage/100);
        return item;
    });

    return newProduct;
}