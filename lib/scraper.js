function scrapeBuybox(obj, callback){
    const osmosis = require("osmosis");
    // array result
    let result = {};
    let list = [];
    // console.log(obj);
    var url = "https://www.amazon.com/gp/offer-listing/"+obj.asin+"/ref=olp_f_new?ie=UTF8&f_all=true&f_new=true";
    osmosis
    .get(url)
    .config('proxy', obj.proxy)
    .config('user_agent', obj.userAgent)
    .paginate('#olpOfferListColumn > div > ul > li.a-last > a[href*="offer"]')
    .set('error', '#g > div > a > img@alt')
    .set('title', 'h1')
    .set('customerReview', '#olpProductDetails > div.a-section.a-spacing-small > span > span.a-size-small > a')
    .set('buyboxPrice', '')
    .find(/*'#olpOfferList > div > div > div.olpOffer,*/'div.olpOffer')
    .set({
        sellerName    : 'div.olpSellerColumn > h3 > span > a, div.olpSellerColumn > h3.olpSellerName > img@alt, div.olpSellerColumn > h3 > a',
        // merchantID    : 'div.olpSellerColumn > h3 > span > a@href',
        sellerRating  : 'div.olpSellerColumn > p > a > b',
        // fulfilledBy   : '',
        // primeBadge    : '',
        offerPrice    : 'div.olpPriceColumn > span.olpOfferPrice',
        shippingCharge: 'div.olpPriceColumn > p > span > span.olpShippingPrice',
        offerListingId: 'div.olpBuyColumn.a-span-last > div > form > input[name*="offeringID"]@value'
    })
    .data(function(res) {
        // do something with listing data
        // result.title = res.title;
        // result.customerReview = res.customerReview;
        result.asin = obj.asin;
        list.push(res);
        result.sellerList = list;
    })
    .done(function(){

    //   console.log(result);
        callback(result);

    })
    // .log(console.log)
    // .error(console.log)
    // .debug(console.log);
}

function roundToTwo(num) {
                return +(Math.round(num + "e+2")  + "e-2");
    }

function resConstructor(data){
    if (typeof data.seller === "undefined" || data.seller === 'undefined'){
        return "skip";
    } else if(data.seller == ''){
        data.merchantID = 'seller=A2L77EE7U53NWQ';
        data.seller = 'Amazon Warehouse';
    }

    // data.merchantID = "seller=";
    console.log('seller: ' + data.seller);


    if(data.seller == "Zappos.com"){
        data.merchantID = "seller=A38MYE29B8LFRT";
    }
    if(data.seller.includes("Amazon.com")){
        data.seller = "Amazon.com";
        data.merchantID = "seller=ATVPDKIKX0DER";
        // if (typeof data.price === "undefined"){
        //     getAmzPrice(data.asin, function(price){
        //         data.price = price;
                console.log("AMazon's price is " + data.price);
        //     });
        // }
    }
        if(data.seller.includes("Amazon Warehouse")){
        data.seller = "Amazon Warehouse";
        data.merchantID = "seller=A2L77EE7U53NWQ";
        // if (typeof data.price === "undefined"){
        //     getAmzPrice(data.asin, function(price){
        //         data.price = price;
                console.log("AMazon's price is " + data.price);
        //     });
        // }
    }
    data.merchantID = data.merchantID
                        .match(/seller=(.*$)/g)[0]
                        .replace("seller=", "");

    data.sellerlink = "https://www.amazon.com/gp/offer-listing/"+data.asin+"/ref=olp_twister_child?ie=UTF8&&seller="+data.merchantID;
    if (typeof data.price === "undefined"){
        return "skip";
    }

    data.price = Number(data.price.replace(/[^0-9\.]+/g,""));
    data.price = roundToTwo(data.price);
    data.title = data.title.replace(/[^\w\s]/gi, '');
    data.seller = data.seller.replace(/['"]+/g, '');

    if(data.price < data.map){
        return data;
    } else{
        return "skip";
    }
}
module.exports = scrapeBuybox;
