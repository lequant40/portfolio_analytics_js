/**
 * @file Functions related to Sharpe ratio computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
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
  * sharpeRatio([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100]);
  * // ~0.585
  */
  function sharpeRatio(portfolioEquityCurve, benchmarkEquityCurve) {
	// Compute the Sharpe ratio statistics
	var srs = sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve);
	var sr = srs[0];
	
	// Return the Sharpe ratio
	return sr;
  }  

  
  /**
  * @function sharpeRatioStatistics_
  *
  * @summary Internal function intended to compute the Sharpe ratio, the Sharpe ratio variance
  * and the Sharpe ratio asymptotic bias.
  *
  * @description This internal function returns the Sharpe ratio of a portfolio v.s. a benchmark, both provided as
  * equity curves, as well as its variance and its asymptotic bias.
  * 
  * The Sharpe ratio is defined as the arithmetic mean of the differential arithmetic returns 
  * (arithmetic returns of the portfolio minus the arithmetic returns of the benchmark), divided by the sample standard deviation 
  * of these differential returns, c.f. the first reference.
  *
  * The Sharpe ratio asymptotic bias is computed using a factor dependant on the kurtosis of the differential returns
  * of the portfolio v.s. the benchmark, c.f. the second reference.
  *
  * The Sharpe ratio variance is approximated through its asymptotic closed form formula, dependant on the skewness
  * and on the kurtosis of these differential returns, c.f. the second reference.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {Array.<number>} the Sharpe ratio of the portfolio v.s. the benchmark, the variance of the Sharpe ratio and the
  * asymptotic bias of the Sharpe ratio.
  *
  * @example
  * sharpeRatioStatistics_([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100]);
  * // [0.5851289093221407, 0.5228801702220195, 1.1019640163238367]
  */
  function sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve) {
	// Compute the differential returns and associated statistics
    var differentialReturns = differentialReturns_(portfolioEquityCurve, benchmarkEquityCurve);
    var moments = sampleMoments_(differentialReturns);
    var m = moments[0];
    var sigma = moments[2];
    var s = moments[3];	
    var k = moments[4];
	
	// Compute the Sharpe ratio, qs defined by the formula (6) of the first reference
    var sr = m/sigma;

    // Compute the Sharpe ratio variance, as defined by formula (8) of the second reference
	var srVar = (1 + 0.25 * sr * sr *(k - 1) - sr * s)/(differentialReturns.length - 1);
	
	// Compute the Sharpe ratio asymptotic bias, c.f. formula 11b of the second reference
	var srBias = 1 + 0.25 * (k - 1)/differentialReturns.length;

	// Return them
	return [sr, srVar, srBias];
  }
  
  
  /**
  * @function differentialReturns_
  *
  * @summary Compute the differential arithmetic returns (also called excess arithmetic returns) of a portfolio v.s. a benchmark.
  *
  * @description This function returns the differential arithmetic returns of a portfolio v.s. a benchmark
  * (arithmetic returns of the portfolio minus arithmetic returns of the benchmark), both provided as
  * equity curves.
  *
  * @see <a href="http://www.iijournals.com/doi/abs/10.3905/jpm.1994.409501?journalCode=jpm">The Sharpe Ratio, William F. Sharpe, The Journal of Portfolio Management, Fall 1994, Vol. 21, No. 1: pp.49-58</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {Array.<number>} the differential returns, an array of real numbers of the same length as portfolioEquityCurve minus 1.
  *
  * @example
  * differentialReturns_([100, 105, 110.25], [100, 100, 100]);
  * // [0.05, 0.05], special case of constant benchmark (e.g. risk free rate equals to zero)
  */
  function differentialReturns_(portfolioEquityCurve, benchmarkEquityCurve) {
	// Compute the arithmetic returns of the portfolio
	var portfolioReturns = arithmeticReturns(portfolioEquityCurve).slice(1); // First value is NaN

	// Compute the arithmetic returns of the benchmark
	var benchmarkReturns = arithmeticReturns(benchmarkEquityCurve).slice(1); // First value is NaN

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
  * The Sharpe ratio asymptotic bias is computed using a factor dependant on the kurtosis of the differential returns
  * of the portfolio v.s. the benchmark, c.f. the reference.
  * 
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {number} the Sharpe ratio of the portfolio v.s. the benchmark, adjusted for bias.
  *
  * @example
  * biasAdjustedSharpeRatio([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100]);
  * // ~0.53
  */
  function biasAdjustedSharpeRatio(portfolioEquityCurve, benchmarkEquityCurve) {
	// Compute the Sharpe ratio statistics
	var srs = sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve);
	var sr = srs[0];
	var srBias = srs[2];
	
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
  * dependant on the skewness and on the kurtosis of the differential returns of the portfolio v.s. the benchmark, c.f. the second reference,
  * and not through a bootstrap procedure originally described in the first reference.
  *	
  * @see <a href="https://ssrn.com/abstract=168748">Vinod, Hrishikesh D. and Morey, Matthew R., A Double Sharpe Ratio (June 1, 1999).</a>
  * @see <a href="http://link.springer.com/article/10.1057/palgrave.jam.2250084">Comparing Sharpe ratios: So where are the p-values, J.D. Opdyke, Journal of Asset Management (2007) 8, 308–336</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @return {number} the double Sharpe ratio of the portfolio v.s. the benchmark.
  *
  * @example
  * doubleSharpeRatio([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100]); 
  * // ~0.809
  */
  function doubleSharpeRatio(portfolioEquityCurve, benchmarkEquityCurve) {
	// Compute the Sharpe ratio statistics
	var srs = sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve);
	var sr = srs[0];
	var srStdDev = Math.sqrt(srs[1]);
	
	// And return the double Sharpe ratio, as defined by formula 3 of the first reference
	return sr/srStdDev;
  }

  
  /**
  * @function sharpeRatioConfidenceInterval
  *
  * @summary Compute the confidence interval at a given significance level of a Sharpe ratio 
  * of a portfolio v.s. a benchmark.
  *
  * @description This function returns the confidence interval, at a given significance level alpha%,
  * of a Sharpe ratio of a portfolio v.s. a benchmark, both provided as equity curves.
  *
  * The confidence interval is centered on the Sharpe ratio of the portfolio, with a length
  * depending on the significance level and on the variance of the Sharpe ratio, approximated 
  * by its asymptotic closed form formula, c.f. the references.
  *
  * @see <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1821643">David H. Bailey, DavisMarcos Lopez de Prado, The Sharpe Ratio Efficient Frontier, Journal of Risk, Vol. 15, No. 2, Winter 2012/13</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @param {number} alpha the significance level, a real number belonging to interval [0,1].
  * @return {Array.<number>} the confidence interval of the Sharpe ratio of the portfolio v.s. the benchmark.
  *
  * @example
  * sharpeRatioConfidenceInterval([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100], 0.05); 
  * // [-0.832129939760892, 2.0023877584051735] // This interval is the 95% confidence level interval for the Sharpe ratio,
  * which implies that a negative/null Sharpe ratio cannot be excluded
  */
  function sharpeRatioConfidenceInterval(portfolioEquityCurve, benchmarkEquityCurve, alpha) {
	// Compute the Sharpe ratio statistics
	var srs = sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve);
	var sr = srs[0];
	var srStdDev = Math.sqrt(srs[1]);

	// Then compute its confidence interval at the alpha level, as defined by formula 9 of the reference
	var zalpha2 = norminv_(1 - alpha/2); 
	var srLowerBound = sr - zalpha2 * srStdDev;
	var srUpperBound = sr + zalpha2 * srStdDev;
	
	// And return it
	return [srLowerBound, srUpperBound];
  }
  
  
  /**
  * @function probabilisticSharpeRatio
  *
  * @summary Compute the probabilistic Sharpe ratio of a portfolio v.s. a benchmark, 
  * assessed against a reference Sharpe ratio.
  *
  * @description This function returns the probabilistic Sharpe ratio of a portfolio v.s. a benchmark, both provided as
  * equity curves, assessed against a reference Sharpe ratio.
  *
  * The probabilistic Sharpe ratio is defined as the probability that the computed Sharpe ratio of a portfolio
  * v.s. a benchmark is greater than a reference Sharpe ratio, c.f. the reference.
  *
  * The probabilistic Sharpe ratio takes into account multiple statistical features present in the portfolio returns, 
  * such as their length, frequency and deviations from normality (through their skewness and their kurtosis) 
  * and provide a deflated, atemporal measure of performance expressed in terms of probability of skill.
  * 
  * To be noted that calculations are done in the original frequency of the portfolio valuations,
  * so that care must be taken when chosing the reference Sharpe ratio.
  * Standard values for the reference Sharpe ratio are 0 (no investment skill) and 1 (annualized; root square rule can be used for un-annualization).
  *
  * @see <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1821643">David H. Bailey, DavisMarcos Lopez de Prado, The Sharpe Ratio Efficient Frontier, Journal of Risk, Vol. 15, No. 2, Winter 2012/13</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @param {number} referenceSharpeRatio the Sharpe ratio against which to assess the computed Sharpe ratio, a real number.
  * @return {number} the probabilistic Sharpe ratio of the portfolio v.s. the benchmark, expressed as a percentage.
  *
  * @example
  * probabilisticSharpeRatio([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100], 0); 
  * // ~0.79; // Indicates that the portfolio v.s. benchmark (here, risk free rate of 0) Sharpe ratio is greater than 0 with a confidence level of 79%
  */
  function probabilisticSharpeRatio(portfolioEquityCurve, benchmarkEquityCurve, referenceSharpeRatio) {
	// Compute the Sharpe ratio statistics
	var srs = sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve);
	var sr = srs[0];
	var srStdDev = Math.sqrt(srs[1]);
	
	// Then compute the probabilistic Sharpe ratio, as defined by formula 11 of the reference
	var x = (sr - referenceSharpeRatio)/srStdDev;
	var psr = normcdf_(x);
	
	// And return it
	return psr;
  }


  /**
  * @function minimumTrackRecordLength
  *
  * @summary Compute the minimum track record length at a given significance level of a portfolio v.s. a benchmark, 
  * assessed against a reference Sharpe ratio.
  *
  * @description This function returns the minimum track record length, at a given significance level alpha%,
  * of a portfolio v.s. a benchmark, both provided as equity curves, assessed against a reference Sharpe ratio.
  *
  * The minimum track record length is defined as the length of the track record of the performance of a 
  * portfolio v.s. a benchmark required in order to have statistical confidence, at confidence level 1-alpha%,
  * that its Sharpe ratio is above a reference Sharpe ratio, c.f. the reference.
  *
  * The minimum track record length builds on the probabilistic Sharpe ratio, which means that it takes into account
  * the same statistical features present in the portfolio returns as the probabilistic Sharpe ratio.
  * 
  * To be noted that the minimum track record length is expressed in terms of the number of portfolio valuations required,
  * and not in calendar terms.
  *
  * @see <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1821643">David H. Bailey, DavisMarcos Lopez de Prado, The Sharpe Ratio Efficient Frontier, Journal of Risk, Vol. 15, No. 2, Winter 2012/13</a>
  * 
  * @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
  * @param {Array.<number>} benchmarkEquityCurve the benchmark equity curve, an array of real numbers of the same length as portfolioEquityCurve.
  * @param {number} alpha the significance level, a real number belonging to interval [0,1].
  * @param {number} referenceSharpeRatio the Sharpe ratio against which to test the minimum track record length, a real number.
  * @return {number} the minimum track record length of the portfolio v.s. the benchmark.
  *
  * @example
  * minimumTrackRecordLength([100, 110, 105, 107.5, 115], [100, 100, 100, 100, 100] ,0.05, 0); 
  * // ~13.4; // Indicates that 13.4 valuations are required to state that the portfolio v.s. benchmark Sharpe ratio 
  * is greater than 0 with a 95% confidence level (hence, the 6 values provided here are not sufficent)
  */
  function minimumTrackRecordLength(portfolioEquityCurve, benchmarkEquityCurve, alpha, referenceSharpeRatio) {
	// Compute the Sharpe ratio statistics
	var srs = sharpeRatioStatistics_(portfolioEquityCurve, benchmarkEquityCurve);
	var sr = srs[0];
	var srVar = srs[1];
	
	// Then compute the minimum track record length, as defined by formula 13 of reference
	var zalpha = norminv_(1 - alpha);
	var mtl = 1 + srVar * (portfolioEquityCurve.length - 2) * (zalpha/(sr - referenceSharpeRatio)) * (zalpha/(sr - referenceSharpeRatio));

	// And return it
	return mtl;
  }

  
