// pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/identity_fill/identity_fill.js
import WxApi from "../../../../../../common/helper/wx-api-helper.js"
import PageJump from "../../../../../../common/helper/page-jump.js";
const app = getApp();
Page(app.BP({
  data: {
    cur_img_front: "",
    cur_img_contrary: "",
    // protocolOK: true,
    protocol: true,
    protocol_sec: true,
    imgPathList:[],
    inputlist: [{
      index:0,
      id: "realName",
      name: "姓名",
      type: "text",
      placeHolder: "请填姓名",
      isMust: true,
      boxStyle: "background:rgba(249,250,251);border-radius: 6rpx;margin-bottom: 15rpx;padding-right:180rpx;",
      nameStyle: "font-size:28rpx;",
    }, {
      index:1,
      id: "idCardNo",
      name: "身份证号",
      type: "idcard",
      placeHolder: "请填身份证号",
      isMust: true,
      boxStyle: "background:rgba(249,250,251);border-radius: 6rpx;padding-right:180rpx;",
      nameStyle: "font-size:28rpx;",
      showTip:false
    },
      // {
      //   id: "phone",
      //   name: "手机号码",
      //   type: "number",
      //   placeHolder: "请填手机号",
      //   isMust: true,
      //   boxStyle: "background:rgba(249,250,251);border-radius: 6rpx;",
      //   nameStyle: "font-size:28rpx;",
      // },
    ]
  },
  onLoad: function (options) {
    this.options = options || {};
    getAgreement.call(this,"CERTIFICATION");
    getAgreement.call(this,"CERTIFICATION2");
    let img_front = this.data.brand_info.default_icon_url + "idCard_front.png";
    let img_contrary = this.data.brand_info.default_icon_url + "idCard_contrary.png";
    let img_cam = this.data.brand_info.default_icon_url + "idCard_cam.png";
    this.setData({
      img_front,
      img_contrary,
      img_cam,
    })
  },
  onShow(){
    // this.arr = ['aa','bb']
    // this.multiImgUpload(this.arr);
  },
  onReady() {
    this.inputlist = this.inputlist || this.selectComponent('#list');
  },
  onTap(e) {
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || ""
    if (type == 'submit') {
      this.inputlist = this.inputlist || this.selectComponent('#list');
      try{
        this.result = this.inputlist.checkComplete();
      }catch(e){
        console.log(e,'catch');
        e && this.inputlist.setTip(e.i);
        return
      }
      console.log('result', this.result);
      checkMsgCompleted.call(this);
      try{
        this.upLoadImgs();
      }catch(e){
        console.log(e);
      }
    } else if (type == 'protocol' || type == 'protocol_sec') {
      this.setData({
        [type]: !this.data[type]
      })
    } else if (type == 'show_protocol' || type == 'show_protocol_sec') {
      this[type] = this[type] || this.selectComponent(`#${type}`);
      this[type].show();
    } else if (type == 'front' || type == 'contrary') {
      let _setData = "cur_img_" + type;
      WxApi.chooseImage({
        count: 1,
      }).then(res => {
        console.log('========success:', res);
        let path = res.tempFilePaths && res.tempFilePaths[0];
        this.setData({
          [_setData]: path
        })
      }).catch(e => {
        this.setData({
          [_setData]: this.data[_setData] || ""
        })
      })
    }
  },
  upLoadImgs(){
    if(this.lockUpLoad){
      app.SMH.showToast({
        title:"数据正在上传"
      })
      return;
    }
    this.data.imgPathList = [];
    this.lockUpLoad = true;
    this.imgArr = [this.data.cur_img_front,this.data.cur_img_contrary];
    this.multiImgUpload(this.imgArr);
  },
  protocolConfirm(e) {
    let id = e.currentTarget && e.currentTarget.id || "";
    console.log(e,id);
    let data = id == 'show_protocol' ? 'protocol' : 'protocol_sec'
    data && this.setData({
      [data]: true
    })
  },

  multiImgUpload(imgList) {
    const that = this;
    let brand_info = this.data.brand_info;
    let brand_name = app.Conf.BRAND_CODE;
    let time = new Date().getTime();
    let domain_name = app.Conf.UPLOAD_DOMIN;
    let req_type = "idCard"; //grass
    let req_id = new Date().getTime();
    let c_req_type = 'img';
    let operate_name = "admin";
    let remark = "";
    let img_code = "";
    let suffix = "";
    let sign_key = "123456";
    if (imgList.length > 0) {
      let filePath = imgList.shift();
      console.log('======路径：', filePath);
      let obj = {};
      obj = {
        brand_info,
        brand_name,
        time,
        domain_name,
        req_type,
        req_id,
        c_req_type,
        operate_name,
        remark,
        img_code,
        suffix,
        sign_key,
        filePath,
        imgList
      };
      infoCheckFn.call(that, obj, that)
    } else { // 触发最后的提交
      console.log('循环结束：', this.data.imgPathList);
      this.lockUpLoad = false;
      checkUserIdCard.call(this, initParams.call(this));
      return;
    }
  },

}))

function initParams() {
  let params = {};
  params.frontPicPath = this.data.imgPathList[0] || "";
  params.backPicPath = this.data.imgPathList[1] || "";
  let rt = this.result || {};
  for (let i in rt) {
    params[i] = rt[i] && rt[i].value || "";
  }
  return params
}

function checkUserIdCard(params) {
  console.log(params);
  if (this.lock) return;
  this.lock = true;
  return app.RunApi.go('POST', 'DistributionApi', 'checkUserIdCard', params).then(res => {
    if (res.code == '1') {
      app.SMH.showToast({
        title: "认证完成"
  });
      setVerify.call(this);
      setTimeout(() => {
        this.lock = false;
        jump.call(this);
      }, 1000)
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e => {
    this.lock = false;
    app.SMH.showToast({
      title: e && e.msg || "认证失败"
    })
  })
}

function jump() {
  let ops = this.options || {};
  console.log(ops.fromRoute);
  if (ops.fromRoute == 'brokerage') {
    wx.redirectTo({
      url: `/pages/micro_mall/distribution_center/distribution_brokerage/distribution_take_out/distribution_take_out?balance=${ops.balance || 0}`,
    })
  } else if (ops.fromRoute == 'staff') {
    let result = this.result || {};
    let params = {
      func_type: "STAFF",
      order_amount: ops.order_amount,
      free_num_day: ops.free_num_day,
      dure_agreement: ops.dure_agreement,
      page_id: ops.page_id,
      phone: ops.phone,
      userName: ops.userName,
      navType: "redirect",
      cName: result.realName && result.realName.value
    }
    PageJump(params);
  } else {
    wx.navigateBack({
      delta: 1,
    })
  }

}

function checkMsgCompleted() {
  let bool = true, name = "";
  if (!this.data.cur_img_front || !this.data.cur_img_contrary) {
    bool = false;
    name = "请上传" + (!this.data.cur_img_front ? "身份证正面照" : "身份证反面照");
  } else if (!this.data.protocol || !this.data.protocol_sec) {
    let proData = this.data.CERTIFICATION||{};
    let proData2 = this.data.CERTIFICATION2||{};
    bool = false;
    name = "请先勾选" + (!this.data.protocol? (proData.article_title||"协议") : (proData2.article_title||"协议"))
  }
  if (!bool) {
    app.SMH.showToast({
      title: name || ""
    });
    throw name
  }
}

function setVerify() {
  let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
  storage.needVerify = 0;
  app.StorageH.set("SIMPLE_USER_INFO", storage);
}

function getAgreement(type="") {
  return app.UserApi.getUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: type
    }, other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      this.setData({
        [type]: res.data
      })
    }
  })
}

function infoCheckFn(obj, that) {
  // infoMapFn.call(that, obj, that, 'jpg');
  if (obj.c_req_type == 'img') {
      WxApi.getImageInfo({
          src: obj.filePath.trim() 
      }).then(res => {
          infoMapFn.call(that, obj, that, res.type);
      }).catch((e) => {
          infoMapFn.call(that, obj, that, 'jpg');
      })
  }
}


function infoMapFn(obj, that, suffixInit) {
  let suffix = suffixInit;
  let signStr = "brand_name=" + obj.brand_name + "&time=" + obj.time + "&domain_name=" + obj.domain_name + "&req_type=" + obj.req_type + "&req_id=" + obj.req_id + "&c_req_type=" + obj.c_req_type + "&operate_name=" + obj.operate_name + "&remark=" + obj.remark + "&img_code=" + obj.img_code + "&suffix=" + suffix + "&image_data=" + obj.filePath;
  let img_code = app.md5.hexMD5(app.md5.hexMD5(signStr) + obj.sign_key);

  let urlSend = suffixInit == 'mp4' ? obj.brand_info.uploadMvUrl : obj.brand_info.uploadImgUrl
  if (!this.data.showLoading){
    this.setData({
        showLoading: true
    })
  }
  app.SMH.showToast({
      "title": "正在提交..",
  })
  //上传
  console.log('服务器地址', urlSend)
  urlSend = changeHttp.call(this, urlSend);
  console.log('file路径', obj.filePath)
  wx.uploadFile({
      url: urlSend,
      filePath: obj.filePath.trim(),
      name: 'upload_file',
      formData: {
          brand_name: app.Conf.BRAND_CODE,
          time: new Date().getTime(),
          domain_name: app.Conf.UPLOAD_DOMIN,
          req_type: "idCard",
          req_id: new Date().getTime(),
          c_req_type: obj.c_req_type, //MV/img
          operate_name: "admin",
          remark: "",
          img_code: img_code,
          suffix: suffix
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
          try{
              let data = {};
              data = JSON.parse(res.data);
              let file_path = data.data.file_path;
              let imgPathList = that.data.imgPathList || [];
              // const key = `img${imgPathList.length + 1}_path`;
              imgPathList.push(file_path);
              that.setData({
                  imgPathList: imgPathList
              });
              that.multiImgUpload(obj.imgList);
          }catch(e){
              console.log(e);
              this.lockUpLoad = false;
              that.multiImgUpload(obj.imgList);
          }
      },
      fail: function(res) {
          that.multiImgUpload(obj.imgList)
      }
  })
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