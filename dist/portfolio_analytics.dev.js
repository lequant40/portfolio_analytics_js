/**
 * @file Functions related to drawdowns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper private methods - Unit tests usage only */
  self.maxDrawdown_ = function(equityCurve, idxStart, idxEnd) { return maxDrawdown_(equityCurve, idxStart, idxEnd); }
  /* End Wrapper private methods - Unit tests usage only */

/* End Not to be used as is in Google Sheets */  
  
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
  self.maxDrawdown = function(equityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);

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
    
    // Internal function => no specific checks on the input arguments
    
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
  self.drawdownFunction = function(equityCurve) {
    // Initialisations
    var highWaterMark = -Infinity;
    
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
    
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
  self.topDrawdowns = function(equityCurve, nbTopDrawdowns) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
    self.assertPositiveInteger_(nbTopDrawdowns);
    
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
  self.ulcerIndex = function(equityCurve) {
    // No need for input checks, as done in function below

    // Compute the drawdown function
    var ddFunc = self.drawdownFunction(equityCurve);
    
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
  self.painIndex = function(equityCurve) {
    // No need for input checks, as done in function below
    
    // Compute the drawdown function
    var ddFunc = self.drawdownFunction(equityCurve);
	
    // Compute and return the mean of this function, which corresponds to the pain index
	return self.mean_(ddFunc);
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
  self.conditionalDrawdown = function(equityCurve, alpha) {
    // Input checks
    // No need to check for array positivity, as done in function below
    self.assertBoundedNumber_(alpha, 0, 1);
   
    // Compute the drawdown function and
	// remove the first element, always equals to 0
	// C.f. definition 3.1
    var ddFunc = self.drawdownFunction(equityCurve).slice(1);
	
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

  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
 * @file Functions related to performances ratios computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function gainToPainRatio
  *
  * @description Compute the gain to pain ratio associated to a portfolio equity curve.
  *
  * @see <a href="http://onlinelibrary.wiley.com/doi/10.1002/9781119203469.app1/summary">Hedge Fund Market Wizards: How Winning Traders Win, Jack D. Schwager, Wiley, 2012</a>
  * 
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @return {number} the gain to pain ratio.
  *
  * @example
  * gainToPainRatio([1, 2, 1]); 
  * // 1.0 
  *
  * @example
  * gainToPainRatio([1, 1.1, 1.4]); 
  * // NaN
  */
  self.gainToPainRatio = function(equityCurve) {
    // No need for input checks, as done in function below
	
	// Compute the arithmetic returns of the portfolio
	var returns = self.arithmeticReturns(equityCurve).slice(1); // First value is NaN
	
	// If there is no usable returns, exit
	if (returns.length == 0) {
	  return NaN;
	}
	
    // Else, compute the gain to pain ratio as the the sum of the returns divided by
	// the sum of the absolute values of the negative returns
	var numerator = self.mean_(returns);
	var denominator = self.lpm_(returns, 1, 0.0);

    // Return the gain to pain ratio
    if (denominator == 0.0) {
	  return NaN; // The gain to pain ratio is undefined in case there is no negative returns
	}
	else {
	  return numerator/denominator;
	}
  }


/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
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
  
  
  //self.sharpeRatioConfidenceInterval (alpha)
  

  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
 * @file Functions related to returns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {

/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function cumulativeReturn
  *
  * @description Compute the cumulative return associated to a portfolio equity curve.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Rate_of_return">https://en.wikipedia.org/wiki/Rate_of_return</a>
  * 
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @return {number} the cumulative return.
  *
  * @example
  * cumulativeReturn([1, 2, 1]); 
  * // 0.0, i.e. 0% return
  *
  * @example
  * cumulativeReturn([1, 2, 2]);
  * // 1, i.e. 100% return
  */
  self.cumulativeReturn = function(equityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
	
    // Compute the cumulative return
	var cumRet = NaN;
	if (equityCurve.length >= 2) { // In order to compute a proper cumulative return, at least 2 periods are required
	  cumRet = (equityCurve[equityCurve.length-1] - equityCurve[0])/equityCurve[0];
	}
    
    // Return it
    return cumRet;
  }

  
  /**
  * @function cagr
  *
  * @description Compute the compound annual growth rate associated to a portfolio equity curve and its associated valuation dates.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Compound_annual_growth_rate">https://en.wikipedia.org/wiki/Compound_annual_growth_rate</a>
  * 
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @param {Array.<date>} valuationDates the portfolio equity curve valuation dates.
  * @return {number} the annualized return.
  *
  * @example
  * cagr([1, 1.1, 1.2], [new Date("2015-12-31"), new Date("2016-12-31"), new Date("2017-12-31")]);
  * // 0.095, i.e. ~9.5% annualized return
  */
  self.cagr = function(equityCurve, valuationDates) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
	self.assertDateArray_(valuationDates);
	self.assertSameLengthArrays_(equityCurve, valuationDates);
	
    // Extract the initial and the final equity curve values and valuation dates
    var initialValue = equityCurve[0];
	var initialValuationDate = valuationDates[0];
    var finalValue = equityCurve[equityCurve.length-1];
	var finalValuationDate = valuationDates[valuationDates.length-1];
  
    // Compute the number of invested calendar days and then years
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
  * @description Compute the arithmetic returns associated to a portfolio equity curve.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Rate_of_return">https://en.wikipedia.org/wiki/Rate_of_return</a>
  * 
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @return {Array.<number>} the arithmetic returns corresponding to the values of the portfolio equity curve,
  * with the convention that the first return is NaN.
  *
  * @example
  * arithmeticReturns([1, 2, 1]); 
  * // [NaN, 1.0, -0.5], i.e. 100% return and then -50% return
  */
  self.arithmeticReturns = function(equityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
	
    // Compute the arithmetic returns
	var returns = new equityCurve.constructor(equityCurve.length); // Inherit the array type from the input array
	returns[0] = NaN;
	for (var i=1; i<equityCurve.length; ++i) {
	  returns[i] = (equityCurve[i] - equityCurve[i-1])/equityCurve[i-1];
	}
    
    // Return the arithmetic returns
    return returns;
  }


  /**
  * @function valueAtRisk
  *
  * @description Compute the (percent) value at risk of a portfolio equity curve.
  *
  * To be noted that by convention, this value is positive, so that in case there is no loss in the portfolio equity curve, the computed value is then negative.
  *
  * @see <a href="http://onlinelibrary.wiley.com/doi/10.1111/1468-0300.00091/abstract">Expected Shortfall: A Natural Coherent Alternative to Value at Risk, CARLO ACERBI, DIRK TASCHEy, Economic Notes, Volume 31, Issue 2, Pages 379–388 (July 2002)</a>
  *
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @param {number} alpha the percent confidence level belonging to interval [0,1].
  * @return {number} the (percent) value at risk at the 100*(1–alpha) percent confidence level.
  *
  * @example
  * valueAtRisk([100, 90, 80, 70, 60, 50, 40, 30, 20], 0.7);
  * // 0.725
  */
  self.valueAtRisk = function(equityCurve, alpha) {
    // Input checks
    // No need to check for array positivity, as done in function below
    self.assertBoundedNumber_(alpha, 0, 1);
   
    // Compute the returns and remove the first element, always equals to NaN
    var returns = self.arithmeticReturns(equityCurve).slice(1);
	
    // Sort the returns from lowest to highest values
    returns.sort(function(a, b) { return a - b;});
  
    // Compute w
    // C.f. p. 383 of the reference
	w = Math.floor(alpha * returns.length)
    
	// Limit case (w equals to 0), return NaN
	if (w == 0) {
      return NaN;
    }
    
    // Otherwise, compute the value at risk as the w-th return
	// C.f. (2) and (6) of the reference
	valAtRisk = -returns[w-1];
	
	// Return the value at risk
	return valAtRisk;
  }

 
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
 * @file Functions related to distributions computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function normsinv_
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
  * @param {boolean} extendedPrecision an optional boolean either false for a standard approximation (default) or true for a refined approximation.
  * @return {number} an approximation to the x value satisfying p = Pr{Z <= x} where Z is a random variable following a standard normal distribution law.
  *
  * @example
  * normsinv_(0.5); 
  * // 0
  */
  self.normsinv_ = function(p, extendedPrecision) {
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
      var e = 0.5 * self.erfc_(-x/1.4142135623730951) - p; // Constant is equal to sqrt(2)
      var u = e * 2.5066282746310002 * Math.exp(x*x/2); // Constant is equal to sqrt(2*pi)
      x = x - u/(1 + x*u/2);
	}
	
	// Return the computed value
	return x;
  }
  

  /**
  * @function erf_
  *
  * @summary Compute the erf function.
  *
  * @description This function returns an approximation of the error function erf, defined by erf(x) = 2/sqrt(pi) * Int_0^x{e^(-t^2)dt}.
  *
  * C.f. the internal function calerf_ for more details about the computations.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Error_function">https://en.wikipedia.org/wiki/Error_function</a>
  * 
  * @param {number} x a real number.
  * @return {number} an approximation to erf(x).
  *
  */
  self.erf_ = function(x) {
    return calerf_(x, 0);
  }
  
  
  /**
  * @function erfc_
  *
  * @summary Compute the erfc function.
  *
  * @description This function returns an approximation of the complementary error function erfc, defined by erfc(x) = 2/sqrt(pi) * Int_x^+infinity{e^(-t^2)dt}.
  *
  * C.f. the internal function calerf_ for more details about the computations.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Error_function">https://en.wikipedia.org/wiki/Error_function</a>
  * 
  * @param {number} x a real number.
  * @return {number} an approximation to erf(x).
  *
  */
  self.erfc_ = function(x) {
    return calerf_(x, 1);
  }
  
  
  /**
  * @function calerf_
  *
  * @summary Internal function, mimicking the CALERF routine of the second reference, intended to compute erf(x) and erfc(x) functions.
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
  
  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
 * @file Functions related to moments computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  
/* End Not to be used as is in Google Sheets */  
  
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
  self.hpm_ = function(x, n, t) {
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
  self.lpm_ = function(x, n, t) {
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
  self.mean_ = function(x) {
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
  self.variance_ = function(x) {
	// In case the input array is made of only one element, the variance is not defined
	if (x.length == 1) {
	  return NaN;
	}
	
	// Initialisations
    var nn = x.length;

    // Compute the mean of the input numeric array (first pass)
	var meanX = self.mean_(x);

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
  self.sampleVariance_ = function(x) {
    var v = self.variance_(x);
	
    //
	var nn = x.length;
	return v * nn/(nn - 1);
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
  self.stddev_ = function(x) {
	return Math.sqrt(self.variance_(x));
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
  self.sampleStddev_ = function(x) {
	return Math.sqrt(self.sampleVariance_(x));
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
  self.skewness_ = function(x) {
	// In case the input array is made of less than two elements, the skewness is not defined
	if (x.length <= 2) {
	  return NaN;
	}
	
	// Initialisations
    var nn = x.length;
	
    // Compute the mean of the input numeric array (first pass)
	var meanX = self.mean_(x);
	
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
	if (correctedVariance == 0.0) {
	  return NaN;
	}
	else {
      return S/(nn * Math.sqrt(correctedVariance) * correctedVariance);
	}
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
  self.sampleSkewness_ = function(x) {
    var s = self.skewness_(x);
	
    // Compute the G1 coefficient from the reference
	var nn = x.length;
	return s * Math.sqrt(nn * (nn - 1))/(nn - 2);	
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
  self.kurtosis_ = function(x) {
	// In case the input array is made of less than three elements, the skewness is not defined
	if (x.length <= 3) {
	  return NaN;
	}
	
	// Initialisations
    var nn = x.length;
	
    // Compute the mean of the input numeric array (first pass)
	var meanX = self.mean_(x);
	
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
	if (correctedVariance == 0.0) {
	  return NaN;
	}
	else {
      return S/(nn * correctedVariance * correctedVariance);
	}
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
  self.sampleKurtosis_ = function(x) {
    var k = self.kurtosis_(x);
	
    // Compute the G2 coefficient from the reference, and add 3 as the excess kurtosis is not computed here
	var nn = x.length;
	return (nn - 1)/((nn - 2) * (nn - 3)) * ((nn + 1) * k - 3* (nn - 1)) + 3
  }
  
  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */

var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {

/* End Not to be used as is in Google Sheets */  
  
	/**
	* @function assertArray_
	*
	* @description Throws an error if the input parameter is not an array 
	* or a typed array.
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertArray_([]); 
	* //
	*
	* @example
	* assertArray_(1); 
	* // Error("input must be an array")
	*/
	self.assertArray_ = function(x) {
	  if (Object.prototype.toString.call(x).indexOf("Array") == -1) {
		throw new Error("input must be an array");
	  }
	}


	/**
	* @function assertNumberArray_
	*
	* @description Throws an error if the input parameter is not an array of numbers 
	* (or a typed array).
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertNumberArray_([1]); 
	* //
	*
	* @example
	* assertNumberArray_(1); 
	* // Error("input must be an array of numbers")
	*
    * assertNumberArray_([-1]); 
	* // Error("input must be an array of numbers")
	*/
	self.assertNumberArray_ = function(x) {
	  // A number array is an array...
	  try {
		self.assertArray_(x);
	  }
	  catch (e) {
		throw new Error("input must be an array of numbers");
	  }

     // ... non empty...
	 if (x.length == 0) {
	   throw new Error("input must be an array of numbers");
	 }
	 
     // ... and made of numbers
     for (var i=0; i<x.length; ++i) {
  	   try {
         self.assertNumber_(x[i]);
	   }
       catch (e) {
         throw new Error("input must be an array of numbers");
        }
	  }
	}


	/**
	* @function assertPositiveNumberArray_
	*
	* @description Throws an error if the input parameter is not an array of positive numbers 
	* (or a typed array).
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertPositiveNumberArray_([]); 
	* //
	*
	* @example
	* assertPositiveNumberArray_(1); 
	* // Error("input must be an array of positive numbers")
	*
    * assertPositiveNumberArray_([-1]); 
	* // Error("input must be an array of positive numbers")
	*/
	self.assertPositiveNumberArray_ = function(x) {
	  // A positive array is an array...
	  try {
		self.assertArray_(x);
	  }
	  catch (e) {
		throw new Error("input must be an array of positive numbers");
	  }

     // ... non empty...
	 if (x.length == 0) {
	   throw new Error("input must be an array of positive numbers");
	 }
	 
     // ... and made of positive numbers
     for (var i=0; i<x.length; ++i) {
  	   try {
         self.assertPositiveNumber_(x[i]);
	   }
       catch (e) {
         throw new Error("input must be an array of positive numbers");
        }
	  }
	}


	/**
	* @function assertNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number.
	* 
	* @param {number} x input parameter.
	*
	* @example
	* assertNumber_('1'); 
	* // Error("input must be a number")
	*
	* @example
	* assertNumber_(1);
	*
	* @example
	* assertNumber_(NaN);
	* // Error("input must be a number")
	*/
	self.assertNumber_ = function(x) {
	  if (Object.prototype.toString.call(x)!= "[object Number]" || 
		  isNaN(x) || 
		  x === Infinity ||
          x === -Infinity){
		throw new Error("input must be a number");
	  }
	}


	 /**
	* @function assertPositiveNumber_
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {number} x input parameter.
	*
	* @example
	* assertPositiveNumber_(-2.3); 
	* // Error("input must be a positive number")
	*
	* @example
	* assertPositiveNumber_(1.1);
	*
	* @example
	* assertPositiveNumber_(NaN);
	* // Error("input must be a positive number")
	*/
	self.assertPositiveNumber_ = function(x) {
	  // A positive number is a number...
	  try {
		self.assertNumber_(x);
	  }
	  catch (e) {
		throw new Error("input must be a positive number");
	  }
	  
	  // ... as well as positive
	  if (x < 0.0 ) {
	    throw new Error("input must be a positive number");
	  }
	}


	/**
	* @function assertBoundedNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number
	* greater than a (finite)lower bound and lower than a (finite) upper bound.
	* 
	* @param {number} x input parameter.
	* @param {number} lowerBound the lower bound.
	* @param {number} upperBound the upper bound.
	*
	* @example
	* assertBoundedNumber_(2, 0, 1); 
	* // Error("input must be bounded")
	*
	* @example
	* assertBoundedNumber_(1, 1, 1);
	*
	* @example
	* assertBoundedNumber_(NaN, 0, 1);
	* // Error("input(s) must be a number")
	*/
	self.assertBoundedNumber_ = function(x, lowerBound, upperBound) {
	  // The bounds and the input must be numbers...
	  try {
        self.assertNumber_(x);
	    self.assertNumber_(lowerBound);
		self.assertNumber_(upperBound);
	  }
	  catch (e) {
		throw new Error("input(s) must be a number");
	  }
	  
	  // The input parameter must be between the input bounds
	  if (x < lowerBound || x > upperBound) {
	    throw new Error("input must be bounded between " + lowerBound + " and " + upperBound);
	  }
	}
	
	
	/**
	* @function assertPositiveInteger_
	*
	* @description Throws an error if the input parameter is not a positive integer.
	* 
	* @param {number} x input parameter.
	*
	* @example
	* assertPositiveInteger_(-2.3); 
	* // Error("input must be a positive integer")
	*
	* @example
	* assertPositiveInteger_(1);
	*
	* @example
	* assertPositiveInteger_(NaN);
	* // Error("input must be a positive integer")
	*/
	self.assertPositiveInteger_ = function(x) {
	  // A positive integer is a positive number...
	  try {
		self.assertPositiveNumber_(x);
	  }
	  catch (e) {
		throw new Error("input must be a positive integer");
	  }

	  // ... as well as an integer
	  if (Math.floor(x) !== x) {
		throw new Error("input must be a positive integer");
	  }
	}


	/**
	* @function assertString_
	*
	* @description Throws an error if the input parameter is not a string.
	* 
	* @param {string} x input parameter.
	*
	* @example
	* assertString_(1); 
	* // Error("input must be a string")
	*
	* @example
	* assertEnumeration_("test"); 
	*/
	self.assertString_ = function(x) {
	  if (!(typeof x === 'string' || x instanceof String)) {
		throw new Error("input must be a string");
	  }
	}

	
	/**
	* @function assertStringEnumeration_
	*
	* @description Throws an error if the input parameter is not a string belonging to a set of string values.
	* 
	* @param {string} x input parameter.
	* @param {Array.<string>} allowedValues array listing the allowed values for the input parameter.
	*
	* @example
	* assertStringEnumeration_(1, ["test", "test2"]); 
	* // Error("input must be a string equals to any of test,test2")
	*
	* @example
	* assertStringEnumeration_("test", ["test", "test2"]); 
	*/
	self.assertStringEnumeration_ = function(x, allowedValues) {
	  // Allowed values must be an array...
	  try {
        self.assertArray_(allowedValues);
	  }
	  catch (e) {
		throw new Error("input must be an array of strings");
	  }
	    
	  // ... of strings
	  for (var i=0; i<allowedValues.length; ++i) {
	    try {
		  self.assertString_(allowedValues[i]);
	    }
	    catch (e) {
		  throw new Error("input must be an array of strings");
        }
	  }
	  
	  // A string enumeration is a string...
	  try {
		self.assertString_(x);
	  }
	  catch (e) {
		throw new Error("input must be a string equals to any of " + allowedValues.toString());
	  }

	  // ... with predefinite values
	  if (allowedValues.indexOf(x) == -1) {
		throw new Error("input must be a string equals to any of " + allowedValues.toString());
	  }
	}


	/**
	* @function assertDate_
	*
	* @description Throws an error if the input parameter is not a date.
	* 
	* @param {date} x input parameter.
	*
	* @example
	* assertDate_(1); 
	* // Error("input must be a date")
	*
	* @example
	* assertDate_(new Date("2015-12-31")); 
	*/
	self.assertDate_ = function(x) {
	  if ( !(x instanceof Date) || isNaN(x.getTime()) ) {
		throw new Error("input must be a date");
	  }
	}
	

	/**
	* @function assertDateArray_
	*
	* @description Throws an error if the input parameter is not an array of dates.
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertDateArray_([new Date("2015-12-31")]); 
	* //
	*
	* @example
	* assertDateArray_(1); 
	* // Error("input must be an array of dates")
	*
    * assertDateArray_([-1]); 
	* // Error("input must be an array of dates")
	*/
	self.assertDateArray_ = function(x) {
	  // A date array is an array...
	  try {
		self.assertArray_(x);
	  }
	  catch (e) {
		throw new Error("input must be an array of dates");
	  }

      // ... non empty...
	  if (x.length == 0) {
	    throw new Error("input must be an array of dates");
	  }
	 
      // ... and made of dates
      for (var i=0; i<x.length; ++i) {
  	    try {
          self.assertDate_(x[i]);
	    }
        catch (e) {
          throw new Error("input must be an array of dates");
        }
	  }
	}

	
	/**
	* @function assertSameLengthArrays_
	*
	* @description Throws an error if the input parameters are not arrays of same length.
	* 
	* @param {Array.<Object>} x input parameter.
	* @param {Array.<Object>} y input parameter.
	*
	* @example
	* assertSameLengthArrays_([1], [2]); 
	* //
	*
	* @example
	* assertSameLengthArrays_([1], [1, 2]); 
	* // Error("input must be arrays of same length")
	*
    * assertSameLengthArrays_([-1], []); 
	* // Error("input must be arrays of same length")
	*/
	self.assertSameLengthArrays_ = function(x, y) {
	  // The two inputs must be arrays...
	  try {
		self.assertArray_(x);
		self.assertArray_(y);
	  }
	  catch (e) {
		throw new Error("input must be arrays of same length");
	  }

      // ... of same length
	  if (x.length != y.length) {
	    throw new Error("input must be arrays of same length");
	  }
	}
	
	
	/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
