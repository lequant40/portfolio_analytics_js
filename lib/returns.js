/**
 * @file Functions related to returns computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.ror = function(iEquityCurve) { return ror(iEquityCurve); }
  self.cagr = function(iEquityCurve, iPeriodicity) { return cagr(iEquityCurve, iPeriodicity); }
  /* End Wrapper public methods */

  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function ror
  *
  * @description Compute the rate of return associated to a portfolio equity curve (i.e. the single period return).
  *
  * @see <a href="https://en.wikipedia.org/wiki/Rate_of_return">https://en.wikipedia.org/wiki/Rate_of_return</a>
  * 
  * @param {Array.<number>} iEquityCurve the portfolio equity curve.
  * @return {number} the cumulative return.
  *
  * @example
  * ror([1, 2, 1]); 
  * // 0.0, i.e. 0% return
  *
  * @example
  * ror([1, 2, 2]);
  * // 1, i.e. 100% return
  */
  function ror(iEquityCurve) {
    // Input checks
    self.assertPositiveArray_(iEquityCurve);
	
    // Compute the single period return
	var periodReturn = NaN;
	if (iEquityCurve.length >= 2) { // In order to compute a proper RoR, at least 2 periods are required
	  periodReturn = (iEquityCurve[iEquityCurve.length-1]-iEquityCurve[0])/iEquityCurve[0];
	}
    
    // Return it
    return periodReturn;
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
    self.assertPositiveArray_(iEquityCurve);
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


/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
