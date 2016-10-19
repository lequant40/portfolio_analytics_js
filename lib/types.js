/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */

var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.assertArray_ = function(iX) { return assertArray_(iX); }
  self.assertPositiveNumber_ = function(iX) { return assertPositiveNumber_(iX); }
  self.assertPositiveInteger_ = function(iX) { return assertPositiveInteger_(iX); } 
  /* End Wrapper public methods */
  
/* End Not to be used as is in Google Sheets */  
  
	/**
	* @function assertArray_
	*
	* @description Throws an error if the input parameter is not an array 
	* (or a typed array).
	* 
	* @param {Array.<Object>} iX input parameter.
	*
	* @example
	* assertArray_([]); 
	* //
	*
	* @example
	* assertArray_(1); 
	* // Error("input must be an array")
	*/
	function assertArray_(iX) {
	  if (Object.prototype.toString.call(iX).indexOf("Array") == -1) {
		throw new Error("input must be an array");
	  }
	}
	 

	/**
	* @function assertPositiveNumber_
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {number} iNumber input parameter.
	*
	* @example
	* assertPositiveNumber_(-2.3); 
	* // Error("input must be a positive number")
	*
	* @example
	* assertPositiveNumber_(1);
	*
	* @example
	* assertPositiveNumber_(NaN);
	* // Error("input must be a positive number")
	*/
	function assertPositiveNumber_(iX) {
	  if (Object.prototype.toString.call(iX)!= "[object Number]" || 
		  isNaN(iX) || 
		  iX === Infinity ||
          iX === -Infinity ||
		  iX < 0.0 ) {
		throw new Error("input must be a positive number");
	  }
	}


	/**
	* @function assertPositiveInteger_
	*
	* @description Throws an error if the input parameter is not a positive integer.
	* 
	* @param {number} iX input parameter.
	*
	* @example
	* assertPositiveInteger_(-2.3); 
	* // Error("input must be a positive integer")
	*
	* @example
	* assertPositiveInteger_(1);
	*
	* @example
	* assertPositiveInteger_(NaN);
	* // Error("input must be a positive integer")
	*/
	function assertPositiveInteger_(iX) {
	  // A positive integer is a positive number...
	  try {
		assertPositiveNumber_(iX);
	  }
	  catch (e) {
		throw new Error("input must be a positive integer");
	  }

	  // ... as well as an integer
	  if (Math.floor(iX) !== iX) {
		throw new Error("input must be a positive integer");
	  }
	}

/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
