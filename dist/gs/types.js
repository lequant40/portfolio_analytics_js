/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
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

