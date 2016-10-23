/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

  
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
	* @function assertNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number.
	* 
	* @param {number} iX input parameter.
	*
	* @example
	* assertNumber_('1'); 
	* // Error("input must be a number")
	*
	* @example
	* assertNumber_(1);
	*
	* @example
	* assertNumber_(NaN);
	* // Error("input must be a number")
	*/
	function assertNumber_(iX) {
	  if (Object.prototype.toString.call(iX)!= "[object Number]" || 
		  isNaN(iX) || 
		  iX === Infinity ||
          iX === -Infinity){
		throw new Error("input must be a number");
	  }
	}
	
	
	 /**
	* @function assertPositiveNumber_
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {number} iX input parameter.
	*
	* @example
	* assertPositiveNumber_(-2.3); 
	* // Error("input must be a positive number")
	*
	* @example
	* assertPositiveNumber_(1.1);
	*
	* @example
	* assertPositiveNumber_(NaN);
	* // Error("input must be a positive number")
	*/
	function assertPositiveNumber_(iX) {
	  // A positive number is a number...
	  try {
		assertNumber_(iX);
	  }
	  catch (e) {
		throw new Error("input must be a positive number");
	  }
	  
	  // ... as well as positive
	  if (iX < 0.0 ) {
	    throw new Error("input must be a positive number");
	  }
	}


	/**
	* @function assertBoundedNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number
	* greater than a (finite)lower bound and lower than a (finite) upper bound.
	* 
	* @param {number} iX input parameter.
	* @param {number} iLowerBound the lower bound.
	* @param {number} iUpperBound the upper bound.
	*
	* @example
	* assertBoundedNumber_(2, 0, 1); 
	* // Error("input must be bounded")
	*
	* @example
	* assertBoundedNumber_(1, 1, 1);
	*
	* @example
	* assertBoundedNumber_(NaN, 0, 1);
	* // Error("input(s) must be a number")
	*/
	function assertBoundedNumber_(iX, iLowerBound, iUpperBound) {
	  // The bounds and the input must be numbers...
	  try {
        assertNumber_(iX);
	    assertNumber_(iLowerBound);
		assertNumber_(iUpperBound);
	  }
	  catch (e) {
		throw new Error("input(s) must be a number");
	  }
	  
	  // The input parameter must be between the input bounds
	  if (iX < iLowerBound || iX > iUpperBound) {
	    throw new Error("input must be bounded between " + iLowerBound + " and " + iUpperBound);
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

