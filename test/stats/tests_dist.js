// ------------------------------------------------------------
QUnit.module('Statistics module', {
  before: function() {
	// Coming from "Practical Portfolio Performance Measurement and Attribution, 2nd Edition, Carl R. Bacon."
	this.BaconReturns = [0.003, 0.026, 0.011, -0.01, 0.015, 0.025, 0.016, 0.067, -0.014, 0.04, -0.005, 0.081, 0.04, -0.037, -0.061, 0.017, -0.049, -0.022, 0.07, 0.058, -0.065, 0.024, -0.005, -0.009];
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
