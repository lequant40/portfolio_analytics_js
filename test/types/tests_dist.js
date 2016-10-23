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


QUnit.test('Number', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertNumber_();
    },
    new Error("input must be a number"),
    "No input argument"
  );
 
  assert.throws(function() {
      PortfolioAnalytics.assertNumber_(NaN);
    },
    new Error("input must be a number"),
    "NaN input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertNumber_(Infinity);
    },
    new Error("input must be a number"),
    "Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertNumber_(-Infinity);
    },
    new Error("input must be a number"),
    "-Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertNumber_('1');
    },
    new Error("input must be a number"),
    "String input argument"
  );
  
 
  PortfolioAnalytics.assertNumber_(1);
  assert.ok(true, "One number input argument");
  
  PortfolioAnalytics.assertNumber_(1.1);
  assert.ok(true, "One dot one number input argument");

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


QUnit.test('Bounded number', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_();
    },
    new Error("input(s) must be a number"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(-2.3);
    },
    new Error("input(s) must be a number"),
    "Negative number input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(NaN);
    },
    new Error("input(s) must be a number"),
    "NaN input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(Infinity);
    },
    new Error("input(s) must be a number"),
    "Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(-Infinity);
    },
    new Error("input(s) must be a number"),
    "-Infinity input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_('1');
    },
    new Error("input(s) must be a number"),
    "String input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(1, NaN, 1);
    },
    new Error("input(s) must be a number"),
    "NaN lower boundary argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(1, 0, NaN);
    },
    new Error("input(s) must be a number"),
    "NaN upper boundary argument"
  );
  
  
  PortfolioAnalytics.assertBoundedNumber_(0, 0, 0);
  assert.ok(true, "Zero numbers input arguments");
  
  PortfolioAnalytics.assertBoundedNumber_(1.2, 0, 2);
  assert.ok(true, "Positive numbers input arguments");
  
  PortfolioAnalytics.assertBoundedNumber_(-1.2, -2, 0);
  assert.ok(true, "Negative numbers input arguments");
  
  
  assert.throws(function() {
      PortfolioAnalytics.assertBoundedNumber_(1.1, 0, 1);
    },
    new Error("input must be bounded between 0 and 1"),
    "Not bounded input argument"
  );
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

