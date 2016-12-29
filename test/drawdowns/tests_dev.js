// ------------------------------------------------------------
QUnit.module('Drawdowns internal module', {
  before: function() {
    // Coming from "Ambiguity in Calculating and Interpreting Maximum Drawdown, Research Note, Andreas Steiner Consulting GmbH, December 2010"
	this.complexEquityCurve = [60, 40, 80, 140, 100, 90, 110, 70, 100, 130, 110, 120, 90, 150, 120, 130];
  }
});


QUnit.test('Max drawdown internal incorrect input arguments', function(assert) {
  assert.expect(0);
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
