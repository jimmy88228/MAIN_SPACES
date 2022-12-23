import retainSessionH from "../../../../common/helper/retain-session-handler/index";
const App = getApp();
Page(App.BP({
  data: {
    brand_info: {},
    addr_list:[],
    visit_type:"",
    showImg: true,
    edit: "",
    del: "",
    isEmpty: false
  },
  page:0,
  hasMore: true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let edit = this.data.brand_info.icon_url + "micro_mall/address/address_edit.png";
      let del = this.data.brand_info.icon_url + "micro_mall/address/address_del.png";
      this.setData({
          edit: edit,
          del: del,
      });
      this.options = options || {};
      let visit_type = options.visit_type;
      this.setData({
        visit_type: visit_type || "",
        options: options
      })
      
  },
    onHide() {
        this.setData({
            isEmpty: false
        });
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.page = 0;
    getAddressList.call(this);
  },
  onReachBottom(){
    if(this.hasMore){
      getAddressList.call(this);
    }else{
      App.SMH.showToast({
        "title":"已经到底啦！"
      })
    }
    
  },
  /**
   * 新增地址
  */
  addNewAddress:function(){
    App.StorageH.remove("editAddr");
    if(this.options.userToken){
      wx.navigateTo({
        url: '/pages/main/address/address-edit/index?userToken=' + this.options.userToken,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/main/address/address-edit/index',
    })
  },
  getWxAddress(){
    let that = this;
    App.AS.checkAuthorize('scope.address', function(bool) {
      retainSessionH.saveRetainSession({
        shortPath: that.route,
        shortHome: true
      })
      wx.chooseAddress({
        success(res){
          console.log("chooseAddress", res)
          checkWxAddress.call(that,res).then(()=>{
            bindWxAddress.call(that, res).then( e=>{
              that.page = 0;
              getAddressList.call(that);
            })
          }).catch(e=>{
          })
        }
      })
    }); 
  },
  /**
   * 删除地址
   */
  delAddress:function(e){
    let that = this;
    let addr_id = e.currentTarget.dataset.addr_id;
    wx.showModal({
      title: '',
      content: '确定删除该地址',
      success(res){
        if (res.confirm){
          delAddressHandle.call(that, addr_id)
        }
      }
    })
    
  },
  /**
   * 编辑地址
   */
  editAddress: function (e) {
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let addr_data = this.data.addr_list[index];
    App.StorageH.set("editAddr", addr_data)
    if (this.options.userToken) {
      wx.navigateTo({
        url: '/pages/main/address/address-edit/index?userToken=' + this.options.userToken,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/main/address/address-edit/index',
    })
  },

  setDafaultAddr:function(e){
    let that = this;
    let is_default = e.currentTarget.dataset.is_default;
    let addr_id = e.currentTarget.dataset.addr_id;
    let storage = App.StorageH.get('userChoiceData') ||{};
    console.log("e", e)
    if (is_default == 1 && (storage.selectAddr && storage.selectAddr.address_id == addr_id)){
      return this.ChoiceAddr(e)
    }
    setAddressDefaultHandle.call(this, addr_id,e);
  },
  ChoiceAddr:function(e){
    this.choosed = true;
    var addr_id = e.currentTarget.dataset.addr_id;
    var addr_list = this.data.addr_list;
    let name = this.options.type == "modify_address" ? "Modify_Address" : "userChoiceData";
    var userChoiceData = App.StorageH.get(name) || {};
    for (var i in addr_list) {
      if (addr_list[i].address_id == addr_id){
        userChoiceData.selectAddr = addr_list[i];
        App.StorageH.set(name, userChoiceData);
        App.StorageH.set("store_data", "");
        wx.showLoading();
        let _timer = setTimeout(function(){
          clearTimeout(_timer);
          wx.navigateBack();
        },500)
        return 
      }
    }
  }
}))
//
function getAddressList(){
  this.page = this.page + 1;
  return App.Http.UserApi.getAddressList({
    params:{
      userToken: this.options.userToken || App.LM.userKey,
      pageIndex: this.page,
      pageSize: App.Conf.PAGE_SIZE,   
      brandCode: App.Conf.BRAND_CODE
    },
    other:{
      isShowLoad: true
    }
  }).then( e=>{
    if(e.code == "1"){
      let data = e.data;
      let addr_list = this.page == 1 ? [] : this.data.addr_list;
      if(data.length == 0){
        this.hasMore = false;
          this.setData({
              isEmpty: true
          });
        return;
      }
      addr_list = addr_list.concat(data);
      this.setData({
        addr_list: addr_list
      });
    }
    return Promise.reject();
  }).finally( e=>{
    if (this.data.showImg){
      this.setData({
        showImg: false
      })
    }
  })
}
//
function delAddressHandle(addressId){
  return App.Http.UserApi.deleteAddress({
    data:{
      addressId: addressId,
      userToken: this.options.userToken || App.LM.userKey,
      brandCode:App.Conf.BRAND_CODE
    },
    other:{isShowLoad:true}
  }).then( e=>{
    if (e.code == "1") {
      let addr_list = this.data.addr_list;
      for (var i in addr_list) {
        if (addr_list[i].address_id == addressId) {
          addr_list.splice(i, 1);
          break;
        }
      }
      let userChoiceData = App.StorageH.get("userChoiceData") || {};
      let selectAddr = userChoiceData.selectAddr || {};
      if (addressId == selectAddr.address_id) {
        delete userChoiceData.selectAddr;
        App.StorageH.set("userChoiceData", userChoiceData);
      }
      this.setData({
        addr_list: addr_list
      });
        if (this.data.addr_list.length == 0) {
            this.setData({
                isEmpty: true
            });
        }
    }
    return Promise.reject()
  })
}
function setAddressDefaultHandle(addressId,obj){
  return App.Http.UserApi.setAddressDefault({
    data:{
      addressId: addressId,
      userToken: this.options.userToken || App.LM.userKey,
      brandCode: App.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if (e.code == "1") {
      let addr_list = this.data.addr_list;
      for (var j in addr_list) {
        if (addr_list[j].address_id == addressId) {
          addr_list[j].is_default = '1';
        } else {
          addr_list[j].is_default = '0';
        }
      }
      this.setData({
        addr_list: addr_list
      })
      // if(this.data.visit_type != 'check' && !this.choosed){
      if(this.data.visit_type != 'check'){
        this.ChoiceAddr(obj)
      }else{
        App.SMH.showToast({
          title:"设置成功"
        })
      }
    }
    return Promise.reject()
  })
}

//对接微信和接口地址
function bindWxAddress(address){
  return App.Http.UserApi.bindWxAddress({
    data:{
      "userName": address.userName,
      "telNumber": address.telNumber,
      "provinceName": address.provinceName,
      "cityName": address.cityName,
      "countyName": address.countyName,
      "detailInfo": address.detailInfo,
      "postalCode": address.postalCode,
      "userToken": this.options.userToken || App.LM.userKey,
      "brandCode": App.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == 1){
      if(e.data == 1){
        return Promise.resolve(e);
      }
    }
    App.SMH.showToast({
      "title": e && e.msg || "操作失败"
    })
    return Promise.reject(e);
  })
}

function checkWxAddress(address) {
    return new Promise((rs,rj)=>{
      if(address.userName && address.userName.length>20){
        return rj({msg:"收货人名字的长度不应大于20个字符"});
      }
      return rs();
    })
}