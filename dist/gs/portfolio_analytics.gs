/**
 * @file Header
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/**
 * @file Functions related to drawdowns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */


 
  
/**
* @function maxDrawdown
*
* @description Compute the maximum drawdown associated to a portfolio equity curve.
*
* @see <a href="https://en.wikipedia.org/wiki/Drawdown_(economics)">https://en.wikipedia.org/wiki/Drawdown_(economics)</a>
* 
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @return {number} the maximum drawdown.
*
* @example
* maxDrawdown([1, 2, 1]); 
* // 0.5, i.e. 50% drawdown
*
* @example
* maxDrawdown([1, 2, 3]);
* // 0.0, i.e. no drawdown
*
* @example
* maxDrawdown([]);
* // 0.0, i.e. no drawdown
*/
function maxDrawdown(equityCurve) {
	// Compute the maximum drawdown and its associated duration
	var maxDd_ = maxDrawdown_(equityCurve, 0, equityCurve.length-1);

	// Return the maximum drawdown
	if (maxDd_[0] == -Infinity) {
		return 0.0;
	}
	else {
		return maxDd_[0];
	}
}
  
  
/**
* @function maxDrawdown_
*
* @description Compute the maximum drawdown associated to a portfolio equity curve,
* as well as the indexes of the start/end of the maximum drawdown phase.
*
* In case there are several identical maximum drawdowns, the indexes returned
* correspond to the start/end of the first encountered maximum drawdown phase.
*
* @see <a href="https://en.wikipedia.org/wiki/Drawdown_(economics)">https://en.wikipedia.org/wiki/Drawdown_(economics)</a>
* 
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @param {number} idxStart the equityCurve array index from which to compute the maximum drawdown.
* @param {number} idxEnd the equityCurve index until which to compute the maximum drawdown.
* @return {Array.<number>} in this order, the maximum drawdown and
* the indexes of the start/end of the maximum drawdown phase.
*
* @example
* maxDrawdown_([1, 2, 1], 0, 2); 
* // [0.5, 1.0, 2.0], i.e. 50% drawdown, starting at index 1 and ending at index 2
*
* @example
* maxDrawdown_([1, 2, 3], 0, 2); 
* // [0.0, -1.0, -1.0], i.e. no drawdown computed, hence no start/end indexes
*
* @example
* maxDrawdown_([1, 2, 3], 0, -1); 
* // [-Infinity, -1.0, -1.0], i.e. failure in the drawdown computation, hence no start/end indexes
*/
function maxDrawdown_(equityCurve, idxStart, idxEnd) {
	// Initialisations
	var highWaterMark = -Infinity;
	var maxDd = -Infinity;
	var idxHighWaterMark = -1;
	var idxStartMaxDd = -1;
	var idxEndMaxDd = -1;

	// Loop over all the values to compute the maximum drawdown
	for (var i=idxStart; i<idxEnd+1; ++i) {     
		if (equityCurve[i] > highWaterMark) {
			highWaterMark = equityCurve[i];
			idxHighWaterMark = i;
		}

		var dd = (highWaterMark - equityCurve[i]) / highWaterMark;

		if (dd > maxDd) {
			maxDd = dd;
			idxStartMaxDd = idxHighWaterMark;
			idxEndMaxDd = i;
		}
	}

	// Return the computed values
	return [maxDd, idxStartMaxDd, idxEndMaxDd];
}


/**
* @function drawdownFunction
*
* @description Compute the drawdown function associated to a portfolio equity curve,
* also called the portfolio underwater equity curve.
*
* @see <a href="https://en.wikipedia.org/wiki/Drawdown_(economics)">https://en.wikipedia.org/wiki/Drawdown_(economics)</a>
* @see <a href="http://papers.ssrn.com/sol3/papers.cfm?abstract_id=223323">Portfolio Optimization with Drawdown Constraints, Chekhlov et al., 2000</a>
* 
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @return {Array.<number>} the values of the drawdown function.
*
* @example
* drawdownFunction([1, 2, 1]); 
* // [0.0, 0.0, 0.5], i.e. no drawdowns at indexes 0/1, 50% drawdown at index 2  
*/
function drawdownFunction(equityCurve) {
	// Initialisations
	var highWaterMark = -Infinity;

	// Other initialisations
	var ddVector = new equityCurve.constructor(equityCurve.length); // Inherit the array type from the input array

	// Loop over all the values to compute the drawdown vector
	for (var i=0; i<equityCurve.length; ++i) {
		if (equityCurve[i] > highWaterMark) {
			highWaterMark = equityCurve[i];
		}

		ddVector[i] = (highWaterMark - equityCurve[i]) / highWaterMark;
	}

	// Return the computed vector
	return ddVector;
}


/**
* @function topDrawdowns
*
* @description Compute the top drawdowns associated to a portfolio equity curve,
* as well as the indexes of the start/end of these drawdown phases.
*
* The top 1 drawdown is, by definition, the maximum drawdown - if existing.
*
* The top 2 drawdown is (reasonably) defined as the maximum drawdown occuring outside of
* the top 1 drawdown phase - if existing.
*
* The top n drawdown is (reasonably) defined as the maximum drawdown occuring outside of
* the top n-1, n-2,..., 1 drawdown phases - if existing.
*
* In case there are several identical drawdowns, they are ordered from the lowest
* to the highest start index of the drawdown phase.
*
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @param {<number>} nbTopDrawdowns the (maximum) number of top drawdown to compute.
* @return {Array.<Array.<number>>} the top drawdowns.
*
* @example
* topDrawdowns([1, 2, 1], 1);
* // [[0.5, 1.0, 2.0]], i.e. top 1 drawdown is 50%, starting at index 1 and ending at index 2
*
* @example
* topDrawdowns([1,2, 1], 1)[0][0] == maxDrawdown([1, 2, 1]); 
* // true
*/
function topDrawdowns(equityCurve, nbTopDrawdowns) {
	// If no drawdowns are required, returns
	if (nbTopDrawdowns == 0) {
		return [];
	}

	// Do the effective computation
	// Note: this code results from the de-recursification of the naive
	// implementation of the top n drawdown definition (hence in
	// particular the callStak variable, emulating the recursive calls)
	var topDrawdowns = [];
	var callStack = [];

	callStack.push([0, equityCurve.length-1, nbTopDrawdowns]);

	while (callStack.length != 0) {
		var topCallStack  = callStack.pop();
		var idxStart = topCallStack[0];
		var idxEnd = topCallStack[1];
		var nbRemainingTopDrawdows = topCallStack[2];

		var topDd = maxDrawdown_(equityCurve, idxStart, idxEnd);
		var idxStartMaxDd = topDd[1];
		var idxEndMaxDd = topDd[2];
		var maxDd = topDd[0];

		if (maxDd != 0.0 && maxDd != -Infinity) {
			topDrawdowns.push([maxDd, idxStartMaxDd, idxEndMaxDd]);
		}

		if (nbRemainingTopDrawdows == 1) { // End of the recursion
			;
		}
		else {
			// Four possible cases:
			// #1 - idxStartMaxDd == idxStart and idxEndMaxDd == idxEnd => nothing more to do, 
			// as only one maximum drawdown exists
			if (idxStartMaxDd == idxStart && idxEndMaxDd == idxEnd) {
				;
			}
			
			// #2 - idxStartMaxDd == idxStart and idxEndMaxDd < idxEnd => compute the remaining 
			// n-1 maximum drawdowns on [idxEndMaxDd, idxEnd] interval
			else if (idxStartMaxDd == idxStart && idxEndMaxDd < idxEnd) {
				callStack.push([idxEndMaxDd, idxEnd, nbRemainingTopDrawdows-1]);
			}
			
			// #3 - idxStartMaxDd > idxStart and idxEndMaxDd == idxEnd => compute the remaining 
			// n-1 maximum drawdowns on [idxStart, idxStartMaxDd] interval
			else if (idxStartMaxDd > idxStart && idxEndMaxDd == idxEnd) {
				callStack.push([idxStart, idxStartMaxDd, nbRemainingTopDrawdows-1]);
			}
			
			// #4 - idxStartMaxDd > idxStart and idxEndMaxDd < idxEnd => compute the remaining 
			// n-1 maximum drawdowns on both [idxStart, idxStartMaxDd] and [idxEndMaxDd, idxEnd]
			// intervals
			else {
				callStack.push([idxStart, idxStartMaxDd, nbRemainingTopDrawdows-1]);
				callStack.push([idxEndMaxDd, idxEnd, nbRemainingTopDrawdows-1]);
			}
		}
	}  

	// Sort the computed top drawdowns
	topDrawdowns.sort(function(a, b) { 
		var ddA = a[0];
		var ddB = b[0];
		if (ddA < ddB) { // b drawdown > a drawdown => b drawdown to appear first
			return 1;
		}
		else if (ddA > ddB) { // a drawdown > b drawdown => a drawdown to appear first
			return -1;
		}
		else { // a drawdown = b drawdown => least recent drawdown to appear first
			var idxStartDdA = a[1];
			var idxStartDdB = b[1];
			if (idxStartDdA < idxStartDdB) { // a drawdown least recent => a drawdown to appear first
				return -1;
			}
			else { // b drawdown least recent => b drawdown to appear first; no ties possible on indexes
				return 1;
			}
		}
	}); 

	// Return (at most) the nbTopDrawdowns top drawdowns
	return topDrawdowns.slice(0, Math.min(nbTopDrawdowns, topDrawdowns.length));
}


/**
* @function ulcerIndex
*
* @description Compute the ulcer index associated to a portfolio equity curve.
*
* @see <a href="http://www.tangotools.com/ui/ui.htm">Ulcer Index, An Alternative Approach to the Measurement of Investment Risk & Risk-Adjusted Performance</a>
*
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @return {number} the ulcer index.
*
* @example
* ulcerIndex([1, 2, 1]);
* // ~0.289
*/
function ulcerIndex(equityCurve) {
	// Compute the drawdown function
	var ddFunc = drawdownFunction(equityCurve);

	// Compute the sum of squares of this function
	var sumSquares = 0.0;
	for (var i=0; i<ddFunc.length; ++i) {
		sumSquares += ddFunc[i]*ddFunc[i];
	}

	// Compute and return the ulcer index
	return Math.sqrt(sumSquares/ddFunc.length);
}


/**
* @function painIndex
*
* @description Compute the pain index associated to a portfolio equity curve.
*
* @see <a href="http://www.styleadvisor.com/content/pain-index">Pain Index and Pain Ratio, White Paper, Zephyr Associates</a>
*
* The pain index also corresponds to the average of the values of the drawdown function.
*
* @see <a href="http://papers.ssrn.com/sol3/papers.cfm?abstract_id=223323">Portfolio Optimization with Drawdown Constraints, Chekhlov et al., 2000</a>
*
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @return {number} the pain index.
*
* @example
* painIndex([1, 2, 1]);
* // ~0.167
*/
function painIndex(equityCurve) {
	// Compute the drawdown function
	var ddFunc = drawdownFunction(equityCurve);

	// Compute and return the mean of this function, which corresponds to the pain index
	return mean_(ddFunc);
}


/**
* @function conditionalDrawdown
*
* @description Compute the conditional drawdown of a portfolio equity curve.
*
* @see <a href="http://www.worldscientific.com/doi/abs/10.1142/S0219024905002767">Drawdown Measure in Portfolio Optimization, Chekhlov et al., Int. J. Theor. Appl. Finan. 08, 13 (2005)</a>
*
* @param {Array.<number>} equityCurve the portfolio equity curve.
* @param {number} alpha the tolerance parameter belonging to interval [0,1].
* @return {number} the alpha-conditional drawdown.
*
* @example
* conditionalDrawdown([100, 90, 80, 70, 60, 50, 40, 30, 20], 0.7);
* // 0.725
*/
function conditionalDrawdown(equityCurve, alpha) {   
	// Compute the drawdown function and
	// remove the first element, always equals to 0
	// C.f. definition 3.1
	var ddFunc = drawdownFunction(equityCurve).slice(1);

	// Sort the drawdown function from lowest to highest values
	ddFunc.sort(function(a, b) { return a - b;});

	// If alpha = 1 (limit case), return the maximum drawdown
	if (alpha == 1.0) {
		return ddFunc[ddFunc.length-1];
	}

	// Otherwise, find the drawdown associated to pi^{-1}(alpha), as well as its percentile
	// C.f. (3.8) of the reference
	var idxAlphaDd = 1; 
	while (alpha > idxAlphaDd/ddFunc.length) {
		++idxAlphaDd;
	}
	var alphaDd = ddFunc[idxAlphaDd-1];
	var pctileAlphaDd = idxAlphaDd/ddFunc.length;

	// Compute and return the conditional drawdown using Theorem 3.1 of the reference
	// Compute the integral between alpha and the alpha percentile
	var cdd1 = (pctileAlphaDd - alpha) * alphaDd;

	// Compute the remaining part of the integral between alpha percentile and one  
	var cdd2 = 0.0;
	for (var i=idxAlphaDd; i<ddFunc.length; ++i) {
		cdd2 += ddFunc[i];
	}
	cdd2 /= ddFunc.length;

	// Compute and return the average value of the integral above
	var cdd = (cdd1 + cdd2) / (1 - alpha);
	return cdd;
}

/**
 * @file Functions related to performances ratios computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */


/**
* @function gainToPainRatio
*
* @summary Compute the gain to pain ratio of a portfolio.
*
* @description This function returns the gain to pain ratio of a portfolio, provided as an
* equity curve.
*
* The the gain to pain ratio is defined as the sum of all returns divided by the absolute value of the sum of all losses, c.f. the reference.
*
* From the reference, a gain to pain ratio above 1.0 is very good, and a gain to pain ratio above 1.5 is excellent.
*
* @see <a href="http://onlinelibrary.wiley.com/doi/10.1002/9781119203469.app1/summary">Hedge Fund Market Wizards: How Winning Traders Win, Jack D. Schwager, Wiley, 2012</a>
* 
* @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
* @return {number} the gain to pain ratio of the portfolio.
*
* @example
* gainToPainRatio([1, 2, 1]); 
* // 1.0 
*
* @example
* gainToPainRatio([1, 1.1, 1.4]); 
* // NaN
*/
function gainToPainRatio(portfolioEquityCurve) {
	// Compute the arithmetic returns of the portfolio
	var returns = arithmeticReturns(portfolioEquityCurve).slice(1); // First value is NaN

	// If there is no usable returns, exit
	if (returns.length == 0) {
		return NaN;
	}

	// Else, compute the gain to pain ratio as the the sum of the returns divided by
	// the sum of the absolute values of the negative returns, c.f. the reference.
	var numerator = mean_(returns);
	var denominator = lpm_(returns, 1, 0.0);

	// Return the gain to pain ratio
	if (denominator == 0.0) {
		return NaN; // The gain to pain ratio is undefined in case there is no negative returns
	}
	else {
		return numerator/denominator;
	}
}

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
* @summary Internal function intended to compute the differential arithmetic returns 
* (also called excess arithmetic returns) of a portfolio v.s. a benchmark.
*
* @description This internal function returns the differential arithmetic returns of a portfolio v.s. a benchmark
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

/**
 * @file Functions related to returns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */


/**
* @function cumulativeReturn
*
* @summary Compute the cumulative return of a portfolio.
*
* @description This function returns the cumulative return of a portfolio, provided as an
* equity curve.
*
* The cumulative return of a portfolio is defined as its rate of return over the period
* on which it is provided, c.f. the reference.
*
* @see <a href="https://en.wikipedia.org/wiki/Rate_of_return">https://en.wikipedia.org/wiki/Rate_of_return</a>
* 
* @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
* @return {number} the cumulative return of the portfolio, expressed as a percentage.
*
* @example
* cumulativeReturn([1, 2, 1]); 
* // 0.0, i.e. 0% return over the period
*
* @example
* cumulativeReturn([1, 2, 2]);
* // 1, i.e. 100% return over the period
*/
function cumulativeReturn(portfolioEquityCurve) {
	// Compute the cumulative return
	var cumRet = NaN;
	if (portfolioEquityCurve.length >= 2) { // In order to compute a proper cumulative return, at least 2 periods are required
		cumRet = (portfolioEquityCurve[portfolioEquityCurve.length-1] - portfolioEquityCurve[0])/portfolioEquityCurve[0];
	}

	// Return it
	return cumRet;
}


/**
* @function cagr
*
* @summary Compute the compound annual growth rate of a portfolio.
*
* @description This function returns compound annual growth rate of a portfolio, provided as an
* equity curve together with its associated valuation dates.
*
* The compound annual growth rate of a portfolio is defined as the geometric progression ratio
* that provides a constant rate of return over the period on which the portfolio valuations are provided, c.f. the reference.
*
* The algorithm automatically computes the number of (calendar) days between the first portfolio valuation date
* and the last portfolio valuation date, which is then converted into a number of years for the cagr computation following the
* formula of the reference.
*
* @see <a href="https://en.wikipedia.org/wiki/Compound_annual_growth_rate">https://en.wikipedia.org/wiki/Compound_annual_growth_rate</a>
* 
* @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
* @param {Array.<date>} valuationDates the portfolio valuation dates, an array of Dates of same length as portfolioEquityCurve.
* @return {number} the compound annual growth rate of the portfolio, expressed as a percentage.
*
* @example
* cagr([1, 1.1, 1.2], [new Date("2015-12-31"), new Date("2016-12-31"), new Date("2017-12-31")]);
* // 0.095, i.e. 9.5% cagr over two years, from 31/12/2015 to 31/12/2017
*/
function cagr(portfolioEquityCurve, valuationDates) {
	// Extract the initial and the final equity curve values and valuation dates
	var initialValue = portfolioEquityCurve[0];
	var initialValuationDate = valuationDates[0];
	var finalValue = portfolioEquityCurve[portfolioEquityCurve.length-1];
	var finalValuationDate = valuationDates[valuationDates.length-1];

	// Compute the number of invested calendar days and then years
	// The computation of the number of calendar days is following the algorithm
	// of Michael Liu - http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
	function treatAsUTC(date) {
		var result = new Date(date);
		result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
		return result;
	}
	var millisecondsPerDay = 24 * 60 * 60 * 1000;
	var nbInvestedDays = (treatAsUTC(finalValuationDate) - treatAsUTC(initialValuationDate)) / millisecondsPerDay;
	var nbInvestedYears = nbInvestedDays/365.25;

	// Compute the CAGR
	var valCagr = Math.pow(finalValue/initialValue, 1/nbInvestedYears) - 1;

	// Return the computed value
	return valCagr;
}


/**
* @function arithmeticReturns
*
* @summary Compute the period-to-period arithmetic returns of a portfolio.
*
* @description This function returns the period-to-period arithmetic returns of a portfolio, provided as an
* equity curve.
*
* The period-to-period arithmetic returns of a portfolio are defined as the serie of the arithmetic returns of the portfolio
* over each of its valuation period, with the return associated to the first period being undefined.
*
* @see <a href="https://en.wikipedia.org/wiki/Rate_of_return">https://en.wikipedia.org/wiki/Rate_of_return</a>
* 
* @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
* @return {Array.<number>} the period-to-period arithmetic returns of the portfolio, 
* with the convention that the first return is NaN, expressed as percentages.
*
* @example
* arithmeticReturns([1, 2, 1]); 
* // [NaN, 1.0, -0.5], i.e. 100% arithmetic return from the first period to the second period, 
* // and -50% arithmetic return from the second period to the third period
*/
function arithmeticReturns(portfolioEquityCurve) {
	// Compute the arithmetic returns
	var returns = new portfolioEquityCurve.constructor(portfolioEquityCurve.length); // Inherit the array type from the input array
	returns[0] = NaN;
	for (var i=1; i<portfolioEquityCurve.length; ++i) {
		returns[i] = (portfolioEquityCurve[i] - portfolioEquityCurve[i-1])/portfolioEquityCurve[i-1];
	}

	// Return the arithmetic returns
	return returns;
}


/**
* @function valueAtRisk
*
* @summary Compute the value at risk of a portfolio.
*
* @description This function returns the percent value at risk at a given confidence level of a portfolio, provided as an
* equity curve.
*
* The (percent) value at risk of a portfolio at an alpha% confidence level answers to the question:
* what is the minimum (percent) loss incurred in the 1-alpha% worst returns of the portfolio?
*
* By convention from the reference, this value is positive so that the computed value is negative if there is no loss.
*
* @see <a href="http://onlinelibrary.wiley.com/doi/10.1111/1468-0300.00091/abstract">Expected Shortfall: A Natural Coherent Alternative to Value at Risk, CARLO ACERBI, DIRK TASCHEy, Economic Notes, Volume 31, Issue 2, Pages 379–388 (July 2002)</a>
*
* @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
* @param {number} alpha the percent confidence level, real number belonging to interval [0,1].
* @return {number} the value at risk at the alpha percent confidence level, expressed as a percentage.
*
* @example
* valueAtRisk([100, 90, 80, 70, 60, 50, 40, 30, 20], 0.80); // 80% confidence level 
* // ~0.33, i.e. 33% of minimal loss at a confidence level of 80%
*/
function valueAtRisk(portfolioEquityCurve, alpha) {
	// Compute the returns and remove the first element, always equals to NaN
	var returns = arithmeticReturns(portfolioEquityCurve).slice(1);

	// Sort the returns from lowest to highest values
	returns.sort(function(a, b) { return a - b;});

	// Compute w
	// C.f. p. 383 of the reference
	var calpha = 1 - alpha;
	var w = Math.floor(calpha * returns.length)

	// Limit case (w equals to 0), return NaN
	if (w == 0) {
		return NaN;
	}

	// Otherwise, compute the value at risk as the w-th return
	// C.f. (2) and (6) of the reference
	var valAtRisk = -returns[w-1];

	// Return the value at risk
	return valAtRisk;
}

/**
 * @file Functions related to distributions computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

 


/**
* @function norminv_
*
* @summary Compute the inverse of the standard normal cumulative distribution function.
*
* @description This function returns an approximation of the inverse standard normal cumulative distribution function, i.e.
* given p in [0,1] it returns an approximation to the x value satisfying p = Pr{Z <= x} where Z is a
* random variable following a standard normal distribution law.
*
* x is also called a z-score.
*
* The algorithm uses the fact that if F^-1(p) is the inverse normal cumulative distribution function, then G^-1(p) = F^-1(p+1/2) is an odd function.
* The algorithm uses two separate rational minimax approximations: one rational approximation is used for the central region and another one is used for the tails.
* The algorithm has a relative error whose absolute value is less than 1.15e-9, but if needed, the approximation of the inverse normal cumulative distribution function can be refined better precision using Halley's method.
*
* @author Peter John Acklam <jacklam@math.uio.no>
*
* @see <a href="http://home.online.no/%7Epjacklam/notes/invnorm">http://home.online.no/%7Epjacklam/notes/invnorm</a>
* @see <a href="https://web.archive.org/web/20151030215612/http://home.online.no/%7Epjacklam/notes/invnorm/">https://web.archive.org/web/20151030215612/http://home.online.no/%7Epjacklam/notes/invnorm/</a>
* 
* @param {number} p a probability value, real number belonging to interval [0,1].
* @param {boolean} extendedPrecision an optional boolean, either false for a standard approximation (default) or true for a refined approximation.
* @return {number} an approximation to the x value satisfying p = Pr{Z <= x} where Z is a random variable following a standard normal distribution law.
*
* @example
* norminv_(0.5);
* // 0
*/
function norminv_(p, extendedPrecision) {
	// By default, standard precision is required
	if (extendedPrecision === undefined) {
		extendedPrecision = false;
	}

	// Coefficients in rational approximations.
	var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
	var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
	var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
	var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

	// Define break-points.
	var p_low = 0.02425;
	var p_high = 1 - p_low;

	// Regions definition.
	var x = NaN;
	if (p == 0.0) {
		x = Number.NEGATIVE_INFINITY;
	}
	else if (p == 1.0) {
		x = Number.POSITIVE_INFINITY;
	}
	else if (p < p_low) {
		// Rational approximation for lower region.
		var q = Math.sqrt(-2*Math.log(p));
		x =  (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
		((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
	}
	else if (p > p_high) {
		// Rational approximation for upper region.
		var q  = Math.sqrt(-2*Math.log(1-p));
		x = -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
		((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
	}
	else if (p_low <= p && p <= p_high) {
		// Rational approximation for central region.
		var q = p - 0.5;
		var r = q*q;
		x = (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
		(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
	}

	// Improve the precision, if required.
	if (extendedPrecision === true) {
		var e = 0.5 * erfc_(-x/1.4142135623730951) - p; // Constant is equal to sqrt(2)
		var u = e * 2.5066282746310002 * Math.exp(x*x/2); // Constant is equal to sqrt(2*pi)
		x = x - u/(1 + x*u/2);
	}

	// Return the computed value
	return x;
}


/**
* @function normcdf_
*
* @summary Compute the the standard normal cumulative distribution function.
*
* @description This function returns an approximation of the standard normal cumulative distribution function, i.e.
* given x a real number, it returns an approximation to p = Pr{Z <= x} where Z is a
* random variable following a standard normal distribution law.
*
* This function is also called Phi in the statistical litterature.
*
* The algorithm uses a Taylor expansion around 0 of a well chosen function of Phi.
* The algorithm has an absolute error of less than 8e−16.
*
* @author George Marsaglia
*
* @see <a href="https://www.jstatsoft.org/article/view/v011i04/v11i04.pdf"> G. Marsaglia. Evaluating the normal distribution. Journal of Statistical Software, 11(4):1–11, 2004.</a>
* 
* @param {number} x a real number.
* @return {number} an approximation to the p value satisfying p = Pr{Z <= x} where Z is a random variable following a standard normal distribution law.
*
* @example
* normcdf_(0);
* // 0.5
*/
function normcdf_(x) {
	// Initialisations
	var s=x;
	var t=0;
	var b=x;
	var q=x*x;
	var i=1;

	// The main loop corresponds to the computation of the Taylor serie of the function B around 0, c.f. page 5 of the reference.
	while (s != t) {
		s = (t = s) + (b *= q/(i += 2));
	}

	// The formula linking Phi and the Taylor expansion above if Phi = 1/2 + normal density * B, c.f. page 5 of the reference.
	return 0.5 + s * Math.exp(-0.5 * q - 0.91893853320467274178)
}


/**
* @function erf_
*
* @summary Compute the erf function.
*
* @description This function returns an approximation of the error function erf, defined, for x a real number, by erf(x) = 2/sqrt(pi) * Int_0^x{e^(-t^2)dt}.
*
* C.f. the internal function calerf_ for more details about the computations.
*
* @see <a href="https://en.wikipedia.org/wiki/Error_function">https://en.wikipedia.org/wiki/Error_function</a>
* 
* @param {number} x a real number.
* @return {number} an approximation to erf(x).
*
*/
function erf_(x) {
	return calerf_(x, 0);
}


/**
* @function erfc_
*
* @summary Compute the erfc function.
*
* @description This function returns an approximation of the complementary error function erfc, defined, for x a real number, by erfc(x) = 2/sqrt(pi) * Int_x^+infinity{e^(-t^2)dt}.
*
* C.f. the internal function calerf_ for more details about the computations.
*
* @see <a href="https://en.wikipedia.org/wiki/Error_function">https://en.wikipedia.org/wiki/Error_function</a>
* 
* @param {number} x a real number.
* @return {number} an approximation to erf(x).
*
*/
function erfc_(x) {
	return calerf_(x, 1);
}


/**
* @function calerf_
*
* @summary Internal function, mimicking the CALERF routine of the second reference, intended to compute erf(x) and erfc(x) functions
* for x a real number.
*
* @description This internal function evaluates near-minimax approximations from the first reference.
*
* The algorithm uses rational functions that theoretically approximate erf(x) and erfc(x) to at least 18 significant
* decimal digits.  The accuracy achieved depends on the arithmetic system, the compiler, the intrinsic functions, and proper
* selection of the machine-dependent constants.
*
* The algorithm is supposed to have a maximal relative error of less than 6*10^-19, from the first reference.
*
* @author W.J. Cody
*
* @see <a href="http://www.ams.org/journals/mcom/1969-23-107/S0025-5718-1969-0247736-4/S0025-5718-1969-0247736-4.pdf">W.J. Cody, Rational Chebyshev Approximation for the Error Function, Mathematics of Computation 23(107):631-631, July 1969</a>
* @see <a href="http://www.netlib.org/specfun/erf">http://www.netlib.org/specfun/erf</a>
* 
* @param {number} x a real number.
* @param {number} j an integer, equals to 0 to compute erf(x) or to 1 to compute erfc(x).
* @return {number} an approximation to erf(x) or to erfc(x).
*
*/
function calerf_(x, j) {
	// Machine-dependent constants
	var xinf = 1.79e308;
	var xneg = -26.628e0;
	var xsmall = 1.11e-16;
	var xbig = 26.543e0;
	var xhuge = 6.71e7;
	var xmax = 2.53e307;

	// Coefficients for approximation to  erf  in first interval
	var a = [3.16112374387056560e00,1.13864154151050156e02,3.77485237685302021e02,3.20937758913846947e03,1.85777706184603153e-1];
	var b = [2.36012909523441209e01,2.44024637934444173e02,1.28261652607737228e03,2.84423683343917062e03];

	// Coefficients for approximation to  erfc  in second interval
	var c = [5.64188496988670089e-1,8.88314979438837594e0,6.61191906371416295e01,2.98635138197400131e02,8.81952221241769090e02,1.71204761263407058e03,2.05107837782607147e03,1.23033935479799725e03,2.15311535474403846e-8];
	var d = [1.57449261107098347e01,1.17693950891312499e02,5.37181101862009858e02,1.62138957456669019e03,3.29079923573345963e03,4.36261909014324716e03,3.43936767414372164e03,1.23033935480374942e03];

	// Coefficients for approximation to  erfc  in third interval
	var p = [3.05326634961232344e-1,3.60344899949804439e-1,1.25781726111229246e-1,1.60837851487422766e-2,6.58749161529837803e-4,1.63153871373020978e-2];
	var q = [2.56852019228982242e00,1.87295284992346047e00,5.27905102951428412e-1,6.05183413124413191e-2,2.33520497626869185e-3];

	// ---------------

	// Computations are dispatched on different intervals based on |x|, c.f. the references
	var y = Math.abs(x);

	// Evaluate  erf  for  |X| <= 0.46875
	if (y <= 0.46875) {
		// Initialise ysq
		var ysq = 0.0;
		if (y >= xsmall) {
			ysq = y * y;
		}

		// The original loop computing rational functions has been unrolled	  
		// The final result is computed directly
		var result = x * ((((a[4] * ysq + a[0]) * ysq + a[1]) * ysq + a[2]) * ysq + a[3]) / ((((ysq + b[0]) * ysq + b[1]) * ysq + b[2]) * ysq + b[3]);

		// In case erfc function is required
		if (j === 1) {
			result = 1.0 - result;
		}

		// Return the computed value
		return result;
	}

	// Evaluate  erfc  for 0.46875 <= |X| <= 4.0
	else if (y <= 4.0) {
		// The original loop computing rational functions has been unrolled	  
		// The final result is computed directly
		var result = ((((((((c[8] * y + c[0]) * y + c[1]) * y + c[2]) * y + c[3]) * y + c[4]) * y + c[5]) * y + c[6]) * y + c[7]) / ((((((((y + d[0]) * y + d[1]) * y + d[2]) * y + d[3]) * y + d[4]) * y + d[5]) * y + d[6]) * y + d[7]);

		// Computation tricks to improve precision for the exponential	  
		var ysq = y * 16.0;
		ysq = (ysq >= 0 ? Math.floor(ysq) : Math.ceil(ysq))/16.0; // Equivalent of FORTAN AINT/INT function
		//var ysq = AINT(y*16.0)/16.0;
		var del = (y - ysq)*(y + ysq);
		result = Math.exp(-ysq * ysq) * Math.exp(-del) * result;
	}

	// Evaluate  erfc  for |X| > 4.0
	else if (y > 4.0) {
		var result = 0.0;

		if (y < xbig) {
			// Initialise ysq
			var ysq = 1.0/(y * y);

			// The original loop computing rational functions has been unrolled	  
			// The final result is computed directly
			result = ysq * (((((p[5] * ysq + p[0]) * ysq + p[1]) * ysq + p[2]) * ysq + p[3]) * ysq + p[4]) / (((((ysq + q[0]) * ysq + q[1]) * ysq + q[2]) * ysq + q[3]) * ysq + q[4]);
			result = (5.6418958354775628695e-1 - result) / y; // The constant here is equals to SQRPI in the original FORTRAN code

			// Computation tricks to improve precision for the exponential
			var ysq = y * 16.0;
			ysq = (ysq >= 0 ? Math.floor(ysq) : Math.ceil(ysq))/16.0; // Equivalent of FORTAN AINT/INT function
			var del = (y - ysq) * (y + ysq);
			result = Math.exp(-ysq * ysq) * Math.exp(-del) * result;
		}
	}

	// Fix up for negative argument, erf, etc.
	// erf computation
	if (j === 0) {
		// Using relation erf(x) = 1 - erfc(x), with a computation trick to improve precision
		result = (0.5 - result) + 0.5;
		
		// Using relation erf(-x) = -erf(x)
		if (x <= 0.0) {
			result = -result;
		}
	}
	// erfc computation
	else if (j === 1) {
		// Using relation erfc(-x) = 2-erfc(x)
		if (x <= 0.0) {
			result = 2.0 - result;
		}
	}

	// Return the computed result
	return result;
}


/**
 * @file Functions related to moments computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

 
 
/**
* @function hpm_
*
* @summary Compute the higher partial moment of a serie of values.
*
* @description This function returns the n-th order higher partial moment of a serie of values [x_1,...,x_p] with respect to a threshold t, 
* which is defined as the arithmetic mean of the p values max(0, x_1-t)^n,...,max(0, x_p-t)^n.
*  
* @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
* 
* @param {Array.<number>} x an array of real numbers.
* @param {number} n the order of the higher partial moment, a positive integer.
* @param {number} t the threshold of the higher partial moment, a real number
* @return {number} the n-th order higher partial moment of the values of the array x with respect to the threshold t.
*
* @example
* hpm_([0.1,-0.2,-0.3], 2, 0.0); 
* // 0.0167
*/
function hpm_(x, n, t) {
	// Code below is adapted from a mean computation, c.f. mean_ function
	// Initialisations
	var nn = x.length;

	// First pass of the mean computation
	var tmpMean = 0.0;
	var sum = 0.0;
	for (var i=0; i<nn; ++i) {
		sum += Math.pow(Math.max(0, x[i]-t), n);
	}
	tmpMean = sum/nn;

	// Second pass of the mean computation
	var sum2 = 0.0;
	for (var i=0; i<nn; ++i) {
		sum2 += (Math.pow(Math.max(0, x[i]-t), n) - tmpMean);
	}

	// Corrected computed mean
	return (sum + sum2)/nn;
}


/**
* @function lpm_
*
* @summary Compute the lower partial moment of a serie of values.
*
* @description This function returns the n-th order lower partial moment of a serie of values [x_1,...,x_p] with respect to a threshold t, 
* which is defined as the arithmetic mean of the p values max(0, t-x_1)^n,...,max(0, t-x_p)^n.
*  
* @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
* 
* @param {Array.<number>} x an array of real numbers.
* @param {number} n the order of the lower partial moment, a positive integer.
* @param {number} t the threshold of the lower partial moment, a real number.
* @return {number} the n-th order lower partial moment of the values of the array x with respect to the threshold t.
*
* @example
* lpm_([0.1,0.2,-0.3], 2, 0.0); 
* // 0.03
*/
function lpm_(x, n, t) {
	// Code below is adapted from a mean computation, c.f. mean_ function
	// Initialisations
	var nn = x.length;

	// First pass of the mean computation
	var tmpMean = 0.0;
	var sum = 0.0;
	for (var i=0; i<nn; ++i) {
		sum += Math.pow(Math.max(0, t-x[i]), n);
	}
	tmpMean = sum/nn;

	// Second pass of the mean computation
	var sum2 = 0.0;
	for (var i=0; i<nn; ++i) {
		sum2 += (Math.pow(Math.max(0, t-x[i]), n) - tmpMean);
	}

	// Corrected computed mean
	return (sum + sum2)/nn;
}


/**
* @function mean_
*
* @summary Compute the arithmetic mean of a serie of values.
*
* @description This function returns the arithmetic mean of a serie of values [x_1,...,x_p], 
* which is defined as the sum of the p values x_1,...,x_p, divided by p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the reference.
*
* @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
* 
* @param {Array.<number>} x an array of real numbers.
* @return {number} the arithmetic mean of the values of the array x.
*
* @example
* mean_([2,4]); 
* // 3
*/
function mean_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the values of the input numeric array (first pass)
	var tmpMean = 0.0;
	var sum = 0.0;
	for (var i=0; i<nn; ++i) {
		sum += x[i];
	}
	tmpMean = sum/nn;

	// Compute the correction factor (second pass)
	// C.f. M_3 formula of the reference
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
		sumDiff += (x[i] - tmpMean);
	}

	// Return the corrected mean
	return (sum + sumDiff)/nn;
}


/**
* @function variance_
*
* @summary Compute the variance of a serie of values.
*
* @description This function returns the variance of a serie of values [x_1,...,x_p], 
* which is defined as the arithmetic mean of the p values (x_1-m)^2,...,(x_p-m)^2, where m is the arithmetic mean
* of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the reference.
*
* @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the variance of the values of the array x.
*
* @example
* variance_([4, 7, 13, 16]); 
* // 22.5
*/
function variance_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

	// Compute the squared deviations plus the correction factor (second pass)
	// C.f. S_4 formula of the reference
	var sumSquareDiff = 0.0;
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
		var diff = (x[i] - meanX);
		sumSquareDiff += diff * diff;
		sumDiff += diff;
	}

	// Compute the corrected sum of squares of the deviations from the mean
	var S = sumSquareDiff - ((sumDiff * sumDiff) / nn);

	// Return the corrected variance
	return S/nn;
}


/**
* @function sampleVariance_
*
* @summary Compute the sample variance of a serie of values.
*
* @description This function returns the sample variance of a serie of values [x_1,...,x_p], 
* which is defined as the variance of the p values x_1,...,x_p multiplied by p/(p-1).
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function variance_.
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the variance of the values of the array x.
*
* @example
* sampleVariance_([4, 7, 13, 16]); 
* // 30
*/
function sampleVariance_(x) {
	var nn = x.length;
	return variance_(x) * nn/(nn - 1);
}


/**
* @function stddev_
*
* @description Compute the standard deviation of a serie of values.
*
* @description This function returns the standard deviation of a serie of values [x_1,...,x_p], 
* which is defined as the square root of the variance of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function variance_.
*
* @see <a href="https://en.wikipedia.org/wiki/Standard_deviation">https://en.wikipedia.org/wiki/Standard_deviation</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the standard deviation of the values of the array x.
*
* @example
* stddev_([1, 2, 3, 4]); 
* // ~1.12
*/
function stddev_(x) {
	return Math.sqrt(variance_(x));
}


/**
* @function sampleStddev_
*
* @description Compute the sample standard deviation of a serie of values.
*
* @description This function returns the sample standard deviation of a serie of values [x_1,...,x_p], 
* which is defined as the square root of the sample variance of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function sampleVariance_.
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the standard deviation of the values of the array x.
*
* @example
* sampleStddev_([1, 2, 3, 4]); 
* // ~1.29
*/
function sampleStddev_(x) {
	return Math.sqrt(sampleVariance_(x));
}


/**
* @function skewness_
*
* @summary Compute the skewness of a serie of values.
*
* @description This function returns the skewness of a serie of values [x_1,...,x_p], 
* which is defined as the arithmetic mean of the p values (x_1-m)^3,...,(x_p-m)^3 divided by sigma^3, where m is the arithmetic mean
* of the p values x_1,...,x_p and sigma the standard deviation of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the second reference.
*
* @see <a href="https://en.wikipedia.org/wiki/Skewness">https://en.wikipedia.org/wiki/Skewness</a>
* @see <a href="http://link.springer.com/article/10.1007/s00180-015-0637-z">Pébay, P., Terriberry, T.B., Kolla, H. et al (2016) Numerically stable, scalable formulas for parallel and online computation of higher-order multivariate central moments with arbitrary weights. Comput Stat (2016) 31: 1305.</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the skewness of the values of the array x.
*
* @example
* skewness_([4, 7, 13, 16]); 
* // 0
*/
function skewness_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

	// By definition, the skewness is equals to E[((X-m)/sigma)^3], 
	// which can be expanded as 1/sigma^3 * ( E[X^3] - 2*E[X]*E[X^2] + 2*E[X]^3 )
	//
	// Then, as central moments are invariants when data is translated by a constant
	// (c.f. formula 3.40 of the reference and explanations thereby), X can be replaced
	// by X - meanX computed above.

	// Compute the cubed deviations plus the correction factors (second pass)
	var sumCubeDiff = 0.0;
	var sumSquareDiff = 0.0;
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
		var diff = (x[i] - meanX);
		var squareDiff = diff * diff;
		sumCubeDiff += diff * squareDiff;
		sumSquareDiff += squareDiff;
		sumDiff += diff;
	}

	// Compute the corrected sum of cubes of the deviations from the mean
	var sumDiff_sumDiff = sumDiff * sumDiff;
	var S = sumCubeDiff - (2 * sumDiff * sumSquareDiff / nn) + (2 * sumDiff_sumDiff * sumDiff / (nn * nn));

	// Note: To avoid calling the computation of the variance and redo two passes on the data, 
	// compute the corrected variance here (c.f. the variance_ function)
	var correctedVariance = (sumSquareDiff - (sumDiff_sumDiff / nn)) / nn;

	// Return the corrected skewness
	return S/(nn * Math.sqrt(correctedVariance) * correctedVariance);
}


/**
* @function sampleSkewness_
*
* @summary Compute the sample skewness of a serie of values.
*
* @description This function returns the sample skewness of a serie of values [x_1,...,x_p], 
* which is defined as the skewness of the p values x_1,...,x_p multiplied by a factor dependant on p, c.f. the reference.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function skewness_.
*
* @see <a href="www.jstor.org/stable/2988433">D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the skewness of the values of the array x.
*
* @example
* sampleSkewness_([4, 7, 13, 16]); 
* // 0
*/
function sampleSkewness_(x) {
	var nn = x.length;

	// Compute the G1 coefficient from the reference
	return skewness_(x) * Math.sqrt(nn * (nn - 1))/(nn - 2);
}


/**
* @function kurtosis_
*
* @summary Compute the kurtosis of a serie of values.
*
* @description This function returns the kurtosis of a serie of values [x_1,...,x_p], 
* which is defined as the arithmetic mean of the p values (x_1-m)^4,...,(x_p-m)^4 divided by sigma^4, where m is the arithmetic mean
* of the p values x_1,...,x_p and sigma the standard deviation of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the second reference.
*
* @see <a href="https://en.wikipedia.org/wiki/Kurtosis">https://en.wikipedia.org/wiki/Kurtosis</a>
* 
* @see <a href="http://link.springer.com/article/10.1007/s00180-015-0637-z">Pébay, P., Terriberry, T.B., Kolla, H. et al (2016) Numerically stable, scalable formulas for parallel and online computation of higher-order multivariate central moments with arbitrary weights. Comput Stat (2016) 31: 1305.</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the skewness of the values of the array x.
*
* @example
* kurtosis_([4, 7, 13, 16]); 
* // 1.36
*/
function kurtosis_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

	// By definition, the kurtosis is equals to E[((X-m)/sigma)^4], 
	// which can be expanded as 1/sigma^4 * ( E[X^4] - 4*E[X]*E[X^3] + 6*E[X]^2*E[X^2] - 3*E[X]^4 )
	//
	// Then, as central moments are invariants when data is translated by a constant
	// (c.f. formula 3.40 of the reference and explanations thereby), X can be replaced
	// by X - meanX computed above.

	// Compute the bi-squarred deviations plus the correction factors (second pass)
	var sumBiSquareDiff = 0.0;
	var sumCubeDiff = 0.0;
	var sumSquareDiff = 0.0;
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
		var diff = (x[i] - meanX);
		var squareDiff = diff * diff;
		sumBiSquareDiff += squareDiff * squareDiff;
		sumCubeDiff += diff * squareDiff;
		sumSquareDiff += squareDiff;
		sumDiff += diff;
	}

	// Compute the corrected sum of bi-squarres of the deviations from the mean
	var nn_nn = nn * nn;
	var sumDiff_sumDiff = sumDiff * sumDiff;
	var S = sumBiSquareDiff - (4 * sumDiff * sumCubeDiff / nn) + (6 * sumDiff_sumDiff * sumSquareDiff / nn_nn)  - (3 * sumDiff_sumDiff * sumDiff_sumDiff / (nn_nn * nn));

	// Note: To avoid calling the computation of the variance and redo two passes on the data, 
	// compute the corrected variance here (c.f. the variance_ function)
	var correctedVariance = (sumSquareDiff - (sumDiff_sumDiff / nn)) / nn;

	// Return the corrected kurtosis
	return S/(nn * correctedVariance * correctedVariance);
}


/**
* @function sampleKurtosis_
*
* @summary Compute the sample kurtosis of a serie of values.
*
* @description This function returns the sample kurtosis of a serie of values [x_1,...,x_p], 
* which is defined as the kurtosis of the p values x_1,...,x_p multiplied by a factor dependant on p, c.f. the reference.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function kurtosis_.
*
* @see <a href="www.jstor.org/stable/2988433">D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the kurtosis of the values of the array x.
*
* @example
* sampleKurtosis_([4, 7, 13, 16]); 
* // ~-0.30
*/
function sampleKurtosis_(x) {
	var nn = x.length;

	// Compute the G2 coefficient from the reference, and add 3 as the excess kurtosis is not computed here
	return (nn - 1)/((nn - 2) * (nn - 3)) * ((nn + 1) * kurtosis_(x) - 3* (nn - 1)) + 3;
}


/**
* @function sampleMoments_
*
* @summary Compute the arithmetic mean, the sample variance, the sample standard deviation,
* the sample skewness and the sample kurtosis of a serie of values.
*
* @description This function returns the arithmetic mean, the sample variance, 
* the sample standard deviation, the sample skewness and the sample kurtosis of a serie of values [x_1,...,x_p], 
* acting as a performances-oriented wrapper aroung the functions mean_, sampleVariance_, 
* sampleStddev_, sampleKurtosis_, sampleSkewness_.
*
* C.f. the mentionned functions for computation details.
*
* @param {Array.<number>} x an array of real numbers.
* @return {Array.<number>} the arithmetic mean, the sample variance, the sample standard deviation,
* the sample skewness and the sample kurtosis of the values of the array x, in this order.
*
* @example
* sampleMoments_([4, 7, 13, 16]); 
* // [10, 30, ~5.477, 0, ~-0.30]
*/
function sampleMoments_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

	// Code below is copy pasted from kurtosis computation, for performances reasons
	// Compute all the deviations necessary to compute the variance, skewness and kurtosis (second pass)
	var sumBiSquareDiff = 0.0;
	var sumCubeDiff = 0.0;
	var sumSquareDiff = 0.0;
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
		var diff = (x[i] - meanX);
		var squareDiff = diff * diff;
		sumBiSquareDiff += squareDiff * squareDiff;
		sumCubeDiff += diff * squareDiff;
		sumSquareDiff += squareDiff;
		sumDiff += diff;
	}

	// Compute the corrected sum of squares of the deviations from the mean
	// Compute the corrected sum of bi-squarres of the deviations from the mean
	// Compute the corrected sum of cubes of the deviations from the mean
	var sumDiff_sumDiff = sumDiff * sumDiff;
	var nn_nn = nn * nn;
	var S2 = sumSquareDiff - ((sumDiff * sumDiff) / nn);
	var S3 = sumCubeDiff - (2 * sumDiff * sumSquareDiff / nn) + (2 * sumDiff_sumDiff * sumDiff / (nn * nn));
	var S4 = sumBiSquareDiff - (4 * sumDiff * sumCubeDiff / nn) + (6 * sumDiff_sumDiff * sumSquareDiff / nn_nn)  - (3 * sumDiff_sumDiff * sumDiff_sumDiff / (nn_nn * nn));

	// Compute the sample variance, the sample standard deviation, 
	// the sample skewness, the sample kurtosis
	var sampleVarX = NaN;
	var sampleStddevX = NaN;
	var sampleSkewX = NaN;
	var sampleKurtX = NaN;

	// Sample variance
	var correctedVariance = S2 / nn;
	var sampleVarX = correctedVariance * nn/(nn - 1); // Not S2/(nn - 1) to make sure computation matches with sampleVariance_ function
	var sampleStddevX = Math.sqrt(sampleVarX);

	// Sample skewness
	var skewX = S3/(nn * Math.sqrt(correctedVariance) * correctedVariance);
	var sampleSkewX = skewX * Math.sqrt(nn * (nn - 1))/(nn - 2);

	// Sample kurtosis
	var kurtX = S4/(nn * correctedVariance * correctedVariance);
	var sampleKurtX =  (nn - 1)/((nn - 2) * (nn - 3)) * ((nn + 1) * kurtX - 3* (nn - 1)) + 3;

	// Return the computed values
	return [meanX, sampleVarX, sampleStddevX, sampleSkewX, sampleKurtX];
}

/**
 * @file Footer
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

