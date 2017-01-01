// ------------------------------------------------------------
QUnit.module('Statistics module', {
});


QUnit.test('Percentile incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.percentile();
    },
    new Error("input must be an array of numbers"),
    "No input arguments"
  );

  assert.throws(function() {
      PortfolioAnalytics.percentile([1]);
    },
    new Error("input must be bounded between 0 and 1"),
    "Negative numeric array input argument"
  );

  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Percentile computation', function(assert) {    
  // Examples taken from https://en.wikipedia.org/wiki/Percentile
  assert.equal(PortfolioAnalytics.percentile([15, 20, 35, 40, 50], 0.40), 29, 'Percentile #1');
  assert.equal(PortfolioAnalytics.percentile([1,2,3,4], 0.75), 3.25, 'Percentile #2');
  assert.equal(PortfolioAnalytics.percentile([1,2,3,4], 1), 4, 'Percentile #2.1');
  assert.equal(PortfolioAnalytics.percentile([1,2,3,4], 0), 1, 'Percentile #2.2');
  assert.equal(PortfolioAnalytics.percentile([1,3,2,4], 0.75), 3.25, 'Non sorted input array');
  
  // Examples taken from discussion on https://gist.github.com/IceCreamYou/6ffa1b18c4c8f6aeaad2
  assert.equal(PortfolioAnalytics.percentile([1,2,3,18,19,27], 0.5), 10.5, 'Percentile #3');
  assert.equal(PortfolioAnalytics.percentile([1,2,3,18,19,22,27], 0.5), 18, 'Percentile #4');
});

