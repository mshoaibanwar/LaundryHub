export const CalcPrices = (ShopData: any, basketItems: any) => {
    let pricelist: any[] = [];
    let allShopsPriceList: any[] = [];

    for (let i = 0; i < ShopData.length; i++) {
        let shopPriceList: any[] = [];
        let tPrice = 0;
        for (let j = 0; j < basketItems.length; j++) {
            const basketItem = basketItems[j];
            for (let k = 0; k < ShopData[i].prices.length; k++) {
                const shopItem = ShopData[i].prices[k];
                if (basketItem.item === shopItem.title) {
                    for (let k = 0; k < shopItem.services.length; k++) {
                        const service = shopItem.services[k];
                        if (service.serv === basketItem.serType) {
                            const price = parseFloat(service.pri);
                            tPrice += price;
                            shopPriceList.push(price);
                        }
                    }
                }
            }
        }

        pricelist.push(tPrice);
        allShopsPriceList.push(shopPriceList);
    }

    return { pricelist, allShopsPriceList };
};


// export const CalcPrices = (ShopData: any, basketItems: any) => {
//     let tPrice = 0;
//     let pricelist: any = []
//     let shopPriceList: any = []
//     let allShopsPriceList: any = []
//     for (let i = 0; i < ShopData.length; i++) {
//         for (let j = 0; j < ShopData[0].prices.length; j++) {
//             ShopData[i].prices.forEach((element: any, index: any) => {
//                 console.log(element);
//                 let selected: any = null;
//                 let selectedService: any = null;
//                 for (const key in element) {
//                     console.log(key);
//                     if (key === basketItems[j]?.item) {
//                         selected = Object.values(element)[0];
//                     }
//                 }
//                 for (const key1 in selected) {
//                     if (key1 === basketItems[j]?.serType) {
//                         selectedService = Object.entries(selected).filter((val) => val[0] === key1)
//                         tPrice += selectedService[0][1];
//                         shopPriceList.push(selectedService[0][1]);
//                     }
//                 }
//             })
//         }
//         pricelist.push(tPrice);
//         allShopsPriceList.push(shopPriceList);
//         shopPriceList = [];
//         tPrice = 0;
//     }
//     return { pricelist, allShopsPriceList }
// }