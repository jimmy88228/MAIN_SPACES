// pages/micro_mall/search/search_goods.js
var app = getApp();
Page(app.BP({
  data: {
    search_input:"",
    search_list:[],
      brand_info: {},
      showImg: true,
        url:""
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      let str = this.data.brand_info.icon_url + "micro_mall/search_icon.png";
      this.setData({
          url: str,
          showImg: false
      });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var search_list = app.StorageH.get('search_list') || [];
    this.setData({
      search_list: search_list
    })
  },
  /**
   *同步输入 
  */
  searchInput:function(e){
    
    let val=e.detail.value;
    this.setData({
      search_input: val
    })
  },
    loadAction() {
        console.log("图片加载")
    },
    errAction() {
        console.log("图片加载错误")
        console.log(this.data.url)
        this.setData({
            url: this.data.url + ' ',
        });
    },
  /**
   * 搜索商品
  */
  searchGoods:function(){
    let search_input = this.data.search_input;
    let search_list = app.StorageH.get('search_list') || [];
    if (!search_list){
      search_list=[];
    }
    let can_add=true;
    for (let i in search_list){
      if (search_list[i] == search_input){
        can_add=false;
        break;
      }
    }
    if (can_add && search_input !=""){
      search_list.push(search_input);
    }
    app.StorageH.set("search_list", search_list);
    wx.redirectTo({
      url: '../category/category?search_input=' + encodeURIComponent(search_input),
    })
  },
  /**
   *热搜
  */
  HotSearch:function(e){
    let search_input=e.currentTarget.dataset.search_input;
    wx.redirectTo({
      url: '../category/category?search_input=' + encodeURIComponent(search_input),
    })
  },
  /**
   * 清空热搜历史
  */
  clearSearchList:function(){
    let search_list = this.data.search_list;
    search_list=[];
    app.StorageH.set('search_list', search_list);
    this.setData({
      search_list: search_list
    })
  }
}))