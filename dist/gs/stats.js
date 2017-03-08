/**
 * @file Functions related to statistics computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
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
    assertNumberArray_(x);
	assertPositiveInteger_(n);
	
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
    assertNumberArray_(x);
	assertPositiveInteger_(n);
	
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
    assertNumberArray_(x);
	
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
    assertNumberArray_(x);
	
	// In case the input array is made of only one element, the variance is not defined
	if (x.length == 1) {
	  return NaN;
	}
	
	// Initialisations
    var nn = x.length;

    // Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

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
    assertNumberArray_(x);
	
    //
	return Math.sqrt(variance_(x));
  }
  

