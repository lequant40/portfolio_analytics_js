/**
 * @file Functions related to drawdowns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.maxDrawdown = function(iEquityCurve) { return maxDrawdown(iEquityCurve); }
  self.drawdownFunction = function(iEquityCurve) { return drawdownFunction(iEquityCurve); }
  self.topDrawdowns = function(iEquityCurve, iNbTopDrawdowns) { return topDrawdowns(iEquityCurve, iNbTopDrawdowns); } 
  self.ulcerIndex = function(iEquityCurve) { return ulcerIndex(iEquityCurve); }
  self.painIndex = function(iEquityCurve) { return painIndex(iEquityCurve); }
  self.conditionalDrawdown = function(iEquityCurve, iAlpha) { return conditionalDrawdown(iEquityCurve, iAlpha); }
  /* End Wrapper public methods */

  
  /* Start Wrapper private methods - Unit tests usage only */
  self.maxDrawdown_ = function(iEquityCurve, iIdxStart, iIdxEnd) { return maxDrawdown_(iEquityCurve, iIdxStart, iIdxEnd); }
  /* End Wrapper private methods - Unit tests usage only */

/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function maxDrawdown
  *
  * @description Compute the maximum drawdown associated to a portfolio equity curve.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Drawdown_(economics)">https://en.wikipedia.org/wiki/Drawdown_(economics)</a>
  * 
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
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
  function maxDrawdown(iEquityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(iEquityCurve);

    // Compute the maximum drawdown and its associated duration
    var maxDd_ = maxDrawdown_(iEquityCurve, 0, iEquityCurve.length-1);
    
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
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @param {number} iIdxStart the iEquityCurve array index from which to compute the maximum drawdown.
  * @param {number} iIdxEnd the iEquityCurve index until which to compute the maximum drawdown.
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
  function maxDrawdown_(iEquityCurve, iIdxStart, iIdxEnd) {
    // Initialisations
    var highWaterMark = -Infinity;
    var maxDd = -Infinity;
    var idxHighWaterMark = -1;
    var idxStartMaxDd = -1;
    var idxEndMaxDd = -1;
    
    // Internal function => no specific checks on the input arguments
    
    // Loop over all the values to compute the maximum drawdown
    for (var i=iIdxStart; i<iIdxEnd+1; ++i) {     
      if (iEquityCurve[i] > highWaterMark) {
        highWaterMark = iEquityCurve[i];
        idxHighWaterMark = i;
      }
      
      var dd = (highWaterMark - iEquityCurve[i]) / highWaterMark;
      
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
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @return {Array.<number>} the values of the drawdown function.
  *
  * @example
  * drawdownFunction([1, 2, 1]); 
  * // [0.0, 0.0, 0.5], i.e. no drawdowns at indexes 0/1, 50% drawdown at index 2  
  */
  function drawdownFunction(iEquityCurve) {
    // Initialisations
    var highWaterMark = -Infinity;
    
    // Input checks
    self.assertPositiveNumberArray_(iEquityCurve);
    
    // Other initialisations
    var ddVector = new Array(iEquityCurve.length);
    
    // Loop over all the values to compute the drawdown vector
    for (var i=0; i<iEquityCurve.length; ++i) {
      if (iEquityCurve[i] > highWaterMark) {
        highWaterMark = iEquityCurve[i];
      }
      
      ddVector[i] = (highWaterMark - iEquityCurve[i]) / highWaterMark;
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
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @param {<number>} iNbTopDrawdowns the (maximum) number of top drawdown to compute.
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
  function topDrawdowns(iEquityCurve, iNbTopDrawdowns) {
    // Input checks
    self.assertPositiveNumberArray_(iEquityCurve);
    self.assertPositiveInteger_(iNbTopDrawdowns);
    
	// If no drawdowns are required, returns
	if (iNbTopDrawdowns == 0) {
	  return [];
	}
	
    // Do the effective computation
    // Note: this code results from the de-recursification of the naive
    // implementation of the top n drawdown definition (hence in
    // particular the callStak variable, emulating the recursive calls)
    var topDrawdowns = [];
    var callStack = [];
    
    callStack.push([0, iEquityCurve.length-1, iNbTopDrawdowns]);
    
    while (callStack.length != 0) {
      var topCallStack  = callStack.pop();
	  var idxStart = topCallStack[0];
	  var idxEnd = topCallStack[1];
	  var nbRemainingTopDrawdows = topCallStack[2];
      
	  var topDd = maxDrawdown_(iEquityCurve, idxStart, idxEnd);
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
        // #1 - idxStartMaxDd == iIdxStart and idxEndMaxDd == iIdxEnd => nothing more to do, 
        // as only one maximum drawdown exists
        if (idxStartMaxDd == idxStart && idxEndMaxDd == idxEnd) {
          ;
        }
        
        // #2 - idxStartMaxDd == iIdxStart and idxEndMaxDd < iIdxEnd => compute the remaining 
        // n-1 maximum drawdowns on [idxEndMaxDd, iIdxEnd] interval
        else if (idxStartMaxDd == idxStart && idxEndMaxDd < idxEnd) {
          callStack.push([idxEndMaxDd, idxEnd, nbRemainingTopDrawdows-1]);
        }
        
        // #3 - idxStartMaxDd > iIdxStart and idxEndMaxDd == iIdxEnd => compute the remaining 
        // n-1 maximum drawdowns on [iIdxStart, idxStartMaxDd] interval
        else if (idxStartMaxDd > idxStart && idxEndMaxDd == idxEnd) {
          callStack.push([idxStart, idxStartMaxDd, nbRemainingTopDrawdows-1]);
        }
        
        // #4 - idxStartMaxDd > iIdxStart and idxEndMaxDd < iIdxEnd => compute the remaining 
        // n-1 maximum drawdowns on both [iIdxStart, idxStartMaxDd] and [idxEndMaxDd, iIdxEnd]
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
    
    // Return (at most) the iNbTopDrawdowns top drawdowns
    return topDrawdowns.slice(0, Math.min(iNbTopDrawdowns, topDrawdowns.length));
  }
  
  
  /**
  * @function ulcerIndex
  *
  * @description Compute the ulcer index associated to a portfolio equity curve.
  *
  * @see <a href="http://www.tangotools.com/ui/ui.htm">Ulcer Index, An Alternative Approach to the Measurement of Investment Risk & Risk-Adjusted Performance</a>
  *
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @return {number} the ulcer index.
  *
  * @example
  * ulcerIndex([1, 2, 1]);
  * // ~0.289
  */
  function ulcerIndex(iEquityCurve) {
    // No need for input checks, as done in function below

    // Compute the drawdown function
    var ddFunc = drawdownFunction(iEquityCurve);
    
    // Compute the sum of squares of this function
    var sumSquares = 0.0;
    for (var i=0; i<ddFunc.length; ++i) {
      sumSquares += ddFunc[i] * ddFunc[i];
    }
    
    // Compute and return the ulcer index
    var uI = Math.sqrt(sumSquares/ddFunc.length);
    return uI;
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
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @return {number} the pain index.
  *
  * @example
  * painIndex([1, 2, 1]);
  * // ~0.167
  */
  function painIndex(iEquityCurve) {
    // No need for input checks, as done in function below
    
    // Compute the drawdown function
    var ddFunc = drawdownFunction(iEquityCurve);
    
    // Compute the sum of this function
    var sum = 0.0;
    for (var i=0; i<ddFunc.length; ++i) {
      sum += ddFunc[i];
    }
    
    // Compute and return the pain index
    var pI = sum/ddFunc.length;
    return pI;
  }
  
  
  /**
  * @function conditionalDrawdown
  *
  * @description Compute the conditional drawdown of a portfolio equity curve.
  *
  * @see <a href="http://www.worldscientific.com/doi/abs/10.1142/S0219024905002767">Drawdown Measure in Portfolio Optimization, Chekhlov et al., Int. J. Theor. Appl. Finan. 08, 13 (2005)</a>
  *
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @param {Array.<number>} iAlpha the tolerance parameter.
  * @return {number} the iAlpha-conditional drawdown.
  *
  * @example
  * conditionalDrawdown([100, 90, 80, 70, 60, 50, 40, 30, 20], 0.7);
  * // 0.725
  */
  function conditionalDrawdown(iEquityCurve, iAlpha) {
    // Input checks
    // No need to check for array positivity, as done in function below
	if (iAlpha === undefined) {
	  iAlpha = -1;
	}
    self.assertBoundedNumber_(iAlpha, 0, 1);
   
    // Compute the drawdown function and
	// remove the first element, always equals to 0
	// C.f. definition 3.1
    var ddFunc = drawdownFunction(iEquityCurve).slice(1);
	
    // Sort the drawdown function from lowest to highest values
    ddFunc.sort(function(a, b) { return a - b;});
  
    // If iAlpha = 1 (limit case), return the maximum drawdown
    if (iAlpha == 1.0) {
      return ddFunc[ddFunc.length-1];
    }
    
    // Otherwise, find the drawdown associated to pi^{-1}(iAlpha), as well as its percentile
	// C.f. (3.8) of the reference
    var idxAlphaDd = 1; 
    while (iAlpha > idxAlphaDd/ddFunc.length) {
      ++idxAlphaDd;
    }
    var alphaDd = ddFunc[idxAlphaDd-1];
    var pctileAlphaDd = idxAlphaDd/ddFunc.length;

    // Compute and return the conditional drawdown using Theorem 3.1 of the reference
	  // Compute the integral between iAlpha and the iAlpha percentile
    var cdd1 = (pctileAlphaDd - iAlpha) * alphaDd;
  
      // Compute the remaining part of the integral between iAlpha percentile and one
	var cdd2 = 0.0;
    for (var i=idxAlphaDd; i<ddFunc.length; ++i) {
      cdd2 += ddFunc[i];
    }
    cdd2 /= ddFunc.length;
    
      // Compute and return the average value of the integral above
	var cdd = (cdd1 + cdd2) / (1 - iAlpha);
    return cdd;
  }

  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
