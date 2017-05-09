| [French version](readme.fr.md)

# PortfolioAnalytics v0.0.3 ([Changelog](changelog.md))

[![Travis Build Status](https://travis-ci.org/lequant40/portfolio_analytics_js.svg?style=flat)](https://travis-ci.org/lequant40/portfolio_analytics_js)

In order to track my personal stock market investments performances, as well as to analyse trading strategies on my blog [Le Quant 40](http://www.lequant40.com/), I wanted to use portfolio performances measures computed in JavaScript.

Why in JavaScript ? Because I am a fan of [Google Sheets](https://www.google.com/sheets/about/), which is easily extensible thanks to [Google Apps Script](https://developers.google.com/apps-script/), a JavaScript-based language.

After several fruitless hours of Googling (incomplete codes, incorrect codes, undocumented codes...), I decided to create my own JavaScript library of such portfolio performances measures, hoping that it could be useful to other people...


## Features

- Compatible with Google Sheets
- Compatible with any browser supporting ECMAScript 5 (i.e., front-end development)
- Compatible with [Node.js](https://nodejs.org/) (i.e., back-end development)
- (Performances) Automatically uses JavaScript Typed Arrays
- (Performances and accuracy) Internally uses LAPACK-inspired linear algebra methods (sum, dot product...)
- (Accuracy) Internally uses accurate algorithms for statistical computations (e.g., corrected two pass algorithms for mean and variance...)
- Code continuously tested and integrated by [Travis CI](https://travis-ci.org/)
- Code documented using [JSDoc](http://usejsdoc.org/)

## Usage

### Usage in Google Sheets

If you would like to use PortfolioAnalytics in Google Sheets, you can either:

- (Recommended) [Import the external Google Apps Script library](https://developers.google.com/apps-script/guide_libraries) with Script ID 1NXwj16pdgcJT-XG5LiWRJyRW604Dj26U4lqgGsJJfOKLum4y9grakXPI into your spreadsheet script

or:

- Import the JavaScript files from the [dist/gs directory](https://github.com/lequant40/portfolio_analytics_js/tree/master/dist/gs) into your spreadsheet script

In both cases, providing data to the PortfolioAnalytics functions is then accomplished your preferred way:

- Using a wrapper function in your spreadsheet script, directly accessible from your spreadsheet, to which you can provide a standard data range (A1:A99...), e.g.:

```js
function computeUlcerIndexWrapper(iEquityCurveRange) {
  // Convert the input range coming from the spreadsheet into an array
  var aInternalArray = [];
  for (var i=0; i<iEquityCurveRange.length; ++i) {
    aInternalArray.push(iEquityCurveRange[i][0]);
  }
    
  // Compute the index
  var ulcerIndex = PortfolioAnalytics.ulcerIndex(aInternalArray);
  
  // Return it to the spreadsheet
  return ulcerIndex;
}
```

- Using pure Google Apps Script functions - typically the getRange(...) familly of functions -, optimized for speed, e.g.:

```js
function computeUlcerIndex() {
  // Adapted from https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow-column-numrows
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheets()[0];
 var range = sheet.getRange(1, 1, 100); // A1:A100
 var values = range.getValues();

 // Convert the above range into an array
 var aInternalArray = [];
 for (var row in values) {
   for (var col in values[row]) {
     aInternalArray.push(values[row][col]);
   }
 }
 
  // Compute the index
  var ulcerIndex = PortfolioAnalytics.ulcerIndex(aInternalArray);
  
  // Do something with it (use it in a computation, write it back to the spreadsheet, etc.)
  ...
}
```

You can find examples of PortfolioAnalytics usage in [this spreadsheet](https://docs.google.com/spreadsheets/d/16FDa3mhrvo8FTD62ravszhMZEkR-gIpipK4uLRNbj-o/edit?usp=sharing). 


### Usage inside a browser

If you would like to use PortfolioAnalytics inside a browser you can download [its source code](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.js) and/or [its minified source code](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.min.js).

You then just need to include this code in an HTML page, e.g.:
```html
	<script src="portfolio_analytics.dist.min.js" type="text/javascript"></script>
```

To be noted that if the browser is compatible with JavaScript Typed Arrays, you can provide such arrays in input to PortfolioAnalytics for better performances, e.g.:
```html
	PortfolioAnalytics.arithmeticReturns(new Float64Array([100.0, 109.75, 111.25]))
	// Will output a Float64Array
```

### Usage with Node.js

To be done...

### Examples

#### Drawdowns related measures

```js
PortfolioAnalytics.maxDrawdown([1, 2, 1]); 
// The maximum drawdown

PortfolioAnalytics.drawdownFunction([1, 2, 1]); 
// The drawdown function

PortfolioAnalytics.topDrawdowns([1, 2, 1], 1); 
// The top 'n' drawdowns (second largest drawdown, etc.) with their start/end indexes

PortfolioAnalytics.ulcerIndex([1, 2, 1]);
// The Ulcer Index

PortfolioAnalytics.painIndex([1, 2, 1]);
// The Pain Index, also corresponding to the average of the drawdown function

PortfolioAnalytics.conditionalDrawdown([100, 90, 80], 0.5);
// The conditional drawdown
```

#### Returns related measures

```js
PortfolioAnalytics.cumulativeReturn([1, 2, 1]); 
// The cumulative return from first to last period

PortfolioAnalytics.cagr([1, 2, 1], [new Date("2015-12-31"), new Date("2016-12-31"), new Date("2017-12-31")]); 
// The compound annual growth rate (CAGR) from first to last date

PortfolioAnalytics.arithmeticReturns([1, 2, 1]); 
// The arithmetic returns for all periods

PortfolioAnalytics.valueAtRisk([1, 2, 1], 0.7);
// The (percent) value at risk
```

#### Returns to variability related measures

```js
PortfolioAnalytics.gainToPainRatio([1, 2, 1]); 
// The gain to pain ratio
```

## How to contribute ?

### Fork the projet from [Github](https://github.com/)...


### Instal the [Grunt](http://gruntjs.com/) dependencies

```
npm install
```

### Develop...

### Compile

- The following command generates the files to be used inside a browser or with Node.js in the `dist` directory:

```
grunt deliver
```

- The following command generates the files to be used in Google Sheets in the `dist\gs` directory:

```
grunt deliver
```

### Test

Any of the following two commands run the [QUnit](https://qunitjs.com/) unit tests contained in the `test` directory on the generated file `dist\portfolio_analytics.dev.min.js`:

```
npm test
```

```
grunt test
```

### Submit a pull-request...


## License

[MIT License](https://en.wikipedia.org/wiki/MIT_License)

