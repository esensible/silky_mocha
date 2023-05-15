var indent = '';
var passCount = 0;
var failCount = 0;

function describe(description, fn) {
  log('\n' + indent + description);
  indent += '   ';
  fn();
  indent = indent.slice(0, -3);
  log(indent + 'Completed: ' + description);
  log(indent + 'Pass: ' + passCount);
  log(indent + 'Fail: ' + failCount);
  // Reset counts for the next describe block
  passCount = 0;
  failCount = 0;
}

function it(msg, fn) {
  try {
    fn();
    log(indent + '✔ ' + msg);
    passCount++;
  } catch (error) {
    log(indent + '✖ ' + msg);
    log(indent + '  ' + error);
    failCount++;
  }
}

function strictEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error('Expected "' + expected + '" but got "' + actual + '"');
  }
}

function log(message) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/log', true);
  xhr.setRequestHeader('Content-Type', 'text/plain');
  xhr.send(message);
}
