const App = getApp();
Component(App.BC({
  data: {
    show: false, // 是否展示
    title: "", //标题
    formType: "", // delivery: 物流信息输入
    deliveryCompanyList: [], // 快递公司列表
    selectedDeliveryIndex: 0, // 选中的快递公司index
    formData: {
      shippingId: 0, // 物流公司Id
      shippingName: "", // 物流公司名字
      invoiceNo: "", // 快递单号
    },
  },
  methods: {
    showModal({title, formType = ""}) {
      this.setData({
        show: true,
        title,
        formType,
      }, loadData.bind(this))
    },
    hideModal(){
      this.setData({show: false})
    },
    handleUserInput(e) {
      let key = this.getDataset(e, "key");
      let value = e.detail.value || "";
      this.setData({
        [`formData.${key}`]: value
      })
    },
    handleDeliveryPickerChange(e) {
      let index = e.detail.value;
      let shippingInfo = this.data.deliveryCompanyList[index] || {};
      this.setData({
        [`formData.shippingId`]: shippingInfo.shippingId,
        [`formData.shippingName`]: shippingInfo.shippingName,
        selectedDeliveryIndex: index
      })
    },
    validate(formType) {
      let validateError = "";
      if (formType === "delivery") {
        let {shippingId, invoiceNo} = this.data.formData;
        if (!shippingId) validateError = "请选择物流公司";
        else if (!invoiceNo) validateError = "请输入物流单号";
      }
      return validateError
    },
    handleCancelBtnTap() {
      this.setData({show: false}, () => {
        this.triggerEvent("cancel")
      })
    },
    handleConfirmBtnTap() {
      // let formType = this.data.formType;
      // if (this.data.formType === "delivery") {
      //   let validateError = this.validate(formType);
      //   if (validateError) {
      //     App.SMH.showToast({title: validateError});
      //     return;
      //   }
      // }
      setTimeout(() => {
        this._checkAllValid().then(()=>{
          let formData = this.data.formData;
          this.triggerEvent("confirm", formData)
        })
      }, 150);
    }
  }
}))

function loadData() {
  let formType = this.data.formType;
  if (formType === "delivery") {
    getShippingList.call(this);
  }
}

function getShippingList() {
  return App.Http.QT_UserApi.getShippingList({
    params: {
      brandCode: App.Conf.BRAND_CODE
    }
  })
    .then(res => {
      if (res.code == 1) {
        this.setData({
          deliveryCompanyList: res.data || []
        })
        return res.data
      }
      return Promise.reject(res.msg || "获取物流信息失败")
    })
}