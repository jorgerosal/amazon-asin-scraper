# amazon-asin-scraper

Making your amazon scraping job easier. This is going to be an alternative way to get the data you need that are not available on aws product and mws search api.

 - Only Supports US marketplace as of this moment.

# Installation

```shell
npm install exceljs
```

## Usage

```js
const asinScraper = require('amazon-asin-scraper');

// using callback
let asin = someAsinIDhere;

asinScraper(asin, (result)=>{
  // output
  // {
  //   asin :
  //   productTitle :
  //   customerReview :
  //   starRating :
  //   currentPrice :
  //   imageThumbnail :
  //   sellerList : [
  //       { sellerName :
  //         fulfulledBy :
  //         rating :
  //         primeBadge :
  //         offerPrice :
  //         shipping :
  //         offerListingId :
  //       },
  //       {},
  //       {}
  //   ]
  // }  
});
```

## Features

- Buybox Page Data Scraping
- Review Scraping
- Full Seller List Detail
- Product Detail Page Data Scraping
- Single proxy or multiple proxies and handles proxy failure
- Cookie jar and custom cookies/headers/user agent
- Set Retries on failed requests

## Documentation

For documentation and examples check out [https://not-yet.com](https://cjpcjp.jd)


## Donate

Please consider a donation if you depend on this project and makes your job a bit easier.
Your contribution allows me to spend more time improving features of this project.

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZNPEGAPARUJSC)
