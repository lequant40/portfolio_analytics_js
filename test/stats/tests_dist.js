// ------------------------------------------------------------
QUnit.module('Statistics module', {
  before: function() {
	// Coming from "Practical Portfolio Performance Measurement and Attribution, 2nd Edition, Carl R. Bacon."
	this.BaconReturns = [0.003, 0.026, 0.011, -0.01, 0.015, 0.025, 0.016, 0.067, -0.014, 0.04, -0.005, 0.081, 0.04, -0.037, -0.061, 0.017, -0.049, -0.022, 0.07, 0.058, -0.065, 0.024, -0.005, -0.009];
	
	// Coming from Spiegel, Murray R., and Larry J. Stephens. 1999. Theory and Problems of Statistics. 3d ed. McGraw-Hill. 
    var heights = [ [61,5], [64,18], [67,42], [70,27], [73,8] ];
	this.SpiegelHeights = [];
    for (var i=0;i<5;++i) {
      for (var j=0;j<heights[i][1];++j) {
	    this.SpiegelHeights.push(heights[i][0]);
	  }
    }
  }
});


QUnit.test('Mean incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.mean_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Mean computation', function(assert) {    
  // Uses identity mean(x) = sum(x)/length(x)
  var testArray = [];
  for (var i=1; i<=10; ++i) {
    testArray.push(i);
	assert.equal(PortfolioAnalytics.mean_(testArray), PortfolioAnalytics.sum_(testArray)/i, 'Mean #' + i);
  } 
  
  // Test for rounding errors
  // When the mean computation is not corrected, the (incorrect) fractional part of the computed mean is 5.0049999... in double precision
  // When corrected, it is equal to 5.005
  var testArray = [];
  for (var i=1; i<=1000; ++i) {
    testArray.push(i*0.01 + 10000000);
  }
  assert.equal(PortfolioAnalytics.mean_(testArray), 10000000 + 5.005, 'Mean with no rounding error');

  // Bacon portfolio test
  assert.equal(PortfolioAnalytics.mean_(this.BaconReturns), 0.009, 'Bacon average return');  
  
  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.mean_(this.SpiegelHeights), 67.45, 'Spiegel average return');  
});


QUnit.test('Variance incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.variance_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Variance computation', function(assert) {      
  // Variance of one value is NaN
  assert.deepEqual(PortfolioAnalytics.variance_([1]), NaN, 'Variance of one number');
  
  // Theoretically, Var(X + a) = Var(X), with a a constant
  // With a two pass formula, this formula should be valid for the case below
  assert.equal(PortfolioAnalytics.variance_([1000000000 + 4, 1000000000 + 7, 1000000000 + 13, 1000000000 + 16]), 22.5, 'Variance with no rounding error #1/2');
  assert.equal(PortfolioAnalytics.variance_([4, 7, 13, 16]), 22.5, 'Variance with no rounding error #2/2');
  
  // Bacon portfolio test
  assert.equal(PortfolioAnalytics.variance_(this.BaconReturns), 0.035974/this.BaconReturns.length + 0.0000000000000000003, 'Bacon variance');

  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.variance_(this.SpiegelHeights), 8.527499999999993, 'Spiegel variance'); 
});


QUnit.test('Standard deviation incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.stddev_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Standard deviation computation', function(assert) {      
  // Standard deviation of one value is NaN
  assert.deepEqual(PortfolioAnalytics.stddev_([1]), NaN, 'Standard deviation of one number');
  
  // Uses identity stddev(x) = sqrt(var(x))
  var testArray = [];
  testArray.push(1);
  for (var i=2; i<=10; ++i) {
    testArray.push(i);
	assert.equal(PortfolioAnalytics.stddev_(testArray), Math.sqrt(PortfolioAnalytics.variance_(testArray)), 'Standard deviation #' + i);
  } 
  
  // Bacon portfolio test
  assert.equal(PortfolioAnalytics.stddev_(this.BaconReturns), Math.sqrt(0.035974/this.BaconReturns.length + 0.0000000000000000003), 'Bacon standard deviation');
});


QUnit.test('Skewness incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.skewness_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Skewness computation', function(assert) {      
  // Skewness of one or two values is NaN
  assert.deepEqual(PortfolioAnalytics.skewness_([1]), NaN, 'Skewness of one number');
  assert.deepEqual(PortfolioAnalytics.skewness_([1, 2]), NaN, 'Skewness of two numbers');
  
  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.skewness_(this.SpiegelHeights), -0.10815437112298999, 'Spiegel skewness'); 
  
  // Sample is  −0.1098
});


QUnit.test('Kurtosis incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.kurtosis_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Kurtosis computation', function(assert) {      
  // Skewness of one or two or three values is NaN
  assert.deepEqual(PortfolioAnalytics.kurtosis_([1]), NaN, 'Kurtosis of one number');
  assert.deepEqual(PortfolioAnalytics.kurtosis_([1, 2]), NaN, 'Kurtosis of two numbers');
  assert.deepEqual(PortfolioAnalytics.kurtosis_([1, 2, 3]), NaN, 'Kurtosis of three numbers');
  
  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.kurtosis_(this.SpiegelHeights), 2.741758968539624, 'Spiegel kurtosis'); 
  
  // Wikipedia test (https://en.wikipedia.org/wiki/Kurtosis#Sample_kurtosis)
  assert.equal(PortfolioAnalytics.kurtosis_([0, 3, 4, 1, 2, 3, 0, 2, 1, 3, 2, 0, 2, 2, 3, 2, 5, 2, 3, 999]), 18.051426543784185, 'Wikipedia kurtosis'); 
  
  // Sample −0.2091
});



QUnit.test('Lpm incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.lpm_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.lpm_([1]);
    },
    new Error("input must be a positive integer"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.lpm_([1], 1.1);
    },
    new Error("input must be a positive integer"),
    "No input arguments"
  );
  
  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Lpm computation', function(assert) {    
  // Uses identity lpm(x,1,0) == mean(-x) if x <= 0
  var testArrayNegative = [];
  var testArrayPositive = [];
  for (var i=1; i<=10; ++i) {
    testArrayNegative.push(-i);
	testArrayPositive.push(i);
	assert.equal(PortfolioAnalytics.lpm_(testArrayNegative, 1, 0.0), PortfolioAnalytics.mean_(testArrayPositive), 'Lpm 1 #' + i);
  }
  
  // Bacon Downside Potential
  assert.equal(PortfolioAnalytics.lpm_(this.BaconReturns, 1, 0.005), 0.329/24 - 0.000000000000000004, 'Lpm Bacon');
});


QUnit.test('Hpm incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.hpm_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.hpm_([1]);
    },
    new Error("input must be a positive integer"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.hpm_([1], 1.1);
    },
    new Error("input must be a positive integer"),
    "No input arguments"
  );
  
  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Hpm computation', function(assert) {    
  // Uses identity hpm(x,1,0) == mean(x) if x >= 0
  var testArrayPositive = [];
  for (var i=1; i<=10; ++i) {
	testArrayPositive.push(i);
	assert.equal(PortfolioAnalytics.hpm_(testArrayPositive, 1, 0.0), PortfolioAnalytics.mean_(testArrayPositive), 'Hpm 1 #' + i);
  } 
  
  // Bacon Upside Potential
  assert.equal(PortfolioAnalytics.hpm_(this.BaconReturns, 1, 0.005), 0.425/24, 'Hpm Bacon');

});
