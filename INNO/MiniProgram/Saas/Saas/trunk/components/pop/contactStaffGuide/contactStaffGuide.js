// components/pop/adsPop.js
import SG from "../../../common/helper/handle/shopGuideHandle.js";
const app = getApp();
Component(app.BTAB({
  properties: {

  },
  data: {

  },
  methods: {
    initData(data = {}) {
      let userInfo = app.LM.userInfo || {};
      let {
        bindStaffId,
        fromStoreId
      } = userInfo;
      bindStaffId = data.staffId || bindStaffId;
      fromStoreId = data.storeId || fromStoreId;
      SG.getCustomerService(fromStoreId, bindStaffId, 0, true)
        .then((data = {}) => {
          // 弹窗 如果已有绑定的导购，则弹窗只需显示这一个导购；否则按正常显示列表
          if (bindStaffId && data.staffInfo && data.staffInfo.customerService) { // 有绑定导购
            this.activeCustomerService({
              onlyShowSpecificStaff: true,
              staffInfo: data.staffInfo
            })
            return Promise.resolve(data);
          } else { // 无绑定导购
            this.activeCustomerService({
              ...data
            });
            return Promise.resolve(data);
          }
        })
        .catch(err => {
          console.log("contactStaffGuide error", err);
          app.SMH.showToast({
            title: err || "联系店员启动失败"
          })
        })
    },

    activeCustomerService(data) {
      this.contactStaff = this.contactStaff || this.selectComponent("#contactStaff");
      return this.contactStaff ? this.contactStaff.initData(data) : Promise.reject();
    },

    contactCallBack(e) {
      let detail = e.detail || {};
      this.contactGuide = this.contactGuide || this.selectComponent("#contactGuide");
      this.contactGuide && this.contactGuide.initData(detail);
    },
  }
}))