/**
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
	
    // Initialisations
    nn = x.length;
    dtemp = 0.0;

	//
    m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
		dtemp += Math.pow(Math.max(0, x[i]-t), n);
      }
    }
    
	//
	if (nn < 4) {
      return dtemp/nn;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((Math.pow(Math.max(0, x[i]-t), n) + Math.pow(Math.max(0, x[i+1]-t), n)) + (Math.pow(Math.max(0, x[i+2]-t), n) + Math.pow(Math.max(0, x[i+3]-t), n)));
    }
	
	//
    return dtemp/nn;
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
	
    // Initialisations
    var nn = x.length;
    var dtemp = 0.0;

	//
    var m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
		dtemp += Math.pow(Math.max(0, t-x[i]), n);
      }
    }
    
	//
	if (nn < 4) {
      return dtemp/nn;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((Math.pow(Math.max(0, t-x[i]), n) + Math.pow(Math.max(0, t-x[i+1]), n)) + (Math.pow(Math.max(0, t-x[i+2]), n) + Math.pow(Math.max(0, t-x[i+3]), n)));
    }
	
	//
    return dtemp/nn;
  }


  /**
  * @function mean_
  *
  * @description Compute the mean of the values of a numeric array, using a two-pass formula.
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
    var dtemp = 0.0;
	var dtemp2 = 0.0;

	// Compute the mean of the values of th input numeric array, first pass
	var sum = 0.0;
	for (var i=0; i<nn; ++i) {
	  sum += x[i];
	}
	dtemp = sum/nn;
	
	// Compute the correction factor, second pass
	// C.f. M_3 formula of the reference
	var sum = 0.0;
	for (var i=0; i<nn; ++i) {
	  sum += (x[i] - dtemp);
	}
	dtemp2 = sum/nn;
	
	// Return the corrected mean
    return dtemp + dtemp2;
  }


/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
