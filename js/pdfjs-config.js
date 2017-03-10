module.exports = {
  appContainer: document.body,
  mainContainer: document.getElementById('viewerContainer'),
  viewerContainer: document.getElementById('viewer'),
  eventBus: null, // using global event bus with DOM events
  toolbar: {
    container: document.getElementById('toolbarViewer'),
    numPages: document.getElementById('numPages'),
    pageNumber: document.getElementById('pageNumber'),
    scaleSelectContainer: document.getElementById('scaleSelectContainer'),
    scaleSelect: document.getElementById('scaleSelect'),
    customScaleOption: document.getElementById('customScaleOption'),
    previous: document.getElementById('previous'),
    next: document.getElementById('next'),
    zoomIn: document.getElementById('zoomIn'),
    zoomOut: document.getElementById('zoomOut'),
    viewFind: document.getElementById('viewFind'),
    openFile: document.getElementById('openFile'),
    print: document.getElementById('print'),
    presentationModeButton: document.getElementById('presentationMode'),
    download: document.getElementById('download'),
    viewBookmark: document.getElementById('viewBookmark'),
  },
  secondaryToolbar: {
    toolbar: document.getElementById('secondaryToolbar'),
    toggleButton: document.getElementById('secondaryToolbarToggle'),
    toolbarButtonContainer:
      document.getElementById('secondaryToolbarButtonContainer'),
    presentationModeButton:
      document.getElementById('secondaryPresentationMode'),
    openFileButton: document.getElementById('secondaryOpenFile'),
    printButton: document.getElementById('secondaryPrint'),
    downloadButton: document.getElementById('secondaryDownload'),
    viewBookmarkButton: document.getElementById('secondaryViewBookmark'),
    firstPageButton: document.getElementById('firstPage'),
    lastPageButton: document.getElementById('lastPage'),
    pageRotateCwButton: document.getElementById('pageRotateCw'),
    pageRotateCcwButton: document.getElementById('pageRotateCcw'),
    toggleHandToolButton: document.getElementById('toggleHandTool'),
    documentPropertiesButton: document.getElementById('documentProperties'),
  },
  fullscreen: {
    contextFirstPage: document.getElementById('contextFirstPage'),
    contextLastPage: document.getElementById('contextLastPage'),
    contextPageRotateCw: document.getElementById('contextPageRotateCw'),
    contextPageRotateCcw: document.getElementById('contextPageRotateCcw'),
  },
  sidebar: {
    // Divs (and sidebar button)
    mainContainer: document.getElementById('mainContainer'),
    outerContainer: document.getElementById('outerContainer'),
    toggleButton: document.getElementById('sidebarToggle'),
    // Buttons
    thumbnailButton: document.getElementById('viewThumbnail'),
    outlineButton: document.getElementById('viewOutline'),
    attachmentsButton: document.getElementById('viewAttachments'),
    // Views
    thumbnailView: document.getElementById('thumbnailView'),
    outlineView: document.getElementById('outlineView'),
    attachmentsView: document.getElementById('attachmentsView'),
  },
  findBar: {
    bar: document.getElementById('findbar'),
    toggleButton: document.getElementById('viewFind'),
    findField: document.getElementById('findInput'),
    highlightAllCheckbox: document.getElementById('findHighlightAll'),
    caseSensitiveCheckbox: document.getElementById('findMatchCase'),
    findMsg: document.getElementById('findMsg'),
    findResultsCount: document.getElementById('findResultsCount'),
    findStatusIcon: document.getElementById('findStatusIcon'),
    findPreviousButton: document.getElementById('findPrevious'),
    findNextButton: document.getElementById('findNext')
  },
  passwordOverlay: {
    overlayName: 'passwordOverlay',
    container: document.getElementById('passwordOverlay'),
    label: document.getElementById('passwordText'),
    input: document.getElementById('password'),
    submitButton: document.getElementById('passwordSubmit'),
    cancelButton: document.getElementById('passwordCancel')
  },
  documentProperties: {
    overlayName: 'documentPropertiesOverlay',
    container: document.getElementById('documentPropertiesOverlay'),
    closeButton: document.getElementById('documentPropertiesClose'),
    fields: {
      'fileName': document.getElementById('fileNameField'),
      'fileSize': document.getElementById('fileSizeField'),
      'title': document.getElementById('titleField'),
      'author': document.getElementById('authorField'),
      'subject': document.getElementById('subjectField'),
      'keywords': document.getElementById('keywordsField'),
      'creationDate': document.getElementById('creationDateField'),
      'modificationDate': document.getElementById('modificationDateField'),
      'creator': document.getElementById('creatorField'),
      'producer': document.getElementById('producerField'),
      'version': document.getElementById('versionField'),
      'pageCount': document.getElementById('pageCountField')
    }
  },
  errorWrapper: {
    container: document.getElementById('errorWrapper'),
    errorMessage: document.getElementById('errorMessage'),
    closeButton: document.getElementById('errorClose'),
    errorMoreInfo: document.getElementById('errorMoreInfo'),
    moreInfoButton: document.getElementById('errorShowMore'),
    lessInfoButton: document.getElementById('errorShowLess'),
  },
  printContainer: document.getElementById('printContainer'),
  openFileInputName: 'fileInput',
  debuggerScriptPath: './debugger.js',
  defaultUrl: null
};
