// ------------------------------------------------------------
QUnit.module('Sharpe ratio internal module', {
  before: function() {
	  // Taken from "Practical Portfolio Performance Measurement and Attribution, 2nd Edition, Carl R. Bacon."
	  var baconPortfolioReturns = [0.003, 0.026, 0.011, -0.01, 0.015, 0.025, 0.016, 0.067, -0.014, 0.04, -0.005, 0.081, 0.04, -0.037, -0.061, 0.017, -0.049, -0.022, 0.07, 0.058, -0.065, 0.024, -0.005, -0.009];
	  var baconBenchmarkReturns = [0.002, 0.025, 0.018, -0.011, 0.014, 0.018, 0.014, 0.065, -0.015, 0.042, -0.006, 0.083, 0.039, -0.038, -0.062, 0.015, -0.048, 0.021, 0.06, 0.056, -0.067, 0.019, -0.003, 0];

	  // Build the equity curves corresponding to the returns
	  this.baconPortfolio = new Array(baconPortfolioReturns.length + 1);
	  this.baconBenchmark = new Array(baconBenchmarkReturns.length + 1);
	  this.zeroRiskFree = new Array(baconBenchmarkReturns.length + 1);
	  this.baconPortfolio[0] = 100;
	  this.baconBenchmark[0] = 100;
	  this.zeroRiskFree[0] = 100;
	  for (var i=0; i<baconPortfolioReturns.length; ++i) {
		this.baconPortfolio[i+1] = this.baconPortfolio[i] * (1 + baconPortfolioReturns[i]);
		this.baconBenchmark[i+1] = this.baconBenchmark[i] * (1 + baconBenchmarkReturns[i]);
		this.zeroRiskFree[i+1] = this.zeroRiskFree[i];
	  }
  }
});


QUnit.test('Differential returns computation internal function', function(assert) {
  // Test Bacon portolios
    // Compute the differential returns
  var diffReturns = PortfolioAnalytics.differentialReturns_(this.baconPortfolio, this.baconBenchmark);
  
    // Bacon differential portfolio returns, as defined in "Practical Portfolio Performance Measurement and Attribution, 2nd Edition, Carl R. Bacon."
  var baconDifferentialReturns = [0.001, 0.001, -0.007, 0.001, 0.001, 0.007, 0.002, 0.002, 0.001, -0.002, 0.001, -0.002, 0.001, 0.001, 0.001, 0.002, -0.001, -0.043, 0.01, 0.002, 0.002, 0.005, -0.002, -0.009];

	// The computed differential returns must math those of Bacon  
  for (var i=0; i<baconDifferentialReturns.length; ++i) {
    assert.ok(Math.abs(diffReturns[i] - baconDifferentialReturns[i]) <= 1e-14, 'Bacon differential returns #' + i);
  }
});


QUnit.test('Sharpe ratio statistics internal function', function(assert) {
  // Test internal consistency of the sharpeRatioStatistics_ function
    // Portfolio #1
  var srs = PortfolioAnalytics.sharpeRatioStatistics_(this.baconPortfolio, this.zeroRiskFree);
  assert.equal(srs[0], PortfolioAnalytics.sharpeRatio(this.baconPortfolio, this.zeroRiskFree), 'Sharpe ratio #1');
  assert.equal(srs[0]/Math.sqrt(srs[1]), PortfolioAnalytics.doubleSharpeRatio(this.baconPortfolio, this.zeroRiskFree), 'Double Sharpe ratio #1');
  assert.equal(srs[0]/srs[2], PortfolioAnalytics.biasAdjustedSharpeRatio(this.baconPortfolio, this.zeroRiskFree), 'Bias adjusted Sharpe ratio #1');
  
    // Portfolio #2
  var srs = PortfolioAnalytics.sharpeRatioStatistics_(this.baconBenchmark, this.zeroRiskFree);
  assert.equal(srs[0], PortfolioAnalytics.sharpeRatio(this.baconBenchmark, this.zeroRiskFree), 'Sharpe ratio #2');
  assert.equal(srs[0]/Math.sqrt(srs[1]), PortfolioAnalytics.doubleSharpeRatio(this.baconBenchmark, this.zeroRiskFree), 'Double Sharpe ratio #2');
  assert.equal(srs[0]/srs[2], PortfolioAnalytics.biasAdjustedSharpeRatio(this.baconBenchmark, this.zeroRiskFree), 'Bias adjusted Sharpe ratio #2');

    // Portfolio #3
  var srs = PortfolioAnalytics.sharpeRatioStatistics_(this.baconPortfolio, this.baconBenchmark);
  assert.equal(srs[0], PortfolioAnalytics.sharpeRatio(this.baconPortfolio, this.baconBenchmark), 'Sharpe ratio #3');
  assert.equal(srs[0]/Math.sqrt(srs[1]), PortfolioAnalytics.doubleSharpeRatio(this.baconPortfolio, this.baconBenchmark), 'Double Sharpe ratio #3');
  assert.equal(srs[0]/srs[2], PortfolioAnalytics.biasAdjustedSharpeRatio(this.baconPortfolio, this.baconBenchmark), 'Bias adjusted Sharpe ratio #3');
});