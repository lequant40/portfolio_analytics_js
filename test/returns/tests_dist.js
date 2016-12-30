// ------------------------------------------------------------
QUnit.module('Returns module', {
});


QUnit.test('Cumulative return incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.cumulativeReturn();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.cumulativeReturn([-100]);
    },
    new Error("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );

  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Cumulative return computation', function(assert) {    
  assert.equal(PortfolioAnalytics.cumulativeReturn([100, 110]), 0.10, 'Ror #1');
  assert.deepEqual(PortfolioAnalytics.cumulativeReturn([100]), NaN, 'Ror #2');
  assert.equal(PortfolioAnalytics.cumulativeReturn([100, 90]), -0.10, 'Ror #3');
});


QUnit.test('Cagr incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.cagr();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.cagr([-100]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.cagr([100], "hourly");
    },
    new Error ("input must be a string equals to any of daily,weekly,monthly,quarterly,yearly"),
    "Incorrect periodicity input argument"
  );

  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Cagr computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.cagr([100], "yearly"), NaN, 'CAGR #0');
  assert.equal(PortfolioAnalytics.cagr([100, 110], "yearly"), 0.10000000000000009, 'CAGR #1');
  assert.equal(PortfolioAnalytics.cagr([100, 110, 120], "yearly"), 0.09544511501033215, 'CAGR #2');
  assert.equal(PortfolioAnalytics.cagr([100, 90], "yearly"), -0.09999999999999998, 'CAGR #3');
  assert.equal(PortfolioAnalytics.cagr([100, 110, 100, 110, 110], "quarterly"), 0.10000000000000009, 'CAGR #4');
  assert.equal(PortfolioAnalytics.cagr([100, 110, 100, 110, 100, 110, 100, 110, 100, 110, 100, 110, 110], "monthly"), 0.10000000000000009, 'CAGR #5');
});


QUnit.test('Arithmetic returns incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.arithmeticReturns();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.arithmeticReturns([-100]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Arithmetic returns computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns([100]), [NaN], 'Arithmetic returns #1');
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns([100, 100]), [NaN, 0.0], 'Arithmetic returns #2');
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns([100, 110, 100]), [NaN, 0.10, -0.09090909090909091], 'Arithmetic returns #3');
});


QUnit.test('Gain to pain ratio incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.gainToPainRatio();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.gainToPainRatio([-100]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Gain to pain ratio computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.gainToPainRatio([100]), NaN, 'Gain to pain ratio #1');
  assert.equal(PortfolioAnalytics.gainToPainRatio([100, 100, 109.5, 108.405, 109.48905, 108.3941595, 107.8521887]), 3.199999996125246, 'Gain to pain ratio #2');
  assert.deepEqual(PortfolioAnalytics.gainToPainRatio([100, 110]), NaN, 'Gain to pain ratio #3');
});