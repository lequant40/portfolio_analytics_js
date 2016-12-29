// ------------------------------------------------------------
QUnit.module('Returns module', {
});


QUnit.test('Ror incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.ror();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.ror([-100]);
    },
    new Error("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );

  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Ror computation', function(assert) {    
  assert.equal(PortfolioAnalytics.ror([100, 110]), 0.10, 'Ror #1');
  assert.deepEqual(PortfolioAnalytics.ror([100]), NaN, 'Ror #2');
  assert.equal(PortfolioAnalytics.ror([100, 90]), -0.10, 'Ror #3');
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