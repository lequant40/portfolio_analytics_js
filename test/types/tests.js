// ------------------------------------------------------------
QUnit.module('Types module', {
});


QUnit.test('Array', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.assertArray();
    },
    new Error("input must be an array"),
    "No input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertArray(1);
    },
    new Error("input must be an array"),
    "No array input argument"
  );
  
  
  PortfolioAnalytics.assertArray([]);
  assert.ok(true, "Empty array input argument");

  PortfolioAnalytics.assertArray(['a']);
  assert.ok(true, "Non empty array input argument");  
});


QUnit.test('Positive number', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber();
    },
    new Error("input must be a positive number"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber(-2.3);
    },
    new Error("input must be a positive number"),
    "Negative number input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber(NaN);
    },
    new Error("input must be a positive number"),
    "NaN input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber(Infinity);
    },
    new Error("input must be a positive number"),
    "Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber(-Infinity);
    },
    new Error("input must be a positive number"),
    "-Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber('1');
    },
    new Error("input must be a positive number"),
    "String input argument"
  );
  
  
  PortfolioAnalytics.assertPositiveNumber(0);
  assert.ok(true, "Zero number input argument");
  
  PortfolioAnalytics.assertPositiveNumber(1.2);
  assert.ok(true, "Positive number input argument");
});


QUnit.test('Positive integer', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger();
    },
    new Error("input must be a positive integer"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger(-2.3);
    },
    new Error("input must be a positive integer"),
    "Negative number input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger(-2);
    },
    new Error("input must be a positive integer"),
    "Negative integer input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger(NaN);
    },
    new Error("input must be a positive integer"),
    "NaN input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger(Infinity);
    },
    new Error("input must be a positive integer"),
    "Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger(-Infinity);
    },
    new Error("input must be a positive integer"),
    "-Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger('1');
    },
    new Error("input must be a positive integer"),
    "String input argument"
  );
  
  
  PortfolioAnalytics.assertPositiveInteger(0);
  assert.ok(true, "Zero number input argument");

  PortfolioAnalytics.assertPositiveInteger(1);
  assert.ok(true, "Positive integer input argument");
});


