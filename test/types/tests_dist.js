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
  
  PortfolioAnalytics.assertArray_(new Float64Array(5));
  assert.ok(true, "Typed array input argument");
});


QUnit.test('Number Array', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertNumberArray_(1);
    },
    new Error("input must be an array of numbers"),
    "No array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertNumberArray_();
    },
    new Error("input must be an array of numbers"),
    "Empty array input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertNumberArray_(['a']);
    },
    new Error("input must be an array of numbers"),
    "String array input argument"
  );
 
  
  PortfolioAnalytics.assertNumberArray_([-100, 110, 1.1]);
  assert.ok(true, "Number array input argument");
});


QUnit.test('Positive Number Array', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumberArray_(1);
    },
    new Error("input must be an array of positive numbers"),
    "No array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumberArray_();
    },
    new Error("input must be an array of positive numbers"),
    "Empty array input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumberArray_(['a']);
    },
    new Error("input must be an array of positive numbers"),
    "String array input argument"
  );
   
  assert.throws(function() {
      PortfolioAnalytics.assertPositiveNumberArray_([-100]);
    },
    new Error("input must be an array of positive numbers"),
    "Negative input argument"
  );
  
  
  PortfolioAnalytics.assertPositiveNumberArray_([100, 110]);
  assert.ok(true, "Positive array input argument");
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


QUnit.test('String', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertString_();
    },
    new Error("input must be a string"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertString_(1.1);
    },
    new Error("input must be a string"),
    "Non string input argument"
  );
  
  PortfolioAnalytics.assertString_("1");
  assert.ok(true, "String input argument");
});


QUnit.test('Date', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertDate_();
    },
    new Error("input must be a date"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertDate_(1.1);
    },
    new Error("input must be a date"),
    "Non date input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertDate_(new Date("2015-02-31"));
    },
    new Error("input must be a date"),
    "Non valid date input argument"
  );
  
  PortfolioAnalytics.assertDate_(new Date("2015-12-31"));
  assert.ok(true, "Date input argument");
});


QUnit.test('Date Array', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertDateArray_(1);
    },
    new Error("input must be an array of dates"),
    "No array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertDateArray_();
    },
    new Error("input must be an array of dates"),
    "Empty array input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertDateArray_(['a']);
    },
    new Error("input must be an array of dates"),
    "String array input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertDateArray_([new Date("2015-12-31"), new Date("2015-12-32")]);
    },
    new Error("input must be an array of dates"),
    "Wrong dates array input argument"
  );  
  
  PortfolioAnalytics.assertDateArray_([new Date("2015-12-31"), new Date("2015-12-31"), new Date("2015-12-31")]);
  assert.ok(true, "All dates array input argument");
});


QUnit.test('String Enumeration', function(assert) {    
  assert.throws(function() {
      PortfolioAnalytics.assertStringEnumeration_();
    },
    new Error("input must be an array of strings"),
    "No input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertStringEnumeration_("test", ["test", 1]);
    },
    new Error("input must be an array of strings"),
    "No string array input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertStringEnumeration_(1, ["test"]);
    },
    new Error("input must be a string equals to any of test"),
    "No string input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertStringEnumeration_("test", ["tes"]);
    },
    new Error("input must be a string equals to any of tes"),
    "Not allowed string input argument"
  );

  PortfolioAnalytics.assertStringEnumeration_("test", ["tes", "test"]);
  assert.ok(true, "String Enumeration input argument");
});


QUnit.test('Same length arrays', function(assert) {     
  assert.throws(function() {
      PortfolioAnalytics.assertSameLengthArrays_();
    },
    new Error("input must be arrays of same length"),
    "Empty arrays input argument"
  );

  assert.throws(function() {
      PortfolioAnalytics.assertSameLengthArrays_(['a']);
    },
    new Error("input must be arrays of same length"),
    "Missing array input argument"
  );
  
  assert.throws(function() {
      PortfolioAnalytics.assertSameLengthArrays_(['a'], []);
    },
    new Error("input must be arrays of same length"),
    "Not same length arrays input argument"
  );
 
  assert.throws(function() {
      PortfolioAnalytics.assertSameLengthArrays_(1, [1]);
    },
    new Error("input must be arrays of same length"),
    "String array input argument"
  );
  
  PortfolioAnalytics.assertSameLengthArrays_([new Date("2015-12-31"), 1], [1, 'a']);
  assert.ok(true, "Same length arrays input argument");
});
