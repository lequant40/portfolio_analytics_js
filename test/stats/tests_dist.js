// ------------------------------------------------------------
QUnit.module('Statistics module', {
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
});
