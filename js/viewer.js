// this script assumes jQuery has already been loaded
var ko = require('knockout');
var FileSaver = require('file-saver');

var viewModel = {};

var currentBlob = null;

// keep track of changes & rebuild the PDF file when needed
var rebuildTimeout = null;
function settingChanged() {
  if (rebuildTimeout) {
    window.clearTimeout(rebuildTimeout);
    rebuildTimeout = null;
  }
  rebuildTimeout = window.setTimeout(doBuild, 1000);
}
// we use a web worker to do the actual build so the UI isn't unresponsive
var webWorker = new Worker('js/worker.min.js');
webWorker.onmessage = function(e) {
  if (e.data.success) {
    if (e.data.action == 'load') {
      // loading has finished, so do a build
      doBuild();
    } else if (e.data.action == 'build') {
      // building has finished
      renderPDF(e.data.blob);
    }
  } else {
    viewModel.viewerState('error');
    viewModel.optionsEnabled(false);
    viewModel.viewerMessage('Sorry, there was an error.');
    console.log(e.data);
  }
};
function doBuild() {
  currentBlob = null;
  rebuildTimeout = null;
  viewModel.viewerState('building');
  viewModel.optionsEnabled(false);
  viewModel.viewerMessage('Building PDF...');
  var message = {
    'action': 'build',
    'data': {
      'transpose': viewModel.transpose(),
      'capo': viewModel.capo(),
      'flats': viewModel.useFlats()
    }
  };
  webWorker.postMessage(message);
}
function loadResources() {
  rebuildTimeout = null;
  viewModel.viewerState('loading');
  viewModel.optionsEnabled(false);
  viewModel.viewerMessage('Loading resources...');
  var message = {
    'action': 'load',
    'data': chordSheet
  };
  webWorker.postMessage(message);
}

function renderPDF(blob) {
  currentBlob = blob;
  var arrayBuffer;
  var fileReader = new FileReader();
  fileReader.onload = function() {
    arrayBuffer = this.result;
    PDFJS.workerSrc = 'js/pdf.worker.min.js';
    var docInitParams = {
      data: arrayBuffer
    };
    PDFJS.getDocument(docInitParams).then(function(pdf) {
      renderPages(pdf);
    }, function(error) {
      viewModel.viewerState('error');
      viewModel.optionsEnabled(false);
      viewModel.viewerMessage('Sorry, there was an error.');
      console.log(error);
    });
  };
  fileReader.readAsArrayBuffer(blob);
}

function renderPages(pdf) {
  var promise = Promise.resolve();
  var documentContainer = $('#pdf-container');
  documentContainer.empty();
  for (var i = 1; i <= pdf.numPages; i++) {
    // Using promise to fetch and render the next page
    promise = promise.then(function (pageNum) {
      return pdf.getPage(pageNum).then(function (page) {
        var desiredWidth = documentContainer.width() * (window.devicePixelRatio || 1);
        var originalViewport = page.getViewport(1);
        var scale = desiredWidth / originalViewport.width;
        var viewport = page.getViewport(scale);

        var container = document.createElement('div');
        container.id = 'pageContainer' + pageNum;
        container.className = 'pageContainer card';
        documentContainer.append(container);

        var canvas = document.createElement('canvas');
        container.id = 'pageCanvas' + pageNum;
        container.className = 'pageCanvas card';
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.append(canvas);
        
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }.bind(null, i));
  }
  promise.then(function() {
    viewModel.viewerState('ready');
    viewModel.optionsEnabled(true);
  });
}

// initialize the view model
function init() {
  // the page title
  var title = ((chordSheet.metadata && chordSheet.metadata.title) || 'Untitled') + ' - ChordScribe Viewer';
  viewModel.pageTitle = title;
  
  // song information
  viewModel.songInformation = [];
  if (chordSheet.metadata && chordSheet.metadata.title) {
    viewModel.songInformation.push({'label': 'Title', 'value': chordSheet.metadata.title});
  }
  if (chordSheet.metadata && chordSheet.metadata.author) {
    viewModel.songInformation.push({'label': 'Author', 'value': chordSheet.metadata.author});
  }
  
  // transpose options
  viewModel.optionsEnabled = ko.observable(false);
  viewModel.transpose = ko.observable(0);
  viewModel.transpose.subscribe(settingChanged);
  viewModel.transposeDisplay = ko.pureComputed(function() {
    var transpose = viewModel.transpose();
    if (transpose <= 0) {
      return String(transpose);
    } else {
      return "+" + String(transpose);
    }
  });
  viewModel.transposeUp = function() {
    var transpose = viewModel.transpose();
    transpose = Math.min(12, transpose + 1);
    viewModel.transpose(transpose);
  };
  viewModel.transposeDown = function() {
    var transpose = viewModel.transpose();
    transpose = Math.max(-12, transpose - 1);
    viewModel.transpose(transpose);
  };
  viewModel.capo = ko.observable(0);
  viewModel.capo.subscribe(settingChanged);
  viewModel.capoUp = function() {
    var capo = viewModel.capo();
    capo = Math.min(12, capo + 1);
    viewModel.capo(capo);
  };
  viewModel.capoDown = function() {
    var capo = viewModel.capo();
    capo = Math.max(0, capo - 1);
    viewModel.capo(capo);
  };
  viewModel.useFlats = ko.observable(false);
  viewModel.useFlats.subscribe(settingChanged);
  
  // PDF loading indicator
  viewModel.viewerState = ko.observable('loading'); // loading, building, error, ready
  viewModel.viewerMessage = ko.observable('Loading resources...');
  
  // print button
  viewModel.print = function() {
    if (currentBlob) {
      //window.print();
    }
  };
  // download button
  viewModel.download = function() {
    if (currentBlob) {
      var filename = ((chordSheet.metadata && chordSheet.metadata.title) || 'Untitled') + '.pdf';
      FileSaver.saveAs(currentBlob, filename);
    }
  };
}

// bind the view model when the DOM is ready
$(document).ready(function() {
  init();
  ko.applyBindings(viewModel, $('html')[0]);
  
  loadResources();
});
