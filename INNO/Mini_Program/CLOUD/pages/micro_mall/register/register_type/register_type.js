const app = getApp();
Page(app.BP({
  
  data: { 
    current:0,
  },
  onLoad(options){
    this.options = options || {}
    listen.call(this);
    getUserDockList.call(this);
    getUserAgreement.call(this);
  },
  onShow: function() {
  },
  onHide(){ },
  onUnload(){
    unListen.call(this);
  },
  onReady: function () {},
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    if(type=='select'){
      let current = dataset.index||0;
      this.setData({
        current
      })
    }
  },
  getNext(e){
    let current = this.data.current||0;
    let dockList = this.data.dockList||[];
    let id = dockList[current] && dockList[current].id;
    console.log(current,',',id,e);
    if(id > 0){
      wx.navigateTo({
        url: `/pages/micro_mall/register/user_info/user_info?dockId=${id}`,
      })
    }else if(id == 0){
      wx.switchTab({
        url: '/pages/micro_mall/user/user',
      })
    }
  }
}))


function getUserAgreement() {
  return app.UserApi.getUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: "DOCK" //  
    }, other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data||{};
      this.setData({
        agreementList:data.child_article||[]
      })
    }
  })
}

function getUserDockList() {
  return app.UserDockApi.getUserDockList({
    params: {
    }, other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data||[];
      this.setData({
        dockList:data,
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    let msg = e&&e.msg ||"数据异常"; 
    this.setData({
      showTips:true,
      msg
    })
  })
} 
 
function listen(){
  if (app.LM.isLogin) {
    if(!this.data.isLogin){
      this.setData({
        isLogin: true
      });
    }
    return
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    }); 
  });
}

function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}