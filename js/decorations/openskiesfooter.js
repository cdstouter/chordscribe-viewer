//var Calipers = require('calipers')('png');
//var deasync = require('deasync');
//var path = require('path');
var fs = require('fs');
var path = require('path');

var lineHeight = 1.2;
var copyrightFontSize = 9;

var OpenSkiesFooter = function(parent) {
  this.parent = parent;
};

OpenSkiesFooter.prototype.init = function() {
  // measure the CC button image
  //var result = deasync(Calipers.measure)(path.join(__dirname, 'by-nc.svg.png'));
  //this.ccImageSize = result.pages[0];
  this.ccImageSize = {width: 400, height: 140};
  // set up the text
  if (this.parent.data.metadata.copyrightText) {
    this.copyrightText = this.parent.data.metadata.copyrightText;
  } else {
    this.copyrightText = '';
    if (this.parent.data.metadata.copyrightPre) this.copyrightText += this.parent.data.metadata.copyrightPre + ' ';
    var writtenBy = '';
    if (this.parent.data.metadata.writtenBy) writtenBy = this.parent.data.metadata.writtenBy + '. ';
    this.copyrightText += writtenBy + '© ' + String(this.parent.data.metadata.copyrightYear) + ' by Open Skies Praise. This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/.';
    if (this.parent.data.metadata.copyrightNote) {
      this.copyrightText += '\n\n' + this.parent.data.metadata.copyrightNote;
    }
    this.copyrightText += '\n\nFor more information and additional resources, visit https://openskiespraise.org.';
  }
  // split it into pieces
  var sofar = "";
  var pieces = [];
  for (var i=0; i<this.copyrightText.length; i++) {
    var c = this.copyrightText.charAt(i);
    var nextc = this.copyrightText.charAt(i + 1);
    if ((c == ' ' || c == '\n') && sofar.length) {
      pieces.push({'text': sofar});
      sofar = "";
    }
    sofar += c;
    if (c == '-' || c == '/' || c == ' ' || c == '\n') {
      if (!nextc || (nextc != '-' && nextc != '/')) {
        pieces.push({'text': sofar});
        sofar = "";
      }
    }
  }
  if (sofar) pieces.push({'text': sofar});
  // measure the width of each piece
  var spaceWidth = this.parent.measureTextWidth(' ', this.parent.font['regular'], copyrightFontSize);
  for (var i=0; i<pieces.length; i++) {
    var piece = pieces[i];
    if (piece.text == ' ') {
      piece.width = spaceWidth;
    } else if (piece.text == '\n') {
      piece.width = 0;
    } else {
      piece.width = this.parent.measureTextWidth(piece.text, this.parent.font['regular'], copyrightFontSize);
    }
  }
  this.copyrightPieces = pieces;
};

OpenSkiesFooter.prototype.drawPage = function(currentPage, pdf) {
  var imageWidth = 1;
  var imageHeight = (this.ccImageSize.height * (imageWidth / this.ccImageSize.width));
  var imagePadding = .2;

  // wrap the copyright text lines
  // 1" wide creative commons on the right side. with .2" of padding to its left
  var maxLineWidth = this.parent.data.pageWidth - this.parent.pageMargin[1] - this.parent.pageMargin[3] - imageWidth - imagePadding;

  var textLines = [];
  var textLine = {
    'pieces': [],
    'textWidth': 0,
    'justify': true
  };
  
  for (var i=0; i<this.copyrightPieces.length; i++) {
    var piece = this.copyrightPieces[i];
    if (textLine.textWidth + piece.width > maxLineWidth) {
      // new line
      textLines.push(textLine);
      textLine = {
        'pieces': [],
        'textWidth': 0,
        'justify': true
      };
    }
    if (piece.text == '\n') {
      // new line
      textLine.justify = false;
      textLines.push(textLine);
      textLine = {
        'pieces': [],
        'textWidth': 0,
        'justify': true
      };
    } else {
      textLine.textWidth += piece.width;
      textLine.pieces.push(piece);
    }
  }
  if (textLine.pieces.length) textLines.push(textLine);
  // don't justify the last line of the text
  if (textLines.length) textLines[textLines.length - 1].justify = false;
  // trim whitespace
  for (var i=0; i<textLines.length; i++) {
    var textLine = textLines[i];
    if (textLine.pieces.length > 0 && textLine.pieces[0].text == ' ') {
      textLine.textWidth -= textLine.pieces[0].width;
      textLine.pieces.splice(0, 1);
    }
    if (textLine.pieces.length > 0 && textLine.pieces[textLine.pieces.length - 1].text == ' ') {
      textLine.textWidth -= textLine.pieces[textLine.pieces.length - 1].width;
      textLine.pieces.splice(textLine.pieces.length - 1, 1);
    }
  }
  
  var totalTextHeight = textLines.length * (copyrightFontSize * lineHeight / 72);
  var footerHeight = Math.max(imageHeight, totalTextHeight);

  this.parent.pageMargin[2] = this.parent.pageMargin[2] + footerHeight;
  
  if (pdf) {
    //var drawCopyright = currentPage == (this.parent.pages.length - 1);
    var drawCopyright = true;
    var currentY = this.parent.data.pageHeight - this.parent.pageMargin[2];
    //if (drawCopyright) pdf.image(path.join(__dirname, 'by-nc.svg.png'), (this.parent.data.pageWidth - this.parent.pageMargin[1] - imageWidth) * 72, currentY * 72, {'width': imageWidth * 72, 'height': imageHeight * 72});
    var image = fs.readFileSync(__dirname + path.sep + 'by-nc.svg.png');
    if (drawCopyright) pdf.image(image, (this.parent.data.pageWidth - this.parent.pageMargin[1] - imageWidth) * 72, currentY * 72, {'width': imageWidth * 72, 'height': imageHeight * 72});
    // draw the text
    if (drawCopyright) {
      pdf.font('regular').fontSize(copyrightFontSize);
      for (var i=0; i<textLines.length; i++) {
        var textLine = textLines[i];
        var currentX = this.parent.pageMargin[3];
        var extraSpace = maxLineWidth - textLine.textWidth;
        var extraSpacePerSpace = 0;
        // justify lines
        if (textLine.justify) {
          var spaces = 0;
          for (var j=0; j<textLine.pieces.length; j++) {
            var piece = textLine.pieces[j];
            if (piece.text == ' ') spaces++;
          }
          if (spaces > 0) extraSpacePerSpace = extraSpace / spaces;
          // don't justify if the gaps would be too large
          if (extraSpacePerSpace > (.02 * copyrightFontSize)) extraSpacePerSpace = 0;
        }
        for (var j=0; j<textLine.pieces.length; j++) {
          var piece = textLine.pieces[j];
          if (piece.text != ' ') pdf.text(piece.text, currentX * 72, currentY * 72);
          if (piece.text == ' ') currentX += extraSpacePerSpace;
          currentX += piece.width;
        }
        currentY += (copyrightFontSize * lineHeight / 72);
      }
    } else {
      for (var i=0; i<textLines.length; i++) {
        currentY += (copyrightFontSize * lineHeight / 72);
      }
    }
  }

  // add an extra line of space
  this.parent.pageMargin[2] = this.parent.pageMargin[2] + (this.parent.data.fontSize * lineHeight / 72);
};

module.exports = OpenSkiesFooter;
