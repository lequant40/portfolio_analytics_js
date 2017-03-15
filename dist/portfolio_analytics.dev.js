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
	var sumSquares = self.dot_(ddFunc, ddFunc);
    
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
    // No need for input checks, as done in function below
    
    // Compute the drawdown function
    var ddFunc = drawdownFunction(equityCurve);
	
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
  function conditionalDrawdown(equityCurve, alpha) {
    // Input checks
    // No need to check for array positivity, as done in function below
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
    //for (var i=idxAlphaDd; i<ddFunc.length; ++i) {
    //  cdd2 += ddFunc[i];
    //}
	if (idxAlphaDd < ddFunc.length) {
	  cdd2 = self.sum_(ddFunc.slice(idxAlphaDd))/ddFunc.length;
	}	
    
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
  self.assertDate_ = function(x) { return assertDate_(x); }
  self.assertDateArray_ = function(x) { return assertDateArray_(x); }
  self.assertSameLengthArrays_ = function(x, y) { return assertSameLengthArrays_(x, y); }
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
	function assertDate_(x) {
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
	function assertDateArray_(x) {
	  // A date array is an array...
	  try {
		assertArray_(x);
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
	function assertSameLengthArrays_(x, y) {
	  // The two inputs must be arrays...
	  try {
		assertArray_(x);
		assertArray_(y);
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
;/**
 * @file Functions related to returns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.cumulativeReturn = function(equityCurve) { return cumulativeReturn(equityCurve); }
  self.cagr = function(equityCurve, valuationDates) { return cagr(equityCurve, valuationDates); }
  self.arithmeticReturns = function(equityCurve) { return arithmeticReturns(equityCurve); }
  self.valueAtRisk = function(equityCurve, alpha) { return valueAtRisk(equityCurve, alpha); }
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
  function cagr(equityCurve, valuationDates) {
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
  function arithmeticReturns(equityCurve) {
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
  function valueAtRisk(equityCurve, alpha) {
    // Input checks
    // No need to check for array positivity, as done in function below
    self.assertBoundedNumber_(alpha, 0, 1);
   
    // Compute the returns and remove the first element, always equals to NaN
    var returns = arithmeticReturns(equityCurve).slice(1);
	
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
 * @file Functions related to statistics computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.hpm_ = function(x, n, t) { return hpm_(x, n, t); }
  self.lpm_ = function(x, n, t) { return lpm_(x, n, t); }
  self.mean_ = function(x) { return mean_(x); }
  self.variance_ = function(x) { return variance_(x); }
  self.stddev_ = function(x) { return stddev_(x); }
  /* End Wrapper public methods */

  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function hpm_
  *
  * @description Compute the higher partial moment of the values of a numeric array.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {number} n the order of the higher partial moment.
  * @param {number} t the threshold of the higher partial moment.
  * @return {number} the higher partial moment of order n at threshold t of the values of the input array.
  *
  * @example
  * hpm_([0.1,-0.2,-0.3], 2, 0.0); 
  * // 0.0167
  */
  function hpm_(x, n, t) {
    // Input checks
    self.assertNumberArray_(x);
	self.assertPositiveInteger_(n);
	
    // The HPM is the mean of the values max(0, x[i]-t)^n, i=0..length(x) - 1, so that code below is adapted from a mean computation
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
  * @description Compute the lower partial moment of the values of a numeric array.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {number} n the order of the lower partial moment.
  * @param {number} t the threshold of the lower partial moment.
  * @return {number} the lower partial moment of order n at threshold t of the values of the input array.
  *
  * @example
  * lpm_([0.1,0.2,-0.3], 2, 0.0); 
  * // 0.03
  */
  function lpm_(x, n, t) {
    // Input checks
    self.assertNumberArray_(x);
	self.assertPositiveInteger_(n);
	
    // The LPM is the mean of the values max(0, t-x[i])^n, i=0..length(x) - 1, so that code below is adapted from a mean computation
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
  * @description Compute the mean of the values of a numeric array, using a corrected two-pass formula.
  *
  * @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the mean of the values of the input array.
  *
  * @example
  * mean_([2,4]); 
  * // 3
  */
  function mean_(x) {
    // Input checks
    self.assertNumberArray_(x);
	
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
  * @description Compute the variance of the values of a numeric array, using a corrected two-pass formula.
  *
  * @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
  *
  * To be noted that the variance is normalized by the number of observations-1.
  * 
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the variance of the values of the input array.
  *
  * @example
  * variance_([4, 7, 13, 16]); 
  * // 30
  */
  function variance_(x) {
    // Input checks
    self.assertNumberArray_(x);
	
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
	var S = sumSquareDiff - ((sumDiff * sumDiff)/nn);
	
	// Return the corrected variance
    return S/(nn-1);
  }


 /**
  * @function stddev_
  *
  * @description Compute the standard deviation of the values of a numeric array, using a corrected two-pass formula (c.f. the variance_ function)
  *
  * To be noted that the standard deviation is normalized by the number of observations-1.
  * 
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the standard deviation of the values of the input array.
  *
  * @example
  * stddev_([1,2]); 
  * // ~0.707
  */
  function stddev_(x) {
    // Input checks
    self.assertNumberArray_(x);
	
    //
	return Math.sqrt(self.variance_(x));
  }
  

/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
;/**
 * @file Functions related to basic linear algebra computations.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.sum_ = function(x) { return sum_(x); }
  self.dot_ = function(x,y) { return dot_(x,y); }
  /* End Wrapper public methods */

  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function sum_
  *
  * @description Compute the sum of the values of a numeric array using a LAPACK like algorithm.
  *
  * @see <a href="http://www.netlib.org/lapack/explore-html/de/da4/group__double__blas__level1.html">LAPACK</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the sum of the values of the input array.
  *
  * @example
  * sum_([1,2,3,4]); 
  * // 10
  */
  function sum_(x) {
    // Input checks
    self.assertNumberArray_(x);
	
    // Initialisations
    var nn = x.length;
    var dtemp = 0.0;

	//
    var m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
        dtemp += x[i];
      }
    }
	
	//
	if (nn < 4) {
      return dtemp;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((x[i] + x[i+1]) + (x[i+2] + x[i+3]));
    }
	
	//
    return dtemp;
  }
  
  
  /**
  * @function dot_
  *
  * @description Compute the dot product of two numeric arrays using a LAPACK like algorithm.
  *
  * @see <a href="http://www.netlib.org/lapack/explore-html/de/da4/group__double__blas__level1.html">LAPACK</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {Array.<number>} y the input numeric array.
  * @return {number} the dot product of the two input arrays.
  *
  * @example
  * dot_([1,2,3,4], [1,1,1,1]); 
  * // 10
  */
  function dot_(x,y) {
    // Input checks
    self.assertNumberArray_(x);
	self.assertNumberArray_(y);
	if (x.length != y.length) {
	  throw new Error("input arrays must have the same length");
	}
	
    // Initialisations
    var nn = x.length;
    var dtemp = 0.0;

	//
    var m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
        dtemp += x[i]*y[i];
      }
    }
    
	//
	if (nn < 4) {
      return dtemp;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((x[i]*y[i] + x[i+1]*y[i+1]) + (x[i+2]*y[i+2] + x[i+3]*y[i+3]));
    }
	
	//
    return dtemp;
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
  /* Start Wrapper public methods */
  self.gainToPainRatio = function(equityCurve) { return gainToPainRatio(equityCurve); }
  /* End Wrapper public methods */

  
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
  function gainToPainRatio(equityCurve) {
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
