/**
 * @file Functions related to statistics computation.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */
 
var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.percentile = function(x, p) { return percentile(x, p); }
  /* End Wrapper public methods */

  
/* End Not to be used as is in Google Sheets */  
  
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
    self.assertNumberArray_(x);
	if (p === undefined) {
	  p = -1;
	}
	self.assertBoundedNumber_(p, 0, 1);
	
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
  

/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
