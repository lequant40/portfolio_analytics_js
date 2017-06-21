// ------------------------------------------------------------
QUnit.module('Statistics module', {
  before: function() {
	// Coming from "Practical Portfolio Performance Measurement and Attribution, 2nd Edition, Carl R. Bacon."
	this.BaconReturns = [0.003, 0.026, 0.011, -0.01, 0.015, 0.025, 0.016, 0.067, -0.014, 0.04, -0.005, 0.081, 0.04, -0.037, -0.061, 0.017, -0.049, -0.022, 0.07, 0.058, -0.065, 0.024, -0.005, -0.009];
	this.BaconBenchmarkReturns = [0.002, 0.025, 0.018, -0.011, 0.014, 0.018, 0.014, 0.065, -0.015, 0.042, -0.006, 0.083, 0.039, -0.038, -0.062, 0.015, -0.048, 0.021, 0.06, 0.056, -0.067, 0.019, -0.003, 0];
	
	// Coming from Spiegel, Murray R., and Larry J. Stephens. 1999. Theory and Problems of Statistics. 3d ed. McGraw-Hill. 
    var heights = [ [61,5], [64,18], [67,42], [70,27], [73,8] ];
	this.SpiegelHeights = [];
    for (var i=0;i<5;++i) {
      for (var j=0;j<heights[i][1];++j) {
	    this.SpiegelHeights.push(heights[i][0]);
	  }
    }
  }
});



QUnit.test('Mean computation', function(assert) {    
  // Uses identity mean(x) = sum(x)/length(x)
  var testArray = [];
  var sum = 0.0;
  for (var i=1; i<=10; ++i) {
    testArray.push(i);
	sum += i;
	assert.equal(PortfolioAnalytics.mean_(testArray), sum/i, 'Mean #' + i);
  } 
  
  // Test for rounding errors
  // When the mean computation is not corrected, the (incorrect) fractional part of the computed mean is 5.0049999... in double precision
  // When corrected, it is equal to 5.005
  var testArray = [];
  for (var i=1; i<=1000; ++i) {
    testArray.push(i*0.01 + 10000000);
  }
  assert.equal(PortfolioAnalytics.mean_(testArray), 10000000 + 5.005, 'Mean with no rounding error');

  // Bacon portfolio test
  assert.equal(PortfolioAnalytics.mean_(this.BaconReturns), 0.009, 'Bacon average return');  
  
  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.mean_(this.SpiegelHeights), 67.45, 'Spiegel average return');  
});


QUnit.test('Variance computation', function(assert) {      
  // Variance of one value is 0
  assert.equal(PortfolioAnalytics.variance_([1]), 0, 'Variance of one number');
  
  // Sample variance of one value is NaN
  assert.deepEqual(PortfolioAnalytics.sampleVariance_([1]), NaN, 'Sample variance of one number');
  
  // Variance of constant values is constant
  assert.equal(PortfolioAnalytics.variance_([1, 1]), 0, 'Variance for constant values');
  
  // Theoretically, Var(X + a) = Var(X), with a a constant
  // With a two pass formula, this formula should be valid for the case below
  assert.equal(PortfolioAnalytics.variance_([1000000000 + 4, 1000000000 + 7, 1000000000 + 13, 1000000000 + 16]), 22.5, 'Variance with no rounding error #1/2');
  assert.equal(PortfolioAnalytics.variance_([4, 7, 13, 16]), 22.5, 'Variance with no rounding error #2/2');
  assert.equal(PortfolioAnalytics.sampleVariance_([1000000000 + 4, 1000000000 + 7, 1000000000 + 13, 1000000000 + 16]), 30, 'Sample variance with no rounding error #1/2');
  assert.equal(PortfolioAnalytics.sampleVariance_([4, 7, 13, 16]), 30, 'Sample variance with no rounding error #2/2');
  
  // Bacon portfolio test
  assert.equal(Math.abs(PortfolioAnalytics.variance_(this.BaconReturns) - 0.035974/this.BaconReturns.length) <= 1e-16, true, 'Bacon variance');

  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.variance_(this.SpiegelHeights), 8.527499999999993, 'Spiegel variance'); 
});


QUnit.test('Covariance computation', function(assert) {      
  // Test that Var(X) = Cov(X, X), using random data
  var testX = new Array(10);
  for (var i=0; i<testX.length; ++i) {
    testX[i] = Math.random();
  }
  assert.equal(PortfolioAnalytics.covariance_(testX, testX), PortfolioAnalytics.variance_(testX), 'Variance X = Cov(X,X)');
  
  // Test that Var(X + Y) = Var(X) + Var(Y) + 2*Cov(X, Y), using random data
  var testY = new Array(10);
  var testXpY = new Array(10);
  for (var i=0; i<testY.length; ++i) {
    testY[i] = Math.random();
	testXpY[i] = testX[i] + testY[i];
  }
  assert.equal(Math.abs(PortfolioAnalytics.variance_(testX) + PortfolioAnalytics.variance_(testY) + 2*PortfolioAnalytics.covariance_(testX, testY)
               -
               PortfolioAnalytics.variance_(testXpY)) <= 1e-16,
			   true,
			   'Variance X + Y = Var X + Var Y + 2*Cov(X,Y)');

  // Bacon portfolio test
  assert.equal(Math.abs(PortfolioAnalytics.covariance_(this.BaconReturns, this.BaconBenchmarkReturns) - 0.033844/this.BaconReturns.length) <= 1e-16, true, 'Bacon covariance');
});


QUnit.test('Standard deviation computation', function(assert) {      
  // Standard deviation of one value is 0
  assert.equal(PortfolioAnalytics.stddev_([1]), 0, 'Standard deviation of one number');
  
  // Sample standard deviation of one value is NaN
  assert.deepEqual(PortfolioAnalytics.sampleStddev_([1]), NaN, 'Sample standard deviation of one number');
  
  // Uses identity stddev(x) = sqrt(var(x))
  var testArray = [];
  testArray.push(1);
  for (var i=2; i<=10; ++i) {
    testArray.push(i);
	assert.equal(PortfolioAnalytics.stddev_(testArray), Math.sqrt(PortfolioAnalytics.variance_(testArray)), 'Standard deviation #' + i);
	assert.equal(PortfolioAnalytics.sampleStddev_(testArray), Math.sqrt(PortfolioAnalytics.sampleVariance_(testArray)), 'Sample standard deviation #' + i);
  } 
  
  // Bacon portfolio test
  assert.equal(Math.abs(PortfolioAnalytics.stddev_(this.BaconReturns) - Math.sqrt(0.035974/this.BaconReturns.length)) <= 1e-16, true, 'Bacon standard deviation');
  assert.equal(Math.abs(PortfolioAnalytics.sampleStddev_(this.BaconReturns) - Math.sqrt(0.035974/(this.BaconReturns.length-1))) <= 1e-16, true, 'Bacon sample standard deviation');
  
  // Wikipedia test (https://en.wikipedia.org/wiki/Standard_deviation#Basic_examples)
  assert.equal(PortfolioAnalytics.stddev_([2, 4, 4, 4, 5, 5, 7, 9]), 2, 'Wikipedia standard deviation');
});


QUnit.test('Skewness computation', function(assert) {      
  // Skewness of one value is NaN, as variance is 0
  assert.deepEqual(PortfolioAnalytics.skewness_([1]), NaN, 'Skewness of one number');
  
  // Skewness of two values can be NaN (if variance is 0), or a number
  assert.deepEqual(PortfolioAnalytics.skewness_([1, 1]), NaN, 'Skewness of two numbers #1');
  assert.equal(PortfolioAnalytics.skewness_([1, 2]), 0, 'Skewness of two numbers #2');
  
  // Sample skewness of less than 2 numbers is NaN
  assert.deepEqual(PortfolioAnalytics.sampleSkewness_([1]), NaN, 'Sample skewness of one number');
  assert.deepEqual(PortfolioAnalytics.sampleSkewness_([1, 2]), NaN, 'Sample skewness of two numbers');

  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.skewness_(this.SpiegelHeights), -0.10815437112298999, 'Spiegel skewness'); 
  assert.equal(PortfolioAnalytics.sampleSkewness_(this.SpiegelHeights), -0.10980840870973678, 'Spiegel sample skewness'); 
  
  // Bacon portfolio test
  assert.equal(Math.abs(PortfolioAnalytics.skewness_(this.BaconReturns) + 114.99/(Math.pow(Math.sqrt(359.74/24),3) * 24)) <= 1e-15, true, 'Bacon skewness');
  assert.equal(Math.abs(PortfolioAnalytics.sampleSkewness_(this.BaconReturns)+ 114.99/Math.pow(Math.sqrt(359.74/23),3) * 24 / (23 * 22)) <= 1e-15, true, 'Bacon sample skewness');
});


QUnit.test('Kurtosis computation', function(assert) {      
  // Kurtosis of one values is NaN, as variance is 0
  assert.deepEqual(PortfolioAnalytics.kurtosis_([1]), NaN, 'Kurtosis of one number');
  
  // Kurtosis of 2/3 values can be NaN (if variance is 0) or a number
  assert.equal(PortfolioAnalytics.kurtosis_([1, 2]), 1, 'Kurtosis of two numbers');
  assert.equal(PortfolioAnalytics.kurtosis_([1, 2, 3]), 1.5, 'Kurtosis of three numbers');
  assert.deepEqual(PortfolioAnalytics.kurtosis_([1, 1]), NaN, 'Kurtosis of two numbers #2');
  assert.deepEqual(PortfolioAnalytics.kurtosis_([1, 1, 1]), NaN, 'Kurtosis of three numbers #2');

  // Sample kurtosis of less than 3 numbers is NaN
  assert.deepEqual(PortfolioAnalytics.sampleKurtosis_([1]), NaN, 'Sample kurtosis of one number');
  assert.deepEqual(PortfolioAnalytics.sampleKurtosis_([1, 2]), NaN, 'Sample kurtosis of two numbers');
  assert.deepEqual(PortfolioAnalytics.sampleKurtosis_([1, 2, 3]), NaN, 'Sample kurtosis of three numbers');
  
  // Spiegel heigths test
  assert.equal(PortfolioAnalytics.kurtosis_(this.SpiegelHeights), 2.741758968539624, 'Spiegel kurtosis'); 
  assert.equal(PortfolioAnalytics.sampleKurtosis_(this.SpiegelHeights), 2.7908529272488636, 'Spiegel sample kurtosis'); 
  
  // Coming from D. N. Joanes and C. A. Gill, Comparing Measures of Sample Skewness and Kurtosis, Journal of the Royal Statistical Society. Series D (The Statistician), Vol. 47, No. 1 (1998), pp. 183-189
  assert.equal(PortfolioAnalytics.sampleKurtosis_([10, 11, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 16, 17]), 3.274318984817186, 'Joanes & Grill sample kurtosis'); 
    
  // Wikipedia test (https://en.wikipedia.org/wiki/Kurtosis#Sample_kurtosis)
  assert.equal(PortfolioAnalytics.kurtosis_([0, 3, 4, 1, 2, 3, 0, 2, 1, 3, 2, 0, 2, 2, 3, 2, 5, 2, 3, 999]), 18.051426543784185, 'Wikipedia kurtosis'); 
  
  // Bacon portfolio test
  assert.equal(Math.abs(PortfolioAnalytics.kurtosis_(this.BaconReturns) - 13116.28/(Math.pow(Math.sqrt(359.74/24),4) * 24)) <= 1e-6, true, 'Bacon kurtosis');
  assert.equal(Math.abs(PortfolioAnalytics.sampleKurtosis_(this.BaconReturns) - (13116.28/Math.pow(Math.sqrt(359.74/23),4) * (24 * 25)/ (23 * 22 * 21) - 3 * (23 * 23)/(22 * 21) + 3)) <= 1e-6, true,  'Bacon sample kurtosis	');
});


QUnit.test('Sample moments computation', function(assert) {      
  // Generate random data
  var testData = new Array(100);
  for (var i=0; i<100; ++i) {
    testData[i] = Math.random();
  }
  
  // Check that the result of the sampleMoments function is the same as the
  // different functions, using the generated random data
  var moments = PortfolioAnalytics.sampleMoments_(testData);
  assert.equal(PortfolioAnalytics.mean_(testData), moments[0], 'Mean equality');
  assert.equal(PortfolioAnalytics.sampleVariance_(testData), moments[1], 'Sample variance equality');
  assert.equal(PortfolioAnalytics.sampleStddev_(testData), moments[2], 'Sample standard deviation equality');
  assert.equal(PortfolioAnalytics.sampleSkewness_(testData), moments[3], 'Sample skewness equality');
  assert.equal(PortfolioAnalytics.sampleKurtosis_(testData), moments[4], 'Sample kurtosis equality');
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
  
  // Bacon Downside Potential
  assert.equal(PortfolioAnalytics.lpm_(this.BaconReturns, 1, 0.005), 0.329/24 - 0.000000000000000004, 'Lpm Bacon');
});


QUnit.test('Hpm computation', function(assert) {    
  // Uses identity hpm(x,1,0) == mean(x) if x >= 0
  var testArrayPositive = [];
  for (var i=1; i<=10; ++i) {
	testArrayPositive.push(i);
	assert.equal(PortfolioAnalytics.hpm_(testArrayPositive, 1, 0.0), PortfolioAnalytics.mean_(testArrayPositive), 'Hpm 1 #' + i);
  } 
  
  // Bacon Upside Potential
  assert.equal(PortfolioAnalytics.hpm_(this.BaconReturns, 1, 0.005), 0.425/24, 'Hpm Bacon');

});
