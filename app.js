'use strict';

class SSProduct {
    SITE_CODE = 'vn';
    API_VERSION = 'v2';
    API_STYLE = 'global'
    API_SHOP_ENDPOINT = `https://shop.samsung.com/`;
    API_SEARCH_ENDPOINT = `https://searchapi.samsung.com/`;

    constructor(config = {}) {
        try {
            if (typeof jQuery === 'undefined') throw new Error('jQuery is not defined. Please include jQuery before using SSProduct.');

            const {siteCode, apiVersion} = config;
            if (siteCode) this.setSiteCode(siteCode);
            if (apiVersion) this.setApiVersion(apiVersion);
        } catch (e) {

        }
    }

    setSiteCode(siteCode) {
        if (typeof siteCode === 'string' && siteCode.length > 0) {
            this.SITE_CODE = siteCode;
            return this;
        } else {
            throw new Error('Invalid site code. It should be a non-empty string.');
        }
    }

    setApiStyle(apiStyle) {
        if (typeof apiStyle === 'string' && apiStyle.length > 0) {
            this.API_STYLE = apiStyle;
            return this;
        } else {
            throw new Error('Invalid API style. It should be a non-empty string.');
        }
    }
    setApiVersion(apiVersion) {
        if (typeof apiVersion === 'string' && apiVersion.length > 0) {
            this.API_VERSION = apiVersion;
            return this;
        } else {
            throw new Error('Invalid API version. It should be a non-empty string.');
        }
    }
    
    _addToCartV2(skus) {
        let _ = this;
        let data = {
            products: skus
        };
        let url =  new URL(`${_.API_SHOP_ENDPOINT}${_.SITE_CODE}/servicesv2/addToCart/`);
        return $.ajax({
            url: url.toString(),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify(data),
            xhrFields: {
                withCredentials: true,
            },
        });
    }

    _addToCartV1(skus) {
        let _ = this;
        let url = new URL(`${_.API_SHOP_ENDPOINT}${_.SITE_CODE}/ng/p4v1/addToCart/`);
        skus.map((item, i) => {
            url.searchParams.append(`products[${i}].productCode`,item.productCode.toString().toUpperCase());
            url.searchParams.append(`products[${i}].quantity`, parseInt(item.quantity) || 1);
        });
        
        return $.ajax({
            url: url.toString(),
            method: 'GET',
            xhrFields: {
                withCredentials: true,
            },
        });
    }

    addToCart(skus, version = 'v1') {
        return new Promise(async (resolve, reject) => {
            try {
                let _ = this;
                if (!Array.isArray(skus) || skus.length === 0) {
                    throw new Error('Invalid input: skus should be a non-empty array.');
                } 
                const result = (version == 'v1') ? await _._addToCartV1(skus) : await _._addToCartV2(skus);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        })
       
    }

    getSimpleProductInfo(skus) {
        let _ = this;
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(skus) || skus.length === 0) {
                    throw new Error('Invalid input: SKU should be a non-empty array.');
                }
                let url = new URL(`${_.API_SHOP_ENDPOINT}${_.SITE_CODE}/servicesv2/getSimpleProductsInfo`)
                skus = skus.join(',');
                url.searchParams.append('productCodes', skus);
                const result = await $.get(url.toString());
                if (!result?.productDatas) throw new Error('Invalid response from server.'); 
                if (Array.isArray(result.productDatas) && result.productDatas.length <= 0) throw new Error('No product data found in the response.');
                resolve(result.productDatas);
            } catch (e) {
                reject(e);
            }
           
        });
    }

    getProductInfoBySkus(skus) {
        let _ = this;
        return new Promise(async (resolve, reject) => { 
            try {
                if (!Array.isArray(skus) || skus.length === 0) {
                    throw new Error('Invalid input: SKU should be a non-empty array.');
                }
                let url = new URL(`${_.API_SEARCH_ENDPOINT}v6/front/b2c/product/card/detail/${_.API_STYLE}`);
                url.searchParams.append('siteCode', _.SITE_CODE);
                url.searchParams.append('commonCodeYN', 'N');
                url.searchParams.append('saleSkuYN', 'N');
                url.searchParams.append('onlyRequestSkuYN', 'N');
                url.searchParams.append('keySummaryYN', 'N');
                skus = skus.join(',');
                url.searchParams.append('modelList', skus);
                const result = await $.get(url.toString());
                if (!result?.response?.resultData?.productList) throw new Error('Invalid response from server.');
                if (result.response.resultData.productList.length <= 0) throw new Error('No product data found in the response.');
                resolve(result.response.resultData.productList);
            } catch (e) {
                reject(e);
            }
        });
    }
    getProductStockStatus(skus) {
        let _ = this;
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(skus) || skus.length === 0) {
                    throw new Error('Invalid input: SKU should be a non-empty array.');
                }
                const result = await _.getSimpleProductInfo(skus);
                let returnData = [];
                result.map(product => {
                    returnData.push({
                        resultMessage: product.resultMessage,
                        sku: product.productCode,
                        stockLevelStatus: product.stockLevelStatus,
                        stockLevelStatusDisplay: product.stockLevelStatusDisplay,
                        inStock:  !(typeof product.stockLevelStatus === 'null' || product.stockLevelStatus != "inStock") 
                    });
                });
                resolve(returnData);
            } catch (e)  {
                reject(e);
            }
        })
    }

    isInstock(sku) {
        let _ = this;
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof sku !== 'string' || sku.length === 0) {
                    throw new Error('Invalid input: SKU should be a non-empty string.');
                }
                const result = await _.getProductStockStatus([sku]);
                if (result.length === 0) throw new Error('No stock information found for the given SKU.');
                resolve(result[0].inStock);
            } catch (e) {
                reject(e);
            }
        });
    }
}
