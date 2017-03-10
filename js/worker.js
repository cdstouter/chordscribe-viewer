// this script assumes jQuery has already been loaded

var Layout = require('chordscribe-engine');
var _ = require('underscore');

var doc = null;
var fontsLoaded = false;

onmessage = function(msg) {
  if (msg.data.action == 'load') load(msg.data);
  if (msg.data.action == 'build') build(msg.data);
};

function load(msg) {
  fontsLoaded = false;
  doc = null;
  if (!msg.data) {
    msg.success = false;
    msg.error = "No chord data found.";
    return postMessage(msg);
  }
  doc = new Layout(msg.data);
  doc.loadDefaultDecorations();
  //doc.loadDecoration('openskiesheader', require('./osp/openskiesheader.js'));
  //doc.loadDecoration('openskiesfooter', require('./osp/openskiesfooter.js'));
  doc.loadFonts(function(err) {
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
    data = _.defaults(msg.data, data);
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