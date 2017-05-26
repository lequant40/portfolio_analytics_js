/**
 * @file Functions related to performances ratios computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */


/**
* @function gainToPainRatio
*
* @summary Compute the gain to pain ratio of a portfolio.
*
* @description This function returns the gain to pain ratio of a portfolio, provided as an
* equity curve.
*
* The the gain to pain ratio is defined as the sum of all returns divided by the absolute value of the sum of all losses, c.f. the reference.
*
* From the reference, a gain to pain ratio above 1.0 is very good, and a gain to pain ratio above 1.5 is excellent.
*
* @see <a href="http://onlinelibrary.wiley.com/doi/10.1002/9781119203469.app1/summary">Hedge Fund Market Wizards: How Winning Traders Win, Jack D. Schwager, Wiley, 2012</a>
* 
* @param {Array.<number>} portfolioEquityCurve the portfolio equity curve, an array of real numbers.
* @return {number} the gain to pain ratio of the portfolio.
*
* @example
* gainToPainRatio([1, 2, 1]); 
* // 1.0 
*
* @example
* gainToPainRatio([1, 1.1, 1.4]); 
* // NaN
*/
self.gainToPainRatio = function(portfolioEquityCurve) {
	// Compute the arithmetic returns of the portfolio
	var returns = self.arithmeticReturns(portfolioEquityCurve).slice(1); // First value is NaN

	// If there is no usable returns, exit
	if (returns.length == 0) {
		return NaN;
	}

	// Else, compute the gain to pain ratio as the the sum of the returns divided by
	// the sum of the absolute values of the negative returns, c.f. the reference.
	var numerator = mean_(returns);
	var denominator = lpm_(returns, 1, 0.0);

	// Return the gain to pain ratio
	if (denominator == 0.0) {
		return NaN; // The gain to pain ratio is undefined in case there is no negative returns
	}
	else {
		return numerator/denominator;
	}
}
