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
  
  //TODO: missing second array, second array not dates, arrays length different

  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Cagr computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.cagr([100], [new Date("2015-12-31")]), NaN, 'CAGR #0');
  assert.equal(PortfolioAnalytics.cagr([100, 110], [new Date("2016-12-31"), new Date("2017-12-31")]), 0.10007181138351062, 'CAGR #1');
  assert.equal(PortfolioAnalytics.cagr([100, 110, 120], [new Date("2015-12-31"), new Date("2016-12-31"), new Date("2017-12-31")]), 0.09537681233175466, 'CAGR #2');
  assert.equal(PortfolioAnalytics.cagr([100, 90], [new Date("2016-12-31"), new Date("2017-12-31")]), -0.10006494591964599, 'CAGR #3');
  assert.equal(PortfolioAnalytics.cagr([100, 110, 100, 110, 110], 
                                       [new Date("2014-12-31"), new Date("2015-03-31"), new Date("2015-06-30"), new Date("2015-09-30"), new Date("2015-12-31")]), 	
                                       0.10007181138351062, 'CAGR #4');
  assert.equal(PortfolioAnalytics.cagr([100, 110, 100, 110, 100, 110, 100, 110, 100, 110, 100, 110, 110], 
                                       [new Date("2014-12-31"), new Date("2015-01-31"), new Date("2015-02-28"), new Date("2015-03-31"), new Date("2015-04-30"), new Date("2015-05-31"), new Date("2015-06-30"), new Date("2015-07-31"), new Date("2015-08-31"), new Date("2015-09-30"), new Date("2015-10-31"), new Date("2015-11-30"), new Date("2015-12-31")]), 
									   0.10007181138351062, 'CAGR #5');
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
  
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns(new Float64Array([100.0, 110.0, 100.0])),
                   new Float64Array([NaN, 0.10, -0.09090909090909091]),
				   'Arithmetic returns typed array');
});


QUnit.test('Value at risk incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.valueAtRisk();
    },
    new Error("input(s) must be a number"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.valueAtRisk([-100]);
    },
    new Error ("input(s) must be a number"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.valueAtRisk([-100], 1);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.valueAtRisk([100], -0.01);
    },
    new Error ("input must be bounded between 0 and 1"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.valueAtRisk([100], 1.01);
    },
    new Error ("input must be bounded between 0 and 1"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Value at risk computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.valueAtRisk([100], 0.10), NaN, 'Value at Risk NaN #1');
  
  assert.equal(PortfolioAnalytics.valueAtRisk([100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110], 0.10), -0.009174311926605505, 'Negative value at Risk');
  
  var aTestPortfolio = [100,93,88.815,87.0387,85.7331195,84.87578831,84.87578831,86.99768301,91.34756716,98.1986347,107.0365118];  
  assert.equal(PortfolioAnalytics.valueAtRisk(aTestPortfolio, 0.10), 0.07, 'Value at Risk #1');
  assert.deepEqual(PortfolioAnalytics.valueAtRisk(aTestPortfolio, 0.05), NaN, 'Value at Risk NaN #2');
});