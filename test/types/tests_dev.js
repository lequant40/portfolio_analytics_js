// ------------------------------------------------------------
QUnit.module('Types internal module', {
});


QUnit.test('Array', function(assert) {   
  assert.throws(function() {
      PortfolioAnalytics.assertArray_();
    },
    new Error("input must be an array"),
    "No input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertArray_(1);
    },
    new Error("input must be an array"),
    "No array input argument"
  );
  
  
  PortfolioAnalytics.assertArray_([]);
  assert.ok(true, "Empty array input argument");

  PortfolioAnalytics.assertArray_(['a']);
  assert.ok(true, "Non empty array input argument");  
});


QUnit.test('Positive number', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber_();
    },
    new Error("input must be a positive number"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber_(-2.3);
    },
    new Error("input must be a positive number"),
    "Negative number input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber_(NaN);
    },
    new Error("input must be a positive number"),
    "NaN input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber_(Infinity);
    },
    new Error("input must be a positive number"),
    "Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber_(-Infinity);
    },
    new Error("input must be a positive number"),
    "-Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumber_('1');
    },
    new Error("input must be a positive number"),
    "String input argument"
  );
  
  
  PortfolioAnalytics.assertPositiveNumber_(0);
  assert.ok(true, "Zero number input argument");
  
  PortfolioAnalytics.assertPositiveNumber_(1.2);
  assert.ok(true, "Positive number input argument");
});


QUnit.test('Positive integer', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_();
    },
    new Error("input must be a positive integer"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_(-2.3);
    },
    new Error("input must be a positive integer"),
    "Negative number input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_(-2);
    },
    new Error("input must be a positive integer"),
    "Negative integer input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_(NaN);
    },
    new Error("input must be a positive integer"),
    "NaN input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_(Infinity);
    },
    new Error("input must be a positive integer"),
    "Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_(-Infinity);
    },
    new Error("input must be a positive integer"),
    "-Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveInteger_('1');
    },
    new Error("input must be a positive integer"),
    "String input argument"
  );
  
  
  PortfolioAnalytics.assertPositiveInteger_(0);
  assert.ok(true, "Zero number input argument");

  PortfolioAnalytics.assertPositiveInteger_(1);
  assert.ok(true, "Positive integer input argument");
});


