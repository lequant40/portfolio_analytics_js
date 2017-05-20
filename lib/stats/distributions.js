/**
 * @file Functions related to distributions computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  
/* End Not to be used as is in Google Sheets */  
  
  /**
  * @function norminv_
  *
  * @summary Compute the inverse of the standard normal cumulative distribution function.
  *
  * @description This function returns an approximation of the inverse standard normal cumulative distribution function, i.e.
  * given p in [0,1] it returns an approximation to the x value satisfying p = Pr{Z <= x} where Z is a
  * random variable following a standard normal distribution law.
  *
  * x is also called a z-score.
  *
  * The algorithm uses the fact that if F^-1(p) is the inverse normal cumulative distribution function, then G^-1(p) = F^-1(p+1/2) is an odd function.
  * The algorithm uses two separate rational minimax approximations: one rational approximation is used for the central region and another one is used for the tails.
  * The algorithm has a relative error whose absolute value is less than 1.15e-9, but if needed, the approximation of the inverse normal cumulative distribution function can be refined better precision using Halley's method.
  *
  * @author Peter John Acklam <jacklam@math.uio.no>
  *
  * @see <a href="http://home.online.no/%7Epjacklam/notes/invnorm">http://home.online.no/%7Epjacklam/notes/invnorm</a>
  * @see <a href="https://web.archive.org/web/20151030215612/http://home.online.no/%7Epjacklam/notes/invnorm/">https://web.archive.org/web/20151030215612/http://home.online.no/%7Epjacklam/notes/invnorm/</a>
  * 
  * @param {number} p a probability value, real number belonging to interval [0,1].
  * @param {boolean} extendedPrecision an optional boolean either false for a standard approximation (default) or true for a refined approximation.
  * @return {number} an approximation to the x value satisfying p = Pr{Z <= x} where Z is a random variable following a standard normal distribution law.
  *
  * @example
  * norminv_(0.5);
  * // 0
  */
  self.norminv_ = function(p, extendedPrecision) {
    // By default, standard precision is required
	if (extendedPrecision === undefined) {
	  extendedPrecision = false;
	}
	
	// Coefficients in rational approximations.
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
	var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
	var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
	var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
   
    // Define break-points.
    var p_low = 0.02425;
    var p_high = 1 - p_low;
   
    // Regions definition.
	var x = NaN;
	if (p == 0.0) {
	  x = Number.NEGATIVE_INFINITY;
	}
	else if (p == 1.0) {
	  x = Number.POSITIVE_INFINITY;
	}
	else if (p < p_low) {
	  // Rational approximation for lower region.
	  var q = Math.sqrt(-2*Math.log(p));
	  x =  (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
		     ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
    }
	else if (p > p_high) {
	  // Rational approximation for upper region.
	  var q  = Math.sqrt(-2*Math.log(1-p));
	  x = -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
			((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
	}
	else if (p_low <= p && p <= p_high) {
	  // Rational approximation for central region.
      var q = p - 0.5;
      var r = q*q;
	  x = (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
			(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
	}
	
	// Improve the precision, if required.
	if (extendedPrecision === true) {
      var e = 0.5 * self.erfc_(-x/1.4142135623730951) - p; // Constant is equal to sqrt(2)
      var u = e * 2.5066282746310002 * Math.exp(x*x/2); // Constant is equal to sqrt(2*pi)
      x = x - u/(1 + x*u/2);
	}
	
	// Return the computed value
	return x;
  }
  
  
  /**
  * @function normcdf_
  *
  * @summary Compute the the standard normal cumulative distribution function.
  *
  * @description This function returns an approximation of the standard normal cumulative distribution function, i.e.
  * given x a real number, it returns an approximation to p = Pr{Z <= x} where Z is a
  * random variable following a standard normal distribution law.
  *
  * This function is also called Phi in the statistical litterature.
  *
  * The algorithm uses a Taylor expansion around 0 of a well chosen function of Phi.
  * The algorithm has an absolute error of less than 8e−16.
  *
  * @author George Marsaglia
  *
  * @see <a href="https://www.jstatsoft.org/article/view/v011i04/v11i04.pdf"> G. Marsaglia. Evaluating the normal distribution. Journal of Statistical Software, 11(4):1–11, 2004.</a>
  * 
  * @param {number} x a real number.
  * @return {number} an approximation to the p value satisfying p = Pr{Z <= x} where Z is a random variable following a standard normal distribution law.
  *
  * @example
  * normcdf_(0);
  * // 0.5
  */
  self.normcdf_ = function(x) {
    // Initialisations
	var s=x;
	var t=0;
	var b=x;
	var q=x*x;
	var i=1;
    
	// The main loop corresponds to the computation of the Taylor serie of the function B around 0, c.f. page 5 of the reference.
	while (s != t) {
	  s = (t = s) + (b *= q/(i += 2));
	}
    
	// The formula linking Phi and the Taylor expansion above if Phi = 1/2 + normal density * B, c.f. page 5 of the reference.
	return 0.5 + s * Math.exp(-0.5 * q - 0.91893853320467274178)
  }
  
  
  /**
  * @function erf_
  *
  * @summary Compute the erf function.
  *
  * @description This function returns an approximation of the error function erf, defined, for x a real number, by erf(x) = 2/sqrt(pi) * Int_0^x{e^(-t^2)dt}.
  *
  * C.f. the internal function calerf_ for more details about the computations.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Error_function">https://en.wikipedia.org/wiki/Error_function</a>
  * 
  * @param {number} x a real number.
  * @return {number} an approximation to erf(x).
  *
  */
  self.erf_ = function(x) {
    return calerf_(x, 0);
  }
  
  
  /**
  * @function erfc_
  *
  * @summary Compute the erfc function.
  *
  * @description This function returns an approximation of the complementary error function erfc, defined, for x a real number, by erfc(x) = 2/sqrt(pi) * Int_x^+infinity{e^(-t^2)dt}.
  *
  * C.f. the internal function calerf_ for more details about the computations.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Error_function">https://en.wikipedia.org/wiki/Error_function</a>
  * 
  * @param {number} x a real number.
  * @return {number} an approximation to erf(x).
  *
  */
  self.erfc_ = function(x) {
    return calerf_(x, 1);
  }
  
  
  /**
  * @function calerf_
  *
  * @summary Internal function, mimicking the CALERF routine of the second reference, intended to compute erf(x) and erfc(x) functions
  * for x a real number.
  *
  * @description This internal function evaluates near-minimax approximations from the first reference.
  *
  * The algorithm uses rational functions that theoretically approximate erf(x) and erfc(x) to at least 18 significant
  * decimal digits.  The accuracy achieved depends on the arithmetic system, the compiler, the intrinsic functions, and proper
  * selection of the machine-dependent constants.
  *
  * The algorithm is supposed to have a maximal relative error of less than 6*10^-19, from the first reference.
  *
  * @author W.J. Cody
  *
  * @see <a href="http://www.ams.org/journals/mcom/1969-23-107/S0025-5718-1969-0247736-4/S0025-5718-1969-0247736-4.pdf">W.J. Cody, Rational Chebyshev Approximation for the Error Function, Mathematics of Computation 23(107):631-631, July 1969</a>
  * @see <a href="http://www.netlib.org/specfun/erf">http://www.netlib.org/specfun/erf</a>
  * 
  * @param {number} x a real number.
  * @param {number} j an integer, equals to 0 to compute erf(x) or to 1 to compute erfc(x).
  * @return {number} an approximation to erf(x) or to erfc(x).
  *
  */
  function calerf_(x, j) {
    // Machine-dependent constants
	var xinf = 1.79e308;
	var xneg = -26.628e0;
	var xsmall = 1.11e-16;
	var xbig = 26.543e0;
	var xhuge = 6.71e7;
	var xmax = 2.53e307;
	
	// Coefficients for approximation to  erf  in first interval
	var a = [3.16112374387056560e00,1.13864154151050156e02,3.77485237685302021e02,3.20937758913846947e03,1.85777706184603153e-1];
	var b = [2.36012909523441209e01,2.44024637934444173e02,1.28261652607737228e03,2.84423683343917062e03];
	
	// Coefficients for approximation to  erfc  in second interval
	var c = [5.64188496988670089e-1,8.88314979438837594e0,6.61191906371416295e01,2.98635138197400131e02,8.81952221241769090e02,1.71204761263407058e03,2.05107837782607147e03,1.23033935479799725e03,2.15311535474403846e-8];
    var d = [1.57449261107098347e01,1.17693950891312499e02,5.37181101862009858e02,1.62138957456669019e03,3.29079923573345963e03,4.36261909014324716e03,3.43936767414372164e03,1.23033935480374942e03];

	// Coefficients for approximation to  erfc  in third interval
	var p = [3.05326634961232344e-1,3.60344899949804439e-1,1.25781726111229246e-1,1.60837851487422766e-2,6.58749161529837803e-4,1.63153871373020978e-2];
    var q = [2.56852019228982242e00,1.87295284992346047e00,5.27905102951428412e-1,6.05183413124413191e-2,2.33520497626869185e-3];
	
	// ---------------
	
	// Computations are dispatched on different intervals based on |x|, c.f. the references
	var y = Math.abs(x);
	
	// Evaluate  erf  for  |X| <= 0.46875
	if (y <= 0.46875) {
	  // Initialise ysq
	  var ysq = 0.0;
	  if (y >= xsmall) {
	   ysq = y * y;
	  }

      // The original loop computing rational functions has been unrolled	  
	  // The final result is computed directly
	  var result = x * ((((a[4] * ysq + a[0]) * ysq + a[1]) * ysq + a[2]) * ysq + a[3]) / ((((ysq + b[0]) * ysq + b[1]) * ysq + b[2]) * ysq + b[3]);
	  
	  // In case erfc function is required
	  if (j === 1) {
	    result = 1.0 - result;
	  }
	  
	  // Return the computed value
	  return result;
	}

	// Evaluate  erfc  for 0.46875 <= |X| <= 4.0
	else if (y <= 4.0) {
      // The original loop computing rational functions has been unrolled	  
	  // The final result is computed directly
	  var result = ((((((((c[8] * y + c[0]) * y + c[1]) * y + c[2]) * y + c[3]) * y + c[4]) * y + c[5]) * y + c[6]) * y + c[7]) / ((((((((y + d[0]) * y + d[1]) * y + d[2]) * y + d[3]) * y + d[4]) * y + d[5]) * y + d[6]) * y + d[7]);
	  
	  // Computation tricks to improve precision for the exponential	  
	  var ysq = y * 16.0;
	  ysq = (ysq >= 0 ? Math.floor(ysq) : Math.ceil(ysq))/16.0; // Equivalent of FORTAN AINT/INT function
	  //var ysq = AINT(y*16.0)/16.0;
	  var del = (y - ysq)*(y + ysq);
	  result = Math.exp(-ysq * ysq) * Math.exp(-del) * result;
	}
	
	// Evaluate  erfc  for |X| > 4.0
	else if (y > 4.0) {
	  var result = 0.0;
	  
	  if (y < xbig) {
	    // Initialise ysq
	    var ysq = 1.0/(y * y);

        // The original loop computing rational functions has been unrolled	  
	    // The final result is computed directly
        result = ysq * (((((p[5] * ysq + p[0]) * ysq + p[1]) * ysq + p[2]) * ysq + p[3]) * ysq + p[4]) / (((((ysq + q[0]) * ysq + q[1]) * ysq + q[2]) * ysq + q[3]) * ysq + q[4]);
        result = (5.6418958354775628695e-1 - result) / y; // The constant here is equals to SQRPI in the original FORTRAN code

	    // Computation tricks to improve precision for the exponential
  	    var ysq = y * 16.0;
	    ysq = (ysq >= 0 ? Math.floor(ysq) : Math.ceil(ysq))/16.0; // Equivalent of FORTAN AINT/INT function
        var del = (y - ysq) * (y + ysq);
	    result = Math.exp(-ysq * ysq) * Math.exp(-del) * result;
	  }
    }
    
    // Fix up for negative argument, erf, etc.
	// erf computation
    if (j === 0) {
        // Using relation erf(x) = 1 - erfc(x), with a computation trick to improve precision
        result = (0.5 - result) + 0.5;
        
        // Using relation erf(-x) = -erf(x)
        if (x <= 0.0) {
            result = -result;
        }
    }
	// erfc computation
    else if (j === 1) {
        // Using relation erfc(-x) = 2-erfc(x)
        if (x <= 0.0) {
            result = 2.0 - result;
        }
    }
    
    // Return the computed result
    return result;
  }
  
  
/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
