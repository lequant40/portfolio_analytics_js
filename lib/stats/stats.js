/**
 * @file Functions related to statistics computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  
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
  self.hpm_ = function(x, n, t) {
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
  self.lpm_ = function(x, n, t) {
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
  self.mean_ = function(x) {
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
  * @description Compute the (population) variance of the values of a numeric array, using a corrected two-pass formula.
  *
  * @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the variance of the values of the input array.
  *
  * @example
  * variance_([4, 7, 13, 16]); 
  * // 22.5
  */
  self.variance_ = function(x) {
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
	var S = sumSquareDiff - ((sumDiff * sumDiff) / nn);
	
	// Return the corrected variance
    return S/nn;
  }


/**
  * @function sampleVariance_
  *
  * @description Compute the (sample) variance of the values of a numeric array, using a corrected two-pass formula (c.f. the variance_ function)
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the variance of the values of the input array.
  *
  * @example
  * sampleVariance_([4, 7, 13, 16]); 
  * // 30
  */
  self.sampleVariance_ = function(x) {
    // Input checks are delegated
    var v = self.variance_(x);
	
    //
	var nn = x.length;
	return v * nn/(nn - 1);
  }

  
  /**
  * @function stddev_
  *
  * @description Compute the (population) standard deviation of the values of a numeric array, using a corrected two-pass formula (c.f. the variance_ function)
  *
  * @see <a href="https://en.wikipedia.org/wiki/Standard_deviation">https://en.wikipedia.org/wiki/Standard_deviation</a>
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the standard deviation of the values of the input array.
  *
  * @example
  * stddev_([1, 2, 3, 4]); 
  * // ~1.12
  */
  self.stddev_ = function(x) {
    // Input checks are delegated

    // 
	return Math.sqrt(self.variance_(x));
  }
  
  
  /**
  * @function sampleStddev_
  *
  * @description Compute the (sample) standard deviation of the values of a numeric array, using a corrected two-pass formula (c.f. the variance_ function)
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the standard deviation of the values of the input array.
  *
  * @example
  * sampleStddev_([1, 2, 3, 4]); 
  * // ~1.29
  */
  self.sampleStddev_ = function(x) {
    // Input checks are delegated

    //
	return Math.sqrt(self.sampleVariance_(x));
  }

  
 /**
  * @function skewness_
  *
  * @description Compute the (population) skewness of the values of a numeric array, using a corrected two-pass formula.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Skewness">https://en.wikipedia.org/wiki/Skewness</a>
  * 
  * @see <a href="http://link.springer.com/article/10.1007/s00180-015-0637-z">Pébay, P., Terriberry, T.B., Kolla, H. et al (2016) Numerically stable, scalable formulas for parallel and online computation of higher-order multivariate central moments with arbitrary weights. Comput Stat (2016) 31: 1305.</a>
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the skewness of the values of the input array.
  *
  * @example
  * skewness_([4, 7, 13, 16]); 
  * // 0
  */
  self.skewness_ = function(x) {
    // Input checks
    self.assertNumberArray_(x);
	
	// In case the input array is made of less than two elements, the skewness is not defined
	if (x.length <= 2) {
	  return NaN;
	}
	
	// Initialisations
    var nn = x.length;
	
    // Compute the mean of the input numeric array (first pass)
	var meanX = self.mean_(x);
	
	// By definition, the skewness is equals to E[((X-m)/sigma)^3], 
	// which can be expanded as 1/sigma^3 * ( E[X^3] - 2*E[X]*E[X^2] + 2*E[X]^3 )
	//
	// Then, as central moments are invariants when data is translated by a constant
	// (c.f. formula 3.40 of the reference and explanations thereby), X can be replaced
	// by X - meanX computed above.
	
	// Compute the cubed deviations plus the correction factors (second pass)
	var sumCubeDiff = 0.0;
	var sumSquareDiff = 0.0;
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
	  var diff = (x[i] - meanX);
	  var squareDiff = diff * diff;
	  sumCubeDiff += diff * squareDiff;
	  sumSquareDiff += squareDiff;
	  sumDiff += diff;
	}
	
	// Compute the corrected sum of cubes of the deviations from the mean
	var sumDiff_sumDiff = sumDiff * sumDiff;
	var S = sumCubeDiff - (2 * sumDiff * sumSquareDiff / nn) + (2 * sumDiff_sumDiff * sumDiff / (nn * nn));
	
	// Note: To avoid calling the computation of the variance and redo two passes on the data, 
	// compute the corrected variance here (c.f. the variance_ function)
	var correctedVariance = (sumSquareDiff - (sumDiff_sumDiff / nn)) / nn;
	
	// Return the corrected skewness
	if (correctedVariance == 0.0) {
	  return NaN;
	}
	else {
      return S/(nn * Math.sqrt(correctedVariance) * correctedVariance);
	}
  }
  

 /**
  * @function sampleSkewness_
  *
  * @description Compute the (sample) skewness of the values of a numeric array, using a corrected two-pass formula (c.f. skewness_ function).
  *
  * @see <a href="www.jstor.org/stable/2988433">D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189</a>
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the skewness of the values of the input array.
  *
  * @example
  * sampleSkewness_([4, 7, 13, 16]); 
  * // 0
  */
  self.sampleSkewness_ = function(x) {
    // Input checks are delegated
    var s = self.skewness_(x);
	
    // Compute the G1 coefficient from the reference
	var nn = x.length;
	return s * Math.sqrt(nn * (nn - 1))/(nn - 2);	
  }
  
  
 /**
  * @function kurtosis_
  *
  * @description Compute the (population, non excess) kurtosis of the values of a numeric array, using a corrected two-pass formula.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Kurtosis">https://en.wikipedia.org/wiki/Kurtosis</a>
  * 
  * @see <a href="http://link.springer.com/article/10.1007/s00180-015-0637-z">Pébay, P., Terriberry, T.B., Kolla, H. et al (2016) Numerically stable, scalable formulas for parallel and online computation of higher-order multivariate central moments with arbitrary weights. Comput Stat (2016) 31: 1305.</a>
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the skewness of the values of the input array.
  *
  * @example
  * kurtosis_([4, 7, 13, 16]); 
  * // 1.36
  */
  self.kurtosis_ = function(x) {
    // Input checks
    self.assertNumberArray_(x);
	
	// In case the input array is made of less than three elements, the skewness is not defined
	if (x.length <= 3) {
	  return NaN;
	}
	
	// Initialisations
    var nn = x.length;
	
    // Compute the mean of the input numeric array (first pass)
	var meanX = self.mean_(x);
	
	// By definition, the kurtosis is equals to E[((X-m)/sigma)^4], 
	// which can be expanded as 1/sigma^4 * ( E[X^4] - 4*E[X]*E[X^3] + 6*E[X]^2*E[X^2] - 3*E[X]^4 )
	//
	// Then, as central moments are invariants when data is translated by a constant
	// (c.f. formula 3.40 of the reference and explanations thereby), X can be replaced
	// by X - meanX computed above.
	
	// Compute the bi-squarred deviations plus the correction factors (second pass)
	var sumBiSquareDiff = 0.0;
	var sumCubeDiff = 0.0;
	var sumSquareDiff = 0.0;
	var sumDiff = 0.0;
	for (var i=0; i<nn; ++i) {
	  var diff = (x[i] - meanX);
	  var squareDiff = diff * diff;
	  sumBiSquareDiff += squareDiff * squareDiff;
	  sumCubeDiff += diff * squareDiff;
	  sumSquareDiff += squareDiff;
	  sumDiff += diff;
	}
	
	// Compute the corrected sum of bi-squarres of the deviations from the mean
	var nn_nn = nn * nn;
	var sumDiff_sumDiff = sumDiff * sumDiff;
	var S = sumBiSquareDiff - (4 * sumDiff * sumCubeDiff / nn) + (6 * sumDiff_sumDiff * sumSquareDiff / nn_nn)  - (3 * sumDiff_sumDiff * sumDiff_sumDiff / (nn_nn * nn));
	
	// Note: To avoid calling the computation of the variance and redo two passes on the data, 
	// compute the corrected variance here (c.f. the variance_ function)
	var correctedVariance = (sumSquareDiff - (sumDiff_sumDiff / nn)) / nn;
	
	// Return the corrected kurtosis
	if (correctedVariance == 0.0) {
	  return NaN;
	}
	else {
      return S/(nn * correctedVariance * correctedVariance);
	}
  }
  
  
 /**
  * @function sampleKurtosis_
  *
  * @description Compute the (sample, non excess) kurtosis of the values of a numeric array, using a corrected two-pass formula (c.f. kurtosis_ function).
  *
  * @see <a href="www.jstor.org/stable/2988433">D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189</a>
  *
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the kurtosis of the values of the input array.
  *
  * @example
  * sampleKurtosis_([4, 7, 13, 16]); 
  * // ~-0.30
  */
  self.sampleKurtosis_ = function(x) {
    // Input checks are delegated
    var k = self.kurtosis_(x);
	
    // Compute the G2 coefficient from the reference, and add 3 as the excess kurtosis is not computed here
	var nn = x.length;
	return (nn - 1)/((nn - 2) * (nn - 3)) * ((nn + 1) * k - 3* (nn - 1)) + 3
  }
  
  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
