const osmosis = require("osmosis");


var getAmzPrice = require("../core/itemLookupApi").amzPrice;
// var getAmzPrice = require("../core/getAmzPrice");

function mapChecker(obj, callback){

    // array result
    var result = [];
    // console.log(obj);
    var url = "https://www.amazon.com/gp/offer-listing/"+obj.asin+"/ref=olp_f_new?ie=UTF8&f_all=true&f_new=true";
    osmosis
    .get(url)
    .config('proxy', getRandomProxy())
    .config('user_agent', getRandomUserAgent())
    .paginate('#olpOfferListColumn > div > ul > li.a-last > a[href*="offer"]')
    .set('error', '#g > div > a > img@alt')
    .set("title", "h1")
    .find(/*'#olpOfferList > div > div > div.olpOffer,*/'div.olpOffer')
    .set({
        seller : 'div.olpSellerColumn > h3 > span > a, div.olpSellerColumn > h3.olpSellerName > img@alt, div.olpSellerColumn > h3 > a',
        merchantID : 'div.olpSellerColumn > h3 > span > a@href',
        price : 'div.olpPriceColumn > span.olpOfferPrice'

    })
    .data(function(res) {
        // do something with listing data
        // console.log(res);
        res.brand = obj.brand;
        res.asin = obj.asin;
        res.upc = obj.upc;
        res.map = roundToTwo(obj.map);
        res.sku = obj.sku;
        res.timeStamp = Ustime();
        // res.timeStamp = '2018-04-09 00:00:00'
        res.ScreenshotTrigger = obj.ss;

        var out = resConstructor(res);
        // console.log(out);
        if(out != 'skip'){
            // console.log(out);
            result.push(out)
        }
    })
    .done(function(){

    //   console.log(result);
        callback(result);

    })
    .log(console.log)
    .error(console.log)
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

    let link = "http://map.channelbpo.com/"+ fileNaming(data);
    data.ScreenshotLink = link;

    if(data.brand.includes("RW-") || data.brand.includes("-RW")){
        data.ScreenshotJob = 'close';
        data.ScreenshotTrigger = 'No';
        data.link = "none";
    }

    if (data.brand == "Thorogood RW"){
        data.ScreenshotJob = 'close';
        data.ScreenshotTrigger = 'No';
        data.link = "none";
    } else data.ScreenshotJob = 'open';



    if(data.price < data.map){
        return data;
    } else{
        return "skip";
    }
}
module.exports = mapChecker;
