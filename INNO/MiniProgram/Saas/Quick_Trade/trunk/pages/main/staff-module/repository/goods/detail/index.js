// pages/main/staff-module/repository/goods/detail/index.js
import WxApi from "../../../../../../common/utils/wxapi/index";
import { uploadImage, chooseImage } from "./utils";
import Utils from "../../../../../../common/utils/normal/index";
const wxParser = require("../../../../../../common/support/wx-parser/index").wxParser;
const base64 = require("../../../../../../common/support/libs/sign/base64");
const App = getApp();
Page(App.BP({
  data: {
    // movableAreaHeight: 0, // 可移动区域高度 
    nodeArray: [],
    inputVal: ""
  },
  onLoad(query) { // goods_id
    this.pageQuery = query;
    let {goods_id = 0} = query;
    if (goods_id) {
      getGoodsDetails.call(this)
        .catch(err => {
          console.log("getGoodsDetails err", err);
         App.SMH.showToast({title: err});
        })
    }
  },
  onInput(e) {
    let value = e.detail.value || "";
    this.setData({inputVal: value})
  },
  addHtml(e) {
    let type = this.getDataset(e, "type") || "";
    let nodeArray = this.data.nodeArray || [];
    switch (type) {
      case "text":
        let inputVal = this.data.inputVal || "";
        console.log("inputVal", inputVal)
        if (!inputVal.trim()) {
          App.SMH.showToast({title: "请输入内容"});
          return 
        }
        let nodeData = {value: inputVal};
        this.setData({
          [`nodeArray[${nodeArray.length}]`]: createNode(type, nodeData),
          inputVal: ""
        })
        break;
      case "image":
        chooseImage()
        .then(uploadImage)
        .then(filePath => {
          let nodeData = {src: filePath};
          this.setData({
            [`nodeArray[${nodeArray.length}]`]: createNode(type, nodeData),
          })
        })
        .catch(error => {
          console.log("error", error)
          if (error && error.errMsg && error.errMsg.indexOf("cancel") >= 0) return Promise.resolve()
          else App.SMH.showToast({title: error && error.errMsg || error});
        })
        break
      default:
        break;
    }
  },
  handlePreviewBtnTap() {
    console.log("this", this);
    let nodeArray = this.data.nodeArray || [];
    let htmlStr = nodeArrayToHtmlStr(nodeArray);
    this.previewPop = this.previewPop || this.selectComponent("#preview-pop");
    this.previewPop.showModal({htmlStr})
    console.log("htmlstr", htmlStr)
  },
  handleSaveBtnTap() {
    let nodeArray = this.data.nodeArray || [];
    let htmlStr = nodeArrayToHtmlStr(nodeArray);
    this.showLoading();
    return App.Http.QT_GoodsApi.updateGoodsDetails({
      data: {
        goods_id: 1,
        goods_detail: base64.encode(htmlStr)
      }
    })
      .then(res => {
        if (res.code == 1) {
          App.SMH.showToast({title: "保存成功"});
          setTimeout(() => {WxApi.navigateBack()}, 500);
          return 
        }
        return Promise.reject(res.msg || "保存失败")
      })
      .catch(err => {
        console.log("handleSaveBtnTap err", err);
        App.SMH.showToast({title: err});
        return Promise.reject(err)
      })
      .finally(() => {this.hideLoading()})
  }
}))

function getGoodsDetails() {
  let goodsId = this.pageQuery && this.pageQuery.goods_id || 0;
  if (!goodsId) return Promise.reject("getGoodsDetails 没有goods_id");
  this.showLoading();
  return App.Http.QT_GoodsApi.getGoodsDetails({
    params: {
      goodsId
    }
  })
    .then(res => {
      if (res.code == 1) {
        let htmlStr = res.data || "";
        let nodeArray = htmlStrToNodeArray(htmlStr);
        this.setData({nodeArray})
        return nodeArray
      }
      return Promise.reject(res.msg || "获取商品详情失败")
    })
    .finally(() => {this.hideLoading()})
}

// function reRreshMovableAreaHeight() {
//   this.showLoading();
//   this.selectorQuery = this.selectorQuery || wx.createSelectorQuery().in(this);
//   return new Promise(rs => {
//     WxApi.nextTick(() => {
//       Utils.requestAnimationFrame(() => {
//         this.selectorQuery.select(".detail-display-list")
//         .boundingClientRect(rs)
//         .exec()
//       });
//     })
//   })
//     .then((res = {}) => {
//       console.log("获取节点信息结果", res);
//       let {height = 0} = res;
//       return this.setData({movableAreaHeight: height});
//     })
//     .finally(() => {this.hideLoading()})
// }

function createNode(type, {value = "", src = ""}) {
  let node = {
    type,
    id: new Date().getTime()
  };
  switch (type) {
    case "text":
      node.value = value;
      node.style = "padding: 6px 0"
      break;
    case "image":
      node.src = src;
      node.style = "width: 100%; display: block"
      break;
    default:
      break;
  }
  return node;
}

function nodeToHtmlStr(node = {}) {
  let htmlStr = "";
  let {type, style = "", value = "", src = ""} = node;
  switch (type) {
    case "text":
      htmlStr = `<div style="${style}">${value}</div>`;
      break;
    case "image":
      htmlStr = `<img style="${style}" src="${src}" />`
      break;
    default:
      break;
  }
  return htmlStr;
}

function nodeArrayToHtmlStr(nodeArray = []) {
  let htmlStr = "";
  for (let node of nodeArray) {
    htmlStr += nodeToHtmlStr(node);
  };
  return htmlStr
}

function parseResultObjToNode(parseNode) {
  let nodeName = parseNode.nodeName || "";
  let node = {};
  let attr = parseNode.attr || [];
  attr.forEach(item => {
    if (item.name === "style") node.style = item.value;
    else if (item.name === "src") node.src = item.value;
  })
  if (nodeName === "img") {
    node.type = "image";
  } else if (nodeName === "div") {
    node.type = "text";
    let children = parseNode.children || [];
    children.forEach(item => {
      if (item.nodeName === "TEXTNODE") node.value = item.children && item.children[0] || ""
    })
  }
  return node
}

function parseResultToNodeArray(rootNode) {
  let nodeArray = [];
  let children = rootNode.children || [];
  children.forEach(parseNode => {
    nodeArray.push(parseResultObjToNode(parseNode))
  })
  return nodeArray
}

function htmlStrToNodeArray(htmlStr = "") {
  let parseResult = wxParser.parseStart(htmlStr);
  console.log("parseResult", parseResult)
  return parseResultToNodeArray(parseResult);
}