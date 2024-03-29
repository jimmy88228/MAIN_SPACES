// pages/micro_mall/questionnaire/questionnaire.js
const app = getApp();
import WxApi from "../../../common/support/tools/wx-api-promise.js"
Page(app.BP({
  data: {

  }, 
  onLoad: function (options) {
    this.options = options; 
  }, 
  onReady: function () { 
  }, 
  onShow: function () {
    this.jump = false;
    assembleOptions.call(this);
  }, 
  onHide: function () { 
  },
  onUnload: function () { 
  },
  onShareAppMessage: function () { 
    let path = `pages/micro_mall/questionnaire/questionnaire?voteActivityId=${this.options.voteActivityId}`;
    return {
      isCustom: true,
      title: this.title || "调查问券",
      path: path,
      // imageUrl: , 
    }
  },
  registerBack(detail){
    if(detail.isLogin){
      initParams.call(this, this.options);
    }
  },
  submit(e){
    if(this.lockUpLoad){
      app.SMH.showToast({
        title:"数据正在上传"
      })
      return;
    }
    if (!this.jump){
      console.log('提交');
      submit.call(this);
    }
  },
  multiImgUpload(imgList,index=0) {
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
    if (imgList && imgList.length > 0) {
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
        index,
        filePath,
        imgList
      };
      infoCheckFn.call(that, obj, that)
    } else { // 触发最后的提交
      console.log('循环结束：',this.results);
      this.lockUpLoad = false;
      let params = {
        cookieId: "",
        voteActivityId: this.options.voteActivityId ,
        brandCode: app.Conf.BRAND_CODE,
        userToken: app.LM.userKey
      }
      params = {
        ...params,
        results: this.results
      }
      post_VoteResult.call(this,params);
      return;
    }
  },
}))
function assembleOptions() { 
    let scene = this.options.scene;
    if (scene) {
      app.SHP.getParams(["voteActivityId"]).then((params) => {
        this.options = {
          ...this.options,
          ...params
        }
        listen.call(this);
      })
    } else {
      listen.call(this);
    } 
}
function initParams(){
  get_VoteActivityOptionList.call(this);
}
 
function submit(){
  let question = this.data.question.option_list || []; 
  let check = true; 
  init.call(this); 
  this.arr = this.arr || [];
  let temp = {};
  // let picArr = [];
  this.imgArr = [];
  this.label = [];
  let index = 0;
  for (let item in question) {
    if (!this.arr[item]) {
      let name = '#q_item' + item;
      temp = this.selectComponent(name);
      this.arr.push(temp);
    } else {
      temp = this.arr[item];
    }
    let tempData = temp.getData && temp.getData() || {};
    console.log(item, tempData);
    if (!tempData.check) {
      check = false;
      pageScrollTo.call(this, tempData.data && tempData.data.label || 0);
      break
    }
    let obj = setParams.call(this, tempData,index);
    if (question[item].vote_type_code != 'html') {
      this.results.push(obj);
    }
    index+=1;
  }
  // console.log(JSON.stringify(this.results));
  if(!check)return
  this.multiImgUpload(this.imgArr); 
}

function setParams(data={},index=0){
  data = data && data.data || {};
  let type = data.type || '';
  let obj = JSON.parse(JSON.stringify(this.resultsObj));
  if (type == 'text' || type == 'phone' || type == 'email' || type == 'date'){
    obj.txtData = data.value;
    obj.voteOptionId = data.id;
    return obj
  }
  if (type == 'location'){
    if (data.value && data.value.length>1){
      obj.province = data.value[0];
      obj.city = data.value[1];
      obj.district = data.value[2];
    } 
    obj.voteOptionId = data.id;
    return obj
  }
  if (type == 'vote_text' || type == 'vote_image'){
    obj.selectOptions = data.value;
    obj.voteOptionId = data.id;
    return obj
  }
  if (type == 'image'){
    obj.txtData = data.value;
    obj.voteOptionId = data.id;
    // data.value && picArr.push(data.id);
    data.value && this.label.push(index);
    data.value && this.imgArr.push(data.value);
    return obj
  }
  return this.resultsObj
}

function init(){
  this.results = [];
  this.resultsObj = {
    voteOptionId:0,
    txtData:"",
    province:0,
    city:0,
    district:0,
    selectOptions: null
    // {
    //   voteOptionId:0,
    //   voteOptionChildId:0,
    //   txtData:""
    // }
  }
}

function get_VoteActivityOptionList(){
  if (this.initQuestion)return
  let params = {
    voteActivityId: this.options.voteActivityId,
    brandCode: app.Conf.BRAND_CODE,
    userToken: app.LM.userKey
  }
  return app.RunApi.go('VoteApi', 'get_VoteActivityOptionList', params,{diy:true}).then(res=>{
    if(res.code==1){
      let data = res.data||{}; 
      this.title = data.activity_name || "问券调查"
      wx.setNavigationBarTitle({
        title: this.title
      })
      this.initQuestion = JSON.parse(JSON.stringify(data)) || [];
      this.setData({
        question: data || [],
        is_must_login: data.is_must_login || 0,
        showPage: true,
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    console.log("get_VoteActivityOptionList", e)
    this.setData({
      errMsg: e.msg || "问券异常",
      showPage: true
    })
    app.SMH.showToast({
      title: e.msg || "问券异常"
    })
  })
}

function post_VoteResult(params={}){
  params = params ||{};
  this.jump = true;
  return app.RunApi.go('post','VoteApi', 'post_VoteResult', params,{diy:true}).then(res => {
    if (res.code == 1) {
      let showResult = res.data || 0; 
      this.data.question = this.initQuestion
      app.SMH.showToast({
        title: "提交成功，正在跳转"
      })
      let _timer = setTimeout(()=>{
        this.setData({
          question: this.data.question
        })
        clearTimeout(_timer)
      },1000)
      let _timer_s = setTimeout(()=>{
        wx.navigateTo({
          url: `/pages/micro_mall/questionnaire/results/results?voteActivityId=${this.options.voteActivityId || 0}&showResult=${showResult}`,
        })
        clearTimeout(_timer_s)
      },500)
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    this.jump = false;
    app.SMH.showToast({
      title:e.msg || "提交失败，请稍后再试"
    })
  })
}


function listen() {
  this._checkUserLogin().finally(()=>{
    if(this.data.isLogin){
      initParams.call(this, this.options);
    }
  })
  this.setData({
    showPage:true
  })
}

function pageScrollTo(index=0){
  wx.pageScrollTo({
    duration: 300,
    selector: `#jump${index}`,
    complete: res => {
      console.log('跳', res, `#jump${index}`);
    }
  })
}


function infoCheckFn(obj, that) {
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
              let file_path =  data.data.ImgDomain + data.data.file_path;
              that.results[that.label[obj.index]] && (that.results[that.label[obj.index]].txtData = file_path);
              // that.imgPathList = that.imgPathList || {};
              // const key = `img${imgPathList.length + 1}_path`;
              // that.imgPathList[id] = that.imgPathList[id] || {};
              // that.imgPathList[id].url = file_path; 
              that.multiImgUpload(obj.imgList,obj.index+1);
          }catch(e){
              console.log(e);
              this.lockUpLoad = false;
              that.multiImgUpload(obj.imgList,obj.index+1);
          }
      },
      fail: function(res) {
          that.multiImgUpload(obj.imgList,obj.index+1)
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