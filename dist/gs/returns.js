/**
 * @file Functions related to returns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
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
    assertPositiveNumberArray_(equityCurve);
	
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
    assertPositiveNumberArray_(equityCurve);
    assertStringEnumeration_(periodicity, ["daily", "weekly", "monthly", "quarterly", "yearly"]);

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
    assertPositiveNumberArray_(equityCurve);
	
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


