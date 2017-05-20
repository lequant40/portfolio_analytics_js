/**
 * @file Functions related to Sharpe ratio computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper private methods - Unit tests usage only */
  self.sharpeRatio_ = function(mean, stddev) { return sharpeRatio_(mean, stddev); }
  /* End Wrapper private methods - Unit tests usage only */
  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function sharpeRatio
  *
  * @summary Compute the Sharpe ratio of a portfolio v.s. a benchmark.
  *
  * @description This function returns the Sharpe ratio of a portfolio v.s. a benchmark, both provided as
  * equity curves.
  *
  * The Sharpe ratio is defined as the arithmetic mean of the differential arithmetic returns 
  * (arithmetic returns of portfolio minus the arithmetic returns of the benchmark), divided by the sample standard deviation 
  * of these differential returns, c.f. the reference.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} equityCurveBenchmark the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {number} the Sharpe ratio of the portfolio v.s. the benchmark.
  *
  * @example
  * sharpeRatio([1, 2, 3], [1, 1, 1]); 
  * // XXX
  */
  self.sharpeRatio = function(portfolioEquityCurve, benchmarkEquityCurve) {
	// The Sharpe ratio is defined by the formula (6) of the reference, which uses:
	// - Differential returns
	// - Mean of differential returns
	// - Sample standard deviation of sample returns	
    var differentialReturns = differentialReturns_(portfolioEquityCurve, benchmarkEquityCurve);
	var m = self.mean_(differentialReturns);
	var sigma = self.sampleStddev_(differentialReturns);

    // Effectively computes the Sharpe ratio
	return sharpeRatio_(m, sigma);	
  }
  
  
  /**
  * @function sharpeRatio_
  *
  * @summary Internal function intended to compute the Sharpe ratio.
  *
  * @description This internal function returns the Sharpe ratio of a serie of differential returns based on their arithmetic
  * mean and their sample standard deviation.
  *
  * The Sharpe ratio is defined as the above mean divided by the above sample standard deviation, c.f. the reference.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * 
  * @param {number} m the arithmetic mean of differential returns, a real number.
  * @param {number} s the sample standard deviation of differential returns, a real number.
  * @return {number} the Sharpe ratio associated to m and s.
  *
  * @example
  * sharpeRatio_(1, 2); 
  * // XXX
  */
  function sharpeRatio_(m, s) {
	// The Sharpe ratio is defined by the formula (6) of the reference
	if (s == 0.0) {
	  return NaN; // The Sharpe ratio is undefined in case there is a null variance
	}
	else {
	  return m/s;
	}
  }

  
  /**
  * @function differentialReturns_
  *
  * @summary Compute the differential returns (also called excess returns) of a portfolio v.s. a benchmark.
  *
  * @description This function returns the differential returns of a portfolio v.s. a benchmark, both provided as
  * equity curves.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {Array.<number>} the differential returns, an array of real numbers of the same length as portfolioEquityCurve minus 1.
  *
  * @example
  * differentialReturns_(1, 2); 
  * // XXX
  */
  function differentialReturns_(portfolioEquityCurve, benchmarkEquityCurve) {
	// Compute the arithmetic returns of the portfolio
	var portfolioReturns = self.arithmeticReturns(portfolioEquityCurve).slice(1); // First value is NaN

	// Compute the arithmetic returns of the benchmark
	var benchmarkReturns = self.arithmeticReturns(benchmarkEquityCurve).slice(1); // First value is NaN

	// If there are no usable returns, exit
	if (portfolioReturns.length == 0 || benchmarkReturns.length == 0) {
	  return NaN;
	}

	// Else, compute and return the differential returns
	var differentialReturns = new portfolioReturns.constructor(portfolioReturns.length); // Inherit the array type from (ultimately) the input array
    for (var i=0; i<portfolioReturns.length; ++i) {
	  differentialReturns[i] = portfolioReturns[i] - benchmarkReturns[i];
	}
	return differentialReturns;
  }
  

  /**
  * @function biasAdjustedSharpeRatio
  *
  * @summary Compute the Sharpe ratio of a portfolio v.s. a benchmark, adjusted for its bias.
  *
  * @description This function returns the Sharpe ratio of a portfolio v.s. a benchmark, both provided as
  * equity curves, adjusted for its asymptotic bias.
  *
  * The asymptotic bias is computed using a factor dependant on the kurtosis of the differential returns
  * of the portfolio v.s. the benchmark, c.f. the reference.
  * 
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {number} the Sharpe ratio adjusted for its bias.
  *
  * @example
  * biasAdjustedSharpeRatio([1, 2, 3], [1, 1, 1]); 
  * // XXX
  */
  self.biasAdjustedSharpeRatio = function(portfolioEquityCurve, benchmarkEquityCurve) {
	// First compute the Sharpe ratio
    var differentialReturns = differentialReturns_(portfolioEquityCurve, benchmarkEquityCurve);
	var m = self.mean_(differentialReturns);
	var sigma = self.sampleStddev_(differentialReturns);
	var sr = sharpeRatio_(m, sigma);

	// Then compute its sample bias, c.f. formula 11b of the reference
	var k = self.sampleKurtosis_(differentialReturns);
	var srBias = 1 + 0.25 * (k - 1)/differentialReturns.length;
	
	// And return the Sharpe ratio adjusted fot its bias
	return sr/srBias;
  }
  

  /**
  * @function doubleSharpeRatio
  *
  * @summary Compute the double Sharpe ratio of a portfolio v.s. a benchmark. 
  *
  * @description This function returns the double Sharpe ratio of a portfolio v.s. a benchmark, both provided as
  * equity curves.
  *
  . The double Sharpe ratio is defined as the Sharpe ratio adjusted for its estimation risk as computed by its
  * standard deviation, c.f. the first reference.
  *
  * To be noted that the algorithm approximates the standard deviation of the Sharpe ratio through its asymptotic closed form formula,
  * found in the second reference, and not through a bootstrap procedure as originally described in the first reference.
  *
  * @see <a href="https://ssrn.com/abstract=168748">Vinod, Hrishikesh D. and Morey, Matthew R., A Double Sharpe Ratio (June 1, 1999).</a>
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {number} the double Sharpe ratio.
  *
  * @example
  * doubleSharpeRatio([1, 2, 3], [1, 1, 1]); 
  * // XXX
  */
  self.doubleSharpeRatio = function(portfolioEquityCurve, benchmarkEquityCurve) {
	// First compute the Sharpe ratio
    var differentialReturns = differentialReturns_(portfolioEquityCurve, benchmarkEquityCurve);
	var m = self.mean_(differentialReturns);
	var sigma = self.sampleStddev_(differentialReturns);
	var sr = sharpeRatio_(m, sigma);

	// Then compute its standard deviation as defined by formula 8 of the second reference
	var s = self.sampleSkewness_(differentialReturns);
	var k = self.sampleKurtosis_(differentialReturns);
	var srStdDev = Math.sqrt(sharpeRatioVariance_(differentialReturns.length, sr, s, k));
	
	// And return the double Sharpe ratio, as defined by formula 3 of the first reference
	return sr/srStdDev;
  }
  
  
  /**
  * @function sharpeRatioVariance_
  *
  * @summary Internal function intended to compute the variance of the Sharpe ratio.
  *
  * @description This internal function returns the variance of the Sharpe ratio of a serie of differential returns, based on their 
  * original Sharpe ratio, their sample skewness and their sample kurtosis.
  * 
  * The variance of the Sharpe ratio is approximated by its asymptotic closed form formula, c.f. the reference.
  *
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {number} nbRet the number of differential returns, a positive integer.  
  * @param {number} sR the Sharpe ratio of the differential returns, a real number.  
  * @param {number} s the skewness of the differential returns, a real number.
  * @param {number} k the kurtosis of the differential returns, a real number.
  * @return {number} the variance of the Sharpe ratio.
  *
  * @example
  * sharpeRatioVariance_(1, 2); 
  * // XXX
  */
  function sharpeRatioVariance_(nbRet, sR, s, k) {
	// The Sharpe ratio standard deviation is defined by formula 8 of the reference
	return (1 + 0.25 * sR*sR *(k - 1) - sR * s)/(nbRet - 1);
  }
  
  //TODO self.sharpeRatioConfidenceInterval (alpha)
  //TODO self.probabilisticSharpeRatio (alpha, target)
  //TODO self.minimumTrackLength (alpha, target)

  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
