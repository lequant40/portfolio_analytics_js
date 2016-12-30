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
;/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */

var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.assertArray_ = function(iX) { return assertArray_(iX); }
  self.assertPositiveNumberArray_ = function(iX) { return assertPositiveNumberArray_(iX); }
  self.assertNumber_ = function(iX) { return assertNumber_(iX); }
  self.assertPositiveNumber_ = function(iX) { return assertPositiveNumber_(iX); }
  self.assertBoundedNumber_ = function(iX, iLowerBound, iUpperBound) { return assertBoundedNumber_(iX, iLowerBound, iUpperBound); } 
  self.assertPositiveInteger_ = function(iX) { return assertPositiveInteger_(iX); }
  self.assertString_ = function(iX) { return assertString_(iX); }
  self.assertStringEnumeration_ = function(iX, iAllowedValues) { return assertStringEnumeration_(iX, iAllowedValues); }
  /* End Wrapper public methods */
  
/* End Not to be used as is in Google Sheets */  
  
	/**
	* @function assertArray_
	*
	* @description Throws an error if the input parameter is not an array 
	* (or a typed array).
	* 
	* @param {Array.<Object>} iX input parameter.
	*
	* @example
	* assertArray_([]); 
	* //
	*
	* @example
	* assertArray_(1); 
	* // Error("input must be an array")
	*/
	function assertArray_(iX) {
	  if (Object.prototype.toString.call(iX).indexOf("Array") == -1) {
		throw new Error("input must be an array");
	  }
	}


	/**
	* @function assertPositiveNumberArray_
	*
	* @description Throws an error if the input parameter is not an array of positive numbers 
	* (or a typed array).
	* 
	* @param {Array.<Object>} iX input parameter.
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
	function assertPositiveNumberArray_(iX) {
	  // A positive array is an array...
	  try {
		assertArray_(iX);
	  }
	  catch (e) {
		throw new Error("input must be an array of positive numbers");
	  }

     // ... non empty...
	 if (iX.length == 0) {
	   throw new Error("input must be an array of positive numbers");
	 }
	 
     // ... and made of positive numbers
     for (var i=0; i<iX.length; ++i) {
  	   try {
         self.assertPositiveNumber_(iX[i]);
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
	* @param {number} iX input parameter.
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
	function assertNumber_(iX) {
	  if (Object.prototype.toString.call(iX)!= "[object Number]" || 
		  isNaN(iX) || 
		  iX === Infinity ||
          iX === -Infinity){
		throw new Error("input must be a number");
	  }
	}


	 /**
	* @function assertPositiveNumber_
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {number} iX input parameter.
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
	function assertPositiveNumber_(iX) {
	  // A positive number is a number...
	  try {
		assertNumber_(iX);
	  }
	  catch (e) {
		throw new Error("input must be a positive number");
	  }
	  
	  // ... as well as positive
	  if (iX < 0.0 ) {
	    throw new Error("input must be a positive number");
	  }
	}


	/**
	* @function assertBoundedNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number
	* greater than a (finite)lower bound and lower than a (finite) upper bound.
	* 
	* @param {number} iX input parameter.
	* @param {number} iLowerBound the lower bound.
	* @param {number} iUpperBound the upper bound.
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
	function assertBoundedNumber_(iX, iLowerBound, iUpperBound) {
	  // The bounds and the input must be numbers...
	  try {
        assertNumber_(iX);
	    assertNumber_(iLowerBound);
		assertNumber_(iUpperBound);
	  }
	  catch (e) {
		throw new Error("input(s) must be a number");
	  }
	  
	  // The input parameter must be between the input bounds
	  if (iX < iLowerBound || iX > iUpperBound) {
	    throw new Error("input must be bounded between " + iLowerBound + " and " + iUpperBound);
	  }
	}
	
	
	/**
	* @function assertPositiveInteger_
	*
	* @description Throws an error if the input parameter is not a positive integer.
	* 
	* @param {number} iX input parameter.
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
	function assertPositiveInteger_(iX) {
	  // A positive integer is a positive number...
	  try {
		assertPositiveNumber_(iX);
	  }
	  catch (e) {
		throw new Error("input must be a positive integer");
	  }

	  // ... as well as an integer
	  if (Math.floor(iX) !== iX) {
		throw new Error("input must be a positive integer");
	  }
	}


	/**
	* @function assertString_
	*
	* @description Throws an error if the input parameter is not a string.
	* 
	* @param {string} iX input parameter.
	*
	* @example
	* assertString_(1); 
	* // Error("input must be a string")
	*
	* @example
	* assertEnumeration_("test"); 
	*/
	function assertString_(iX) {
	  if (!(typeof iX === 'string' || iX instanceof String)) {
		throw new Error("input must be a string");
	  }
	}

	
	/**
	* @function assertStringEnumeration_
	*
	* @description Throws an error if the input parameter is not a string belonging to a set of string values.
	* 
	* @param {string} iX input parameter.
	* @param {Array.<string>} iAllowedValues array listing the allowed values for the input parameter.
	*
	* @example
	* assertStringEnumeration_(1, ["test", "test2"]); 
	* // Error("input must be a string equals to any of test,test2")
	*
	* @example
	* assertStringEnumeration_("test", ["test", "test2"]); 
	*/
	function assertStringEnumeration_(iX, iAllowedValues) {
	  // Allowed values must be an array...
	  try {
        assertArray_(iAllowedValues);
	  }
	  catch (e) {
		throw new Error("input must be an array of strings");
	  }
	    
	  // ... of strings
	  for (var i=0; i<iAllowedValues.length; ++i) {
	    try {
		  assertString_(iAllowedValues[i]);
	    }
	    catch (e) {
		  throw new Error("input must be an array of strings");
        }
	  }
	  
	  // A string enumeration is a string...
	  try {
		assertString_(iX);
	  }
	  catch (e) {
		throw new Error("input must be a string equals to any of " + iAllowedValues.toString());
	  }

	  // ... with predefinite values
	  if (iAllowedValues.indexOf(iX) == -1) {
		throw new Error("input must be a string equals to any of " + iAllowedValues.toString());
	  }
	}


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
  /* Start Wrapper public methods */
  self.cumulativeReturn = function(iEquityCurve) { return cumulativeReturn(iEquityCurve); }
  self.cagr = function(iEquityCurve, iPeriodicity) { return cagr(iEquityCurve, iPeriodicity); }
  self.arithmeticReturns = function(iEquityCurve) { return arithmeticReturns(iEquityCurve); }
  self.gainToPainRatio = function(iEquityCurve) { return gainToPainRatio(iEquityCurve); }
  /* End Wrapper public methods */

  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function cumulativeReturn
  *
  * @description Compute the cumulative return associated to a portfolio equity curve.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Rate_of_return">https://en.wikipedia.org/wiki/Rate_of_return</a>
  * 
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
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
  function cumulativeReturn(iEquityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(iEquityCurve);
	
    // Compute the cumulative return
	var cumRet = NaN;
	if (iEquityCurve.length >= 2) { // In order to compute a proper cumulative return, at least 2 periods are required
	  cumRet = (iEquityCurve[iEquityCurve.length-1]-iEquityCurve[0])/iEquityCurve[0];
	}
    
    // Return it
    return cumRet;
  }

  
  /**
  * @function cagr
  *
  * @description Compute the compound annual growth rate associated to a portfolio equity curve.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Compound_annual_growth_rate">https://en.wikipedia.org/wiki/Compound_annual_growth_rate</a>
  * 
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @param {} iPeriodicity the periodicity associated with the portfolio equity curve: 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'.
  * @return {number} the annualized return.
  *
  * @example
  * cagr([1, 1.1, 1.2], 'yearly');
  * // 0.095, i.e. ~9.5% annualized return
  */
  function cagr(iEquityCurve, iPeriodicity) {
    // Input checks
    self.assertPositiveNumberArray_(iEquityCurve);
    self.assertStringEnumeration_(iPeriodicity, ["daily", "weekly", "monthly", "quarterly", "yearly"]);

    // Extract the initial and the final equity curve values
    var aInitialValue = iEquityCurve[0];
    var aFinalValue = iEquityCurve[iEquityCurve.length-1];
  
    // Compute the number of invested years based on the equity curve length and periodicity
    var nbInvestedYears = iEquityCurve.length-1;
	if (iPeriodicity == "yearly") {
      nbInvestedYears = nbInvestedYears / 1.0;
    }
	else if (iPeriodicity == "quarterly") {
     nbInvestedYears = nbInvestedYears / 4.0;
    } 
	else if (iPeriodicity == "monthly") {
      nbInvestedYears = nbInvestedYears / 12.0;
    }
    else if (iPeriodicity == "weekly") {
      nbInvestedYears = nbInvestedYears / 52.0;
    }
    else if (iPeriodicity == "daily") {
      nbInvestedYears = nbInvestedYears / 252.0;
    }
  
    // Compute the CAGR
    var valCagr = Math.pow(aFinalValue/aInitialValue, 1/nbInvestedYears) - 1;

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
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @return {Array.<number>} the arithmetic returns corresponding to the values of the portfolio equity curve,
  * with the convention that the first return is NaN.
  *
  * @example
  * arithmeticReturns([1, 2, 1]); 
  * // [NaN, 1.0, -0.5], i.e. 100% return and then -50% return
  */
  function arithmeticReturns(iEquityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(iEquityCurve);
	
    // Compute the different arithmetic returns
	var returns = new Array(iEquityCurve.length);
	returns[0] = NaN;
	for (var i=1; i<iEquityCurve.length; ++i) {
	  returns[i] = (iEquityCurve[i]-iEquityCurve[i-1])/iEquityCurve[i-1];
	}
    
    // Return them
    return returns;
  }


  /**
  * @function gainToPainRatio
  *
  * @description Compute the gain to pain ratio associated to a portfolio equity curve.
  *
  * @see <a href="http://onlinelibrary.wiley.com/doi/10.1002/9781119203469.app1/summary">Hedge Fund Market Wizards: How Winning Traders Win, Jack D. Schwager, Wiley, 2012</a>
  * 
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
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
  function gainToPainRatio(iEquityCurve) {
    // No need for input checks, as done in function below
	
	// Compute the arithmetic returns of the portfolio
	var returns = arithmeticReturns(iEquityCurve);
	
    // Loop over all the returns to compute their sum and
	// the sum of the asolute values of the negative returns
	var numerator = 0.0;
	var denominator = 0.0;
    
    // Loop over all the values to compute the drawdown vector
    for (var i=1; i<returns.length; ++i) {
      numerator += returns[i];
	  if (returns[i] < 0.0) {
	    denominator += -returns[i];
	  }
    }
    
    // Compute and return the gain to pain ratio
    var ratio = numerator;
	if (denominator != 0.0) {
	  ratio /= denominator;
	}
	else {
	  ratio = NaN; // The gain to pain ratio is undefined in case there is no negative returns
	}

	return ratio;
  }


/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
