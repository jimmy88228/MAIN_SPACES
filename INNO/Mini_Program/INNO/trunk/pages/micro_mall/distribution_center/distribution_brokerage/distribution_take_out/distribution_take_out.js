// let reg_float = /^(([1-9]+)|([0]\.{1})|([0]{1}$))\.{0,1}(\d{0,2})$/;
const app = getApp();
let reg_float = /^(\d+)\.{0,1}(\d{0,2})$/;
let reg_int = /^(\d+)$/;
let reg_result = /^((\d+)\.{0,1}(\d+))$|^((\d+))$/;
const MAX = 10;
const MIN = 0;

Page(app.BP({
    data: {
        value: '',
        min: '',
        max: '',
        remark:'',
        can_cashout:0
    },
    onLoad: function(options) {
        initData.call(this);
        getMyStaffDstbInfo.call(this);
        this.options = options;
        let balance = parseFloat(this.options.balance);
        this.setData({
          balance: balance
        })
    },
    handleInput(e) {
        let value = e.detail.value;
        let reg;
        // reg = this.mustbe_integer == 1 ? reg_int : reg_float;
        reg = reg_float;
        if (reg.test(value)) {
            this.data.value = value;
            if (this.data.value != '00') {
                this.setData({
                    value: value
                });
            } else {
                this.setData({
                    value: value && this.tempValue || ''
                })
            }
        } else {
            this.setData({
                value: value && this.tempValue || ''
            })
        }
        this.tempValue = this.data.value;
    },
    confirm(e) {
        let inputValue = this.data.value || 0;
        let balance = this.data.balance || 0;
        let warn = "";
        if(reg_result.test(inputValue)){
          if (inputValue < this.min){
            warn = `提取金额不能小于${this.min}`
          } else if (inputValue > this.max){
            warn = `提取金额不能大于${this.max}`
          } else if (inputValue > balance){
            warn = `提取金额不能大于当前可用金额`
          } else if (!inputValue || inputValue=='0'){
            warn = `提现金额必须大于0元`;
          } else if (this.mustbe_integer && !reg_int.test(inputValue)){
            warn = `提现金额必须为整数`;
          }
        } else if (inputValue > 1 && inputValue.indexOf('0') == 0){
          warn = "请输入正确格式的金额"
        }
        if(warn){
          app.SMH.showToast({
            title: warn,
          })
          return;
        }
        loadData.call(this)
        // return;
        // if (!reg_result.test(inputValue) || inputValue == 0 || (inputValue > this.max || inputValue < this.min) || (inputValue > this.data.balance)) {
        //     if (inputValue && reg_result.test(inputValue) && ((inputValue > this.max || inputValue < this.min) || (inputValue > this.data.balance))) {
        //         app.SMH.showToast({
        //             title: `提取金额需大于${this.min} , 小于${this.max}, 且不能大于当前收益!`
        //         })
        //     } else {
        //         app.SMH.showToast({
        //             title: '请输入正确格式的金额',
        //         })
        //     }
        // } else if (inputValue > 1 && inputValue.indexOf('0')==0) {
        //     // console.log('0开头的大于1')
        //     app.SMH.showToast({
        //         title: '请输入正确格式的金额',
        //     })
        // } else {
        //     loadData.call(this)
        // }
    },
    input_tap(e){
      // if (this.data.can_cashout == 0 && this.showPage){
      //   app.SMH.showToast({
      //     title:"您现在的状态不允许提现"
      //   })
      // }
    }
}))

function initData() {
    app.DistrApi.staffInfo({
        params: {
            "brandCode": app.Conf.BRAND_CODE
        },
        other: {}
    }).then(res => {
        let remark = "";
        if (res.code == 1) {
            const data = res.data || {};
            this.mustbe_integer = data.cashout_mustbe_integer || 0;
            remark = data.limit_cashout_remark||"";
            if(parseFloat(data.max_cashout) > 0 || parseFloat(data.max_cashout) == 0){
              this.max = data.max_cashout
            }else{
              this.max = MAX;
            }
            if(parseFloat(data.min_cashout) > 0 || parseFloat(data.min_cashout) == 0){
              this.min = data.min_cashout;
            }else{
              this.min = MIN;
            }
        } else {
            this.max = MAX;
            this.min = MIN;
        }
        this.setData({
            max: this.max,
            min: this.min,
            remark:remark || ""
        })
        return res
    })

}

function loadData() {
    if(this.holdIng) return;
    this.holdIng = true;
    app.DistrApi.cashOut({
        data: {
            "userToken": app.LM.userToken || "",
            "brandCode": app.Conf.BRAND_CODE,
            "apply_amount": this.data.value,
            "remark": ''
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            this.setData({
                value: ''
            })
            app.SMH.showToast({
                title: '申请成功'
            })
            let _timer = setTimeout((() => {
                clearTimeout(_timer);
                wx.navigateBack({
                    delta: 1
                })
            }), 2000)
            return res
        }
        return Promise.reject(res)
    }).catch(e=>{
      app.SMH.showToast({
        title:e && e.msg || '申请异常',
        duration:3000
    })
    })
    .finally(()=>{
      this.holdIng = false;
    })
}

function getMyStaffDstbInfo(){
  let params = {
    staffCode: app.LM.staffInfo.staffCode,
    brandCode: app.Conf.BRAND_CODE,
  }
  let extra = {
    diy: true
  }
  app.RunApi.go('DistributionApi', 'getMyStaffDstbInfo', params, extra).then(res => {
    let data = res.data || {};
    console.log('data', data, data.can_apply_cashout_duty)
    this.showPage = true;
    this.setData({
      can_cashout: data.can_apply_cashout_duty || 0,
      showbtn:true
    })
  })
}