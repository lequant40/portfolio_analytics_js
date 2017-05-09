/**
 * @file Functions related to basic linear algebra computations.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
  /**
  * @function sum_
  *
  * @description Compute the sum of the values of a numeric array using a LAPACK like algorithm.
  *
  * @see <a href="http://www.netlib.org/lapack/explore-html/de/da4/group__double__blas__level1.html">LAPACK</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @return {number} the sum of the values of the input array.
  *
  * @example
  * sum_([1,2,3,4]); 
  * // 10
  */
  function sum_(x) {
    // Input checks
    assertNumberArray_(x);
	
    // Initialisations
    var nn = x.length;
    var dtemp = 0.0;

	//
    var m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
        dtemp += x[i];
      }
    }
	
	//
	if (nn < 4) {
      return dtemp;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((x[i] + x[i+1]) + (x[i+2] + x[i+3]));
    }
	
	//
    return dtemp;
  }
  
  
  /**
  * @function dot_
  *
  * @description Compute the dot product of two numeric arrays using a LAPACK like algorithm.
  *
  * @see <a href="http://www.netlib.org/lapack/explore-html/de/da4/group__double__blas__level1.html">LAPACK</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {Array.<number>} y the input numeric array.
  * @return {number} the dot product of the two input arrays.
  *
  * @example
  * dot_([1,2,3,4], [1,1,1,1]); 
  * // 10
  */
  function dot_ (x,y) {
    // Input checks
    assertNumberArray_(x);
	assertNumberArray_(y);
	if (x.length != y.length) {
	  throw new Error("input arrays must have the same length");
	}
	
    // Initialisations
    var nn = x.length;
    var dtemp = 0.0;

	//
    var m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
        dtemp += x[i]*y[i];
      }
    }
    
	//
	if (nn < 4) {
      return dtemp;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((x[i]*y[i] + x[i+1]*y[i+1]) + (x[i+2]*y[i+2] + x[i+3]*y[i+3]));
    }
	
	//
    return dtemp;
  }
  

