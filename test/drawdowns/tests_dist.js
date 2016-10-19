// ------------------------------------------------------------
QUnit.module('Drawdowns module', {
  before: function() {
    this.complexEquityCurve = [60, 40, 80, 140, 100, 90, 110, 70, 100, 130, 110, 120, 90, 150, 120, 130];
	this.BaconEquityCurve = [100, 100.3, 102.9078, 104.0397858, 102.9993879, 104.5443788, 107.1579882, 108.872516, 116.1669746, 114.540637, 119.1222625, 118.5266511, 
           128.1273099, 133.2524023, 128.3220634, 120.4944175, 122.5428226, 116.5382243, 113.9743834, 121.9525902, 129.0258404, 120.6391608, 123.5345007, 122.9168282, 121.8105767];
  }
});


QUnit.test('Max drawdown incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown();
    },
    new Error("input must be an array"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown([-100]);
    },
    new Error ("input must be a positive number"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Max drawdown computation', function(assert) {    
  assert.equal(PortfolioAnalytics.maxDrawdown([100]), 0, 'No max drawdown #1');
  assert.equal(PortfolioAnalytics.maxDrawdown([100, 110]), 0, 'No max drawdown #2');
  assert.equal(PortfolioAnalytics.maxDrawdown([]), 0, 'No max drawdown #3');
  
  assert.equal(PortfolioAnalytics.maxDrawdown([100, 90]), 0.1, 'Simple max drawdown #1');
  assert.equal(PortfolioAnalytics.maxDrawdown([100, 90, 80]), 0.2, 'Simple max drawdown #2');
  
  assert.equal(PortfolioAnalytics.maxDrawdown(this.complexEquityCurve), 
                                              0.5, 
                                              'Complex max drawdown #1');
  assert.equal(PortfolioAnalytics.maxDrawdown(this.BaconEquityCurve), 
                                              0.14467295573852484, 
                                              'Complex max drawdown #2');
});



QUnit.test('Drawdown function incorrect input arguments', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.drawdownFunction();
    },
    new Error("input must be an array"),
    "No input arguments"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.drawdownFunction([-100]);
    },
    new Error ("input must be a positive number"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Drawdown function computation', function(assert) {
  assert.deepEqual(PortfolioAnalytics.drawdownFunction([100]), 
                                                       [0], 
                                                       'Simple drawdown function #1');
  assert.deepEqual(PortfolioAnalytics.drawdownFunction([100, 90, 90, 80, 100]), 
                                                       [0, 0.1, 0.1, 0.2, 0], 
                                                       'Simple drawdown function #2');
  
  assert.deepEqual(PortfolioAnalytics.drawdownFunction(this.complexEquityCurve, 0, this.complexEquityCurve.length-1), 
                                                       	[0,
                                                         0.3333333333333333,
                                                         0,
                                                         0,
                                                         0.2857142857142857,
                                                         0.35714285714285715,
                                                         0.21428571428571427,
                                                         0.5,
                                                         0.2857142857142857,
                                                         0.07142857142857142,
                                                         0.21428571428571427,
                                                         0.14285714285714285,
                                                         0.35714285714285715,
                                                         0,
                                                         0.2,
                                                         0.13333333333333333
                                                        ], 
                                                       'Complex drawdown function #1');
  assert.deepEqual(PortfolioAnalytics.drawdownFunction(this.BaconEquityCurve, 0, this.BaconEquityCurve.length-1), 
                                                       	[0.0, 0.0, 0.0, 0.0, 0.010000000403691738, 0.0, 0.0, 0.0, 0.0, 0.013999999617791537, 0.0, 0.005000000734539523, 
														0.0, 0.0, 0.03700000011181794, 0.0957430003496455, 0.0803706313368281, 0.1254324703457898, 0.14467295573852484, 0.0848000629253946, 0.031718466812211514, 0.0946567662742993, 0.07292852835869665, 0.0775638856906372, 0.0858658110661319], 
                                                       'Complex drawdown function #2');
});


QUnit.test('Top drawdowns incorrect input arguments', function(assert) {
  assert.throws(function() {
      PortfolioAnalytics.topDrawdowns();
    },
    new Error("input must be an array"),
    "No input arguments"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.topDrawdowns([-100.01], 1);
    },
    new Error ("input must be a positive number"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js

  
  assert.throws(function() {
      PortfolioAnalytics.topDrawdowns([1]);
    },
    new Error("input must be a positive integer"),
    "No top drawdowns argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.topDrawdowns([1], 'a');
    },
    new Error("input must be a positive integer"),
    "No integer top drawdowns argument"
  );
});


QUnit.test('Top drawdowns computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([1, 2, 1], 1), 
                                                   [[0.5, 1, 2]], 'Simple top drawdown #1');
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([1, 2, 1], 2), 
                                                   [[0.5, 1, 2]], 'Simple top drawdown #2');
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([], 1), 
                                                   [], 'Simple top drawdown #3');
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([1, 2, 1], 0), 
                                                   [], 'Simple top drawdown #4');
												   
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([100, 150, 75, 150, 75], 2), 
                                                   [[0.5, 1, 2], [0.5, 3, 4]],
                                                   'Ties in top drawdowns'); 
  
  assert.equal(PortfolioAnalytics.topDrawdowns([1, 2, 1], 1)[0][0], 
               PortfolioAnalytics.maxDrawdown([1, 2, 1]), 
               'Top 1 drawdown consistency with max drawdown');
               
  assert.deepEqual(PortfolioAnalytics.topDrawdowns(this.complexEquityCurve, 5), 
                                                   [[0.5, 3.0, 7.0], 
                                                    [0.33333333333333333, 0.0, 1.0], 
                                                    [0.3076923076923077, 9.0, 12.0], 
                                                    [0.2, 13.0, 14.0]
                                                   ], 
                                                   'Complex top drawdown #1');
  assert.deepEqual(PortfolioAnalytics.topDrawdowns(this.BaconEquityCurve, 3), 
                                                   [[0.14467295573852484, 13.0, 18.0], 
												    [0.06499999979848993, 20.0, 21.0], 
													[0.013999999617791537, 8.0, 9.0]
                                                   ], 
                                                   'Complex top drawdown #2');
												   
  var sp500 = [4153.98,4075.35,4474.03,4339.43,4250.40,4355.18,4287.09,4553.38,4312.99,4294.76,3956.16,3975.53,
               4116.57,3741.22,3504.21,3776.52,3801.83,3709.29,3672.78,3442.86,3164.84,3225.19,3472.58,3503.00,
			   3451.88,3385.31,3512.63,3299.67,3275.36,3042.05,2804.91,2823.33,2516.49,2737.98,2899.14,2728.82,
			   2657.33,2617.46,2642.88,2860.57,3011.29,3049.70,3103.47,3164.00,3130.40,3307.48,3336.58,3511.57,
			   3576.02,3625.73,3571.03,3514.97,3563.21,3632.49,3512.27,3526.48,3564.67,3619.13,3765.56,3893.70,
			   3798.79,3878.73,3810.05,3737.79,3856.72,3862.20,4005.82,3969.28,4001.42,3934.72,4083.54,4084.96,
			   4193.12,4204.50,4256.83,4313.99,4189.83,4195.51,4221.39,4321.83,4433.20,4577.66,4664.71,4730.15,
			   4801.68,4707.77,4760.42,4971.29,5144.76,5059.29,4902.43,4975.91,5162.01,5244.12,5024.88,4990.02,
			   4690.71,4538.33,4518.73,4738.81,4800.19,4395.52,4358.57,4421.61,4027.61,3351.18,3110.72,3143.82,
			   2878.84,2572.31,2797.63,3065.39,3236.84,3243.26,3488.58,3614.53,3749.41,3679.75,3900.48,3975.82,
			   3832.79,3951.52,4189.97,4256.12,3916.27,3711.26,3971.28,3792.00,4130.42,4287.58,4288.13,4574.71,
			   4683.14,4843.58,4845.50,4989.00,4932.53,4850.31,4751.68,4493.56,4177.67,4634.26,4624.02,4671.32,
			   4880.66,5091.71,5259.28,5226.26,4912.16,5114.55,5185.59,5302.38,5439.41,5338.97,5369.94,5418.89,
			   5699.56,5776.93,5993.59,6109.06,6251.96,6168.01,6481.86,6294.14,6491.52,6789.92,6996.83,7173.97,
			   6925.93,7242.75,7303.63,7357.62,7530.33,7685.89,7579.90,7883.13,7772.58,7962.43,8176.57,8155.98
			   ];
  assert.deepEqual(PortfolioAnalytics.topDrawdowns(sp500, 10), 
                                                   [[0.5094868157097855, 93, 109],
													  [0.4473358252550853, 7, 32],
													  [0.16262377229905792, 135, 140],
													  [0.12801800701108043, 123, 125],
													  [0.09715984740302291, 34, 37],
													  [0.06600142985351605, 146, 148],
													  [0.04998401888230524, 2, 4],
													  [0.047102294373304085, 88, 90],
													  [0.04514413488849947, 126, 127],
													  [0.04004160567069879, 59, 63]
													], 
                                                   'Complex top drawdown #3');
});
