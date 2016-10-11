/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Spreadsheet */

var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {
  /* Start Wrapper public methods */
  self.assertArray = function(iArray) { return assertArray(iArray); }
  self.assertPositiveNumber = function(iNumber) { return assertPositiveNumber(iNumber); }
  self.assertPositiveInteger = function(iNumber) { return assertPositiveInteger(iNumber); } 
  /* End Wrapper public methods */
    
/* End Not to be used as is in Google Spreadsheet */  
  
	/**
	* @function assertArray
	*
	* @description Throws an error if the input parameter is not an array.
	* 
	* @param {iArray} iArray input parameter.
	*
	* @example
	* assertArray([]); 
	* //
	*
	* @example
	* assertArray(1); 
	* // Error("input must be an array")
	*/
	function assertArray(iArray) {
	  if (!arguments.length || !Array.isArray(iArray)) {
		throw new Error("input must be an array");
	  }
	}
	 

	/**
	* @function assertPositiveNumber
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {iNumber} iNumber input parameter.
	*
	* @example
	* assertPositiveNumber(-2.3); 
	* // Error("input must be a positive number")
	*
	* @example
	* assertPositiveNumber(1);
	*
	* @example
	* assertPositiveNumber(NaN);
	* // Error("input must be a positive number")
	*/
	function assertPositiveNumber(iNumber) {
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
	* @function assertPositiveInteger
	*
	* @description Throws an error if the input parameter is not a positive integer.
	* 
	* @param {iNumber} iNumber input parameter.
	*
	* @example
	* assertPositiveInteger(-2.3); 
	* // Error("input must be a positive integer")
	*
	* @example
	* assertPositiveInteger(1);
	*
	* @example
	* assertPositiveInteger(NaN);
	* // Error("input must be a positive integer")
	*/
	function assertPositiveInteger(iNumber) {
	  // A positive integer is a positive number...
	  try {
		assertPositiveNumber(iNumber);
	  }
	  catch (e) {
		throw new Error("input must be a positive integer");
	  }

	  // ... as well as an integer
	  if (Math.floor(iNumber) !== iNumber) {
		throw new Error("input must be a positive integer");
	  }
	}

/* Start Not to be used as is in Google Spreadsheet */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Spreadsheet */
