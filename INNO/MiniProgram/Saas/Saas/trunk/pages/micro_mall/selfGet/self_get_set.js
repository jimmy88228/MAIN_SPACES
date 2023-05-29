// pages/micro_mall/selfGet/self_get_set.js
const app = getApp();
Page(app.BP({
  data: {
    brand_info: {},
    contact: "",
    mob_phone: "",
    select_store: {
      id: 0,
      key_word: ""
    },
    toggle: false,
    scrollShow: false,
    list: [], 
    defaultInfo:{},
  },
  pageIndex: 1,
  loading: false,
  hasMore: true,
  onLoad(options) {
    this.options = options || {};
    let defaultInfo = {
      staff_id : options.staff_id && parseInt(options.staff_id) || 0,
      staff_name : options.staff_id && options.staff_name || "默认归属店员"
    }
    console.log('defaultInfo',defaultInfo)
    let loc_f = options && options.loc_f;
    let select_store = this.data.select_store || {};
    select_store.id = parseInt(options.select_store_id) || 0;
    select_store.name = options.store_name || "";
    this.setData({
      loc_f: loc_f || 0,
      select_store: select_store,
      options: options,
      defaultInfo
    });
    checkChangeStaff.call(this)
  },
  onShow: function () {
    this.loadInitData();
  },
  onReady() {
    let that = this;
    let showModalMsg = this.options && this.options.showModalMsg || false;
    let loc_f = this.options && this.options.loc_f || false;
    if (showModalMsg == 1 || loc_f == 1) {
      that.loc_checked = true;
      that.pageDialog = that.pageDialog || that.selectComponent("#pageDialog");
      that.pageDialog.setTitle("无法精准定位");
      that.pageDialog.setTouchCancel(false);
      that.pageDialog.setCentent("建议下次允许小程序定位功能，确保手机开启定位后重新尝试");
      that.pageDialog.setSingleBtn({
        name: "确认",
        tap: function () {
          that.pageDialog.dismiss();
        }
      });
      that.pageDialog.show();
    }
  },
  onHide() {
    this.isbindWxAddrBack = false;
  },
  onUnload() {
    this.isbindWxAddrBack = false;
  },
  loadInitData() {
    //再次更改门店信息，获取上次信息
    let store_data = app.StorageH.get("store_data") || {};
    if (store_data.select_store && !this.isbindWxAddrBack) {
      this.setData({
        contact: store_data.contact,
        mob_phone: store_data.mob_phone,
        select_store: store_data.select_store || {}
      })
    }
    //选择门店列表返回
    let select_store = app.StorageH.get("select_store");
    if (select_store) {
      this.setData({
        select_store: select_store || {}
      })
    }
  },
  onInputSync(e) {
    this.setData({
      [e.target.dataset.key]: e.detail.value
    });
  },
  submitStore() {
    let contact = this.data.contact;
    let mob_phone = this.data.mob_phone;
    let select_store = this.data.select_store;
    let mobileReg = /(^\d{2,4}-\d{7,8}$)|(^\d{11}$)/;
    let warn = "";
    if (!contact) {
      warn = "收货人不能为空!";
    } else if (!mob_phone) {
      warn = "手机号码不能为空!";
    } else if (!(mobileReg.test(mob_phone))) {
      warn = "请输入正确的手机号码！";
    } else if (!select_store.id || select_store.id == 0) {
      warn = "请选择取货门店!";
    }
    if (warn) {
      app.SMH.showToast({
        "title": warn
      })
      return;
    }
    //清除缓存
    app.StorageH.set("select_store", "");

    let store_data = app.StorageH.get("store_data") || {};
    let defaultInfo = this.data.defaultInfo||{};
    store_data.staff_id = defaultInfo.staff_id || this.options.staff_id || 0;
    store_data.staff_name = defaultInfo.staff_name || this.options.staff_name || "";
    store_data.contact = contact;
    store_data.mob_phone = mob_phone;
    store_data.select_store = select_store;
    app.StorageH.set("store_data", store_data);
    app.SMH.showToast({
      "title": "选择成功"
    });
    let _timer = setTimeout(function () {
      clearTimeout(_timer);
      wx.navigateBack();
    }, 500)

  },
  getWeixinAddress() {
    var that = this;
    wx.chooseAddress({
      success(res) {
        bindWxAddress.call(that, res).then(e => {
          that.isbindWxAddrBack = true;
          let store_data = app.StorageH.get("store_data") || {};
          store_data.contact = res.userName;
          store_data.mob_phone = res.telNumber;
          app.StorageH.set("store_data", store_data);
          that.setData({
            contact: res.userName,
            mob_phone: res.telNumber
          })
        });
      }
    })
  },
  goSelectStore(e) {
    let dataset = e.currentTarget.dataset;
    let url = dataset.url;
    let store_data = app.StorageH.get("store_data") || {};
    let ops = this.options || {};
    store_data.contact = this.data.contact || store_data.contact;
    store_data.mob_phone = this.data.mob_phone || store_data.mob_phone;
    app.StorageH.set("store_data", store_data);
    if (url) {
      if (ops.userToken) {
        wx.navigateTo({
          url: url + "&userToken=" + ops.userToken + '&recIds=' + (ops.recIds || '') + '&type=' + (ops.type || "") + '&pId=' + (ops.pId || 0),
        })
        return;
      }
      wx.navigateTo({
        url: url + "&recIds=" + (ops.recIds || '') + '&type=' + (ops.type || "") + '&pId=' + (ops.pId || 0),
      })
    }
  },
  onTap(e) {
    let dataset = this.getDataset(e);
    let type = dataset.type || "";
    if (type == 'toggle') {
      if(this.data.list.length==0)return
      if (!this.data.toggle && this.data.scrollShow) {
        return
      }
      if (!this.data.toggle) {
        this.setData({
          scrollShow: true
        })
        wx.nextTick(() => {
          this.setData({
            toggle: true,
          })
        })
      } else {
        this.setData({
          toggle: false,
        })
        setTimeout(() => {
          this.setData({
            scrollShow: false
          })
        }, 300);
      }
    } else if (type == 'clerk_sel') {
      console.log(dataset)
      // let staff_id = dataset.staff_id||0;
      // let staff_name = dataset.staff_name||"";
      let info = dataset.info || {};
      let list = this.data.list||{};
      let defaultInfo = this.data.defaultInfo||{};
      if(defaultInfo.staff_id){
        list.splice(0,0,{...defaultInfo}); 
      }
      defaultInfo = {
        ...defaultInfo,
        ...info
      }
      // console.log('newlist',list);
      this.setData({
        defaultInfo,
        toggle: false,
      })
      wx.nextTick(()=>{
        this._filter(info.staff_id,list); //过滤
        this.setData({
          list
        })
      })
      setTimeout(() => {
        this.setData({
          scrollShow: false
        })
      }, 300);
    }
  },
  scrollToLower(e) {
    if (this.hasMore) {
      this.loadData();
    }
  },
  loadData() {
    if (this.loading) {
      return Promise.reject();
    }
    this.loading = true
    return getStoreStaffList.call(this).then(res => {
      if (res.code == 1) {
        let data = res.data || {};
        let list = data.list || [];
        this.hasMore = this.pageIndex * app.Conf.PAGE_SIZE < data.totalCount;
        this.pageIndex += 1;
        let defaultInfo = this.data.defaultInfo||{};
        this._filter(defaultInfo.staff_id,list) //过滤
        this.setData({
          list: [...this.data.list, ...list]
        })
        return res;
      }
      return Promise.reject(res)
    }).finally(() => {
      this.loading = false;
    })
  },
  _filter(staff_id,list) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (staff_id == list[i].staff_id) {
        // console.log('删除', i, list[i]);
        list.splice(i, 1);
      }
    }
  }
}))
//对接微信和接口地址
function bindWxAddress(address) {
  return app.UserApi.bindWxAddress({
    data: {
      "userName": address.userName,
      "telNumber": address.telNumber,
      "provinceName": address.provinceName,
      "cityName": address.cityName,
      "countyName": address.countyName,
      "detailInfo": address.detailInfo,
      "postalCode": address.postalCode,
      "userToken": this.options.userToken || app.LM.userToken,
      "brandCode": app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      if (e.data == 1) {
        return Promise.resolve(e);
      }
      app.SMH.showToast({
        "title": e.msg || "操作失败"
      })
    }
    return Promise.reject(e);
  })
}

function checkChangeStaff() {
  return app.sysTemConfig("instore_order_change_staff").then(data => {
    if (data.Value != this.data.isShowRemark) {
      this.setData({
        is_can_change_staff: data.Value
      })
      if (data.Value) {
        this.loadData()
      }
    }
  })
}

function getStoreStaffList() {
  return app.UserApi.getStoreStaffList({
    params: {
      storeId: this.options.select_store_id || 0,
      searchText: "",
      pageIndex: this.pageIndex,
      pageSize: app.Conf.PAGE_SIZE,
      brandCode: app.Conf.BRAND_CODE
    },
  })
}