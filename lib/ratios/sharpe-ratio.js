/**
 * @file Functions related to Sharpe ratio computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function sharpeRatio
  *
  * @description Compute the (historic) Sharpe ratio associated to a portfolio equity curve v.s. a benchmark equity curve.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * 
  * @param {Array.<number>} equityCurvePortfolio the portfolio equity curve.
  * @param {Array.<number>} equityCurveBenchmark the benchmark equity curve.
  * @return {number|Array.<number>} the (historic) Sharpe ratio.
  *
  * @example
  * sharpeRatio([1, 2, 3], [1, 1, 1]); 
  * // XXX
  */
  self.sharpeRatio = function(equityCurvePortfolio, equityCurveBenchmark) {
    // No need for input checks, as done in function below
	
	// Compute the arithmetic returns of the portfolio
	var portfolioReturns = self.arithmeticReturns(equityCurvePortfolio).slice(1); // First value is NaN

	// Compute the arithmetic returns of the benchmark
	var benchmarkReturns = self.arithmeticReturns(equityCurveBenchmark).slice(1); // First value is NaN

	// If there are no usable returns, exit
	if (portfolioReturns.length == 0 || benchmarkReturns.length == 0) {
	  return NaN;
	}

	// Else, compute the differential returns
	// TODO : NEW_FLOAT64_ARRAY(differentialReturns, portfolioReturns.length)
	if (typeof Float64Array === 'function') { var differentialReturns = new Float64Array(portfolioReturns.length); } else { var differentialReturns = new Array(portfolioReturns.length) }
    for (var i=0; i<portfolioReturns.length; ++i) {
	  differentialReturns[i] = portfolioReturns[i] - benchmarkReturns[i];
	}
	
    // And compute the Sharpe ratio
	return self.sharpeRatio_(differentialReturns);	
  }

  
  /**
  * @function sharpeRatio_
  *
  * @description Compute the (historic) Sharpe ratio associated to the returns on a portfolio v.s. the returns on a benchmark portfolio.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * 
  * @param {Array.<number>} differentialReturns the differential returns between a portfolio returns and a benchmark returns.
  *
  * @example
  * sharpeRatio_([1, 2, 3]); 
  * // XXX
  */
  self.sharpeRatio_ = function(differentialReturns) {
    // Internal function => no specific checks on the input arguments
		
	// The historic Sharpe ratio is defined by the formula (6) of the reference
      // Compute the average of differential returns 
	var m = self.mean_(differentialReturns);
	  
	  // Compute the sample (i.e., unbiaised) standard deviation of differential returns
	var sigma = self.sampleStddev_(differentialReturns);
	  
	// Return the Sharpe ratio
	if (sigma == 0.0) {
	  return NaN; // The Sharpe ratio is undefined in case there is a null variance
	}
	else {
	  return m/sigma;
	}
  }


  /**
  * @function biasAdjustedSharpeRatio
  *
  * @description Compute the (historic) Sharpe ratio associated to a portfolio equity curve v.s. a benchmark equity curve, adjusted for its (small sample) bias.
  *
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {Array.<number>} equityCurvePortfolio the portfolio equity curve.
  * @param {Array.<number>} equityCurveBenchmark the benchmark equity curve.
  * @return {number|Array.<number>} the (historic) Sharpe ratio.
  *
  * @example
  * biasAdjustedSharpeRatio([1, 2, 3], [1, 1, 1]); 
  * // XXX
  */
  self.biasAdjustedSharpeRatio = function(equityCurvePortfolio, equityCurveBenchmark) {
    // No need for input checks, as done in function below
	
	// Compute the arithmetic returns of the portfolio
	var portfolioReturns = self.arithmeticReturns(equityCurvePortfolio).slice(1); // First value is NaN

	// Compute the arithmetic returns of the benchmark
	var benchmarkReturns = self.arithmeticReturns(equityCurveBenchmark).slice(1); // First value is NaN

	// If there are no usable returns, exit
	if (portfolioReturns.length == 0 || benchmarkReturns.length == 0) {
	  return NaN;
	}
	
	// Else, compute the differential returns
	// TODO : NEW_FLOAT64_ARRAY(differentialReturns, portfolioReturns.length)
	if (typeof Float64Array === 'function') { var differentialReturns = new Float64Array(portfolioReturns.length); } else { var differentialReturns = new Array(portfolioReturns.length) }
    for (var i=0; i<portfolioReturns.length; ++i) {
	  differentialReturns[i] = portfolioReturns[i] - benchmarkReturns[i];
	}
	
	// Then compute the Sharpe ratio
	var s = self.sharpeRatio_(differentialReturns);
	
	// Then compute its small sample bias, c.f. formula 11b of the reference
	var bias = 1 + 0.25 * (self.sampleKurtosis_(differentialReturns) - 1)/portfolioReturns.length;
	
	// And return it
	return s/bias
  }
  

  
  //self.sharpeRatioConfidenceInterval (alpha)
  

  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
