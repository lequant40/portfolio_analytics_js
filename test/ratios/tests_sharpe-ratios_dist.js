// ------------------------------------------------------------
QUnit.module('Sharpe ratio module', {
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

QUnit.test('Sharpe ratio computation', function(assert) {    
   assert.equal(PortfolioAnalytics.sharpeRatio(this.baconPortfolio, this.zeroRiskFree), 0.22756845566238826, 'Sharpe ratio #1');
   assert.equal(PortfolioAnalytics.sharpeRatio(this.baconBenchmark, this.zeroRiskFree), 0.26162488955600643, 'Sharpe ratio #2');
   assert.equal(PortfolioAnalytics.sharpeRatio(this.baconPortfolio, this.baconBenchmark), -0.10726723360428486, 'Sharpe ratio #3');
});

QUnit.test('Bias adjusted Sharpe ratio computation', function(assert) {    
   assert.equal(PortfolioAnalytics.biasAdjustedSharpeRatio(this.baconPortfolio, this.zeroRiskFree), 0.22385539495710946, 'Bias adjusted Sharpe ratio #1');
   assert.equal(PortfolioAnalytics.biasAdjustedSharpeRatio(this.baconBenchmark, this.zeroRiskFree), 0.2564567137450749, 'Bias adjusted Sharpe ratio #2');
   assert.equal(PortfolioAnalytics.biasAdjustedSharpeRatio(this.baconPortfolio, this.baconBenchmark), -0.09000601734112651, 'Bias adjusted Sharpe ratio #3');
});

QUnit.test('Double Sharpe ratio computation', function(assert) {    
   assert.equal(PortfolioAnalytics.doubleSharpeRatio(this.baconPortfolio, this.zeroRiskFree), 1.0698359558642094, 'Double Sharpe ratio #1');
   assert.equal(PortfolioAnalytics.doubleSharpeRatio(this.baconBenchmark, this.zeroRiskFree), 1.1932271183081238, 'Double Sharpe ratio #2');
   assert.equal(PortfolioAnalytics.doubleSharpeRatio(this.baconPortfolio, this.baconBenchmark), -0.6374027463566774, 'Double Sharpe ratio #3');
});

QUnit.test('Sharpe ratio confidence interval computation', function(assert) {    
   assert.deepEqual(PortfolioAnalytics.sharpeRatioConfidenceInterval(this.baconPortfolio, this.zeroRiskFree, 0.05),[-0.18934216977548385,0.6444790811002603], 'Sharpe ratio confidence interval #1');
   assert.deepEqual(PortfolioAnalytics.sharpeRatioConfidenceInterval(this.baconBenchmark, this.zeroRiskFree, 0.01), [-0.3031469359192987,0.8263967150313116], 'Sharpe ratio confidence interval #2');
   assert.deepEqual(PortfolioAnalytics.sharpeRatioConfidenceInterval(this.baconPortfolio, this.baconBenchmark, 0.10), [-0.384076361052474,0.16954189384390428], 'Sharpe ratio confidence interval #3');
});

QUnit.test('Probabilistic Sharpe ratio computation', function(assert) {    
   assert.equal(PortfolioAnalytics.probabilisticSharpeRatio(this.baconPortfolio, this.zeroRiskFree, 0), 0.85765342264124, 'Probabilistic Sharpe ratio #1');
   assert.equal(PortfolioAnalytics.probabilisticSharpeRatio(this.baconBenchmark, this.zeroRiskFree, 1/Math.sqrt(12)), 0.45090641544923754, 'Probabilistic Sharpe ratio #2');
   assert.equal(PortfolioAnalytics.probabilisticSharpeRatio(this.baconPortfolio, this.baconBenchmark, 0), 0.2619312699710906, 'Probabilistic Sharpe ratio #3');
});

QUnit.test('Minimum track record length computation', function(assert) {    
   assert.equal(PortfolioAnalytics.minimumTrackRecordLength(this.baconPortfolio, this.zeroRiskFree, 0.05, 0), 55.36857732082471, 'Minimum track record length #1');
   assert.equal(PortfolioAnalytics.minimumTrackRecordLength(this.baconBenchmark, this.zeroRiskFree, 0.05, 1/Math.sqrt(12)), 4089.385389453716, 'Minimum track record length #2');
   assert.equal(PortfolioAnalytics.minimumTrackRecordLength(this.baconPortfolio, this.baconBenchmark, 0.10, 0), 93.97627557455954, 'Minimum track record length #3');
});