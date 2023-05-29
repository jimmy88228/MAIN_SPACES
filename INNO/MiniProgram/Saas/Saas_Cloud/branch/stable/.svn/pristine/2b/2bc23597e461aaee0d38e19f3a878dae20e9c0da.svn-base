// pages/micro_mall/invoice/title_manager/title_manager.js
const app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr:[{},{}],
    list:[],
  },
  page:1,
  hasMore:true,
  isLoading:false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options;
    wx.setNavigationBarTitle({
      title: !options.from? "抬头管理" : "抬头选择",
    })
    let l_color = app.getColor(this.data.brand_info.style.bg_color, 0, 0, 0, 0.3) || '';
    this.setData({
      l_color
    })
  }, 
  onReady: function () {

  },
 
  onShow: function () {
    loadData.call(this,true);
  }, 
  onHide: function () {

  }, 
  onUnload: function () {

  },  
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||""; 
    if(type=="new"){
      wx.navigateTo({
        url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=title`,     
      })
    }else if(type=="edit"){
      let id = dataset.id||0;
      wx.navigateTo({
        url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=title&id=${id}`,
      })
    }else if(type=="select" && this.options.from == 'issue'){
      console.log('开具发票 选择 back');
      let data = dataset.data||{};
      wx.setStorageSync('Invoice_Choose', {
        exist:true,
        data
      })
      wx.navigateBack({
        delta:1
      })
    }else if(type == "delete"){
      let id = dataset.id||0;
      showDialog.call(this,type,id)
    }
  },
  handle_scroll(e){
    console.log('handle_scroll',this.hasMore,e);
    if(this.hasMore){
      loadData.call(this);
    }else{
      app.SMH.showToast({
        title:"没有更多了"
      })
    }
  }
}))

function loadData(reset=false){
  if(reset){
    init.call(this);
  }
  app.ElectricApi.getElectricKpInfoList({
    params:{
      pageIndex:this.page,
      pageSize:app.Conf.PAGE_SIZE,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },other:{
      isShowLoad:true
    }
  }).then(res=>{
    console.log(res);
    if(res.code=='1'){
      let data = res.data||{};
      let list = data.list||[];
      let totalCount = data.totalCount||0;
      let empty = false;
      if(this.page == 1 && list.length==0){
        empty = true;
      }
      this.hasMore = this.page * app.Conf.PAGE_SIZE < totalCount;
      this.page+=1;
      this.setData({
        list:[...this.data.list,...list],
        empty
      })
    }
  })
}

function init(){
  this.page=1;
  this.hasMore=true;
  this.isLoading=false;
  this.data.list = [];
}

function showDialog(type="",id){
  if(type == "delete"){
    this.dialog = this.dialog || this.selectComponent("#dialog");
    this.dialog.setTitle("提示");
    this.dialog.setTouchCancel(true);
    this.dialog.setCentent("确定要删除该抬头吗");
    let that = this;
    this.dialog.setTwoBtn({
      name: "取消",
      tap: function () {
        console.log('取消');
        that.dialog.dismiss();
      }
    },{
      name: "确认",
      tap: function () {
        console.log('确认');
        deleteTitle.call(that,id).then(res=>{
          that.dialog.dismiss();
          loadData.call(that,true);
        });
      }
    });
    this.dialog.show();
  }
}

function deleteTitle(id){
  return app.ElectricApi.deleteElectricKpInfo({
    data:{
      infoId:id,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code==1){
      app.SMH.showToast({
        title:"删除成功"
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title:e&&e.msg||"删除失败"
    })
    return Promise.resolve(e);
  })
}
