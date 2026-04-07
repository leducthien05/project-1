module.exports.newPriceArray = (array)=>{
    const newProduct = array.map(item => {
        item.newPrice =  item.price * (1 - item.discountPercentage/100);
        return item;
    });

    return newProduct;
}

module.exports.newPrice = (product)=>{
    const newPrice =  product.price * (1 - product.discountPercentage/100);
    product.newPrice = newPrice
    return product;
}