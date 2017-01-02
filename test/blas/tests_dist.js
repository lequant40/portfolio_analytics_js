// ------------------------------------------------------------
QUnit.module('Blas module', {
});


QUnit.test('Sum incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.sum_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Sum computation', function(assert) {    
  // Uses identity sum i,i=1..n = n*(n+1)/2
  var testArray = [];
  for (var i=1; i<=10; ++i) {
    testArray.push(i);
	assert.equal(PortfolioAnalytics.sum_(testArray), i*(i+1)/2, 'Sum #' + i);
  } 
});


QUnit.test('Dot product incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.dot_();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.dot_([1.1]);
    },
    new Error("input must be an array of numbers"),
    "One array only input arguments"
  );

    assert.throws(function() {
      PortfolioAnalytics.dot_([1.1], [1, 2]);
    },
    new Error("input arrays must have the same length"),
    "Array of not same length input arguments"
  );

  // Other tests are delegated to the unit tests of types.js
});

QUnit.test('Dot product computation', function(assert) {    
  // Uses identity sum i^2 = n*(n+1)*(2n+1)/6
  // Uses relationship dot(x, 1..1) == sum(x)
  var identityArray = [];
  var testArray = [];  
  for (var i=1; i<=10; ++i) {
    identityArray.push(1);
	testArray.push(i);
	
	assert.equal(PortfolioAnalytics.dot_(testArray, identityArray), PortfolioAnalytics.sum_(testArray), 'Dot product 1 #' + i);
	assert.equal(PortfolioAnalytics.dot_(testArray, testArray), i*(i+1)*(2*i+1)/6, 'Dot product 2 #' + i);
  } 
});