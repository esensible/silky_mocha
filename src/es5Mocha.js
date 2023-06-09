var indent = '';
var passCount = 0;
var failCount = 0;

function describe(description, fn) {
  try {
    log('\n' + indent + description);
    indent += '   ';
    fn();
    indent = indent.slice(0, -3);
    // log(indent + 'Completed: ' + description);
    // log(indent + 'Pass: ' + passCount);
    // log(indent + 'Fail: ' + failCount);
  } catch (error) {
    log(indent + '✖ OUTER SCOPE');
    log(indent + '  ' + error);
  }

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
      if (error.stack) {
        log(indent + '  Stack trace: ' + error.stack);
      }
      failCount++;
    }
}

function strictEqual(actual, expected) {
  if (actual !== expected) {
    log('Expected "' + expected + '" but got "' + actual + '"');
    throw new Error('Expected "' + expected + '" but got "' + actual + '"');
  }
}

function log(message) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/log', true);
  xhr.setRequestHeader('Content-Type', 'text/plain');
  xhr.send(message);
}

window.onerror = function(message, source, lineno, colno, error) {
  var info = "An error occurred: " + message;
  info += "\nSource: " + source;
  info += "\nLine Number: " + lineno;
  info += "\nColumn Number: " + colno;

  // Check if the browser supports error.stack and if so, add it to the info
  if (error && error.stack) {
      info += "\nStack trace: " + error.stack;
  }

  log(info);

  return true; // If you return true, the error won't be reported in the console
}