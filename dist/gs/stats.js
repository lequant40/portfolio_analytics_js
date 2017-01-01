/**
 * @file Functions related to statistics computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
  /**
  * @function hpm_
  *
  * @descrption Compute the higher partial moment of the values of a numeric array.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {number} n the order of the higher partial moment.
  * @param {number} t the threshold of the higher partial moment.
  * @return {number} the higher partial moment of order n at threshold t of the values of the input array.
  *
  * @example
  * hpm_([0.1,-0.2,0.3], 2, 0.0); 
  * // X
  */
  function hpm_(x, n, t) {
    // Input checks
    assertNumberArray_(x);
	assertPositiveInteger_(n);
	
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
      return dtemp;
    }
    
	//
    for (var i=m; i<nn; i+=4) {
      dtemp += ((Math.pow(Math.max(0, x[i]-t), n) + Math.pow(Math.max(0, x[i+1]-t), n)) + (Math.pow(Math.max(0, x[i+2]-t), n) + Math.pow(Math.max(0, x[i+3]-t), n)));
    }
	
	//
    return dtemp/n;
  }


  /**
  * @function lpm_
  *
  * @descrption Compute the lower partial moment of the values of a numeric array.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Moment_(mathematics)">https://en.wikipedia.org/wiki/Moment_(mathematics)</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {number} n the order of the lower partial moment.
  * @param {number} t the threshold of the lower partial moment.
  * @return {number} the lower partial moment of order n at threshold t of the values of the input array.
  *
  * @example
  * lpm_([0.1,-0.2,0.3], 2, 0.0); 
  * // X
  */
  function lpm_(x, n, t) {
    // Input checks
    assertNumberArray_(x);
	assertPositiveInteger_(n);
	
    // Initialisations
    nn = x.length;
    dtemp = 0.0;

	//
    m = nn % 4;
    if (m != 0) {
      for (var i=0; i<m; i++) {
		dtemp += Math.pow(Math.max(0, t-x[i]), n);
      }
    }
    
	//
	if (nn < 4) {
      return dtemp;
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
  * @descrption Compute the mean of the values of a numeric array.
  *
  * @see <a href="https://en.wikipedia.org/wiki/Mean">https://en.wikipedia.org/wiki/Mean</a>
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
    nn = x.length;

	//
    return sum_(x)/nn;
  }


  /**
  * @function percentile
  *
  * @descrption Compute the percentile value of a numeric array using the linear interpolation between closest tanks method with C = 1.
  *
  * @see <a href="https://en.wikpedia.org/wiki/Percentile">https://en.wikpedia.org/wiki/Percentile</a>
  * 
  * @param {Array.<number>} x the input numeric array.
  * @param {number} p the p-th percentile of the input array to be computed, belonging to interval [0,1].
  * @return {number} the p-th percentile value of the input array.
  *
  * @example
  * percentile([1,2,3,4], 0.75); 
  * // 3.25
  */
  function percentile(x, p) {
    // Input checks
    assertNumberArray_(x);
	if (p === undefined) {
	  p = -1;
	}
	assertBoundedNumber_(p, 0, 1);
	
    // Pre-process for the special case p=1 percentile value
	if (p == 1.0) {
	  return x[x.length-1];
	}
	
	// Otherwise, sort a copy of the array
	var sortedArray = x.slice().sort(function (a, b) { return a - b; });
	
	// Then compute the index of the p-th percentile
	var idx = p*(sortedArray.length - 1);
	
	// Then compute and return the value of the p-th percentile
	var lowerIdx = Math.floor(idx);
	var upperIdx = lowerIdx + 1;
	return sortedArray[lowerIdx] + (idx % 1) * (sortedArray[upperIdx] - sortedArray[lowerIdx]);
  }
  

