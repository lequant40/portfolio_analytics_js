| [French version](readme.fr.md)

# PortfolioAnalytics v0.0.1 ([Changelog](changelog.md))

[![Travis Build Status](https://travis-ci.org/lequant40/portfolio_analytics_js.svg?style=flat)](https://travis-ci.org/lequant40/portfolio_analytics_js)

In order to track my personal stock market investments performances, as well as to analyse trading strategies on my blog [Le Quant 40](http://www.lequant40.com/), I wanted to use portfolio performances measures computed in JavaScript.

Why in JavaScript ? Because I am a fan of [Google Sheets](https://www.google.com/sheets/about/), which is easily extensible thanks to [Google Apps Script](https://developers.google.com/apps-script/), a JavaScript-based language.

After several fruitless hours of Googling (incomplete codes, incorrect codes, undocumented codes...), I decided to create my own JavaScript library of such portfolio performances measures, hoping that it could be useful to other people...


## Features

- Compatible with Google Sheets
- Compatible with any browser supporting ECMAScript 5 (i.e., front-end development)
- Compatible with [Node.js](https://nodejs.org/) (i.e., back-end development)
- Code continuously tested and integrated by [Travis CI](https://travis-ci.org/)
- Code documented using [JSDoc](http://usejsdoc.org/)

## Usage

### Usage in Google Sheets

If you would like to use PortfolioAnalytics in Google Sheets, you can either:

- (Recommended) [Import the external Google Apps Script library](https://developers.google.com/apps-script/guide_libraries) with Script ID 1NXwj16pdgcJT-XG5LiWRJyRW604Dj26U4lqgGsJJfOKLum4y9grakXPI from your spreadsheet
- Import the JavaScript files from the [dist/gs directory](https://github.com/lequant40/portfolio_analytics_js/tree/master/dist/gs) into your spreadsheet

You can find examples of PortfolioAnalytics usage in Google Sheets (data retrieval from cells...) in [this spreadsheet](https://docs.google.com/spreadsheets/d/16FDa3mhrvo8FTD62ravszhMZEkR-gIpipK4uLRNbj-o/edit?usp=sharing). 


### Usage inside a browser

If you would like to use PortfolioAnalytics inside a browser you can download [its source code](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.js) and/or [its minified source code](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.min.js).

You then just need to include this code in an HTML page, e.g.:
```html
	<script src="portfolio_analytics.dist.min.js" type="text/javascript"></script>
```

### Usage with Node.js

To be done...

### Examples

#### Drawdowns related measures

```js
PortfolioAnalytics.maxDrawdown([1, 2, 1]); 
// == 0.5 - the maximum drawdown

PortfolioAnalytics.drawdownFunction([1, 2, 1]); 
// == [0.0, 0.0, 0.5] - the drawdown function

PortfolioAnalytics.topDrawdowns([1, 2, 1], 1); 
// == [[0.5, 1.0, 2.0]] - the top 'n' drawdowns (second largest drawdown, etc.) with their start/end indexes

PortfolioAnalytics.ulcerIndex([1, 2, 1]);
// == ~0.289 - the Ulcer Index

PortfolioAnalytics.painIndex([1, 2, 1]);
// == ~0.167- the Pain Index, also corresponding to the average of the drawdown function

PortfolioAnalytics.conditionalDrawdown([100, 90, 80], 0.5);
// == 0.2 - the conditional drawdown at alpha level 0.5
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

