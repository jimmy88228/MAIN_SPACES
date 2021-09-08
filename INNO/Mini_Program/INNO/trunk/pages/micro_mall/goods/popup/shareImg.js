import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
import WxApi from "../../../../common/helper/wx-api-helper.js"
import SIH from "../../../../common/helper/sys-infos-helper"
import appletCode from "../../../../common/helper/utils/appleCode.js"
// import Promise from '../../../../libs/promise/promise.js'
import DrawTemplate from '../../goods/popup/help/template.js';
import {
  ActionRoute,
  // LogMap,
} from "../../../../common/manager/log-map.js";
const app = getApp();
const LABEL_TEMP = "onlyOne"
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      allData: {
        value: {},
        type: Object,
        observer(n, o) {
          console.log(n, "allData   n");
          n = n || {};
          let opKind = n.info && n.info.opKind;
          if (opKind != this.temOpKind || opKind == 'STAFF_GOODS' || opKind == 'STAFF_ACTIVITY') {
            this.setData({
              QRCode: "",
              tempQR: {},
            })
            this.temOpKind = opKind;
          }
        }
      },
      imgList: {
        value: [],
        type: Array,
        observer(n, o) {
          let arr = [];
          for (let i in n) {
            arr.push({
              url: n[i]
            });
          }
          this.setData({
            listInfo: arr,
            canvasList: []
          })
        }
      },
      isShowList: {
        type: Boolean,
        value: false,
      },
      theme_color: {
        type: String,
        value: '',
      },
      onlySave: {
        type: Boolean,
        value: false
      }
    },
    data: {
      boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
      staffInfo: {},
      canvasConf: {
        width: 600,
        height: 900,
      },
      saveCanvasConf: {
        width: 600,
        height: 900,
      },
      QRCode: "",
      tempQR: {},
      codeInfo: {
        w: 140,
        h: 140
      },
      portraitImg: "",
      tempPortrait: {},
      listInfo: [],
      swiperCurr: 0,
      canvasList: [],
      saveCurrent: 1,

      cStyle: {
        cTxt: "#333",
        cTip: "#7f7f7f"
      },
      canClick: false,
    },
    attached() {
      this.first_touch = false;
      this.labelObj = {};
      this.savingObj = {};
      this.labelObj[LABEL_TEMP] = {};
      this.savingObj[LABEL_TEMP] = {};
    },
    detached() { },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;",
          canClick: true
        });
        this.qy_logo = "";
        let allData = this.properties.allData;
        let info = allData.info || {};
        let opKind = info.opKind || '';
        if (opKind && (opKind == "STORE_STAFF" || opKind == "STAFF_PERSONAL")) {
          this.setData({
            showTwoBtn: true,
          })
        }
        if (this.properties.isShowList) {
          getAppletCode.call(this, allData);
          getUserInfo.call(this, opKind);
          this.changeView({
            detail: {
              current: 0
            }
          })
          //读取展示配置
          checkShareConf.call(this).then(()=>{
            staffCodeHandle.call(this);
          })
        } else if (!this.properties.onlySave) {
          this.createAdaptiveCanvas();
        } else if (this.properties.onlySave) {
          this.onlySaveFnc();
        }
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      createAdaptiveCanvas() {
        if (!checkSetClick.call(this)) return;
        checkSetClick.call(this, false);
        let allData = this.properties.allData;
        let scene = allData.scene || {};
        let draw = allData.draw || {};
        let info = allData.info || {};
        let baseInfo = draw.baseInfo || {};
        let drawArr = draw.drawArr || [];
        initTemplate.call(this, allData).then(res => { //初始化模板
          if (!baseInfo.codeDiy) { //  启用小程序码默认样式、补充drawArr的码和头像
            drawArr = initCodeArr.call(this,res,info);
          }
          console.log('模板darwArr',drawArr)
          let p1 = getAppletCode.call(this, allData);
          let p2 = getUserInfo.call(this);
          Promise.all([p1, p2]).then(res => {
            allAdaptiveSet.call(this, drawArr).then(res => {
              console.log('download完成', res);
              adaptiveDrawCanvas.call(this, 'shareCanvas', res, 1);
              adaptiveDrawCanvas.call(this, 'saveShareCanvas', res, 2);
            }).catch(e => {
              // console.log('catch', e);
            });
          })
        });
      },
      checkAuthorize() {
        return new Promise((rs, rj) => {
          app.AS.checkAuthorize("scope.writePhotosAlbum", function () {
            return rs();
          }, null, true)
        })
      },
      saveShareCanvas(callback) {
        if (!checkSetClick.call(this)) return;
        checkSetClick.call(this, false);
        let that = this;
        this.checkAuthorize().then(() => {
          that.saveToPhotosAlbum(callback);
        })
      },
      saveToPhotosAlbum(callback) {
        let that = this;
        setTimeout(() => {
          wx.saveImageToPhotosAlbum({
            filePath: this.savePathCurrent || '',
            success(state) {
              if (typeof (callback) == "function") {
                callback();
              } else {
                app.SMH.showToast({
                  "title": "保存成功"
                })
                triggerActionLog.call(that, that.data.allData, "save");
                that.closeList();
              }
            },
            fail(error) {
              app.SMH.showToast({
                "title": "保存失败"
              })
              console.log(error)
              if (typeof (callback) == "function") {
                callback();
              }
            },
            complete(res) {
              checkSetClick.call(that, true);
            }
          })
        }, 500)
      },
      allSaveHandle() {
        if (!checkSetClick.call(this)) return;
        checkSetClick.call(this, false);
        this.checkAuthorize().then(() => {
          this.createAllShareCanvas();
        })
      },
      onlySaveFnc(arr = []) { //仅保存，不画出来展示 （分销中心海报）
        if (!checkSetClick.call(this)) return;
        checkSetClick.call(this, false);
        this.createAllShareCanvas();
      },
      createAllShareCanvas() {
        let allData = this.properties.allData || {};
        let info = allData.info || {};
        let opKind = info.opKind || '';
        let scene = allData.scene || {};
        let that = this;
        let imgList = this.properties.imgList;
        if (!app.SIH.isIos) { //安卓倒序
          let imgList = this.properties.imgList;
          this.saveActive = imgList.length - 1
        } else { //ios正序
          this.saveActive = 0
        }
        this.setData({
          saveCurrent: app.SIH.isIos ? this.saveActive + 1 : (imgList.length - this.saveActive)
        })
        getAppletCode.call(this, allData).then(code => {
          getUserInfo.call(this, opKind).then(userHead => {
            app.SMH.showLoading({
              title: "加载中..."
            });
            let _timer = setTimeout(() => {
              clearTimeout(_timer);
              app.SMH.hideLoading();
            }, 4000);
            if ((info.opKind == 'STORE_STAFF' || info.opKind == "NEW_USER_SHARE")) {
              this.qy_logo = this.data.brand_info.icon_url + "micro_mall/qy_logo.png";
              userHead = this.qy_logo || '';
            }
            let carryData = {}, that = this;
            carryData.drawQy = opKind && (opKind == 'STORE_STAFF' || opKind == 'NEW_USER_SHARE') ? true : false;
            allData.carryData = carryData;
            this.saveProgress = this.saveProgress || this.selectComponent("#saveProgress");
            this.saveProgress.show();
            this.canvasArrEvent(code, userHead);
          })
        })
      },
      canvasArrEvent(code, userHead) {
        let imgList = this.properties.imgList;
        let imgUrl = imgList[this.saveActive];
        let allData = this.data.allData || {};
        console.log("JSON allData",JSON.parse(JSON.stringify(allData)))
        let info = allData.info || {};
        allData.draw = allData.draw || {};
        let draw = allData.draw || {};
        draw.drawArr = [];
        let drawArr = draw.drawArr;
        if (!imgUrl) {
          this.saveProgress = this.saveProgress || this.selectComponent("#saveProgress");
          this.saveProgress.dismiss();
          if (info.opKind == "STAFF_ACTIVITY" || info.opKind == "STAFF_GOODS") {
            this.triggerEvent('handle_draw');
          } else {
            app.SMH.showToast({
              title: '保存结束',
            })
            checkSetClick.call(this, true);
          }
          triggerActionLog.call(this, allData, "show");
          triggerActionLog.call(this, allData, "save");
          this.closeList();
          return;
        };
        let that = this;
        // let arr = [imgUrl, code, userHead];
        let goodsCanvas = app.Conf.BRAND_CODE == 'KEDD' && info.path == 'pages/micro_mall/goods/goods_info';
        if (goodsCanvas && info.opKind == "STAFF_ACTIVITY") {
          draw.template = info.gen_barcode_style == 2 || (info.gen_barcode_style == 0 && this.saveActive != 0) ? "custom" : "goods"
        } else {
          draw.template = "custom";
        }
        info.imgUrl = imgUrl || "";
        initTemplate.call(this, allData).then(tempArr => {
          if (info.opKind != "STAFF_ACTIVITY" || !(draw.template == "custom" && info.gen_barcode_style == 0 && this.saveActive != 0)) {
            drawArr = tempArr || [];
            drawArr = tempArr || [];
            let img_code = DrawTemplate.initData('image');
            let img_user = DrawTemplate.initData('image');
            //根据配置绘制头像二维码
            if(info.gen_barcode_style == 0){
              if(this.saveActive != 0){
                img_code = DrawTemplate.initData('');
                img_user = DrawTemplate.initData('');
              }
            }
            if(info.gen_barcode_style != 2){
              img_code.type = 'code';
              drawArr.push(img_code);
              img_user.type = this.qy_logo ? 'brand_logo' : 'userHead';
              drawArr.push(img_user);
            }
            this.setData({
              qy_logo: userHead
            })
            console.log("drawArr",drawArr);
          }
          allAdaptiveSet.call(this, drawArr).then(res => {
            adaptiveDrawCanvas.call(this, "saveShareCanvas", drawArr, 2, function () {
              that.saveToPhotosAlbum(function () {
                console.log("下标",that.saveActive,that.properties.imgList[that.saveActive]);
                app.SIH.isIos ? ++that.saveActive : --that.saveActive;
                that.setData({
                  saveCurrent: app.SIH.isIos ? that.saveActive + 1 : (imgList.length - that.saveActive)
                })
                that.canvasArrEvent(code, userHead);
              });
            });
          })
        })
      },
      changeView(e) {
        let detail = e.detail || {};
        let current = parseInt(detail.current);
        let imgList = this.data.imgList || [];
        let arr = imgList.slice(current, current + 1);
        let canvasConf = this.data.canvasConf || {};
        let viewW = canvasConf.width;
        this.setData({
          swiperCurr: current
        })
      },
      closeList() {
        checkSetClick.call(this, true);
        this.dismiss();
      },
      imgFnErr(e) { //二维码加载失败
        if (!this.firstError) {
          this.firstError = true;
          setTimeout(() => {
            this.resetFn();
          }, 500);
        }
      },
      imgFn(e) { },//二维码加载成功 
      _noFn() { }
    }
  })
);

//灵活canvas画布
function adaptiveDrawCanvas(canvasId = '', res = [], multiple = 1, callback) {
  console.log("DrawCanvas++", res, this.data.allData);
  let that = this;
  let allData = this.data.allData || {};
  let draw = allData.draw || {};
  let baseInfo = draw.baseInfo || {};
  let ctx = wx.createCanvasContext(canvasId, this);
  let canvasConf = JSON.parse(JSON.stringify(this.data.canvasConf));
  let saveCanvasConf = JSON.parse(JSON.stringify(this.data.saveCanvasConf));
  let canvasW = baseInfo.canvasW || canvasConf.width;
  let canvasH = baseInfo.canvasH || canvasConf.height;
  canvasConf.width = canvasW;
  canvasConf.height = canvasH;
  saveCanvasConf.width = canvasW;
  saveCanvasConf.height = canvasH;
  let textTopLine = 0;
  let textBottomLine = canvasH;
  let base = 30;
  let scale = 1;
  console.log("res", res);
  if (allData.draw && allData.draw.template == 'custom') {
    let temp = res && res[0] && res[0].downMsg || {};
    let postW = temp.width || 0;
    let postH = temp.height || 0;
    if (canvasId == "saveShareCanvas"){
      canvasW = postW;
      canvasH = postH;
      saveCanvasConf.width = canvasW; 
      saveCanvasConf.height = canvasH; 
    } else {
      canvasH = (canvasW * postH) / postW;
      canvasH = canvasH <= 900 ? canvasH : 900;
      scale = postH / canvasH;
      canvasConf.height = canvasH; 
    } 
  };
  this.setData({
    allData,
    canvasConf,
    saveCanvasConf
  })
  let baseW = SIH.screenWidth / 750 * multiple;
  let baseW_H = SIH.screenWidth / 750 * multiple * scale;
  ctx.setFillStyle(baseInfo.background || '#fff');
  ctx.fillRect(0, 0, canvasW * baseW, canvasH * baseW);
  res && res.forEach((item, index) => {
    if (item.category == 'image') {
    //图片
      if (!baseInfo.codeDiy && (item.type == 'userHead' || item.type == 'code')) return
      let downMsg = item.downMsg || {};
      if (item.type == 'userHead') { //头像
        item.baseW = baseW;
        DrawTemplate.drawCircle('circle', ctx, item);
      }else if(item.mode=='fitORfill'){ //当高>宽==(aspectFit)，当宽<高==(aspectFill)
        if(downMsg.width<downMsg.height){
          //aspectFit
          let scale_img = parseFloat((downMsg.width / downMsg.height).toFixed(3));
          downMsg.path && ctx.drawImage(
            downMsg.path, 
            0,0, 
            downMsg.width, 
            downMsg.height,
            item.x * baseW + (item.w * baseW  - item.w * baseW * scale_img)/2, item.y * baseW,
            item.w * baseW * scale_img, item.h * baseW  
          );
        }else{
          //aspectFill
          let scale = parseFloat((item.w / item.h).toFixed(3));
          downMsg.path && ctx.drawImage(downMsg.path, item.x * baseW, (downMsg.height - parseInt(downMsg.width / scale)) / 2, downMsg.width, parseInt(downMsg.width / scale), 0, item.y * baseW, item.w * baseW, item.h * baseW);
        }
      }else if (item.mode == 'aspectFit') { //等高缩放
        //aspectFit
        let scale_img = parseFloat((downMsg.width / downMsg.height).toFixed(3));
        downMsg.path && ctx.drawImage(
          downMsg.path, 
          0,0,
          downMsg.width, 
          downMsg.height,
          item.x * baseW + (item.w * baseW  - item.w * baseW * scale_img)/2, item.y * baseW,
          item.w * baseW * scale_img, item.h * baseW  
        );
      } else if (item.mode == 'aspectFill') { //居中裁剪
        //aspectFill
        let scale = parseFloat((item.w / item.h).toFixed(3));
        downMsg.path && ctx.drawImage(downMsg.path, item.x * baseW, (downMsg.height - parseInt(downMsg.width / scale)) / 2, downMsg.width, parseInt(downMsg.width / scale), 0, item.y * baseW, item.w * baseW, item.h * baseW);
      }else if (item.mode == 'widthFix') { //宽度撑满，高度自适应
        //widthFix
        downMsg.path && ctx.drawImage(downMsg.path, item.x * baseW, item.y * baseW, canvasW * baseW, canvasH * baseW);
      }else if(item.mode == 'normal'){
        downMsg.path && ctx.drawImage(downMsg.path, item.x * baseW, item.y * baseW, item.w * baseW, item.h * baseW);
      }
    }else if (item.category == 'text') {
    //文字
      base = item.size * 1;
      ctx.setTextAlign(item.align || 'left');
      ctx.setFillStyle(item.color || '#000')
      ctx.setFontSize(item.size * baseW);
    if (item.position == 'absolute') {
        textTopLine = item.y || textTopLine;
        if (item.ellipsis > 0) {
          textTopLine = DrawTemplate.wrapMsg(ctx, baseW, item.y, item, allData);
        } else {
          fillText.call(this, item.text, item.x, item.y, baseW, item, ctx);
          textTopLine += base;
        }
      } else if (item.position == 'relative') {
        textTopLine = (item.y || textTopLine) + item.extraH;
        if (item.ellipsis > 0) {
          textTopLine = DrawTemplate.wrapMsg(ctx, baseW, textTopLine, item, allData);
        } else {
          fillText.call(this, item.text, item.x, textTopLine, baseW, item, ctx);
          textTopLine += base;
        }
      } else if (item.position == 'fixed') {
        let extra = item.extra || {};
        if (extra.type == 'column_middle') { //自定义extra 竖向居中
          let metrics = ctx.measureText(item.text || '').width / baseW;
          let x_middle = (item.x - ((metrics - extra.codeW) / 2));
          fillText.call(this, item.text, x_middle, item.y, baseW, item, ctx);
        }
      }
    }
  })
  codeInitDraw.call(this, ctx, baseW, res, baseInfo,canvasId);
  setTimeout(() => {
    ctx.draw(false, () => {
      toTempFn.call(that, canvasId, function () {
        typeof (callback) == "function" && callback();
      })
      if (multiple == 1) {
        triggerActionLog.call(that, allData, "show");
      }
    });
  }, 500)
}

//默认码样式
function codeInitDraw(ctx, baseW, res, baseInfo, canvasId) {
  let info = this.data.allData.info || {};
  let draw = this.data.allData.draw || {};
  if (!baseInfo.codeDiy && info.gen_barcode_style !=2 && (info.opKind != "STAFF_ACTIVITY" || info.opKind == "STAFF_ACTIVITY" && (this.saveActive == 0 || info.gen_barcode_style == 1))) {
    this.ShareConf = this.ShareConf || {};
    let QR_Conf = this.ShareConf.qrcode && this.ShareConf.qrcode.data || false;
    let Poster_Conf = this.ShareConf.poster && this.ShareConf.poster.data || false;
    let _code = res[res.length - 2] && JSON.parse(JSON.stringify(res[res.length - 2])) || ""; //码
    let _user = res[res.length - 1] && JSON.parse(JSON.stringify(res[res.length - 1])) || ""; //头像、logo
    console.log('右下角',"\n码:",_code,"\n头像:",_user);
    if(!_code.url && !_user.url){
      console.log("没有头像二维码");
      return
    }
    let padding = 20;
    let codeW = 128;
    let font_size = 26;
    let wrap_base = 1;
    let baseInit = 25;
    let baseH = 4;
    let canvasW = baseInfo.canvasW || this.data.canvasConf.width;
    let canvasH = baseInfo.canvasH || this.data.canvasConf.height;
    if (draw.template == "custom"){
      codeW = 160; //自定义海报定死尺寸
      if (canvasId == "saveShareCanvas"){
        canvasW = baseInfo.canvasW || this.data.saveCanvasConf.width;
        canvasH = baseInfo.canvasH || this.data.saveCanvasConf.height;
      }
    } 
    let bottomInit = canvasH - padding;
    let { staffCode,  storeInfo} = staffCodeHandle.call(this);
    if (!staffCode && !storeInfo.isStore) {
      bottomInit -= 10;
    }
    font_size = 16;
    ctx.setTextAlign("left");
    ctx.setFillStyle('#7f7f7f');
    ctx.setFontSize(font_size * baseW);
    //1.文案
    baseInit = font_size * wrap_base + baseH;
    let tipText = draw && draw.codeType == 'QR' ? '扫码注册会员' : '长按识别小程序码'
    let metrics = ctx.measureText(tipText || '').width / baseW;
    let x_middle = ((canvasW - codeW - padding) - ((metrics - codeW) / 2));
    ctx.fillText(tipText, x_middle * baseW, (bottomInit) * baseW);
    bottomInit -= baseInit; 
    if(staffCode){
      ctx.setTextAlign("left");
      ctx.setFillStyle('#7f7f7f');
      font_size = 16;
      ctx.setFontSize(font_size * baseW);
      baseInit = font_size * wrap_base + baseH;
      let metrics = ctx.measureText(staffCode || '').width / baseW;
      let x_middle = ((canvasW - codeW - padding) - ((metrics - codeW) / 2));
      ctx.fillText(staffCode, x_middle * baseW, (bottomInit) * baseW);
      bottomInit -= baseInit;
    }
    
    bottomInit = bottomInit - codeW;
    //3.1码背景
    if(Poster_Conf && Poster_Conf.cfg_pic && Poster_Conf.cfg_pic.is_show_bg == "1"){
      ctx.setFillStyle('#ffffff');
      ctx.fillRect((canvasW - codeW - padding) * baseW, bottomInit * baseW, codeW * baseW, codeW * baseW);
    }
    //3.2码
    if (_code.downMsg && _code.downMsg.path) {
      ctx.drawImage(_code.downMsg.path, (canvasW - codeW - padding) * baseW, bottomInit * baseW, codeW * baseW, codeW * baseW);
    }
    //4.用户头像/logo
    let drawCircle = false;
    let name = '';
    if ((!QR_Conf || QR_Conf && QR_Conf.cfg_pic != "logo") && _user.downMsg && _user.downMsg.path && (draw && draw.codeType != 'QR')) {
      drawCircle = true;
      name = 'userHead';
    } else if (draw.codeType == 'QR') { //公众号二维码logo
      drawCircle = true;
      name = 'brand_logo'; 
    }
    if (drawCircle) {
      _user.x = canvasW - codeW - padding;
      _user.y = bottomInit;
      _user.w = codeW;
      _user.h = codeW;
      _user.baseW = baseW;
      DrawTemplate.drawCircle(name, ctx, _user);
    }
  }
}

function staffCodeHandle(){//根据配置读取staff_code展示的内容
  let staffCode = app.LM.staffInfo.private_code || app.LM.staffInfo.staffCode || "";
  let storeInfo = app.LM.storeInfo || {};
  storeInfo = {
    staff_code: storeInfo.staff_code ||"",
    staff_name: storeInfo.staff_name ||"",
    isStore:(storeInfo.staff_code || storeInfo.staff_name) || false
  };
  let Identity_Conf = this.ShareConf.identity && this.ShareConf.identity.data || false;
  let Store_Identity_Conf = this.ShareConf.identity_store && this.ShareConf.identity_store.data || false;
  //2.昵称/code
  if (staffCode) {
    if(Identity_Conf && Identity_Conf.cfg_pic == 'none'){
      staffCode = "";
    }else if (Identity_Conf && Identity_Conf.cfg_pic == 'name') {
      staffCode = this.data.realName || staffCode;
    }
  }else if(storeInfo.isStore){
    if(Store_Identity_Conf.cfg_pic == 'none'){
      staffCode = "";
    }else if(!Store_Identity_Conf || Store_Identity_Conf.cfg_pic != 'name'){
      staffCode = storeInfo.staff_code || storeInfo.staff_name || staffCode || "";
    }else{
      staffCode = storeInfo.staff_name || storeInfo.staff_code || staffCode || "";
    }
  }
  console.log("staffCode",staffCode)
  this.setData({
    staffCode: staffCode
  })
  return {
    staffCode,
    storeInfo
  }
}
 
//组合任务
function allAdaptiveSet(data = []) {
  let arr = [];
  return new Promise((rs, rj) => {
    data && data.forEach((item, index) => {
      arr.push(adaptiveSet.call(this, item, index));
    })
    Promise.all(arr).then(e => {
      rs(e)
    }).catch(e => {
      rs(e)
    })

  });
}

//单个任务
function adaptiveSet(data = {}) {
  return new Promise((rs, rj) => {
    if (data.category == 'image') {//图片模板
      if (data.type && !data.url) {
        return templateInfo.call(this, data).then(tamplateUrl => { //获取模板图片
          data.url = tamplateUrl || '';
          return downImageFnc.call(this, data.url, data).then(res => {//开始下载图片
            rs(data);
          });
        });
      } else if (!data.downMsg.status || !data.downMsg.downUrl) {
        return downImageFnc.call(this, data.url, data).then(res => {
          rs(data);
        });
      } else {
        rs(data);
      }
    } else if (data.category == 'text') {//文字模板
      if (data.type && !data.text) {
        return templateInfo.call(this, data).then(tamplateName => { //获取模板文字
          data.text = tamplateName || '';
          rs(data);
        });
      } else {
        rs(data);
      }
    } else {
      rs(data);
    }
  })
}

function downImageFnc(src = '', data = {}) {
  data = data || {};
  src = src || '';
  if (!src) return Promise.resolve(data);
  return WxApi.getImageInfo({
    src: changeHttp.call(this, src) || "",
  }).then(res => {
    data.downMsg = res;
    data.status = true;
    console.log('下载suc getImgInfo',data.type,data);
    return Promise.resolve(data);
  }).catch(e => {
    console.log('下载catch getImgInfo',data.type,e,data);
    data.downMsg = {};
    data.status = false;
    return Promise.resolve(data);
  })
}


function checkInfo(data = {}) {
  // console.log('进来前', JSON.parse(JSON.stringify(data.scene)));
  this.staffInfo = app.LM.staffInfo || {};
  this.storeInfo = app.LM.storeInfo || {};
  if (this.staffInfo.staffCode) {
    data.scene = data.scene || {};
    if (this.staffInfo.staffCode != data.scene.staffCode) {
      data.scene.staffCode = this.staffInfo.staffCode;
    }
  }
  let opKind = data.info && data.info.opKind || "";
  switch (opKind) {
    case 'STORE_STAFF':
    case 'STAFF_PERSONAL': {
      data.scene.store_id = this.storeInfo.store_id || '';
      data.scene.staff_code = this.storeInfo.staff_code || '';
      data.scene.staff_id = this.storeInfo.staff_id || '';
    }
      break;
    // case 'NEW_USER_SHARE':{
    // }
    // break
    // case 'user_share' :{
    // }
    // break
    default:
      break;
  }
  console.log('用户身份检测',this.staffInfo,',',this.storeInfo);
}

//图片、文字提取模板
function templateInfo(data = {}) { //下载前获取模板图片的url
  return new Promise((rs, rj) => {
    if (data.category == 'image') {
      switch (data.type) {
        case 'code': {
          return getAppletCode.call(this, this.data.allData).then(code => {
            rs(code)
          })
        }
          break;
        case 'userHead': {
          return getUserInfo.call(this).then(userHead => {
            rs(userHead)
          })
        }
          break;
        case 'brand_logo': {
          let qy_logo = this.data.brand_info.icon_url + "micro_mall/qy_logo.png";
          this.setData({
            qy_logo: qy_logo
          })
          rs(qy_logo);
          break;
        }
        case '': {
          rs(data.url || '');
        }
          break;
        default:
          rs(data.url || '')
          break;
      }
    } else if (data.category == 'text') {
      switch (data.type) {
        case 'realName': {
          return getUserInfo.call(this).then(res => {
            rs(this.userInfo.realName);
          })
        }
          break;
        case 'miniProm': {
          rs("长按识别小程序码")
        }
          break;
        case 'QR': {
          rs("扫码注册会员")
        }
          break;
        default:
          rs('')
          break;
      }
    } else {
      rs('');
    }
  })
}

function initTemplate(allData = {}) {
  allData = allData || {};
  let draw = allData.draw || {};
  let info = allData.info || {};
  let tempArr = [];
  if (draw.diy) {
    tempArr = draw.drawArr || [];
    return Promise.resolve(tempArr);
    // return checkShareConf.call(this, "adaptive").then(check_res => {
    // })
  } else if (draw.template == 'custom') {
    return checkShareConf.call(this, "custom").then(check_res => {
      return DrawTemplate.initCustomTemplate(allData).then(res => {
        return Promise.resolve(res || []);
      })
    })
  }
  else if (!draw.template || draw.template == 'goods') {
    return checkShareConf.call(this, "goods").then(check_res => {
      allData.info = allData.info || {};
      allData.info.ShareConf = this.ShareConf || {};
      return DrawTemplate.initNewGoodsTemplate(allData).then(res => {
        return Promise.resolve(res || []);
      })
    })
  } else {
    return Promise.resolve([]);
  }
}

function fillText(text, x, y, baseW, item, ctx) {
  ctx.fillText(text, x * baseW, (y + item.size) * baseW);
  if (item.bold) {
    ctx.fillText(text, x * baseW, (y + item.size - 0.5) * baseW);
  }
  if (item.decoration == 'line-through') {
    let x1 = x * baseW;
    let x2 = x1 + ctx.measureText(text).width;
    ctx.beginPath();
    ctx.setStrokeStyle("#B2B2B2");
    ctx.moveTo(x1, (y + item.size / 2 + 4) * baseW);
    ctx.lineTo(x2, (y + item.size / 2 + 4) * baseW);
    ctx.stroke()
  }
}

function checkShareConf(type = "goods") {
  let key = "POSTER_SHARE_CONF";
  return app.CDateH.setCatchDate(key, 5).then(res => {
    let arr = [];
    let p1 = checkShareConfApi.call(this, "poster_style");
    let p2 = checkShareConfApi.call(this, "qrcode_icon");
    let p3 = checkShareConfApi.call(this, "sharing_identity");
    let p4 = checkShareConfApi.call(this, "staff_identity");
    arr = [p1, p2, p3,p4];
    return new Promise.all(arr).then(res => {
      let obj = {};
      obj.poster = res[0] || {};
      obj.qrcode = res[1] || {};
      obj.identity = res[2] || {};
      obj.identity_store = res[3] || {};
      app.CDateH.setCacheData(key, res);
      obj.poster && obj.poster.data && obj.poster.data.cfg_pic && (obj.poster.data.cfg_pic = JSON.parse(obj.poster.data.cfg_pic));
      this.ShareConf = obj || {};
      console.log('配置',obj)
      return Promise.resolve(res);
    })
  }).catch(() => {
    let data = app.CDateH.getResult(key) || [];
    let obj = {};
    obj.poster = data[0] || {};
    obj.qrcode = data[1] || {};
    obj.identity = data[2] || {};
    obj.identity_store = data[3] || {};
    this.ShareConf = obj || {};
    return Promise.resolve(data);
  })
}

function checkShareConfApi(cfgType = "") {
  return app.BrandApi.getWxappShareConfigEntity({
    params: {
      cfgType: cfgType,
      brandCode: app.Conf.BRAND_CODE,
    }, other: {
      isShowLoad: false
    },
  })
}

function triggerActionLog(data = {}, type) {
  let name = "", position = "GOODS", params = {};
  if (type == "show") {
    name = "GOODS_POSTER"
  } else if (type == "save") {
    name = "GOODS_POSTER_SAVE"
  }
  let info = this.data.allData.info || {};
  let goodsInfo = info.goodsInfo || {};
  let opKind = info.opKind || "";
  let scene = data.scene || {};
  let staff_page_id = 0;
  console.log("share opKind", opKind)
  switch (opKind) {
    case "user_share":
      position = scene.issued_id ? "SECKILL" : scene.activityId ? "SECKILL_GOODS_DETAIL" : "GOODS";
      if (position == 'SECKILL' || position == 'GOODS') {
        params.issued_id = scene.issued_id || 0;
        params.goods_id = goodsInfo.goods_id || 0;
      } else if (position == 'SECKILL_GOODS_DETAIL') {
        params.activityId = scene.activityId || 0;
        params.goodsId = goodsInfo.goods_id || 0;
      }
      break;
    case "user_share_sk":
      position = "SECKILL_GOODS_DETAIL";
      params.activityId = scene.activityId || 0;
      params.goodsId = goodsInfo.goods_id || 0;
      break;
    case "user_share_pin":
      position = "GROUP_BUY";
      params.activity_id = scene.activity_id || 0;
      params.goods_id = goodsInfo.goods_id || 0;
      break;
    case "user_share_pr":
      position = "PRESELL";
      params.activity_id = scene.activity_id || 0;
      params.goods_id = goodsInfo.goods_id || 0;
      break;
    case "user_share_point":
      position = "INTEGRAL";
      params.mkGoodsId = scene.mkGoodsId || 0;
      params.goods_id = goodsInfo.goods_id || 0;
      break;
    case "STORE_STAFF":
      if (type == "show") {
        name = "STORE_POSTER"
      } else if (type == "save") {
        name = "STORE_POSTER_SAVE"
      }
      position = "STORE_CODE";
      params.store_id = scene.store_id || 0;
      params.staff_id = scene.staff_id || 0;
      break;
    case "STAFF_PERSONAL":
      if (type == "show") {
        name = "STAFF_POSTER"
      } else if (type == "save") {
        name = "STAFF_POSTER_SAVE"
      }
      position = "STAFF_CODE";
      params.store_id = scene.store_id || 0;
      params.staff_id = scene.staff_id || 0;
      break;
    case "NEW_USER_SHARE":
      if (type == "show") {
        name = "MYCODE_POSTER"
      } else if (type == "save") {
        name = "MYCODE_POSTER_SAVE"
      }
      position = "MYCODE";
      params.store_id = scene.store_id || 0;
      params.user_id = scene.staff_id || 0;
      break;
    // case "INVITE_AWARD":
    //   if (type == "show") {
    //     name = "INVITE_AWARD_POSTER"
    //   } else if (type == "save") {
    //     name = "INVITE_AWARD_POSTER_SAVE"
    //   }
    //   position = "INVITE_AWARD";
    //   params.store_id = scene.store_id || 0;
    //   params.user_id = scene.staff_id || 0;
    //   break;
    case "STAFF_GOODS":
    case "STAFF_ACTIVITY":
      position = "STAFF_GOODS";
      // staff_page_id = scene.page_id || (info.customJump == 1 && goodsInfo.page_id) || 0;

      if (type == "show") {
        name = "GOODS_POSTER"
        if (info.tabCurrent == 1) {
          name = "ACTIVITY_POSTER"
          position = "STAFF_ACTIVITY";
        }
      } else if (type == "save") {
        name = "GOODS_POSTER_SAVE"
        if (info.tabCurrent == 1) {
          name = "ACTIVITY_POSTER_SAVE"
          position = "STAFF_ACTIVITY";
        }
      }
      if (data.scene.goods_id && !info.customJump) {
        params.goods_id = scene.goods_id || 0;
        params.activity_id = goodsInfo.actionActivityId || 0;
      } else {
        // if(goodsInfo.page_id){
        //   params.page_id = goodsInfo.page_id;
        // }
        params.page_id = goodsInfo.page_id || 0;
        params.activity_id = goodsInfo.actionActivityId || 0;
      }
      break;
    case "SECKILL_HELP":
      if (type == "show") {
        name = "SECKILL_HELP_POSTER"
      } else if (type == "save") {
        name = "SECKILL_HELP_POSTER_SAVE"
      }
      position = "SECKILL_ACT_PAGE";
      params.groupId = scene.groupId || 0;
      params.activityId = scene.activityId || 0;
      break;
    case "CUSTOM_PAGE":
    case "CUSTOM_INDEX":
    case "user_share_page":
      let page = getCurrentPages().pop() || {};
      let tempRoute = page.pageType ? page.route + '?pageType=' + page.pageType : page.route;
      if (type == "show") {
        name = "CUSTOM_POSTER"
      } else if (type == "save") {
        name = "CUSTOM_POSTER_SAVE"
      }
      position = ActionRoute[tempRoute].position;
      if (info.extend_id) {
        params.page_id = info.extend_id;
      }
      break;
    default:

      break;
  }
  this.addActionLog(name, position, params)
}


function checkSetClick(type) {
  if (typeof (type) != "boolean") {
    return this.data.canClick;
  } else {
    if (type != this.data.canClick) {
      this.setData({
        canClick: type,
      })
    }
    return type;
  }
} 

function initCodeArr(data=[],info={}){
  data = data||[];
  let userHead = DrawTemplate.initData('image');
  userHead.type = 'userHead';//嵌头像
  if (info.opKind == 'STORE_STAFF' || info.opKind == "NEW_USER_SHARE") {
    let qy_logo = this.data.brand_info.icon_url + "micro_mall/qy_logo.png";
    this.setData({
      qy_logo: qy_logo
    })
    userHead.type = 'brand_logo';//嵌logo
  }
  let code = DrawTemplate.initData('image');
  code.type = 'code';
  data.push(code);
  data.push(userHead);
  return data;
}

function toTempFn(canvasId, callback) {
  let that = this;
  if (!this.data.showBtn) {
    this.setData({
      showBtn: true
    })
  }
  if (canvasId == 'saveShareCanvas') {
    wx.canvasToTempFilePath({
      canvasId: canvasId || 'saveShareCanvas',
      success(res) {
        that.savePathCurrent = res.tempFilePath || '';
      },
      fail() {
        app.SMH.showToast({
          "title": "图片路径生成失败"
        })
      },
      complete(res) {
        checkSetClick.call(that, true);
        app.SMH.hideLoading();
        typeof (callback) == "function" && callback();
      }
    }, that)
  }
}

//获取二维码
function getAppletCode(data) {
  checkInfo.call(this, data);
  if (!data) return;
  if (this.data.QRCode) {
    return Promise.resolve(this.data.QRCode);
  }
  return appletCode.call(this, data).then(code => {
    this.setData({
      QRCode: code
    })
    return Promise.resolve(code);
  })
}

//获取头像
function getUserInfo(opKind = '') {
  if (opKind && (opKind == "STORE_STAFF" || opKind == "NEW_USER_SHARE")) { //不需要画canvas头像
    let url = this.data.brand_info.icon_url + "micro_mall/qy_logo.png";
    this.setData({
      qy_logo: url
    })
    return Promise.resolve(url);
  }
  if (this.data.portraitImg) {
    return Promise.resolve(this.data.portraitImg);
  }
  return app.UserApi.getUserSimpleInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      let path = data.portrait_path || '';
      this.setData({
        portraitImg: path,
        realName: data.realName
      })
      this.userInfo = data;
      return Promise.resolve(path);
    } else {
      return Promise.reject(e);
    }
  })
}

function changeHttp(link) {
  if (!link || typeof link == 'object') return 'https://';
  if (link.indexOf("http://") == "-1" && link.indexOf("https://") == "-1") {
    link = "https://" + link;
  } else if (link.indexOf("https://") == "-1") {
    link = link.replace('http://', 'https://');
  }
  return link;
}