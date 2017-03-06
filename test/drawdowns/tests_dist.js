// ------------------------------------------------------------
QUnit.module('Drawdowns module', {
  before: function() {
    // Coming from "Ambiguity in Calculating and Interpreting Maximum Drawdown, Research Note, Andreas Steiner Consulting GmbH, December 2010"
	this.complexEquityCurve = [60, 40, 80, 140, 100, 90, 110, 70, 100, 130, 110, 120, 90, 150, 120, 130];
	
	// Coming from "Practical Portfolio Performance Measurement and Attribution, 2nd Edition, Carl R. Bacon."
	this.BaconEquityCurve = [100, 100.3, 102.9078, 104.0397858, 102.9993879, 104.5443788, 107.1579882, 108.872516, 116.1669746, 114.540637, 119.1222625, 118.5266511, 
           128.1273099, 133.2524023, 128.3220634, 120.4944175, 122.5428226, 116.5382243, 113.9743834, 121.9525902, 129.0258404, 120.6391608, 123.5345007, 122.9168282, 121.8105767];
    
  }
});


QUnit.test('Max drawdown incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown([-100]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.maxDrawdown([]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Max drawdown computation', function(assert) {    
  assert.equal(PortfolioAnalytics.maxDrawdown([100]), 0, 'No max drawdown #1');
  assert.equal(PortfolioAnalytics.maxDrawdown([100, 110]), 0, 'No max drawdown #2');

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
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.drawdownFunction([-100]);
    },
    new Error ("input must be an array of positive numbers"),
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

  assert.deepEqual(PortfolioAnalytics.drawdownFunction(new Float64Array([100, 90, 90, 80, 100])), 
                                                       new Float64Array([0, 0.1, 0.1, 0.2, 0]), 
                                                       'Simple drawdown function with typed array');
													   
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
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.topDrawdowns([-100.01], 1);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
   
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
  
  assert.throws(function() {
      PortfolioAnalytics.topDrawdowns([], 1);
    },
    new Error("input must be an array of positive numbers"),
    "No integer top drawdowns argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Top drawdowns computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([1, 2, 1], 1), 
                                                   [[0.5, 1, 2]], 'Simple top drawdown #1');
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([1, 2, 1], 2), 
                                                   [[0.5, 1, 2]], 'Simple top drawdown #2');
  assert.deepEqual(PortfolioAnalytics.topDrawdowns([1, 2, 1], 0), 
                                                   [], 'Simple top drawdown #3');
												   
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
												   
  // Coming from the monthly values of the S&P500, 2000 - 2014
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


QUnit.test('Ulcer index incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.ulcerIndex();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.ulcerIndex([-100]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Ulcer index computation', function(assert) {   
  	// Coming from the Excel Sheet associated to http://www.tangotools.com/ui/ui.htm
	var testDataUlcerIndex = [352.20,339.93,339.15,325.80,330.92,333.62,332.72,324.15,335.54,337.93,341.91,337.22,339.94,340.08,344.34,335.12,329.11,338.39,352.00,354.64,354.58,363.16,358.71,362.91,355.43,358.02,358.42,367.31,361.61,353.44,344.86,335.52,327.83,311.51,322.56,323.40,316.83,311.32,306.05,311.50,300.03,312.48,304.71,311.85,313.74,317.12,315.10,322.22,327.75,326.82,331.75,328.72,321.00,315.23,332.23,336.07,343.05,359.35,369.06,365.65,370.47,374.95,373.59,367.48,375.22,375.36,380.40,384.20,379.02,380.80,375.74,372.39,377.49,389.83,379.43,382.29,377.75,371.16,374.08,380.25,384.22,380.93,387.18,387.12,385.58,394.17,395.43,389.10,383.59,387.92,385.90,381.25,381.45,392.50,384.20,391.32,392.89,382.62,376.14,375.22,379.10,384.47,387.04,406.46,419.34,415.10,418.86,415.48,408.78,411.09,412.48,411.43,412.70,404.44,405.84,411.30,403.50,401.55,404.29,416.04,409.02,412.53,416.05,410.09,414.02,415.35,413.48,409.76,403.67,403.45,411.77,414.62,415.62,411.60,424.21,418.88,419.91,414.85,414.84,417.08,419.58,422.93,414.35,410.47,402.66,411.73,414.10,418.68,417.58,422.43,426.65,430.16,432.06,433.73,441.28,439.77,435.71,429.05,437.15,436.11,438.78,448.93,444.58,434.22,443.38,446.11,449.83,450.18,447.78,441.39,441.84,448.94,437.03,440.19,442.31,439.56,445.84,450.19,450.06,447.26,443.68,447.60,445.84,448.11,445.75,447.10,448.13,448.68,450.14,456.16,460.54,461.34,461.72,458.83,457.63,461.28,460.31,469.50,463.27,467.83,459.57,465.39,462.60,463.06,464.89,463.93,466.38,467.38,466.45,469.90,474.91,474.72,478.70,469.81,470.18,467.69,466.07,464.74,466.44,471.06,460.58,445.77,447.10,446.18,447.63,450.91,447.82,444.14,454.92,457.33,460.13,458.67,458.45,442.80,446.20,449.55,454.16,453.11,458.26,457.09,461.94,463.68,473.80,470.99,468.18,471.19,459.67,462.71,455.10,469.10,464.89,473.77,462.28,462.35,461.47,452.29,453.30,446.96,458.80,459.83,459.27,460.68,465.97,464.78,470.39,478.65,481.46,481.97,488.11,485.42,489.57,495.52,500.97,500.71,506.42,509.23,508.49,514.71,520.12,525.55,519.19,523.65,532.51,527.94,539.83,549.71,544.75,556.37,559.89,553.62,562.93,558.94,555.11,559.21,560.10,563.84,572.68,583.35,581.73,584.41,582.49,584.50,587.46,579.70,590.57,592.72,600.07,599.97,606.98,617.48,616.34,611.95,615.93,616.71,601.81,611.83,621.62,635.84,656.37,647.98,659.08,644.37,633.50,641.43,650.62,645.50,655.86,636.71,645.07,653.46,641.63,652.09,668.91,678.51,669.12,673.31,665.85,666.84,670.63,657.44,646.19,638.73,635.90,662.49,662.10,665.21,667.03,651.99,655.68,680.54,687.03,686.19,701.46,700.66,710.82,700.92,703.77,730.82,737.62,748.73,757.02,739.60,728.64,748.87,756.79,748.03,759.50,776.17,770.52,786.16,789.56,808.48,801.77,790.82,804.97,793.17,784.10,773.88,757.90,737.65,766.34,765.37,812.97,824.78,829.75,847.03,848.28,858.01,893.27,898.70,887.30,916.92,916.68,915.30,938.79,947.14,933.54,900.81,923.54,899.47,929.05,923.91,950.51,945.22,965.03,966.98,944.16,941.64,914.62,927.51,928.35,963.09,955.40,983.79,953.39,946.78,936.46,975.04,927.69,961.51,957.59,980.28,1012.46,1020.09,1034.21,1049.34,1055.69,1068.61,1099.16,1095.44,1122.70,1110.67,1122.72,1107.90,1121.00,1108.14,1108.73,1110.47,1090.82,1113.86,1098.84,1100.65,1133.20,1146.42,1164.33,1186.75,1140.80,1120.67,1089.45,1062.75,1081.24,1027.14,973.89,1009.06,1020.09,1044.75,1002.60,984.39,1056.42,1070.67,1098.67,1141.01,1125.72,1163.55,1192.33,1176.74,1166.46,1188.03,1226.27,1229.23,1275.09,1243.26,1225.19,1279.64,1239.40,1230.13,1239.22,1238.33,1275.47,1294.59,1299.29,1282.80,1293.72,1348.35,1319.00,1356.85,1335.18,1345.00,1337.80,1330.29,1301.84,1327.75,1293.64,1342.84,1315.31,1391.22,1403.28,1418.78,1356.94,1328.72,1300.29,1327.68,1336.61,1348.27,1357.24,1351.66,1335.42,1277.36,1282.81,1336.02,1247.41,1301.65,1362.93,1370.23,1396.06,1422.00,1416.62,1433.30,1417.04,1421.03,1458.34,1469.25,1441.47,1465.15,1441.36,1360.16,1424.37,1387.12,1346.09,1333.36,1409.17,1395.07,1464.47,1527.46,1498.58,1516.35,1356.56,1434.54,1452.43,1432.63,1420.96,1406.95,1378.02,1477.26,1456.95,1464.46,1441.48,1454.60,1478.90,1509.98,1480.19,1419.89,1462.93,1471.84,1491.72,1506.45,1520.77,1494.50,1465.81,1448.72,1436.51,1408.99,1374.17,1396.93,1379.58,1426.69,1365.98,1367.72,1341.77,1315.23,1369.89,1312.15,1305.95,1320.28,1298.35,1318.55,1342.54,1354.95,1349.47,1314.76,1301.53,1245.86,1234.18,1233.42,1150.53,1139.83,1160.33,1128.43,1183.50,1242.98,1253.05,1266.61,1245.67,1291.96,1277.89,1260.67,1264.96,1214.36,1225.35,1224.38,1190.59,1215.68,1210.85,1205.82,1214.35,1190.16,1161.97,1184.93,1133.58,1085.78,965.80,1040.94,1071.38,1091.65,1073.48,1104.61,1087.20,1120.31,1138.65,1150.34,1139.45,1158.31,1123.09,1144.89,1161.02,1172.51,1145.60,1127.58,1133.28,1122.20,1096.22,1104.18,1089.84,1131.78,1164.31,1166.16,1148.70,1147.39,1122.73,1111.01,1125.17,1076.32,1073.43,1054.99,1106.59,1083.82,1067.14,1027.53,1007.27,989.14,989.82,989.03,921.39,847.75,852.84,864.24,908.64,928.77,940.86,916.07,893.92,889.81,845.39,827.37,800.58,835.32,884.39,897.65,900.96,894.74,909.83,930.55,936.31,912.23,889.48,895.76,875.40,908.59,927.57,901.78,861.40,855.70,829.69,834.89,848.17,841.15,828.89,833.27,895.79,863.50,878.85,868.30,893.58,898.81,930.08,933.41,944.30,933.22,963.59,987.76,988.61,995.69,976.22,985.70,998.14,993.32,998.68,980.15,977.59,990.67,993.06,1008.01,1021.39,1018.63,1036.30,996.85,1029.85,1038.06,1039.32,1028.91,1050.71,1053.21,1050.35,1035.28,1058.20,1061.50,1074.14,1088.66,1095.89,1108.48,1121.86,1139.83,1141.55,1131.13,1142.76,1145.81,1144.11,1144.94,1156.86,1120.57,1109.78,1108.06,1141.81,1139.32,1134.61,1140.60,1107.30,1098.70,1095.70,1093.56,1120.68,1122.50,1136.47,1135.02,1134.43,1125.38,1112.81,1101.39,1086.20,1101.72,1063.97,1064.80,1098.35,1107.77,1113.63,1123.92,1128.55,1110.11,1131.50,1122.14,1108.20,1095.74,1130.20,1166.17,1184.17,1170.34,1182.65,1191.17,1188.00,1194.20,1210.13,1211.92,1186.19,1184.52,1167.87,1171.36,1203.03,1205.30,1201.59,1211.37,1222.12,1200.08,1189.65,1171.42,1172.92,1181.20,1142.62,1152.12,1156.85,1171.35,1154.05,1189.28,1198.78,1196.02,1198.11,1216.96,1191.57,1194.44,1211.86,1227.92,1233.68,1234.18,1226.42,1230.39,1219.71,1205.10,1218.02,1241.48,1237.91,1215.29,1228.81,1195.90,1186.57,1179.59,1198.41,1220.14,1234.72,1248.27,1268.25,1265.08,1259.37,1267.32,1268.66,1248.29,1285.45,1287.61,1261.49,1283.72,1264.03,1266.99,1287.24,1289.43,1287.23,1281.42,1307.25,1302.95,1294.87,1295.50,1289.12,1311.28,1310.61,1325.76,1291.24,1267.03,1280.16,1288.22,1252.30,1251.54,1244.50,1270.20,1265.48,1236.20,1240.29,1278.55,1279.36,1266.74,1302.30,1295.09,1311.01,1298.92,1319.66,1314.78,1335.85,1349.59,1365.62,1368.60,1377.34,1364.30,1380.90,1401.20,1400.95,1396.71,1409.84,1427.09,1410.76,1418.30,1409.71,1430.73,1430.50,1422.18,1448.39,1438.06,1455.54,1451.19,1387.17,1402.84,1386.95,1436.11,1420.86,1443.76,1452.85,1484.35,1494.07,1505.62,1509.48];
	
	assert.equal(PortfolioAnalytics.ulcerIndex(testDataUlcerIndex), 
                 0.16538498426084833, 
                'Ulcer Index computation with Peter G. Martin example');			
				
});


QUnit.test('Pain index incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.painIndex();
    },
    new Error("input must be an array of positive numbers"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.painIndex([-100]);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Pain index computation', function(assert) {   
  assert.equal(PortfolioAnalytics.painIndex([1, 2, 1]), 
               0.16666666666666666, 
              'Simple pain index #1');				

  assert.equal(PortfolioAnalytics.painIndex([100, 50, 25, 12.5]), 
               0.53125, 
              'Simple pain index #2');				

				
  var aTestData = [100, 50, 25, 12.5];
  var aDdFunc = PortfolioAnalytics.drawdownFunction(aTestData);
  var aAvgDdFunc = 0.0;
  for (var i=0; i<aTestData.length; ++i) {
    aAvgDdFunc += aDdFunc[i];
  }
  aAvgDdFunc /= aTestData.length;
  assert.equal(PortfolioAnalytics.painIndex(aTestData), 
               aAvgDdFunc, 
              'Pain index equals to average of the drawdown function values');
});


QUnit.test('Conditional drawdown incorrect input arguments', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.conditionalDrawdown();
    },
    new Error("input(s) must be a number"),
    "No input arguments"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.conditionalDrawdown([-100]);
    },
    new Error ("input(s) must be a number"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.conditionalDrawdown([-100], 1);
    },
    new Error ("input must be an array of positive numbers"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.conditionalDrawdown([100], -0.01);
    },
    new Error ("input must be bounded between 0 and 1"),
    "Negative numeric array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.conditionalDrawdown([100], 1.01);
    },
    new Error ("input must be bounded between 0 and 1"),
    "Negative numeric array input argument"
  );
  
  // Other tests are delegated to the unit tests of types.js
});


QUnit.test('Conditional drawdown computation', function(assert) {   
  assert.equal(PortfolioAnalytics.conditionalDrawdown([100, 110], 0.5), 
                 0, 
                'No conditional drawdown');
				

  var aTestData = [100, 90, 80, 70, 60, 50, 40, 30, 20];
  
  // C.f. reference Example 3.1
  assert.equal(PortfolioAnalytics.conditionalDrawdown(aTestData, 0.7), 
                 0.725, 
                'Simple conditional drawdown #1');
  
  // C.f. reference Example 3.2
  assert.equal(PortfolioAnalytics.conditionalDrawdown(aTestData, 1), 
               PortfolioAnalytics.maxDrawdown(aTestData), 
               '1-conditional drawdown equals to maximum drawdown');
			   
  // C.f. reference Example 3.2
  var aDdFunc = PortfolioAnalytics.drawdownFunction(aTestData);
  var aAvgDdFunc = (aDdFunc[1] + aDdFunc[2]) + (aDdFunc[3] + aDdFunc[4]) + (aDdFunc[5] + aDdFunc[6]) + (aDdFunc[7] + aDdFunc[8])
  aAvgDdFunc /= (aTestData.length-1);
  assert.equal(PortfolioAnalytics.conditionalDrawdown(aTestData, 0), 
               aAvgDdFunc, 
               '0-conditional drawdown equals to average of the drawdown function values minus the first one');

			   
  assert.equal(PortfolioAnalytics.conditionalDrawdown([100, 90, 80], 0.5), 
                 0.2, 
                'Simple conditional drawdown #2');
});
