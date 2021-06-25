const app = getApp();
Page.BasePage({
  data: { 
    list:[]
  },
  /**
   * 页面的初始数据
   */
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
      Object.defineProperties(this, {
          dialogTask: { get: () => this.findView("#dialog") }, 
      });
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
      app.SMH.showToast({
        "title":"已经到底啦！"
      })
    }
    
  },
  /**
   * 新增地址
  */
  addNewAddress:function(){
    app.StorageH.remove("editAddr");
    wx.navigateTo({
      url: '/pages/address/address_edit',
    })
  },
  getWxAddress(){
    let that = this;
    app.AS.checkAuthorize('scope.address', function(bool) {
      wx.chooseAddress({
        success(res){
          checkWxAddress.call(that,res).then(()=>{
            bindWxAddress.call(that, res).then( e=>{
              that.page = 0;
              getAddressList.call(that);
            })
          }).catch(e=>{
            if(e&&e.msg){
              that.dialogTask().then(cmpt=>{
                cmpt.setTitle("温馨提示");
                cmpt.setCentent(e.msg);
                cmpt.setTouchCancel(false);
                cmpt.setSingleBtn( 
                  {
                    name: "确定",
                    tap: function () {
                      cmpt.dismiss();
                    }
                  }
                );
                cmpt.show();
              }) 
            } 
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
    app.StorageH.set("editAddr", addr_data) 
    wx.navigateTo({
      url: '/pages/address/address_edit',
    })
  },

  setDafaultAddr:function(e){
    if(this._timer)return
    let that = this;
    let is_default = e.currentTarget.dataset.is_default;
    let addr_id = e.currentTarget.dataset.addr_id;
    let storage = app.StorageH.get('userChoiceData') ||{};
    if (is_default == 1 && (storage.selectAddr && storage.selectAddr.address_id == addr_id)){
      sucToast();
      this._timer = setTimeout(()=>{
        wx.navigateBack();
        clearTimeout(this._timer)
      },600);
      return ;
    }
    setAddressDefaultHandle.call(this, addr_id,e);
  },
  ChoiceAddr:function(e){
    this.choosed = true;
    var addr_id = e.currentTarget.dataset.addr_id;
    var addr_list = this.data.addr_list;
    let name = "userChoiceData";
    var userChoiceData = app.StorageH.get(name) || {};
    for (var i in addr_list) {
      if (addr_list[i].address_id == addr_id){
        userChoiceData.selectAddr = addr_list[i];
        app.StorageH.set("store_data", "");//清除自提?
        app.StorageH.set(name, userChoiceData);
        sucToast();
        this._timer = setTimeout(function(){
          clearTimeout(this._timer);
          wx.navigateBack();
        },600)
        return 
      }
    }
  }
})
//
function getAddressList(){
  console.log('getAddressList')
  this.page = this.page + 1;
  return app.UserApi.get_UserAddressList({
    params:{ 
      pageIndex: this.page,
      pageSize: app.Conf.PAGE_SIZE,    
    },
    other:{
      showLoading: true
    }
  }).then( e=>{
    if(e.code == "1"){
      let data = e.data || {};
      let list = data.list||[];
      let addr_list = this.page == 1 ? [] : this.data.addr_list;
      if(list.length == 0){
        this.hasMore = false;
          this.setData({
              isEmpty: true
          });
        return;
      }
      addr_list = addr_list.concat(list);
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
  }).catch(e=>{
    this.setData({
      isEmpty: true
    });
  })
}
//
function delAddressHandle(addressId){
  return app.UserApi.deleteUserAddress({
    data:{
      addressId: addressId,
    },
    other:{showLoading:true}
  }).then( e=>{
    if (e.code == "1") {
      let addr_list = this.data.addr_list;
      for (var i in addr_list) {
        if (addr_list[i].address_id == addressId) {
          addr_list.splice(i, 1);
          break;
        }
      }
      let userChoiceData = app.StorageH.get("userChoiceData") || {};
      let selectAddr = userChoiceData.selectAddr || {};
      if (addressId == selectAddr.address_id) {
        delete userChoiceData.selectAddr;
        app.StorageH.set("userChoiceData", userChoiceData);
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
  return app.UserApi.updateUserAddressDefault({
    data:{
      addressId: addressId,
    },
    other:{
      showLoading:true
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
      if(this.data.visit_type != 'check'){
        this.ChoiceAddr(obj)
      }
    }
    return Promise.reject()
  })
}

//对接微信和接口地址
function bindWxAddress(address){
  return app.UserApi.bindWxAddress({
    data:{
      "userName": address.userName,
      "telNumber": address.telNumber,
      "provinceName": address.provinceName,
      "cityName": address.cityName,
      "countyName": address.countyName,
      "detailInfo": address.detailInfo,
      "postalCode": address.postalCode, 
    },
    other:{
      showLoading:true
    }
  }).then(e=>{
    if(e.code == 1){
      if(e.data == 1){
        app.SMH.showToast({
          "title": "获取成功"
        })
        return Promise.resolve(e);
      }
    }
    app.SMH.showToast({
      "title": e && e.msg || "操作失败"
    })
    return Promise.reject(e);
  })
}

function checkWxAddress(address) {
    return new Promise((rs,rj)=>{
      if(address.userName && app.StringUtil.getCharLength(address.userName)>20){
        return rj({msg:"收货人名字的长度不应大于20个字符"});
      }
      return rs();
    })
}

function sucToast(){
  app.SMH.showToast({
    title:"设置成功"
  })
}