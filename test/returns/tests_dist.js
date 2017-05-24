// ------------------------------------------------------------
QUnit.module('Returns module', {
});


QUnit.test('Cumulative return computation', function(assert) {    
  assert.equal(PortfolioAnalytics.cumulativeReturn([100, 110]), 0.10, 'Ror #1');
  assert.deepEqual(PortfolioAnalytics.cumulativeReturn([100]), NaN, 'Ror #2');
  assert.equal(PortfolioAnalytics.cumulativeReturn([100, 90]), -0.10, 'Ror #3');
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


QUnit.test('Arithmetic returns computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns([100]), [NaN], 'Arithmetic returns #1');
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns([100, 100]), [NaN, 0.0], 'Arithmetic returns #2');
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns([100, 110, 100]), [NaN, 0.10, -0.09090909090909091], 'Arithmetic returns #3');
  
  assert.deepEqual(PortfolioAnalytics.arithmeticReturns(new Float64Array([100.0, 110.0, 100.0])),
                   new Float64Array([NaN, 0.10, -0.09090909090909091]),
				   'Arithmetic returns typed array');
});



QUnit.test('Value at risk computation', function(assert) {    
  assert.deepEqual(PortfolioAnalytics.valueAtRisk([100], 0.50), NaN, 'Value at Risk NaN'); 
  
  assert.equal(PortfolioAnalytics.valueAtRisk([100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110], 0.85), -0.009174311926605505, 'Negative value at Risk');
  
  // Synthetic portfolio
    // Generates 101 portfolio values => 100 portfolio returns, from 1% loss to 40% loss, and then 0% loss
  var aTestPortfolio2 = [100];
  for (var i=1; i<=40; ++i) { aTestPortfolio2[i] = aTestPortfolio2[i-1]*(1-i/100); }
  for (var i=41; i<=101; ++i) { aTestPortfolio2[i] = aTestPortfolio2[i-1]; }
  
    // Then tests each value at risk, through its definition, easily done as 100 returns values
  assert.deepEqual(PortfolioAnalytics.valueAtRisk(aTestPortfolio2, 1), NaN, 'Value at Risk synthetic NaN');
  for (var i=1; i<=40; ++i) {
    assert.ok(Math.abs( PortfolioAnalytics.valueAtRisk(aTestPortfolio2, 1-i/100) - (40-(i-1))/100 ) <= 1e-8, 'Value at Risk synthetic #' + i);
  }
  for (var i=41; i<=100; ++i) {
    assert.equal(PortfolioAnalytics.valueAtRisk(aTestPortfolio2, 1-i/100), 0, 'Value at Risk synthetic #' + i);
  }
});