/**
 * @file Functions related to types.
 * @author Roman Rubsamen <roman.rubsamen@gmail.com>
 */

/* Start Not to be used as is in Google Sheets */

var PortfolioAnalytics = PortfolioAnalytics || {};

PortfolioAnalytics = (function(self) {

/* End Not to be used as is in Google Sheets */  
  
	/**
	* @function assertArray_
	*
	* @description Throws an error if the input parameter is not an array 
	* or a typed array.
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertArray_([]); 
	* //
	*
	* @example
	* assertArray_(1); 
	* // Error("input must be an array")
	*/
	self.assertArray_ = function(x) {
	  if (Object.prototype.toString.call(x).indexOf("Array") == -1) {
		throw new Error("input must be an array");
	  }
	}


	/**
	* @function assertNumberArray_
	*
	* @description Throws an error if the input parameter is not an array of numbers 
	* (or a typed array).
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertNumberArray_([1]); 
	* //
	*
	* @example
	* assertNumberArray_(1); 
	* // Error("input must be an array of numbers")
	*
    * assertNumberArray_([-1]); 
	* // Error("input must be an array of numbers")
	*/
	self.assertNumberArray_ = function(x) {
	  // A number array is an array...
	  try {
		self.assertArray_(x);
	  }
	  catch (e) {
		throw new Error("input must be an array of numbers");
	  }

     // ... non empty...
	 if (x.length == 0) {
	   throw new Error("input must be an array of numbers");
	 }
	 
     // ... and made of numbers
     for (var i=0; i<x.length; ++i) {
  	   try {
         self.assertNumber_(x[i]);
	   }
       catch (e) {
         throw new Error("input must be an array of numbers");
        }
	  }
	}


	/**
	* @function assertPositiveNumberArray_
	*
	* @description Throws an error if the input parameter is not an array of positive numbers 
	* (or a typed array).
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertPositiveNumberArray_([]); 
	* //
	*
	* @example
	* assertPositiveNumberArray_(1); 
	* // Error("input must be an array of positive numbers")
	*
    * assertPositiveNumberArray_([-1]); 
	* // Error("input must be an array of positive numbers")
	*/
	self.assertPositiveNumberArray_ = function(x) {
	  // A positive array is an array...
	  try {
		self.assertArray_(x);
	  }
	  catch (e) {
		throw new Error("input must be an array of positive numbers");
	  }

     // ... non empty...
	 if (x.length == 0) {
	   throw new Error("input must be an array of positive numbers");
	 }
	 
     // ... and made of positive numbers
     for (var i=0; i<x.length; ++i) {
  	   try {
         self.assertPositiveNumber_(x[i]);
	   }
       catch (e) {
         throw new Error("input must be an array of positive numbers");
        }
	  }
	}


	/**
	* @function assertNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number.
	* 
	* @param {number} x input parameter.
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
	self.assertNumber_ = function(x) {
	  if (Object.prototype.toString.call(x)!= "[object Number]" || 
		  isNaN(x) || 
		  x === Infinity ||
          x === -Infinity){
		throw new Error("input must be a number");
	  }
	}


	 /**
	* @function assertPositiveNumber_
	*
	* @description Throws an error if the input parameter is not a positive (finite) number.
	* 
	* @param {number} x input parameter.
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
	self.assertPositiveNumber_ = function(x) {
	  // A positive number is a number...
	  try {
		self.assertNumber_(x);
	  }
	  catch (e) {
		throw new Error("input must be a positive number");
	  }
	  
	  // ... as well as positive
	  if (x < 0.0 ) {
	    throw new Error("input must be a positive number");
	  }
	}


	/**
	* @function assertBoundedNumber_
	*
	* @description Throws an error if the input parameter is not a (finite) number
	* greater than a (finite)lower bound and lower than a (finite) upper bound.
	* 
	* @param {number} x input parameter.
	* @param {number} lowerBound the lower bound.
	* @param {number} upperBound the upper bound.
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
	self.assertBoundedNumber_ = function(x, lowerBound, upperBound) {
	  // The bounds and the input must be numbers...
	  try {
        self.assertNumber_(x);
	    self.assertNumber_(lowerBound);
		self.assertNumber_(upperBound);
	  }
	  catch (e) {
		throw new Error("input(s) must be a number");
	  }
	  
	  // The input parameter must be between the input bounds
	  if (x < lowerBound || x > upperBound) {
	    throw new Error("input must be bounded between " + lowerBound + " and " + upperBound);
	  }
	}
	
	
	/**
	* @function assertPositiveInteger_
	*
	* @description Throws an error if the input parameter is not a positive integer.
	* 
	* @param {number} x input parameter.
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
	self.assertPositiveInteger_ = function(x) {
	  // A positive integer is a positive number...
	  try {
		self.assertPositiveNumber_(x);
	  }
	  catch (e) {
		throw new Error("input must be a positive integer");
	  }

	  // ... as well as an integer
	  if (Math.floor(x) !== x) {
		throw new Error("input must be a positive integer");
	  }
	}


	/**
	* @function assertString_
	*
	* @description Throws an error if the input parameter is not a string.
	* 
	* @param {string} x input parameter.
	*
	* @example
	* assertString_(1); 
	* // Error("input must be a string")
	*
	* @example
	* assertEnumeration_("test"); 
	*/
	self.assertString_ = function(x) {
	  if (!(typeof x === 'string' || x instanceof String)) {
		throw new Error("input must be a string");
	  }
	}

	
	/**
	* @function assertStringEnumeration_
	*
	* @description Throws an error if the input parameter is not a string belonging to a set of string values.
	* 
	* @param {string} x input parameter.
	* @param {Array.<string>} allowedValues array listing the allowed values for the input parameter.
	*
	* @example
	* assertStringEnumeration_(1, ["test", "test2"]); 
	* // Error("input must be a string equals to any of test,test2")
	*
	* @example
	* assertStringEnumeration_("test", ["test", "test2"]); 
	*/
	self.assertStringEnumeration_ = function(x, allowedValues) {
	  // Allowed values must be an array...
	  try {
        self.assertArray_(allowedValues);
	  }
	  catch (e) {
		throw new Error("input must be an array of strings");
	  }
	    
	  // ... of strings
	  for (var i=0; i<allowedValues.length; ++i) {
	    try {
		  self.assertString_(allowedValues[i]);
	    }
	    catch (e) {
		  throw new Error("input must be an array of strings");
        }
	  }
	  
	  // A string enumeration is a string...
	  try {
		self.assertString_(x);
	  }
	  catch (e) {
		throw new Error("input must be a string equals to any of " + allowedValues.toString());
	  }

	  // ... with predefinite values
	  if (allowedValues.indexOf(x) == -1) {
		throw new Error("input must be a string equals to any of " + allowedValues.toString());
	  }
	}


	/**
	* @function assertDate_
	*
	* @description Throws an error if the input parameter is not a date.
	* 
	* @param {date} x input parameter.
	*
	* @example
	* assertDate_(1); 
	* // Error("input must be a date")
	*
	* @example
	* assertDate_(new Date("2015-12-31")); 
	*/
	self.assertDate_ = function(x) {
	  if ( !(x instanceof Date) || isNaN(x.getTime()) ) {
		throw new Error("input must be a date");
	  }
	}
	

	/**
	* @function assertDateArray_
	*
	* @description Throws an error if the input parameter is not an array of dates.
	* 
	* @param {Array.<Object>} x input parameter.
	*
	* @example
	* assertDateArray_([new Date("2015-12-31")]); 
	* //
	*
	* @example
	* assertDateArray_(1); 
	* // Error("input must be an array of dates")
	*
    * assertDateArray_([-1]); 
	* // Error("input must be an array of dates")
	*/
	self.assertDateArray_ = function(x) {
	  // A date array is an array...
	  try {
		self.assertArray_(x);
	  }
	  catch (e) {
		throw new Error("input must be an array of dates");
	  }

      // ... non empty...
	  if (x.length == 0) {
	    throw new Error("input must be an array of dates");
	  }
	 
      // ... and made of dates
      for (var i=0; i<x.length; ++i) {
  	    try {
          self.assertDate_(x[i]);
	    }
        catch (e) {
          throw new Error("input must be an array of dates");
        }
	  }
	}

	
	/**
	* @function assertSameLengthArrays_
	*
	* @description Throws an error if the input parameters are not arrays of same length.
	* 
	* @param {Array.<Object>} x input parameter.
	* @param {Array.<Object>} y input parameter.
	*
	* @example
	* assertSameLengthArrays_([1], [2]); 
	* //
	*
	* @example
	* assertSameLengthArrays_([1], [1, 2]); 
	* // Error("input must be arrays of same length")
	*
    * assertSameLengthArrays_([-1], []); 
	* // Error("input must be arrays of same length")
	*/
	self.assertSameLengthArrays_ = function(x, y) {
	  // The two inputs must be arrays...
	  try {
		self.assertArray_(x);
		self.assertArray_(y);
	  }
	  catch (e) {
		throw new Error("input must be arrays of same length");
	  }

      // ... of same length
	  if (x.length != y.length) {
	    throw new Error("input must be arrays of same length");
	  }
	}
	
	
	/* Start Not to be used as is in Google Sheets */
   
   return self;
  
})(PortfolioAnalytics || {});

/* End Not to be used as is in Google Sheets */
