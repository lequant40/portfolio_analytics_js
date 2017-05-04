/**
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
