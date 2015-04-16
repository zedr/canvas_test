(function () {
  "use strict";

  var tests = [],
      karmaFiles = window.__karma__.files;

  for (var fileName in karmaFiles) {
    if (karmaFiles.hasOwnProperty(fileName) && /Spec\.js$/.test(fileName)) {
      tests.push(fileName);
    }
  }

  requirejs.config({
    baseUrl: '/base/src',

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
  });

}());
