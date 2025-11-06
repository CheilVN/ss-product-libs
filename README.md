
# SS Product Libs 📝  
@powerby CheilVN Dev Team
## Get Started 🚀  

~~~html  
    <!--dependency Libs-->
    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.js' integrity='sha512-+k1pnlgt4F1H8L7t3z95o3/KO+o78INEcXTbnoJQ/F2VqDVhWoaiVml/OEHv9HsVgxUaVW+IbiZPUJQfF/YxZw==' crossorigin='anonymous'></script>
    <!-- main libs -->
    <script src="https://cdn.jsdelivr.net/gh/CheilVN/ss-product-libs@latest/app.min.js"></script>
~~~
~~~javascript  
    const CheilVNSsApp = new SSProduct({
        siteCode: 'vn', //ph, my ...
        apiVersion: 'v2', //V1
        apiStyle: 'global' // newhybrid
    });

    const ADDTOCART_SKUS = [
        { productCode: 'VCC8836V36/XSV', quantity: 2 },
        { productCode: 'VC18M21M0VN/SV', quantity: 1 },
        { productCode: 'AW40F09D0ATNTC', quantity: 3 }
    ];
    const SKUS = ['VCC8836V36/XSV','VC18M21M0VN/SV','AW40F09D0ATNTC'];

    async function init() {
        const simpleProductInfo = await CheilVNSsApp.getSimpleProductInfo(SKUS);
        console.log(simpleProductInfo);

        const productStockStatus = await CheilVNSsApp.getProductStockStatus(SKUS);
        console.log(productStockStatus);

        const isInstock = await CheilVNSsApp.isInstock('VC18M21M0VN/SV');
        console.log(isInstock);

        const productDetailData = await CheilVNSsApp.getProductInfoBySkus(['AW40F09D0ATNTC']);
        console.log( productDetailData);

        const addToCartResult = await CheilVNSsApp.addToCart(ADDTOCART_SKUS, 'v1');
        const addToCartResultV2 = await CheilVNSsApp.addToCart(ADDTOCART_SKUS, 'v2');
    }
    init();
~~~  

## Members
- hien.nghoang@cheil.com 
- nhut.nt@cheil.com 
- cong.md@cheil.com