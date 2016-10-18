// ------------------------------------------------------------
QUnit.module('Drawdowns internal module', {
  before: function() {
    this.complexEquityCurve = [60, 40, 80, 140, 100, 90, 110, 70, 100, 130, 110, 120, 90, 150, 120, 130];
	this.BaconEquityCurve = [100, 100.3, 102.9078, 104.0397858, 102.9993879, 104.5443788, 107.1579882, 108.872516, 116.1669746, 114.540637, 119.1222625, 118.5266511, 
           128.1273099, 133.2524023, 128.3220634, 120.4944175, 122.5428226, 116.5382243, 113.9743834, 121.9525902, 129.0258404, 120.6391608, 123.5345007, 122.9168282, 121.8105767];
  }
});


QUnit.test('Max drawdown internal incorrect input arguments', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_([1], 0, -1), 
                                                   [-Infinity, -1, -1], 
                                                   'Undefined max drawdown');
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown_([1], 0, 1);
    },
    new Error ("input must be a positive number"),
    "Out of boundaries input argument #1"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown_([1], -1, 0);
    },
    new Error ("input must be a positive number"),
    "Out of boundaries input argument #2"
  );
  
});


QUnit.test('Max drawdown internal computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_([100], 0, 0), 
                                                   [0, 0, 0], 
                                                   'No max drawdown #1');
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_([100, 110], 0, 1), 
                                                   [0, 0, 0], 
                                                   'No max drawdown #1');
                                                    
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_([100, 90], 0, 1), 
                                                   [0.1, 0, 1], 
                                                   'Simple max drawdown #1');
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_([100, 90, 80], 0, 2), 
                                                   [0.2, 0, 2], 
                                                   'Simple max drawdown #2');

 assert.deepEqual(PortfolioAnalytics.maxDrawdown_([100, 150, 75, 150, 75], 0, 4), 
                                                   [0.5, 1, 2], 
                                                   'Ties in max drawdown');  
												   
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_(this.complexEquityCurve, 0, this.complexEquityCurve.length-1), 
                                                   [0.5, 3, 7], 
                                                   'Complex max drawdown #1');
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_(this.complexEquityCurve, 0, 2), 
                                                   [0.33333333333333333, 0, 1], 
                                                   'Complex max drawdown #2');
  assert.deepEqual(PortfolioAnalytics.maxDrawdown_(this.complexEquityCurve, 7, this.complexEquityCurve.length-1), 
                                                   [0.3076923076923077, 9, 12], 
                                                   'Complex max drawdown #3');
});

