function resetDOM() {
    var elements = document.body.children;
    for (var i = elements.length - 1; i >= 0; i--) {
        var element = elements[i];
        if (element.getAttribute('keep') !== 'true') {
            document.body.removeChild(element);
        }
    }
}

function loadScript(fileName) {
  var oldScript = document.getElementById("testScript");
  if (oldScript) {
    oldScript.parentNode.removeChild(oldScript);
  }

  var newScript = document.createElement('script');
  newScript.id = "testScript";
  newScript.src = fileName;
  newScript.onload = function() {
    console.log(fileName + ' loaded and executed.');
    // We can only assume the script has finished executing.
    // This doesn't cover the case where the script has asynchronous operations.
    pollServer();
  };

  document.body.appendChild(newScript);
}

function loadStyle(fileName) {
  var oldStyle = document.getElementById("testStyle");
  if (oldStyle) {
    oldStyle.parentNode.removeChild(oldStyle);
  }

  var newStyle = document.createElement('link');
  newStyle.id = "testStyle";
  newStyle.href = fileName;
  newStyle.rel = 'stylesheet';

  document.head.appendChild(newStyle);
}

function pollServer() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/test', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      resetDOM();
      if (typeof response.css !== "undefined") {
        loadStyle(response.css);
      }
      loadScript(response.test);
    }
  };
  xhr.send();
}

// Start the polling
pollServer();
