// pages/micro_mall/questionnaire/questionnaire.js
const app = getApp();
import WxApi from "../../../common/helper/wx-api-helper.js"
Page(app.BP({
  data: {
    firstStarIndex:-1,
    lastStarIndex:-1,
  }, 
  onLoad: function (options) {
    app.StorageH.remove("terminatedOption")
    this.options = options;
  }, 
  onReady: function () {
    assembleOptions.call(this);
  }, 
  onShow: function () {
    this.jump = false;
    // listen.call(this);
  }, 
  onHide: function () { 
  },
  onUnload: function () { 
  },
  onShareAppMessage: function () { 
    let path = `pages/micro_mall/questionnaire/questionnaire?voteActivityId=${this.options.voteActivityId}&batchNo=${this.options.batchNo || 0}&needGoodsInfo=${this.options.needGoodsInfo || 0}`;
    return {
      isCustom: true,
      title: this.title || "调查问券",
      path: path,
      // imageUrl: , 
    }
  },
  handleTerminationChange(e) { // 有子组件 发出了 "终止状态" 的改变 
    console.log("终止状态改变", e && e.detail);
    const {label, status} = e.detail;
    if(typeof label === "undefined") return console.log("label不存在，label=", label)
    if(status == 1) { // 专门为GOSO定制的，可去掉回复正常
      this.submit()
    }
    setTerminated.call(this, label, !!status)
  },
  registerBack(){
    listen.call(this);
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
        userToken: app.LM.userToken || "",
        cookieId: "",
        voteActivityId: this.options.voteActivityId,
        relatedValue: this.data.question && this.data.question.relatedValue || "",
        related_goods: this.data.question && this.data.question.reletedGoods || "",
        brandCode: app.Conf.BRAND_CODE,
      }
      params = {
        ...params,
        results: this.results
      }
      post_VoteResult.call(this,params);
      return;
    }
  },
  setOptionsListData(e) {
    const {label, setobj} = e.detail && e.detail;
    const __setData = {};
    for (let key of Object.keys(setobj)) {
      __setData[`question.option_list[${label}].${key}`] = setobj[key]
    }
    this.setData(__setData)
  }
}))
function assembleOptions() { 
    let scene = this.options.scene;
    if (scene) {
      app.SHP.getParams(["voteActivityId"]).then((params) => {
        this.options = {
          ...this.options,
          ...params
        }
        this._checkUserLogin().finally(() => {
          initParams.call(this, this.options)
        })
      })
    } else {
      this._checkUserLogin().finally(() => {
        initParams.call(this, this.options)
      })
    } 
}
function initParams(){
  get_VoteActivityOptionList.call(this)
}
 
function submit(){
  let option_list = this.data.question.option_list || [];
  let question = [];
  option_list.some(option => {
    question.push(option);
    if(option.terminated) return true;
  })
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
  if (type == 'vote_text' || type == 'vote_image' || type == 'vote_star'){
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
  let params = {
    userToken: app.LM.userToken || "",
    brandCode: app.Conf.BRAND_CODE,
    voteActivityId: this.options.voteActivityId,
    needGoodsInfo: this.options.needGoodsInfo || 0,
  }
  if (this.options.batchNo) params.batchNo = this.options.batchNo;
  return app.RunApi.go('VoteApi', 'get_VoteActivityOptionList', params,{diy:true}).then(res=>{
    if(res.code==1){
      let data = res.data||{};
      this.title = data.activity_name || "问券调查"
      wx.setNavigationBarTitle({
        title: this.title
      })
      this.terminateList = initTerminateList(res.data && res.data.option_list); // 在this保存一个终止列表
      console.log("终止属性: ", this.terminateList)
      modifyData.call(this,data); // 处理data
      // if(this.options.needGoodsInfo == 1) data.goodsList = [{
      //   goodsName: "兰缪「甄选」可爱卡通长袖套装",
      //   goodsImg: "http://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20220309/20220309162354879_1112486.png"
      // }]; // 记得删，写死goodsList
      this.setData({
        question: data || [],
        is_must_login: data.is_must_login || 0,
        showPage: true,
      })
      initTerminated.call(this); // 初始化终止属性
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
      // app.SMH.showToast({
      //   title: "提交成功，正在跳转"
      // })
      let _timer_s = setTimeout(()=>{
        // if (app.StorageH.get("terminatedOption")) wx.redirectTo({url: `/pages/micro_mall/questionnaire/results/results`})
        // wx.redirectTo({url: `/pages/micro_mall/questionnaire/results/results`}); // 专门为GOSO定制的，可替换
        wx.redirectTo({url: `/pages/micro_mall/questionnaire/results/results?voteActivityId=${this.options.voteActivityId || 0}&showResult=${showResult}`})
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
function modifyData(data = {}){
  const option_list = data.option_list || [];
  const imgList = data.imgList || [];
  // 标题替换准备
  const nameImageRef = {};
  imgList.forEach(({goodsImg, goodsName}) => {(goodsImg && goodsName) && (nameImageRef[goodsName] ? nameImageRef[goodsName].push(goodsImg) : nameImageRef[goodsName] = [goodsImg]);})
  // 增加属性序号准备
  const appendAutoLabel = appendAutoLabelF();
  // 星星组件，要区分第一个和最后一个，准备
  let {firstStarIndex, lastStarIndex} = this.data;
  for (let i = 0; i < option_list.length; i++){
    const item = option_list[i], {vote_type_code} = item;
    if (vote_type_code == 'html'){ // 富文本只增加一个属性 modifiedHtml
      item.modifiedHtml = modifyHtml(item.txt_html, nameImageRef)
      continue
    }else if(vote_type_code == 'end_page'){ // 终止页
      app.StorageH.set("terminatedOption", item);
      option_list.splice(i, 1);
      i--;
      continue
    }
    // 星星组件，要区分第一个和最后一个
    firstStarIndex < 0 && (item.vote_type_code == 'vote_star') && (firstStarIndex = i);
    (item.vote_type_code == 'vote_star') && (lastStarIndex = i);
    appendTitleProperties(nameImageRef, item); // 对标题、副标题 进行处理，会在item增加 两个属性 titleArr:[...] 和 childTitleArr:[...]
    appendAutoLabel(item); // 给item增加autoLabel属性
  }
  this.setData({
    firstStarIndex,
    lastStarIndex,
  })
  console.log('firstStarIndex',this.data.firstStarIndex)
  console.log('lastStarIndex',this.data.lastStarIndex)
}

function modifyHtml(richText = "", nameImageRef) {
  for (let goodsName of Object.keys(nameImageRef)){
    const goodsImgArr = nameImageRef[goodsName] || [];
    richText = replaceStrKeyWord(richText, goodsName, `<a href="${goodsImgArr.join(',')}" class="product_pic">${goodsName}</a>`)
  }
  return richText
}

function appendAutoLabelF(){
  let autoLabel = 0
  return (item = {}) => {(item.vote_type_code != 'html') && (item.autoLabel = ++autoLabel);}
}

function appendTitleProperties(nameImageRef, item){
  let {title = "", child_title = ""} = item || {};
  title = title.trim();
  child_title = child_title.trim();
  let titleArr = [title], childTitleArr = [child_title];
  if (title) {
    for(let goodsName of Object.keys(nameImageRef)){
      titleArr = recursiveReplacement(titleArr, goodsName, {goodsName, goodsImg: nameImageRef[goodsName]})
    }
  }
  if (child_title) {
    for(let goodsName of Object.keys(nameImageRef)){
      childTitleArr = recursiveReplacement(childTitleArr, goodsName, {goodsName, goodsImg: nameImageRef[goodsName]})
    }
  }
  item.titleArr =  titleArr;
  item.childTitleArr = childTitleArr;
}

function recursiveReplacement(arr, name, replacement) {
  if (Array.isArray(arr) && arr !== replacement) {
    let _arr = [];
    arr.forEach(item => {
      if (Object.prototype.toString.call(item) === "[object String]") _arr = [..._arr, ...replaceStrName(item, name, replacement)];
      else _arr.push(item);
    })
    return _arr
  }
  return arr
}

// 辅助函数 给定 字符串:str, 关键字:name, 将str中包含的name替换成replacement; 输出一个数组
function replaceStrName(str, name, replacement) {
  let nameIndex = str.indexOf(name)
  if (nameIndex != -1) return [str.slice(0, nameIndex), replacement, ...replaceStrName(str.substring(nameIndex + name.length), name, replacement)];
  return [str]
}

// 辅助函数 给定 字符串:str, 关键字:name, 将str中包含的name替换成newStr; 输出一个字符串
function replaceStrKeyWord(str = "", name, newStr) {
  const nameIndex = str.indexOf(name);
  if (nameIndex != -1 && str != newStr) return str.slice(0, nameIndex) + newStr + replaceStrKeyWord(str.substring(nameIndex + name.length), name, newStr);
  else return str
}

function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: true,
    });
    return
  }
  this.setData({
    showPage:true
  })
  return app.LM.loginAsync(false).then(res=>{
    this.setData({
      isLogin: !!res
    });
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

function initTerminateList(option_list = []){
  const terminateList = [];
  option_list.forEach((option,index) => {
    if(option.vote_type_code === 'vote_text') {
      const child_list = option.child_list || [];
      child_list.some(child => {
        if(child.is_stop && child.is_stop != 0){
          terminateList.push(index);
          option.haveTerminateProperty = true; // 给option加上这个属性
          return true;
        }
      })
    }
  })
  return terminateList
}

function initTerminated(){ // 给问卷item初始化Terminated属性-是否隐藏
  const terminateList = this.terminateList || [];
  setTerminated.call(this, terminateList, true);
}

function setTerminated(labels, terminated) {
  const optionList = this.data.question && this.data.question.option_list || [];
  let type = Object.prototype.toString.call(labels);
  let __setData = {};
  if (type == "[object Array]"){
    labels.forEach(label => {
      optionList[label].terminated != terminated && (__setData[`question.option_list[${label}].terminated`] = terminated);
    })
  } else if (type == "[object Number]"){
    const goodsList = this.data.question && this.data.question.goodsList || [];
    optionList[labels].terminated != terminated && (__setData[`question.option_list[${labels}].terminated`] = terminated);
  }
  this.setData(__setData)
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