// pages/micro_mall/questionnaire/questionnaire.js
const app = getApp();
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
    listen.call(this);
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
  registerBack(){
    // listen.call(this);
  },
  submit(e){
    if (!this.jump){
      console.log('提交');
      submit.call(this);
    }
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
      initParams.call(this, this.options);
    })
  } else {
    initParams.call(this, this.options);
  }
}
function initParams(){
  get_VoteActivityOptionList.call(this);
}
 
function submit(){
  let question = this.data.question.option_list || []; 
  let check = true;
  let params = {
    userToken:app.LM.userToken || "",
    cookieId: "",
    voteActivityId: this.options.voteActivityId ,
    brandCode: app.Conf.BRAND_CODE,
  }
  init.call(this); 
  this.arr = this.arr || [];
  let temp = {};
  for (let item in question) {
    if (!this.arr[item]) {
      let name = '#q_item' + item;
      temp = this.selectComponent(name);
      this.arr.push(temp);
    } else {
      temp = this.arr[item];
    }
    console.log(item, temp)
    let tempData = temp.getData && temp.getData() || {};
    console.log(item, tempData);
    if (!tempData.check) {
      check = false;
      pageScrollTo.call(this, tempData.data && tempData.data.label || 0);
      break
    }
    let obj = setParams.call(this, tempData);
    if (question[item].vote_type_code != 'html') {
      this.results.push(obj);
    }
  }
  console.log('results', this.results);
  // console.log(JSON.stringify(this.results));
  if(!check)return
  params = {
    ...params,
    results: this.results
  }
  post_VoteResult.call(this,params);
}

function setParams(data={}){
  data = data && data.data || {};
  let type = data.type || '';
  // console.log(type,data);
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
    userToken: app.LM.userToken || "",
    brandCode: app.Conf.BRAND_CODE,
    voteActivityId: this.options.voteActivityId
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
  if (app.LM.isLogin) {
    this.setData({
      isLogin: true
    });
    // get_VoteActivityOptionList.call(this);
    return
  }
  this.setData({
    showPage:true
  })
  // get_VoteActivityOptionList.call(this)
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
    // get_VoteActivityOptionList.call(this) 
  });
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