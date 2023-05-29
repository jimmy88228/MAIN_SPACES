import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
import WxApi from "../../../../common/helper/wx-api-helper.js"
import SIH from "../../../../common/helper/sys-infos-helper"
import appletCode from "../../../../common/helper/appleCode.js"
const app = getApp();
const LABEL_TEMP = "onlyOne"
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      allData: {
        value:{},
        type: Object,
        observer(n,o){
          console.log(n,"allData   n");
          n = n || {};
          let goodsInfo = n.goodsInfo || {};
          if (goodsInfo.opKind != this.temOpKind){
            this.setData({
              QRCode: "",
              tempQR: {},
            })
            this.temOpKind = goodsInfo.opKind;
          }
        }
      },
      imgList: {
        value:[],
        type:Array,
        observer(n,o){
          let arr = [];
          for(let i in n){
            arr.push({
              url: n[i]
            });
          }
          this.setData({
            listInfo: arr,
            canvasList:[]
          })
        }
      },
      isShowList: {
        type:Boolean,
        value:false,
        observer(){
          if (!this.data.canClick){
            this.setData({
              canClick:true
            })
          }
        }
      },
      theme_color:{
        type: String,
        value: '',
      }
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      // canSave: false,
      //分销
      staffInfo: {},
      canvasConf: {
        width: 600,
        height: 950,
      },
      save_canvasConf: {
        width: 600,
        height: 950,
      },
      tempImg: '',
      QRCode:"",
      tempQR:{},
      codeInfo:{
        w:140,
        h:140
      },
      portraitImg:"",
      tempPortrait:{},
      listInfo:[],
      swiperCurr:0,
      canvasList:[],
      saveCurrent:1,
      /**
       * 样式
       * */
      cStyle:{
        cTxt:"#333",
        cTip:"#7f7f7f"
      },
      canClick:false,
    },
    attached() {
      this.first_touch = false;
      this.labelObj = {};
      this.savingObj = {};
      this.labelObj[LABEL_TEMP] = {};
      this.savingObj[LABEL_TEMP] = {};
    },
    detached() {},
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
        let allData = this.properties.allData;
        let scene = allData.scene || {};
        let goodsInfo = allData && allData.goodsInfo || {};
        let opKind = goodsInfo && goodsInfo.opKind || '';
        let goods = allData.canvasType != "custom";
        if (opKind && (opKind == "STORE_STAFF" || opKind == "STAFF_PERSONAL")) {
          this.setData({
            showTwoBtn: true,
          })
        }
        //
        getAppletCode.call(this, allData);
        getUserInfo.call(this, opKind);
        //
        if (this.properties.isShowList){
          this.changeView({
            detail: {
              current: 0
            }
          })
        }else{
          if (allData.canvasType == "custom") {
            this.createCustomCanvas();
          } else {
            this.createShareCanvas();
          }
        }
      },
      onDetached() {
        let allData = this.data.allData || {};
        if (allData.goodsInfo && allData.goodsInfo.opKind && (allData.goodsInfo.opKind == "STORE_STAFF" || allData.goodsInfo.opKind == "STAFF_PERSONAL")) {
          let _timer = setTimeout(() => {
            clearTimeout(_timer);
            this.ctx = wx.createCanvasContext('shareCanvas', this);
            this.ctx.setFillStyle('#fff');
            this.ctx.fillRect(0, 0, 950, 1500);
            this.ctx.draw()
          }, 500)
        }
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      createShareCanvas(canvasId) {
        let that = this;
        let data = this.properties.allData;
        let scene = data.scene || {};
        let goodsInfo = data.goodsInfo;
        getAppletCode.call(this, data).then(code => {
          getUserInfo.call(this).then(userHead => {
            let arr = [data.imgUrl, code, userHead];
            promiseAllPics.call(this, arr).then(res => {
              app.SMH.showLoading({
                title: "加载中..."
              });
              let _timer = setTimeout(() => {
                clearTimeout(_timer);
                app.SMH.hideLoading();
              }, 3000);
              console.log(res, "download结果");
              let carryData = {};
              carryData.label = scene.label || LABEL_TEMP;
              console.log('allData:', data);
              drawGoodsCanvas.call(this, 'shareCanvas', res, 1, carryData);
              drawGoodsCanvas.call(this, 'saveShareCanvas', res, 2, carryData);
            }).catch(error => {
              console.log(error, "error");
            })
          })
        });
      },

      //2
      createCustomCanvas() {
        let allData = this.properties.allData;
        let goodsInfo = allData && allData.goodsInfo || {};
        let opKind = goodsInfo && goodsInfo.opKind || '';
        let scene = allData && allData.scene || {};
        let that = this;
        let imgUrl = allData.imgUrl || "";
        if (!imgUrl) {
          app.SMH.showToast({
            "title": "海报图为空"
          })
          return;
        }
        let canvasConf = this.data.canvasConf;
        let canvasW = canvasConf.width;
        getAppletCode.call(this, allData).then(code => {
          getUserInfo.call(this, opKind).then(userHead => {
            console.log(userHead,"userHead");
            app.SMH.showLoading({
              title: "加载中..."
            });
            let _timer = setTimeout(() => {
              clearTimeout(_timer);
              app.SMH.hideLoading();
            }, 4000);
            if (opKind && opKind == 'STORE_STAFF') {
              let qy_logo = this.data.brand_info.icon_url + "micro_mall/qy_logo.png";
              userHead = qy_logo || '';
            }
            let arr = [allData.imgUrl, code, userHead];
            console.log("海报的图片",arr);
            promiseAllPics.call(this, arr).then(res => {
              let carryData = {};
              carryData.drawQy = opKind && ( opKind == 'STORE_STAFF' || opKind == 'NEW_USER_SHARE' ) ? true : false;
              carryData.label = scene.label || LABEL_TEMP;
              console.log(res, "download结果");
              allData.carryData = carryData;
              drawCustomCanvas.call(this, "shareCanvas", res, 1);
              drawCustomCanvas.call(this, "saveShareCanvas", res, 2);
            }).catch(e => {
              console.log(error, "error");
            });
          })
        })
      },
      checkAuthorize(){
        return new Promise((rs, rj) => {
          app.AS.checkAuthorize("scope.writePhotosAlbum", function () {
            return rs();
          },null,true)
        })
      },
      saveShareCanvas(callback) {
        if (!checkSetClick.call(this)) return;
        checkSetClick.call(this, false);
        let that = this;
        this.checkAuthorize().then(()=>{
          that.saveToPhotosAlbum(callback);
        })
      },
      saveToPhotosAlbum(callback){
        let that = this;
        wx.saveImageToPhotosAlbum({
          filePath: this.savePathCurrent || '',
          success(state) {
            if (typeof (callback) == "function") {
              callback();
            } else {
              app.SMH.showToast({
                "title": "保存成功"
              })
              triggerActionLog.call(that, that.data.allData,"save");
              that.closeList();
            }
          },
          fail(error) {
            app.SMH.showToast({
              "title": "保存失败"
            })
          },
          complete() {
          }
        })
      },
      allSaveHandle(){
        if (!checkSetClick.call(this)) return;
        checkSetClick.call(this, false);
        this.checkAuthorize().then(()=>{
          this.createAllShareCanvas();
        })
      },
      createAllShareCanvas(){
        let allData = this.properties.allData;
        let goodsInfo = allData && allData.goodsInfo || {};
        let opKind = goodsInfo && goodsInfo.opKind || '';
        let scene = allData && allData.scene || {};
        let that = this;
        let imgList = this.properties.imgList;
        if(!app.SIH.isIos){//ios倒序
          let imgList = this.properties.imgList;
          this.saveActive = imgList.length - 1
        }else{
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
            if (opKind && opKind == 'STORE_STAFF') {
              let qy_logo = this.data.brand_info.icon_url + "micro_mall/qy_logo.png";
              userHead = qy_logo || '';
            }
            let carryData = {}, that = this;
            carryData.drawQy = opKind && (opKind == 'STORE_STAFF' || opKind == 'NEW_USER_SHARE') ? true : false;
            carryData.label = scene.label || LABEL_TEMP;
            allData.carryData = carryData;
            //
            // this.saveProgress = this.saveProgress || this.selectComponent("#saveProgress");
            // this.saveProgress.show();
            this.canvasArrEvent(code, userHead);
          })
          
        })
      },
      canvasArrEvent(code, userHead){
        let imgList = this.properties.imgList;
        let imgUrl = imgList[this.saveActive];
        if (!imgUrl){
          // this.saveProgress = this.saveProgress || this.selectComponent("#saveProgress");
          // this.saveProgress.dismiss();
          app.SMH,wx.showToast({
            title: '保存完成',
          })
          let allData = this.properties.allData || {};
          triggerActionLog.call(this,allData,"show");
          triggerActionLog.call(this,allData, "save");
          this.closeList();
          return;
        };
        let arr = [imgUrl, code, userHead];
        let that = this;

        promiseAllPics.call(this, arr).then(res => {
          drawCustomCanvas.call(this, "saveShareCanvas", res, 2, function () {
            that.saveToPhotosAlbum(function(){
              app.SIH.isIos ? ++that.saveActive : --that.saveActive;
              that.setData({
                saveCurrent: app.SIH.isIos ? that.saveActive + 1 : (imgList.length - that.saveActive)
              })
              that.canvasArrEvent(code, userHead);
            });
          });
        }).catch(e => {
          console.log(e, "error");
        });
      },
      resetFn(e) {
        if (this.data.allData.goodsInfo && this.data.allData.goodsInfo.opKind == 'STORE_STAFF') {
          app.LM.checkIfStore(true).then(res => {
            if (res.store_id && res.staff_id) {
              this.data.allData.scene.staff_id = res.staff_id;
              this.data.allData.scene.store_id = res.store_id;
            }
            this.createCustomCanvas();
          });
        } else {
          this.createCustomCanvas();
        }
      },
      imgFn(e) {
        console.log('二维码加载成功');
      },
      imgFnErr(e) {
        console.log('二维码加载失败:', e);
        if (!this.firstError) {
          this.firstError = true;
          setTimeout(() => {
            this.resetFn();
          }, 500);
        }
      },
      changeView(e){
        let detail = e.detail || {};
        let current = parseInt(detail.current);
        let imgList = this.data.imgList || [];
        let arr = imgList.slice(current, current+1);
        let canvasConf = this.data.canvasConf || {};
        let viewW = canvasConf.width;
        promiseAllPics.call(this, arr).then(res=>{
          let info = res[0];
          let key = `listInfo[${current}]`;
          let h = (viewW * info.height) / info.width;
          let src = arr.join("");
          this.setData({
            [key]:{
              w: viewW,
              h: h,
              url: src,
              ...res[0]
            },
            swiperCurr: current
          })
          console.log(this.data.listInfo,"listInfo");
        })
      },
      closeList() {
        checkSetClick.call(this, true);
        this.dismiss();
      },
      _noFn(){}
    }
  })
);
//获取二维码
function getAppletCode(data){
  if(!data) return;
  if(this.data.QRCode){
    return Promise.resolve(this.data.QRCode);
  }
  return appletCode.call(this, data).then(code=>{
    this.setData({
      QRCode: code
    })
    return Promise.resolve(code);
  })
}
//获取头像
function getUserInfo(opKind = '') {
  if (opKind && (opKind == "STORE_STAFF" || opKind == "NEW_USER_SHARE") ) { //不需要画canvas头像
    return Promise.resolve('');
  }
  if (this.data.portraitImg){
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
        portraitImg: path
      })
      return Promise.resolve(path);
    } else {
      return Promise.reject(e);
    }
  })
}
//自定义画布
function drawCustomCanvas(canvasId, res, multiple,callback) {
  let that = this;
  let canvasConf = this.data.canvasConf;
  let save_canvasConf = this.data.save_canvasConf;
  let canvasW = JSON.parse(JSON.stringify(canvasConf.width));
  let baseW = SIH.screenWidth / 750 * multiple;
  let allData = this.properties.allData;
  let carryData = allData.carryData || {};
  let baseL = 30,
    baseR = 0,
    codeW = 200,
    codeH = 200;
  let res_0 = res && res[0] || {}; //背景图
  let res_1 = res && res[1] || {}; //小程序、二维码
  let res_2 = res && res[2] || {}; //logo
  let postW = 600;
  let postH = 950;
  if (res_0.status) {
    postW = res_0.width;
    postH = res_0.height;
  }
  let scale = 1;
  // if (canvasId == 'saveShareCanvas') {
  //   scale = parseFloat((500/res_0.width).toFixed(4));
  //   save_canvasConf.width = scale > 1 ? parseFloat(scale * res_0.width) : res_0.width;
  //   canvasW = scale > 1 ? parseFloat(scale * res_0.width) : res_0.width;
  // }
  let r_side = 30; //右边界 
  let text_h = 30;
  let canvasH = (canvasW * postH) / postW;
  console.log(postW, postH, canvasW, canvasH, '尺寸', canvasId);
  canvasH = canvasH <= 950 ? canvasH : 950;
  // if (canvasId == 'saveShareCanvas') {
  //   canvasH = JSON.parse(JSON.stringify(scale > 1 ? parseFloat(scale * res_0.height) : res_0.height));
  // }
  let offB = canvasH - r_side;
  let offR = canvasW - r_side;
  let offB_more = carryData.drawQy ? 5 : 0;
  //圆半径
  let circle_r = parseFloat((codeW / 4.4)).toFixed(2);
  // if (canvasId == 'saveShareCanvas') { //保存的图按原尺寸
  //   save_canvasConf.height = canvasH;
  //   this.setData({
  //     save_canvasConf: save_canvasConf,
  //   })
  // } else { //展示图按固定宽600
  // }
  canvasConf.height = canvasH;
  this.setData({
    canvasConf: canvasConf,
  })
  setTimeout(() => {
    this.ctx = wx.createCanvasContext(canvasId, this);
    this.ctx.setFillStyle("#fff");
    this.ctx.fillRect(0, 0, canvasW * baseW, canvasH * baseW);
    if (res_0.status) {
      console.log(res_0.path,"res_0.path");
      this.ctx.drawImage(res_0.path, 0, 0, canvasW * baseW, canvasH * baseW);
    }
    this.ctx.setTextAlign("right");
    this.ctx.setFillStyle('#7f7f7f');
    this.ctx.setFontSize(22 * baseW);
    let metrics = 0
    let text_x = 0;
    let text_content = '长按识别get同款';
    if (carryData.drawQy) {
      text_content = '扫码注册会员';
    }
    //   text_x = (canvasW - codeW - r_side - ((metrics - codeW) / 2)) * baseW; //居中
    this.ctx.fillText(text_content, offR * baseW, offB * baseW);
    this.ctx.setFillStyle('#000000');
    this.ctx.setFontSize(22 * baseW);
    // let allData = this.properties.allData;
    if ((allData.scene && allData.scene.staff_code) || app.LM.staffInfo.isStaffDstbData) {
      this.ctx.setTextAlign("right");
      this.ctx.setFillStyle('#000');
      this.ctx.setFontSize(22 * baseW);
      let staffCode = "";
      if (allData.scene && allData.scene.staff_code) {
        staffCode = allData.scene.staff_code;
      } else {
        staffCode = app.LM.staffInfo.private_code || app.LM.staffInfo.staffCode || ""
      }
      if (staffCode) {
        offB -= text_h;
        this.ctx.fillText(staffCode, offR * baseW, offB * baseW); //居右
      }
    }
    offB -= ((text_h - 5) + codeH + offB_more);
    if (res_1.status) {
      this.ctx.drawImage(res_1.path, (canvasW - (codeW + r_side)) * baseW, offB * baseW, codeW * baseW, codeH * baseW);
      let circle_x = get_circle.call(this, (canvasW - (codeW + r_side)) * baseW, offB * baseW, codeW * baseW, codeH * baseW).result_x;
      let circle_y = get_circle.call(this, (canvasW - (codeW + r_side)) * baseW, offB * baseW, codeW * baseW, codeH * baseW).result_y;
      if (!carryData.drawQy && res_2.status) {
        let head_x = get_vertex.call(this, circle_x, circle_y, circle_r * baseW * 2, circle_r * baseW * 2).result_x;
        let head_y = get_vertex.call(this, circle_x, circle_y, circle_r * baseW * 2, circle_r * baseW * 2).result_y;
        // //会员头像
        this.ctx.beginPath();
        this.ctx.arc(circle_x, circle_y, circle_r * baseW, 0, 2 * Math.PI, false);
        this.ctx.clip();
        this.ctx.drawImage(res_2.path, head_x, head_y, circle_r * 2 * baseW, circle_r * 2 * baseW);
        this.ctx.stroke();
      }
      if (carryData.drawQy && res_2.status) {
        let head_x = get_vertex.call(this, circle_x, circle_y, (codeW * 0.28) * baseW, (codeH * 0.28) * baseW).result_x;
        let head_y = get_vertex.call(this, circle_x, circle_y, (codeW * 0.28) * baseW, (codeH * 0.28) * baseW).result_y;
        this.ctx.drawImage(res_2.path, head_x, head_y, (codeW * 0.28) * baseW, (codeH * 0.28) * baseW);
      }
    }
    that.ctx.draw(false, () => {
      toTempFn.call(that,canvasId,function(){
        typeof (callback) == "function" && callback();
      })
      if (multiple == 1) {
        triggerActionLog.call(that, allData, "show");
      }
    });
  }, 100)
}

//商品画布
function drawGoodsCanvas(canvasId, res, multiple, carryData = {}) {
  let that = this;
  let brandInfo = this.data.brand_info || {};
  let canvasConf = this.data.canvasConf;
  let data = this.properties.allData;
  let goodsInfo = data.goodsInfo;
  let baseW = SIH.screenWidth / 750 * multiple;
  let nextBaseTop = 595;
  let nextBaseBottom = 0;
  let baseStrL = 13, baseStrW = 160 * multiple;
  let r_side = 20;
  let canvasW = canvasConf.width;
  let canvasH = canvasConf.height;
  canvasH = (canvasH) <= 950 ? (canvasH) : 950;
  console.log('canvasH', canvasH)
  let baseL = 30,
    baseR = 0,
    baseB = 20,
    codeW = 200,
    codeH = 200;
  let res_0 = res && res[0] || {}; //背景图
  let res_1 = res && res[1] || {}; //小程序、二维码
  let res_2 = res && res[2] || {}; //logo
  let circle_r = parseFloat((codeW / 4.4)).toFixed(2);
  let postW = 600;
  let postH = 950;
  if (res_0.status) {
    postW = res_0.width;
    postH = res_0.height;
  }
  this.ctx = wx.createCanvasContext(canvasId, this);
  this.ctx.setFillStyle('#fff')
  this.ctx.fillRect(0, 0, canvasW * baseW, canvasH * baseW);
  if (res_0.status) {
    this.ctx.drawImage(res_0.path, 0, (postH - postW) / 2, postW, postW, 0, 0, canvasW * baseW, canvasW * baseW);
  } 

  nextBaseBottom += baseB; 
  this.ctx.setTextAlign("right");
  this.ctx.setFillStyle('#7f7f7f')
  this.ctx.setFontSize(22 * baseW);
  this.ctx.fillText("长按识别get同款", (canvasW - r_side) * baseW, (canvasH - nextBaseBottom) * baseW);
  nextBaseBottom += baseL; 
  // this.ctx.fillText("长按识别小程序码", (canvasW - r_side) * baseW, rBaseTop * baseW)
  // this.ctx.fillText("长按识别小程序码", 390 * baseW, rBaseTop * baseW)

  if (app.LM.staffInfo.isStaffDstbData) {
    this.ctx.setTextAlign("right");
    this.ctx.setFillStyle('#000')
    this.ctx.setFontSize(22 * baseW);
    let staffCode = app.LM.staffInfo.private_code || app.LM.staffInfo.staffCode || "";
    let staffL = staffCode.length * 15;
    let codeX = (canvasW - r_side) * baseW;
    // if (!(staffL > codeW)) {
    //   codeX = (canvasW - r_side - ((codeW - staffL) / 2)) * baseW
    // }
    this.ctx.fillText(staffCode, codeX, (canvasH - nextBaseBottom) * baseW)
    nextBaseBottom += baseL;
  }

  if (res_1.status) {
    this.ctx.drawImage(res_1.path, (canvasW - codeW - r_side) * baseW, (canvasH - nextBaseBottom - codeH) * baseW, codeW * baseW, codeH * baseW);
    // this.ctx.drawImage(res_1.path, (canvasW - codeW - r_side) * baseW, 620 * baseW, codeW * baseW, codeH * baseW);
    // this.ctx.drawImage(res_1.path, 380 * baseW, 620 * baseW, codeW * baseW, codeH * baseW);
  } 

  this.ctx.setTextAlign("left");
  this.ctx.setFillStyle('#000000')
  this.ctx.setFontSize(26 * baseW);
  let NameLFloat = goodsInfo.goods_name.length || 0;
  let limitN = 0;
  let times = 0;
  for (let i = 0; i < NameLFloat; i++) {
    if (NameLFloat >= 2 && i == 0) {
      nextBaseTop = nextBaseTop - r_side;
    }
    let limitStr = goodsInfo.goods_name.slice(limitN, i);
    console.log('asd1', limitStr)
    let metrics = this.ctx.measureText(limitStr);
    if (metrics.width > baseStrW){
      limitN = i;
      times += 1;
      if (times>=4){
        limitStr = limitStr.slice(0, limitStr.length - 1) + '...';
        this.ctx.fillText(limitStr, baseL * baseW, (nextBaseTop + 70) * baseW);
        break
      }else{
        this.ctx.fillText(limitStr, baseL * baseW, (nextBaseTop + 70) * baseW);
      }
      nextBaseTop = nextBaseTop + 30;
    }else{
      limitStr = goodsInfo.goods_name.slice(limitN, NameLFloat);
      console.log('asd2', limitStr)
      metrics = this.ctx.measureText(limitStr);
      if (metrics.width < baseStrW){
        console.log('进来话',limitStr)
        this.ctx.fillText(limitStr, baseL * baseW, (nextBaseTop + 70) * baseW);
        nextBaseTop = nextBaseTop + 30;
        break;
      }
    }
  }
  this.ctx.setFontSize(22 * baseW);
  this.ctx.setFillStyle('#7F7F7F');
  this.ctx.fillText(goodsInfo.goods_sn, baseL * baseW, (nextBaseTop + 106) * baseW)
  this.ctx.setFontSize(38 * baseW);
  this.ctx.setFillStyle(this.data.theme_color || brandInfo.style.font_color);

  if (goodsInfo.min_price != goodsInfo.max_price && goodsInfo.max_price != "0") {
    this.ctx.fillText("¥" + goodsInfo.min_price + "-" + goodsInfo.max_price, baseL * baseW, (nextBaseTop + 165) * baseW)
    this.ctx.fillText("¥" + goodsInfo.min_price + "-" + goodsInfo.max_price, baseL * baseW, (nextBaseTop + 164.5) * baseW)
  } else {
    this.ctx.fillText("¥" + goodsInfo.price, baseL * baseW, (nextBaseTop + 165) * baseW)
    this.ctx.fillText("¥" + goodsInfo.price, baseL * baseW, (nextBaseTop + 164.5) * baseW)
  }
  //
  nextBaseTop = nextBaseTop + 200;

  if (goodsInfo.integral && goodsInfo.integral != 0) {
    this.ctx.setFontSize(30 * baseW);
    this.ctx.setFillStyle(this.data.theme_color || brandInfo.style.font_color);
    if (goodsInfo.min_integral != goodsInfo.max_integral && goodsInfo.max_integral != "0") {
      this.ctx.fillText("加积分" + goodsInfo.min_integral + "-" + goodsInfo.max_integral, baseL * baseW, (nextBaseTop + 5) * baseW)
      this.ctx.fillText("加积分" + goodsInfo.min_integral + "-" + goodsInfo.max_integral, baseL * baseW, (nextBaseTop + 4.5) * baseW)
    } else {
      this.ctx.fillText("加积分" + goodsInfo.integral, baseL * baseW, (nextBaseTop + 5) * baseW)
      this.ctx.fillText("加积分" + goodsInfo.integral, baseL * baseW, (nextBaseTop + 4.5) * baseW)
    }
    nextBaseTop = nextBaseTop + 45;
  }
  if (goodsInfo.market_price != 0 && goodsInfo.price != goodsInfo.market_price) {
    let base_lin_x = (baseL + 3) * baseW,
      base_lin_x2 = baseL * baseW;
    this.ctx.setFontSize(12);
    // this.ctx.setFontSize(22 * baseW);
    this.ctx.setFillStyle("#7F7F7F");
    if (goodsInfo.min_market_price != goodsInfo.max_market_price && goodsInfo.max_market_price != "0") {
      this.ctx.fillText("¥" + goodsInfo.min_market_price + "-" + goodsInfo.max_market_price, baseL * baseW, nextBaseTop * baseW)
      this.ctx.fillText("¥" + goodsInfo.min_market_price + "-" + goodsInfo.max_market_price, baseL * baseW, (nextBaseTop - 0.5) * baseW)
      let text = '¥' + goodsInfo.market_price + "-" + goodsInfo.max_market_price;
      base_lin_x2 = base_lin_x + this.ctx.measureText(text).width;
    } else {
      this.ctx.fillText("¥" + goodsInfo.market_price, baseL * baseW, nextBaseTop * baseW)
      this.ctx.fillText("¥" + goodsInfo.market_price, baseL * baseW, (nextBaseTop - 0.5) * baseW)
      let text = '¥' + goodsInfo.market_price;
      base_lin_x2 = base_lin_x + this.ctx.measureText(text).width;
    }
    this.ctx.beginPath()
    this.ctx.setStrokeStyle("#7F7F7F")
    this.ctx.moveTo(base_lin_x, (nextBaseTop - 6) * baseW);
    this.ctx.lineTo(base_lin_x2, (nextBaseTop - 6) * baseW);
    this.ctx.stroke()
  }  

  if (res_1.status && res_2.status) {
    let circle_x = get_circle.call(this, (canvasW - codeW - r_side) * baseW, (canvasH - nextBaseBottom - codeH) * baseW, codeW * baseW, codeH * baseW).result_x;
    let circle_y = get_circle.call(this, (canvasW - codeW - r_side) * baseW, (canvasH - nextBaseBottom - codeH) * baseW, codeW * baseW, codeH * baseW).result_y;
    let head_x = get_vertex.call(this, circle_x, circle_y, circle_r * baseW * 2, circle_r * baseW * 2).result_x;
    let head_y = get_vertex.call(this, circle_x, circle_y, circle_r * baseW * 2, circle_r * baseW * 2).result_y;

    //会员头像
    this.ctx.beginPath();
    this.ctx.arc(circle_x, circle_y, circle_r * baseW, 0, 2 * Math.PI, false);
    this.ctx.clip();
    this.ctx.drawImage(res_2.path, head_x, head_y, circle_r * 2 * baseW, circle_r * 2 * baseW);
    this.ctx.stroke();
  }
  
  this.ctx.draw(false, () => {
    toTempFn.call(that, canvasId);
    if (multiple == 1){
      triggerActionLog.call(that, data,"show");
    }
    
  });
}


//
function changeHttp(link) {
  if (link.indexOf("http://") == "-1" && link.indexOf("https://") == "-1") {
    link = "https://" + link;
  } else if (link.indexOf("https://") == "-1") {
    link = link.replace('http://', 'https://');
  }
  return link;
}

function toTempFn(canvasId,callback) {
  this.setData({
    canClick: true
  })
  if (canvasId == 'shareCanvas') {
    return;
  }
  let that = this;
  if (canvasId == 'saveShareCanvas') {
    wx.canvasToTempFilePath({
      canvasId: canvasId || 'shareCanvas',
      success(res) {
        console.log(canvasId, '缓存:', res);
        that.savePathCurrent = res.tempFilePath || '';
        typeof (callback) == "function" && callback();
      },
      fail() {
        app.SMH.showToast({
          "title": "生成图片路径失败"
        })
      },
      complete(res) {
        app.SMH.hideLoading();
      }
    }, that)
  }
}


function get_circle(x = 0, y = 0, w = 0, h = 0) { //已知左上端点、宽高, 求中心
  let _middle_x = parseFloat((w * 0.5));
  let _middle_y = parseFloat((h * 0.5));
  let _x = (x + _middle_x);
  let _y = (y + _middle_y);
  return {
    result_x: _x,
    result_y: _y
  }
}

function get_vertex(x = 0, y = 0, w = 0, h = 0) { //已知中心、宽高, 求左上端点
  let _middle_x = parseFloat(w * 0.5);
  let _middle_y = parseFloat(h * 0.5);
  let _x = (x - _middle_x);
  let _y = (y - _middle_y);
  return {
    result_x: _x,
    result_y: _y
  }
}
function checkSetClick(type){
  if (typeof (type) != "boolean" || this.data.canClick == type){
    return this.data.canClick;
  }
  this.setData({
    canClick: type
  })
  if (!this.data.canClick){
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(()=>{
      this.setData({
        canClick: true
      })
    },10000);
  }else{
    this.clickTimer && clearTimeout(this.clickTimer);
  }
}

function promiseAllPics(picsArr = []) {
  //picsArr [0]:背景图 [1]:二维码 [2]:头像
  let arr = [];
  return new Promise((rs, rj) => {
    picsArr.forEach((item,index) => {
      arr.push(promiseAllSet.call(this,item, index));
    })
    Promise.all(arr).then(e => {
      rs(e)
    }).catch(e => {
      rs(e)
    })

  });
}

function promiseAllSet(src = '',index) {
  if (!src) {
    return Promise.resolve('');
  }
  let result = infoHandle.call(this, src, index);
  if (result){
    return Promise.resolve(result);
  }
  return new Promise((rs, rj) => {
    WxApi.getImageInfo({
        src: changeHttp.call(this, src) || "",
      }).then(e => {
        e = e || {};
        e.status = true;
        infoHandle.call(this, src, index, e);
        rs(e);
      })
      .catch(e => {
        e = e || {};
        e.status = false;
        infoHandle.call(this, src, index, e);
        rs(e);
      });
  });
}
function infoHandle(src,index,data){
  switch (index + "") {
    case "0":
      let isShowList = this.data.isShowList || [];
      if (isShowList) {
        let listInfo = this.data.listInfo;
        for (let i in listInfo) {
          if (listInfo[i].url == src) {
            if (listInfo[i].path){
              return Promise.resolve(listInfo[i]);
            } else if (data && data.path){
              let key = `listInfo[${i}]`;
              this.setData({
                [key]: {
                  ...listInfo[i],
                  ...data
                }
              })
            }else{
              return false
            }
          }
        }
      }
      break;
    case "1":
      if (src == this.data.QRCode) {
        if (this.data.tempQR && this.data.tempQR.path){
          return Promise.resolve(this.data.tempQR);
        }else if(data && data.path){
          this.setData({
            tempQR: data
          })
        }else{
          return false;
        }
      }
      break;
    case "2":
      if (src == this.data.portraitImg) {
        if (this.data.tempPortrait && this.data.tempPortrait.path){
          return Promise.resolve(this.data.tempPortrait);
        } else if (data && data.path){
          this.setData({
            tempPortrait: data
          })
        }else{
          return false;
        }
      }
      break;
    default: return false;
  }
}

function triggerActionLog(data = {},type){
  let name = "", position = "GOODS",params = {};
  if (type == "show") {
    name = "GOODS_POSTER"
  } else if (type == "save") {
    name = "GOODS_POSTER_SAVE"
  }
  let goodsInfo = data.goodsInfo || {};
  let scene = data.scene || {};
  switch (goodsInfo.opKind){
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
    default:
      break;
  }
  this.addActionLog(name,position,params)
}