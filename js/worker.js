// this script assumes jQuery has already been loaded
require("babel-polyfill");

var Layout = require('chordscribe-engine');

var doc = null;
var fontsLoaded = false;

onmessage = function(msg) {
  if (msg.data.action == 'load') load(msg.data);
  if (msg.data.action == 'build') build(msg.data);
};

function load(msg) {
  msg.data.fontFiles = {
    'regular': '../fonts/OpenSans/OpenSans-Regular.ttf',
    'bold': '../fonts/OpenSans/OpenSans-Bold.ttf'
  };
  fontsLoaded = false;
  doc = null;
  if (!msg.data) {
    msg.success = false;
    msg.error = "No chord data found.";
    return postMessage(msg);
  }
  doc = new Layout(msg.data);
  doc.loadDefaultDecorations();
  doc.loadDecoration('openskiesheader', require('./decorations/openskiesheader.js'));
  doc.loadDecoration('openskiesfooter', require('./decorations/openskiesfooter.js'));
  doc.loadFontsBrowser(function(err) {
    if (err) {
      msg.success = false;
      msg.error = err;
      return postMessage(msg);
    } else {
      fontsLoaded = true;
      msg.success = true;
      return postMessage(msg);
    }
  });
}

function defaults(dest, source) {
  for (var prop in source) {
    var value = dest[prop];
    if (value === undefined || !dest.hasOwnProperty(prop)) {
      dest[prop] = source[prop];
    }
  }
  return dest;
}

function build(msg) {
  if (!doc) {
    msg.success = false;
    msg.error = "Document hasn't been created.";
    return postMessage(msg);
  }
  if (!fontsLoaded) {
    msg.success = false;
    msg.error = "Fonts aren't loaded.";
    return postMessage(msg);
  }
  if (msg.data) {
    var data = doc.data;
    data = defaults(msg.data, data);
    doc.data = data;
  }
  doc.layout();
  doc.createPDFBlob(function(err, data) {
    if (err) {
      msg.success = false;
      msg.error = err;
      return postMessage(msg);
    } else {
      msg.success = true;
      msg.blob = data;
      return postMessage(msg);
    }
  });
}

/*
console.log('Building PDF...');
doc.downloadPDF();
*/
/*

// generate a PDF from it

console.log('Loading fonts...');

window.test2 = function() {
  doc.data.capo = 3;
  doc.layout();
  doc.downloadPDF();
}
*/