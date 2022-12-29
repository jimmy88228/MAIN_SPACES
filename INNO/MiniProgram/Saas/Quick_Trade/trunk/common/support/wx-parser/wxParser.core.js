"use strict";
var wxParser_tool_1 = require("./wxParser.tool");
var wxParser_type_1 = require("./wxParser.type");

function isText(obj) {
  return obj && obj.type == wxParser_type_1.TEXTNODE;
}

function WxDomParser() {
  this.nodeRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})|(<!--)|(-->)/g;
  this.attrRegex = /[\w\-]+=['"][\s\S]*?['"]/g;
}
WxDomParser.prototype.parseStart = function (htmlStr, optionRegex) {
  if (optionRegex === void 0) {
    optionRegex = this.nodeRegex;
  }
  var matchResult = this.findAllNodes(htmlStr, optionRegex);
  return this.makeWxTree(matchResult);
};
WxDomParser.prototype.findAllNodes = function (htmlStr, optionRegex) {
  if (optionRegex === void 0) {
    optionRegex = this.nodeRegex;
  }
  var result;
  var allMatches = [],
    nextIndex = 0;
  while (result = optionRegex.exec(htmlStr)) {
    var match = result[0],
      startTag = result[1],
      startTagName = result[2],
      attr = result[3],
      endSelf = result[4],
      endTagName = result[5],
      exp = result[6],
      startComment = result[7],
      endComment = result[8];
    var index = result.index,
      length_1 = match.length;
    if (index > nextIndex) {
      allMatches.push({
        type: wxParser_type_1.TEXTNODE,
        value: htmlStr.slice(nextIndex, index)
      });
    }
    if (exp) {
      allMatches.push({
        type: wxParser_type_1.TEXTNODE,
        value: exp
      });
    }
    nextIndex = index + length_1;
    var type = void 0;
    if (startTagName) {
      type = wxParser_type_1.NODESTART;
    } else if (endTagName) {
      type = wxParser_type_1.NODEEND;
    } else if (startComment) {
      type = wxParser_type_1.COMMENTSTART;
    } else if (endComment) {
      type = wxParser_type_1.COMMENTEND;
    } else {
      type = wxParser_type_1.NODECLOSESELF;
    }
    allMatches.push({
      type: type,
      match: match,
      attr: attr,
      startTag: startTag,
      startTagName: startTagName,
      endSelf: endSelf,
      endTagName: endTagName,
      startComment: startComment,
      endComment: endComment,
      index: index,
      length: length_1
    });
  }
  return allMatches;
};
WxDomParser.prototype.makeWxTree = function (results) {
  var openTreeList = [{
    nodeName: 'ROOT',
    attr: [],
    children: []
  }];
  for (var i = 0; i < results.length; i++) {
    this.make(results[i], results[i - 1], results[i + 1], openTreeList);
  }
  return openTreeList[0];
};
WxDomParser.prototype.make = function (result, last, next, openTreeList) {
  var tree = openTreeList[openTreeList.length - 1];
  if (isText(result)) {
    if (!isText(last) && !isText(next)) {
      if (wxParser_tool_1.removeAllSpace(result.value) !== '') {
        tree.children.push({
          nodeName: wxParser_type_1.TEXTNODE,
          attr: [],
          children: [result.value]
        });
      }
    } else {
      tree.children.push({
        nodeName: wxParser_type_1.TEXTNODE,
        attr: [],
        children: [result.value]
      });
    }
  } else {
    if (result.endTagName || result.endComment) {
      openTreeList.pop();
    } else {
      var nodeName = result.startTagName,
        startComment = result.startComment;
      if (result.endSelf) {
        tree.children.push({
          nodeName: nodeName,
          attr: this.getAttributes(result.attr),
          children: []
        });
      } else {
        if (nodeName) {
          var newOpenTree = {
            nodeName: nodeName,
            attr: this.getAttributes(result.attr),
            children: []
          };
          tree.children.push(newOpenTree);
          openTreeList.push(newOpenTree);
        }
        if (startComment) {
          var newOpenTree = {
            nodeName: wxParser_type_1.COMMENTNODE,
            attr: [],
            children: []
          };
          tree.children.push(newOpenTree);
          openTreeList.push(newOpenTree);
        }
      }
    }
  }
};
WxDomParser.prototype.getAttributes = function (attr) {
  var slimAttr = wxParser_tool_1.removeMultiSpace(wxParser_tool_1.removeEqualSpace(attr));
  var attrArray = [];
  var attrExpression;
  while (attrExpression = this.attrRegex.exec(attr)) {
    var p = attrExpression[0].split('=');
    attrArray.push({
      name: p[0],
      value: p[1].replace(/["']/g, '')
    });
  }
  return attrArray;
};
exports.default = new WxDomParser();