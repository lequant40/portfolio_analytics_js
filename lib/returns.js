/**
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
