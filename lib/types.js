/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */

var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.assertArray_ = function(iArray) { return assertArray_(iArray); }
  self.assertPositiveNumber_ = function(iNumber) { return assertPositiveNumber_(iNumber); }
  self.assertPositiveInteger_ = function(iNumber) { return assertPositiveInteger_(iNumber); } 
  /* End Wrapper public methods */
  
/* End Not to be used as is in Google Sheets */  
  
	/**
	* @function assertArray_
	*
	* @description Throws an error if the input parameter is not an array.
	* 
	* @param {iArray} iArray input parameter.
	*
	* @example
	* assertArray_([]); 
	* //
	*
	* @example
	* assertArray_(1); 
	* // Error("input must be an array")
	*/
	function assertArray_(iArray) {
	  if (!arguments.length || !Array.isArray(iArray)) {
		throw new Error("input must be an array");
	  }
	}
	 

	/**
	* @function assertPositiveNumber_
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {iNumber} iNumber input parameter.
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
	function assertPositiveNumber_(iNumber) {
	  if (!arguments.length || 
	      !(typeof iNumber === 'number') || 
		  isNaN(iNumber) || 
		  iNumber === Infinity ||
          iNumber === -Infinity ||
		  iNumber < 0.0 ) {
		throw new Error("input must be a positive number");
	  }
	}


	/**
	* @function assertPositiveInteger_
	*
	* @description Throws an error if the input parameter is not a positive integer.
	* 
	* @param {iNumber} iNumber input parameter.
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
	function assertPositiveInteger_(iNumber) {
	  // A positive integer is a positive number...
	  try {
		assertPositiveNumber_(iNumber);
	  }
	  catch (e) {
		throw new Error("input must be a positive integer");
	  }

	  // ... as well as an integer
	  if (Math.floor(iNumber) !== iNumber) {
		throw new Error("input must be a positive integer");
	  }
	}

/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
