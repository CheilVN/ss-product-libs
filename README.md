
# SS Product Libs 📝  
@powerby CheilVN Dev Team
## Get Started 🚀  

~~~html  
    <script src="https://cdn.jsdelivr.net/gh/CheilVN/ss-product-libs@latest/app.min.js"></script>
~~~
~~~javascript  
    const CheilVNSsApp = new SSProduct({
        siteCode: 'ph',
        apiVersion: 'v2'
    });

    const ADDTOCART_SKUS = [
        { productCode: 'VCC8836V36/XSV', quantity: 2 },
        { productCode: 'VC18M21M0VN/SV', quantity: 1 },
        { productCode: 'AW40F09D0ATNTC', quantityquantity: 3 }
    ];
    const SKUS = ['VCC8836V36/XSV','VC18M21M0VN/SV','AW40F09D0ATNTC'];

    async function init() {
        const simpleProductInfo = await APP.getSimpleProductInfo(SKUS);
        console.log(simpleProductInfo);

        const productStockStatus = await APP.getProductStockStatus(SKUS);
        console.log(productStockStatus);

        const isInstock = await APP.isInstock('VC18M21M0VN/SV');
        console.log(isInstock);

        const productDetailData = await APP.getProductInfoBySkus(['AW40F09D0ATNTC']);
        console.log( productDetailData);

        const addToCartResult = await APP.addToCart(ADDTOCART_SKUS, 'v1');
        const addToCartResultV2 = await APP.addToCart(ADDTOCART_SKUS, 'v2');
    }
    init();
~~~  

## Members
- hien.nghoang@cheil.com 
- nhut.nt@cheil.com 
- cong.md@cheil.com