const app = getApp();
const COUNT = 5;
const DURATION = 3000;
import WxApi from '../../../../../support/tools/wx-api-promise.js'
// import Promise from '../../../../../libs/promise/promise.js'
import PayH from '../../../../../helper/handle/payHandle.js'

Page(app.BP({
    data: {
        filter: false,
        filter_bg: false,
        value_name: '',
        value_phone: '',
        value_code: '',
        disabled: true,
        // send_surplus_time: 0,
        // tab:[
        //   {
        //     type:"code",
        //     txt:"验证码注册"
        //   },
        //   {
        //     type: "weChatPhone",
        //     txt: "微信手机注册"
        //   }
        // ],
        // tabCurrent:0,
        // lineW: 0,
    },

    onLoad: function(options) {
        this.options = options;
        this.dure_agreement = options.dure_agreement || '';
        this.page_id = options.page_id || 0;
        this.setData({
            phone: options.phone || '',
            free_num_day: options.free_num_day || 0,
            order_amount: options.order_amount || 0,
            nameDefault: (options.userName != "undefined" && options.userName) || '',
            idCardName:(options.cName != "undefined" && options.cName)||"",
            value_name:(options.cName != "undefined" && options.cName)||"",
        })
    },
    onUnload(){
      delCacheFn.call(this)
    },
    onHide(){
      delCacheFn.call(this)
    },
    getCode(e) {
        console.log('获取验证码');
        if (this.data.phone && !this.isLoading) {
            this.isLoading = true;
            sendMsg.call(this, this.data.phone)
        }
    },
    registerClick(){
      let checkOk = check.call(this);
      if (checkOk) {
        this.loginPhone = this.loginPhone || this.selectComponent("#loginPhone");
        this.loginPhone.checkLogin({});
      }
    },
    showDetail: function(reqData) {
        // let checkOk = check.call(this);
        // if (checkOk) {
            if (!this.staff_order_id) {
                apply_Staff.call(this,reqData).then(res => {
                    if (res.code == 1) {
                        const data = res.data || {};
                        this.staff_order_id = data.orderId;
                        this.staff_order_sn = data.orderSn;
                        console.log('储存order:', this.staff_order_id, data.orderId)
                        if (data.pay_status == 2) {
                            console.log('免费直接弹窗');
                            windowShowHide.call(this, 'success');
                        } else if ((data.pay_status != 2) && (this.data.free_num_day > 0)) {
                            console.log('免费不足')
                            this.setData({
                                free_num_day: 0
                            })
                            windowShowHide.call(this, 'fail')
                            // app.SMH.showToast({
                            //     title: '很抱歉，免费名额已被抢光啦'
                            // })
                        } else if (data.pay_status != 2) {
                            console.log('付费调支付')
                            toPay.call(this, data.orderId)
                        }
                    }
                })
            } else {
                console.log('取消过，直接拿缓存orderid：', this.staff_order_id)
                toPay.call(this, this.staff_order_id)
            }

        // } else {
        //     app.SMH.showToast({
        //         title: this.msg || "请输入正确格式的信息"
        //     })
        // }

    },

    navigateBack() {
        windowShowHide.call(this, 'jump');
    },

    handleInput(e) {
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value || ''
        })
    },
    codeCountDown: function(count) {
        var that = this;
        console.log('codeCountDown', count)
        if (count == 0) {
            return;
        }
        this.setData({
            send_surplus_time: count || 10
        })
        clearInterval(this.timer);
        this.timer = setInterval(function() {
            if (count > 0) {
                count--;
                that.setData({
                    send_surplus_time: count
                })
            } else {
                app.StorageH.remove("send_surplus_time");
                clearInterval(this.timer);
            }
        }, 1000)
    },

    viewTips(e) {
        wx.navigateTo({
            url: `/pages/micro_mall/distribution_center/apply_for_staff/staff_tip/dure?agreement=${this.dure_agreement}`,
        })
    },
    bingPhoneCallBack:function(e){
      console.log("bindPhoneCallback",e);
      let detail = e.detail || {};
      let encryptedData = detail.encryptedData || "";
      let iv = detail.iv;
      let data = {
        encryptedData,
        iv
      }
      this.showDetail(data);
    }
}))


function sendMsg(mobile) {
    if (!mobile) {
        this.isLoading = false;
        return;
    }
    return app.UserApi.sendMsg({
        data: {
            "mobileNo": mobile,
            "opType": "3", // 1注册 , 2找回密码 3短信登录 4成为代理人 5 绑定手机 6 修改手机,7 申请分销员
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            app.SMH.showToast({
              title: e.msg || "发送成功"
            })
            let count = e.data;
            app.StorageH.set("send_surplus_time", {
                date: new Date(),
                time: count
            });
            this.codeCountDown(count);
            return Promise.resolve(e);
        } else {
            app.SMH.showToast({
                title: e.msg || "暂时无法获取验证码"
            })
            // app.SMH.showToast({
            //     title: e.message || "发送成功"
            // })
            // let count = e.data;
            // app.StorageH.set("send_surplus_time", {
            //     date: new Date(),
            //     time: count
            // });
            // this.codeCountDown(count || 10);
            // return Promise.resolve(e);
        }
        return Promise.reject();
    }).finally(() => {
        let _timer = setTimeout(() => {
            clearTimeout(_timer);
            this.isLoading = false;
        }, 500)
    })


}

function check() {
    let value1 = this.data.value_name;
    let value2 = this.data.value_code;
    let value3 = this.data.phone;
    let warn = "";
    if (!value1) {
        warn = "请输入正确格式的名字"
    }
    if(warn){
      app.SMH.showToast({
        title: warn
      })
      return false;
    }else{
      return true;
    }
    // if (!value2) {
    //     warn = "请输入正确格式的验证码"
    //     return false
    // }
    // if (!value3){
    //     warn = "手机号异常";
    //     return false
    // }
    
    // return true
}


// function apply_Staff() {
//     return app.DistrApi.apply_Staff({
//         data: {
//             userToken: app.LM.userToken,
//             brandCode: app.Conf.BRAND_CODE,
//             apply_name: this.data.value_name,
//             mobile_phone: this.data.phone,
//             msgCode: this.data.value_code,
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(res => {
//         if (res.code == 1) {
//             console.log('注册成功');
//             return Promise.resolve(res)
//         } else {
//             app.SMH.showToast({
//                 title: res.msg || "注册不成功"
//             })
//             return Promise.reject()
//         }
//     })
// }

function apply_Staff(reqData) {
  if (!reqData.encryptedData || !reqData.iv || !app.LM.userToken) return Promise.reject("");
    return app.DistrApi.applyStaffDstbInfoNoPhone({
        data: {
          "apply_name": this.data.value_name,
          "encryptedData": reqData.encryptedData,
          "iv": reqData.iv,
          "sessionId": app.LM.sessionId,
          brandCode: app.Conf.BRAND_CODE,
          userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            console.log('注册成功');
            return Promise.resolve(res)
        } else {
            app.SMH.showToast({
                title: res.msg || "注册不成功"
            })
            return Promise.reject()
        }
    })
}



function windowShowHide(type) {
    if (type != 'jump') {
        this.setData({
            success: (type == 'success') ? true : false,
            fail: type == 'fail' ? true : false
        })
    }
    this.setData({
        filter: !this.data.filter,
    })
    let delayTime = 0;
    if (!this.data.filter) {
        delayTime = 150;
    }
    let _timer1 =setTimeout(() => {
        clearTimeout(_timer1);
        this.setData({ 
            filter_bg: !this.data.filter_bg,
        })
    }, delayTime)
    if (type == 'jump' && this.data.success) {
        // setTimeout(() => {
        //     wx.redirectTo({
        //         url: `/pages/micro_mall/distribution_center/distribution_center`,
        //     })
        // }, 400)
        let _timer2 = setTimeout(() => {
          clearTimeout(_timer2);
          wx.navigateBack({
            delta: 1
          })
        }, 400)
    }
}

/**
 * 去支付
 */
function toPay(order_id) {
    var that = this;
    if (order_id) {
        // return app.PayApi.getAppletPrepayId({
        //     params: {
        //         order_id: order_id,
        //         pay_type: "staff"
        //     },
        //     other: {
        //         isShowLoad: true
        //     }
        // })
        return PayH.UnifiedorderByOrderId("staff",order_id)
        .then(e => {
            console.log('支付配置获取：', e)
            if (e.code == "1") {
                let pay_info = e.data;
                WxApi.requestPayment({
                    'timeStamp': pay_info.timeStamp + '',
                    'nonceStr': pay_info.nonceStr,
                    'package': pay_info.package,
                    'signType': pay_info.signType,
                    'paySign': pay_info.sign,
                }).then(e => {
                    console.log('原生支付成功：', e);
                    createPolling.call(that, COUNT, DURATION, () => {
                        return app.DistrApi.pay_Result({
                            params: {
                                brandCode: app.Conf.BRAND_CODE,
                                orderId: order_id
                            },
                            other: {
                                isShowLoad: true
                            }
                        }).then(res => {
                            console.log('轮询中:', res)
                            if (res.code == 1) {
                                if (res.data && res.data == 2) {
                                    res.isEnd = 1;
                                }
                            }
                            return res;
                        }).catch(() => {
                            console.log('防止轮询过程出现问题中断轮询')
                        });
                    })().then((res) => {
                        console.log('轮询成功~~', res);
                        if (res.code == 1 && res.data == 2) {
                            windowShowHide.call(that, 'success')
                        } else {
                            app.SMH.showToast({
                                title: '注册订单轮询未成功，请稍后再查确'
                            })
                            let _timer = setTimeout(() => {
                                clearTimeout(_timer);
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 2000)
                        }
                    });
                }).catch(e => {
                    console.log('取消支付');
                })
            } else {
                app.SMH.showToast({
                    title: e.msg || '订单号异常'
                })
            }
        })
    } else {
        app.SMH.showToast({
            title: '订单号异常'
        })
    }
}




function createPolling(count, duration, fn) {
    function pollFn() {
        count = count - 1;
        if (count >= 0) {
            return fn().then((res) => {
                if (res.isEnd == 1) {
                    return Promise.resolve(res);
                } else if (count <= 0) {
                    return Promise.resolve(res);
                }
                return Promise.delay(duration).then(() => {
                    return pollFn();
                });
            })
        }
        return Promise.resolve(res);
    }
    return pollFn;
}

function delCacheFn(){
  console.log('清除cache')
  app.CDateH.delCacheDate('checkStaff'); 
}