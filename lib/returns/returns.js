/**
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
  self.cumulativeReturn = function(portfolioEquityCurve) {
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
  self.cagr = function(portfolioEquityCurve, valuationDates) {
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
  self.arithmeticReturns = function(portfolioEquityCurve) {
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
  self.valueAtRisk = function(portfolioEquityCurve, alpha) {
    // Compute the returns and remove the first element, always equals to NaN
    var returns = self.arithmeticReturns(portfolioEquityCurve).slice(1);
	
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

 
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
