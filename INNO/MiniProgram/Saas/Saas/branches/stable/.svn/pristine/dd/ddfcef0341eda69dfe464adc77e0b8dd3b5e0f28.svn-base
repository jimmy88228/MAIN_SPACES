import WindowBehaviors from "../../../../../../components/ui/cps/window/window-behaviors.js";
const app = getApp();

const OPTION_RANGE = [
  {
    name: "手机号",
    type: 1,
    index: 0
  },
  {
    name: "卡号",
    type: 0,
    index: 1
  },
  {
    name: "昵称",
    type: 2,
    index: 2
  },
  {
    name: "备注名",
    type: 3,
    index: 3
  }
]

Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {

    },
    data: {
      boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
      mobilePhone:'',
      showInputPicker: false,
      optionPicker: {
        range: [],
        rangeKey: "name",
        value: 0
      },
      inputPicker: {
        range: [],
        value: [0]
      },
      search: {
        searchStr: "", // 用户输入
        isFans: 1, // 是否粉丝 0才是粉丝 1不是
        type: 1, // 0:卡号 1:手机号 2:昵称 3:备注名
      }
    },
    ready() {
      let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
      let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
      let optionRange = JSON.parse(JSON.stringify(OPTION_RANGE)).slice(0, 2);
      this.setData({
        return_img,
        return_active,
        "optionPicker.range": optionRange,
      })
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      handleInputPickerStart() {
        this.inputPickerScroll = true;
      },
      handleInputPickerEnd() {
        this.inputPickerScroll = false;
      },
      handleOptionPickerChange(e) {
        console.log("e", e)
        let value = e.detail.value;
        let optionRange = this.data.optionPicker.range;
        this.setData({
          'optionPicker.value': value,
          'search.type': optionRange[value].type
        })
      },
      handleInputPickerChange(e = {}) {
        console.log("e", e)
        let index = e.detail && e.detail.value;
        this.setData({"inputPicker.value": [index]})
      },
      handleInputPickerConfirm() {
        console.log("selected")
        if (this.inputPickerScroll) { // 还在滚动
          setTimeout(() => {this.inputPickerScroll = false}, 500);
          return 
        }
        let inputPicker = this.data.inputPicker;
        let selected = inputPicker.range[inputPicker.value[0]];
        this.setData({selected}, this.inputPickerToggleF);
      },
      handleSearchTap() {
        console.log("sda")
        getSearchUserInfo.call(this)
          .then(data => {
            if (data.length) {
              let inputPicker = {
                range: data,
                value: [0]
              };
              this.setData({inputPicker}, this.inputPickerToggleF)
            } else {
              throw("没有找到会员")
            }
          })
          .catch(err => {
            console.log("handleSearchTap err", err);
            app.SMH.showToast({title: err})
          })
      },
      inputPickerToggleF() {
        inputPickerToggle.call(this);
      },
      handleUserInput(e){
        let value = e.detail.value || "";
        this.setData({
          'search.searchStr': value
        })
      },
      isFansChange() {
        this.setData({"search.isFans": this.data.search.isFans ? 0 : 1}, this.reset)
      },
      validate() {
        let validateError = "";
        let selected = this.data.selected || {};
        if (!selected.userToken) validateError = "请选择会员后确认";
        else if (selected.userToken === app.LM.userToken) validateError = "不能为自己下单";
        return validateError
      },
      confirm(){
        let validateError = this.validate();
        if (validateError) {
          app.SMH.showToast({title: validateError});
          return
        }
        this.triggerEvent("searchresult", this.data.selected);
        wx.nextTick(() => {this.dismiss()});
      },
      reset() {
        let {optionPicker, search} = this.data;
        this.setData({
          optionPicker: {
            ...optionPicker,
            range: !search.isFans ? JSON.parse(JSON.stringify(OPTION_RANGE)) : JSON.parse(JSON.stringify(OPTION_RANGE)).slice(0, 2),
            value: 0,
          },
          "search.searchStr": "",
          "search.type": 1,
        })
      }
    }
  })
)
function inputPickerToggle() {
  let showInputPicker = this.data.showInputPicker;
  showInputPicker && this.setData({
    inputPicker: {
      range: [],
      value: [0]
    }
  });
  this.setData({showInputPicker: !showInputPicker})
}
function getSearchUserInfo() {
  return app.UserApi.getSearchUserInfo({
    params: {
      ...this.data.search,
      brandCode:app.Conf.BRAND_CODE,
      userToken:app.LM.userToken
    },
    other:{
      isShowLoad:true
    }
  })
    .then(res => {
      if (res.code && res.data) return res.data;
      throw(res.msg || "获取会员失败")
    })
}
// function searchUserInfo(mobilePhone){
//   return app.UserApi.searchUserInfo({
//     params:{
//       mobilePhone: mobilePhone,
//       brandCode:app.Conf.BRAND_CODE
//     },
//     other:{
//       isShowLoad:true
//     }
//   }).then(res=>{
//     if (res.code == 1){
//       let data = res.data || {};
//       let warn = "";
//       if (data.userToken == app.LM.userToken){ 
//         warn = "不能为自己下单";
//       } else if (!data.userToken){
//         warn = "找不到该会员";
//       }
//       if (warn){
//         app.SMH.showToast({
//           title: warn
//         })
//         return;
//       }
//       data.mobilePhone = mobilePhone;
//       this.triggerEvent("searchresult", data);
//       this.dismiss();
//     }
//   })
// }
