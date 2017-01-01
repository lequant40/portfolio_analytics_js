/**
 * @file Functions related to drawdowns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.maxDrawdown = function(equityCurve) { return maxDrawdown(equityCurve); }
  self.drawdownFunction = function(equityCurve) { return drawdownFunction(equityCurve); }
  self.topDrawdowns = function(equityCurve, nbTopDrawdowns) { return topDrawdowns(equityCurve, nbTopDrawdowns); } 
  self.ulcerIndex = function(equityCurve) { return ulcerIndex(equityCurve); }
  self.painIndex = function(equityCurve) { return painIndex(equityCurve); }
  self.conditionalDrawdown = function(equityCurve, alpha) { return conditionalDrawdown(equityCurve, alpha); }
  /* End Wrapper public methods */

  

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
  function maxDrawdown(equityCurve) {
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
  function drawdownFunction(equityCurve) {
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
  function topDrawdowns(equityCurve, nbTopDrawdowns) {
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
  function ulcerIndex(equityCurve) {
    // No need for input checks, as done in function below

    // Compute the drawdown function
    var ddFunc = drawdownFunction(equityCurve);
    
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
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @return {number} the pain index.
  *
  * @example
  * painIndex([1, 2, 1]);
  * // ~0.167
  */
  function painIndex(equityCurve) {
    // No need for input checks, as done in function below
    
    // Compute the drawdown function
    var ddFunc = drawdownFunction(equityCurve);
    
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
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @param {number} alpha the tolerance parameter belonging to interval [0,1].
  * @return {number} the alpha-conditional drawdown.
  *
  * @example
  * conditionalDrawdown([100, 90, 80, 70, 60, 50, 40, 30, 20], 0.7);
  * // 0.725
  */
  function conditionalDrawdown(equityCurve, alpha) {
    // Input checks
    // No need to check for array positivity, as done in function below
	if (alpha === undefined) {
	  alpha = -1;
	}
    self.assertBoundedNumber_(alpha, 0, 1);
   
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
  self.assertArray_ = function(x) { return assertArray_(x); }
  self.assertNumberArray_ = function(x) { return assertNumberArray_(x); }
  self.assertPositiveNumberArray_ = function(x) { return assertPositiveNumberArray_(x); }
  self.assertNumber_ = function(x) { return assertNumber_(x); }
  self.assertPositiveNumber_ = function(x) { return assertPositiveNumber_(x); }
  self.assertBoundedNumber_ = function(x, lowerBound, upperBound) { return assertBoundedNumber_(x, lowerBound, upperBound); } 
  self.assertPositiveInteger_ = function(x) { return assertPositiveInteger_(x); }
  self.assertString_ = function(x) { return assertString_(x); }
  self.assertStringEnumeration_ = function(x, allowedValues) { return assertStringEnumeration_(x, allowedValues); }
  /* End Wrapper public methods */
  
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
	function assertArray_(x) {
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
	* assertNumberArray_([]); 
	* //
	*
	* @example
	* assertNumberArray_(1); 
	* // Error("input must be an array of numbers")
	*
    * assertNumberArray_([-1]); 
	* // Error("input must be an array of numbers")
	*/
	function assertNumberArray_(x) {
	  // A number array is an array...
	  try {
		assertArray_(x);
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
	function assertPositiveNumberArray_(x) {
	  // A positive array is an array...
	  try {
		assertArray_(x);
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
	function assertNumber_(x) {
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
	function assertPositiveNumber_(x) {
	  // A positive number is a number...
	  try {
		assertNumber_(x);
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
	function assertBoundedNumber_(x, lowerBound, upperBound) {
	  // The bounds and the input must be numbers...
	  try {
        assertNumber_(x);
	    assertNumber_(lowerBound);
		assertNumber_(upperBound);
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
	function assertPositiveInteger_(x) {
	  // A positive integer is a positive number...
	  try {
		assertPositiveNumber_(x);
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
	function assertString_(x) {
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
	function assertStringEnumeration_(x, allowedValues) {
	  // Allowed values must be an array...
	  try {
        assertArray_(allowedValues);
	  }
	  catch (e) {
		throw new Error("input must be an array of strings");
	  }
	    
	  // ... of strings
	  for (var i=0; i<allowedValues.length; ++i) {
	    try {
		  assertString_(allowedValues[i]);
	    }
	    catch (e) {
		  throw new Error("input must be an array of strings");
        }
	  }
	  
	  // A string enumeration is a string...
	  try {
		assertString_(x);
	  }
	  catch (e) {
		throw new Error("input must be a string equals to any of " + allowedValues.toString());
	  }

	  // ... with predefinite values
	  if (allowedValues.indexOf(x) == -1) {
		throw new Error("input must be a string equals to any of " + allowedValues.toString());
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
  self.cumulativeReturn = function(equityCurve) { return cumulativeReturn(equityCurve); }
  self.cagr = function(equityCurve, periodicity) { return cagr(equityCurve, periodicity); }
  self.arithmeticReturns = function(equityCurve) { return arithmeticReturns(equityCurve); }
  self.gainToPainRatio = function(equityCurve) { return gainToPainRatio(equityCurve); }
  /* End Wrapper public methods */

  
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
  function cumulativeReturn(equityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
	
    // Compute the cumulative return
	var cumRet = NaN;
	if (equityCurve.length >= 2) { // In order to compute a proper cumulative return, at least 2 periods are required
	  cumRet = (equityCurve[equityCurve.length-1]-equityCurve[0])/equityCurve[0];
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
  * @param {Array.<number>} equityCurve the portfolio equity curve.
  * @param {string} periodicity the periodicity associated with the portfolio equity curve, among 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'.
  * @return {number} the annualized return.
  *
  * @example
  * cagr([1, 1.1, 1.2], 'yearly');
  * // 0.095, i.e. ~9.5% annualized return
  */
  function cagr(equityCurve, periodicity) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
    self.assertStringEnumeration_(periodicity, ["daily", "weekly", "monthly", "quarterly", "yearly"]);

    // Extract the initial and the final equity curve values
    var initialValue = equityCurve[0];
    var finalValue = equityCurve[equityCurve.length-1];
  
    // Compute the number of invested years based on the equity curve length and periodicity
    var nbInvestedYears = equityCurve.length-1;
	if (periodicity == "yearly") {
      nbInvestedYears = nbInvestedYears / 1.0;
    }
	else if (periodicity == "quarterly") {
     nbInvestedYears = nbInvestedYears / 4.0;
    } 
	else if (periodicity == "monthly") {
      nbInvestedYears = nbInvestedYears / 12.0;
    }
    else if (periodicity == "weekly") {
      nbInvestedYears = nbInvestedYears / 52.0;
    }
    else if (periodicity == "daily") {
      nbInvestedYears = nbInvestedYears / 252.0;
    }
  
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
  function arithmeticReturns(equityCurve) {
    // Input checks
    self.assertPositiveNumberArray_(equityCurve);
	
    // Compute the different arithmetic returns
	var returns = new equityCurve.constructor(equityCurve.length); // Inherit the array type from the input array
	returns[0] = NaN;
	for (var i=1; i<equityCurve.length; ++i) {
	  returns[i] = (equityCurve[i]-equityCurve[i-1])/equityCurve[i-1];
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
  function gainToPainRatio(equityCurve) {
    // No need for input checks, as done in function below
	
	// Compute the arithmetic returns of the portfolio
	var returns = arithmeticReturns(equityCurve);
	
    // Loop over all the returns to compute their sum and
	// the sum of the asolute values of the negative returns
	var numerator = 0.0;
	var denominator = 0.0;
    
    // Loop over all the values to compute the drawdown vector
    for (var i=1; i<returns.length; ++i) { // returns[0] is always equals to NaN
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
;/**
 * @file Functions related to statistics computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.percentile = function(x, p) { return percentile(x, p); }
  /* End Wrapper public methods */

  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function percentile
  *
  * @descrption Compute the percentile value of a numeric array using the linear interpolation between closest tanks method with C = 1.
  *
  * @see <a href="https://en.wikpedia.org/wiki/Percentile">https://en.wikpedia.org/wiki/Percentile</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {number} p the p-th percentile of the input array to be computed, belonging to interval [0,1].
  * @return {number} the p-th percentile value of the input array.
  *
  * @example
  * percentile([1,2,3,4], 0.75); 
  * // 3.25
  */
  function percentile(x, p) {
    // Input checks
    self.assertNumberArray_(x);
	if (p === undefined) {
	  p = -1;
	}
	self.assertBoundedNumber_(p, 0, 1);
	
    // Pre-process for the special case p=1 percentile value
	if (p == 1.0) {
	  return x[x.length-1];
	}
	
	// Otherwise, sort a copy of the array
	var sortedArray = x.slice().sort(function (a, b) { return a - b; });
	
	// Then compute the index of the p-th percentile
	var idx = p*(sortedArray.length - 1);
	
	// Then compute and return the value of the p-th percentile
	var lowerIdx = Math.floor(idx);
	var upperIdx = lowerIdx + 1;
	return sortedArray[lowerIdx] + (idx % 1) * (sortedArray[upperIdx] - sortedArray[lowerIdx]);
  }
  

/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
