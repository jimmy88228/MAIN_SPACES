import AddressH from "../module/addressHandle";
import addressParser from "../../../common/support/libs/address-parse/index";
const MAX_LENGTH = 100;
const app = getApp();
Component(app.BTAB({
  data: {
    maxLength: MAX_LENGTH,
    deliveryText: ""
  },
  methods: {
    handleDeliveryInput(e) {
      let value = e.detail.value;
      this.setData({deliveryText: value})
    },
    confirm() {
      initAddressParser()
        .then(() => {
          let deliveryText = this.data.deliveryText || "";
          let result = addressParser.parse(deliveryText) || [];
          this.triggerEvent("parse", result[0] || {})
        })
    },
    clear() {
      this.setData({deliveryText: ""});
    }
  }
}))

function initAddressParser() {
  if (!addressParser.inited) {
    return AddressH.getRegionListSync()
      .then(regionList => {
        addressParser.initialAreaData(regionList)
      })
  }
  return Promise.resolve()
}