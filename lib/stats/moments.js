/**
 * @file Functions related to moments computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Wrapper private methods - Unit tests usage only */
self.hpm_ = function(x, n, t) { return hpm_(x, n, t); }
self.lpm_ = function(x, n, t) { return lpm_(x, n, t); }
self.mean_ = function(x) { return mean_(x); }
self.variance_ = function(x) { return variance_(x); }
self.stddev_ = function(x) { return stddev_(x); }
self.sampleStddev_ = function(x) { return sampleStddev_(x); }
self.sampleVariance_ = function(x) { return sampleVariance_(x); }
self.skewness_ = function(x) { return skewness_(x); }
self.sampleSkewness_ = function(x) { return sampleSkewness_(x); }
self.kurtosis_ = function(x) { return kurtosis_(x); }
self.sampleKurtosis_ = function(x) { return sampleKurtosis_(x); }
self.sampleMoments_ = function(x) { return sampleMoments_(x); }
/* End Wrapper private methods - Unit tests usage only */
 
 
/**
* @function hpm_
*
* @summary Compute the higher partial moment of a serie of values.
*
* @description This function returns the n-th order higher partial moment of a serie of values [x_1,...,x_p] with respect to a threshold t, 
* which is defined as the arithmetic mean of the p values max(0, x_1-t)^n,...,max(0, x_p-t)^n.
*  
* @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
* 
* @param {Array.<number>} x an array of real numbers.
* @param {number} n the order of the higher partial moment, a positive integer.
* @param {number} t the threshold of the higher partial moment, a real number
* @return {number} the n-th order higher partial moment of the values of the array x with respect to the threshold t.
*
* @example
* hpm_([0.1,-0.2,-0.3], 2, 0.0); 
* // 0.0167
*/
function hpm_(x, n, t) {
	// Code below is adapted from a mean computation, c.f. mean_ function
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
* @summary Compute the lower partial moment of a serie of values.
*
* @description This function returns the n-th order lower partial moment of a serie of values [x_1,...,x_p] with respect to a threshold t, 
* which is defined as the arithmetic mean of the p values max(0, t-x_1)^n,...,max(0, t-x_p)^n.
*  
* @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
* 
* @param {Array.<number>} x an array of real numbers.
* @param {number} n the order of the lower partial moment, a positive integer.
* @param {number} t the threshold of the lower partial moment, a real number.
* @return {number} the n-th order lower partial moment of the values of the array x with respect to the threshold t.
*
* @example
* lpm_([0.1,0.2,-0.3], 2, 0.0); 
* // 0.03
*/
function lpm_(x, n, t) {
	// Code below is adapted from a mean computation, c.f. mean_ function
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
* @summary Compute the arithmetic mean of a serie of values.
*
* @description This function returns the arithmetic mean of a serie of values [x_1,...,x_p], 
* which is defined as the sum of the p values x_1,...,x_p, divided by p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the reference.
*
* @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
* 
* @param {Array.<number>} x an array of real numbers.
* @return {number} the arithmetic mean of the values of the array x.
*
* @example
* mean_([2,4]); 
* // 3
*/
function mean_(x) {
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
* @summary Compute the variance of a serie of values.
*
* @description This function returns the variance of a serie of values [x_1,...,x_p], 
* which is defined as the arithmetic mean of the p values (x_1-m)^2,...,(x_p-m)^2, where m is the arithmetic mean
* of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the reference.
*
* @see <a href="http://dl.acm.org/citation.cfm?doid=365719.365958">Peter M. Neely (1966) Comparison of several algorithms for computation of means, standard deviations and correlation coefficients. Commun ACM 9(7):496–499.</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the variance of the values of the array x.
*
* @example
* variance_([4, 7, 13, 16]); 
* // 22.5
*/
function variance_(x) {
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
	var S = sumSquareDiff - ((sumDiff * sumDiff) / nn);

	// Return the corrected variance
	return S/nn;
}


/**
* @function sampleVariance_
*
* @summary Compute the sample variance of a serie of values.
*
* @description This function returns the sample variance of a serie of values [x_1,...,x_p], 
* which is defined as the variance of the p values x_1,...,x_p multiplied by p/(p-1).
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function variance_.
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the variance of the values of the array x.
*
* @example
* sampleVariance_([4, 7, 13, 16]); 
* // 30
*/
function sampleVariance_(x) {
	var nn = x.length;
	return variance_(x) * nn/(nn - 1);
}


/**
* @function stddev_
*
* @description Compute the standard deviation of a serie of values.
*
* @description This function returns the standard deviation of a serie of values [x_1,...,x_p], 
* which is defined as the square root of the variance of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function variance_.
*
* @see <a href="https://en.wikipedia.org/wiki/Standard_deviation">https://en.wikipedia.org/wiki/Standard_deviation</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the standard deviation of the values of the array x.
*
* @example
* stddev_([1, 2, 3, 4]); 
* // ~1.12
*/
function stddev_(x) {
	return Math.sqrt(variance_(x));
}


/**
* @function sampleStddev_
*
* @description Compute the sample standard deviation of a serie of values.
*
* @description This function returns the sample standard deviation of a serie of values [x_1,...,x_p], 
* which is defined as the square root of the sample variance of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function sampleVariance_.
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the standard deviation of the values of the array x.
*
* @example
* sampleStddev_([1, 2, 3, 4]); 
* // ~1.29
*/
function sampleStddev_(x) {
	return Math.sqrt(sampleVariance_(x));
}


/**
* @function skewness_
*
* @summary Compute the skewness of a serie of values.
*
* @description This function returns the skewness of a serie of values [x_1,...,x_p], 
* which is defined as the arithmetic mean of the p values (x_1-m)^3,...,(x_p-m)^3 divided by sigma^3, where m is the arithmetic mean
* of the p values x_1,...,x_p and sigma the standard deviation of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the second reference.
*
* @see <a href="https://en.wikipedia.org/wiki/Skewness">https://en.wikipedia.org/wiki/Skewness</a>
* @see <a href="http://link.springer.com/article/10.1007/s00180-015-0637-z">Pébay, P., Terriberry, T.B., Kolla, H. et al (2016) Numerically stable, scalable formulas for parallel and online computation of higher-order multivariate central moments with arbitrary weights. Comput Stat (2016) 31: 1305.</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the skewness of the values of the array x.
*
* @example
* skewness_([4, 7, 13, 16]); 
* // 0
*/
function skewness_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

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
	return S/(nn * Math.sqrt(correctedVariance) * correctedVariance);
}


/**
* @function sampleSkewness_
*
* @summary Compute the sample skewness of a serie of values.
*
* @description This function returns the sample skewness of a serie of values [x_1,...,x_p], 
* which is defined as the skewness of the p values x_1,...,x_p multiplied by a factor dependant on p, c.f. the reference.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function skewness_.
*
* @see <a href="www.jstor.org/stable/2988433">D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the skewness of the values of the array x.
*
* @example
* sampleSkewness_([4, 7, 13, 16]); 
* // 0
*/
function sampleSkewness_(x) {
	var nn = x.length;

	// Compute the G1 coefficient from the reference
	return skewness_(x) * Math.sqrt(nn * (nn - 1))/(nn - 2);
}


/**
* @function kurtosis_
*
* @summary Compute the kurtosis of a serie of values.
*
* @description This function returns the kurtosis of a serie of values [x_1,...,x_p], 
* which is defined as the arithmetic mean of the p values (x_1-m)^4,...,(x_p-m)^4 divided by sigma^4, where m is the arithmetic mean
* of the p values x_1,...,x_p and sigma the standard deviation of the p values x_1,...,x_p.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the second reference.
*
* @see <a href="https://en.wikipedia.org/wiki/Kurtosis">https://en.wikipedia.org/wiki/Kurtosis</a>
* 
* @see <a href="http://link.springer.com/article/10.1007/s00180-015-0637-z">Pébay, P., Terriberry, T.B., Kolla, H. et al (2016) Numerically stable, scalable formulas for parallel and online computation of higher-order multivariate central moments with arbitrary weights. Comput Stat (2016) 31: 1305.</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the skewness of the values of the array x.
*
* @example
* kurtosis_([4, 7, 13, 16]); 
* // 1.36
*/
function kurtosis_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

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
	return S/(nn * correctedVariance * correctedVariance);
}


/**
* @function sampleKurtosis_
*
* @summary Compute the sample kurtosis of a serie of values.
*
* @description This function returns the sample kurtosis of a serie of values [x_1,...,x_p], 
* which is defined as the kurtosis of the p values x_1,...,x_p multiplied by a factor dependant on p, c.f. the reference.
*
* The algorithm implemented uses a two pass formula in order to reduce the computation error, c.f. the function kurtosis_.
*
* @see <a href="www.jstor.org/stable/2988433">D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189</a>
*
* @param {Array.<number>} x an array of real numbers.
* @return {number} the kurtosis of the values of the array x.
*
* @example
* sampleKurtosis_([4, 7, 13, 16]); 
* // ~-0.30
*/
function sampleKurtosis_(x) {
	var nn = x.length;

	// Compute the G2 coefficient from the reference, and add 3 as the excess kurtosis is not computed here
	return (nn - 1)/((nn - 2) * (nn - 3)) * ((nn + 1) * kurtosis_(x) - 3* (nn - 1)) + 3;
}


/**
* @function sampleMoments_
*
* @summary Compute the arithmetic mean, the sample variance, the sample standard deviation,
* the sample skewness and the sample kurtosis of a serie of values.
*
* @description This function returns the arithmetic mean, the sample variance, 
* the sample standard deviation, the sample skewness and the sample kurtosis of a serie of values [x_1,...,x_p], 
* acting as a performances-oriented wrapper aroung the functions mean_, sampleVariance_, 
* sampleStddev_, sampleKurtosis_, sampleSkewness_.
*
* C.f. the mentionned functions for computation details.
*
* @param {Array.<number>} x an array of real numbers.
* @return {Array.<number>} the arithmetic mean, the sample variance, the sample standard deviation,
* the sample skewness and the sample kurtosis of the values of the array x, in this order.
*
* @example
* sampleMoments_([4, 7, 13, 16]); 
* // [10, 30, ~5.477, 0, ~-0.30]
*/
function sampleMoments_(x) {
	// Initialisations
	var nn = x.length;

	// Compute the mean of the input numeric array (first pass)
	var meanX = mean_(x);

	// Code below is copy pasted from kurtosis computation, for performances reasons
	// Compute all the deviations necessary to compute the variance, skewness and kurtosis (second pass)
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

	// Compute the corrected sum of squares of the deviations from the mean
	// Compute the corrected sum of bi-squarres of the deviations from the mean
	// Compute the corrected sum of cubes of the deviations from the mean
	var sumDiff_sumDiff = sumDiff * sumDiff;
	var nn_nn = nn * nn;
	var S2 = sumSquareDiff - ((sumDiff * sumDiff) / nn);
	var S3 = sumCubeDiff - (2 * sumDiff * sumSquareDiff / nn) + (2 * sumDiff_sumDiff * sumDiff / (nn * nn));
	var S4 = sumBiSquareDiff - (4 * sumDiff * sumCubeDiff / nn) + (6 * sumDiff_sumDiff * sumSquareDiff / nn_nn)  - (3 * sumDiff_sumDiff * sumDiff_sumDiff / (nn_nn * nn));

	// Compute the sample variance, the sample standard deviation, 
	// the sample skewness, the sample kurtosis
	var sampleVarX = NaN;
	var sampleStddevX = NaN;
	var sampleSkewX = NaN;
	var sampleKurtX = NaN;

	// Sample variance
	var correctedVariance = S2 / nn;
	var sampleVarX = correctedVariance * nn/(nn - 1); // Not S2/(nn - 1) to make sure computation matches with sampleVariance_ function
	var sampleStddevX = Math.sqrt(sampleVarX);

	// Sample skewness
	var skewX = S3/(nn * Math.sqrt(correctedVariance) * correctedVariance);
	var sampleSkewX = skewX * Math.sqrt(nn * (nn - 1))/(nn - 2);

	// Sample kurtosis
	var kurtX = S4/(nn * correctedVariance * correctedVariance);
	var sampleKurtX =  (nn - 1)/((nn - 2) * (nn - 3)) * ((nn + 1) * kurtX - 3* (nn - 1)) + 3;

	// Return the computed values
	return [meanX, sampleVarX, sampleStddevX, sampleSkewX, sampleKurtX];
}
