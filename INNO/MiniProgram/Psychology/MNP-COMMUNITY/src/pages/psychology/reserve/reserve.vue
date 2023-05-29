<template>
  <view>
    <template v-if="!showLoading">
    <view class="reserve-page">
      <page-nav></page-nav>
      <view class="text-edit flex-col-1">
        <view class="m-b-22 C_7f font-28 bold">问题描述</view>
        <textarea v-model="formData.psychologicalDescription" placeholder="尽量清晰地讲述引起烦恼的事件，可以获得更好的解答"
          :placeholder-style="textareaOptions.placeholderStyle" maxlength="200"></textarea>
      </view>
      <view class="user-edit-item flex-b-c">
        <view class="edit-item-title m-r-30 font-28 bold">姓名</view>
        <input class="font-28 bold" maxlength="20" v-model="formData.name" />
      </view>
      <view class="user-edit-item flex-b-c">
        <view class="edit-item-title m-r-30 font-28 bold">联系方式</view>
        <input type="number" maxlength="11" class="font-28 bold" v-model="formData.mobilePhone" />
      </view>
      <template v-if="pickGroup.length > 0">
        <ori-picker @pickerChange="(e) => pickerChange(e, 'sonsultType')" range-key="serviceName" mode="selector"
          :range="pickGroup" :pickerValue="picker_value">
          <template v-slot:content>
            <view class="user-edit-item flex-b-c">
              <view class="edit-item-title m-r-30 font-28 bold">咨询方式</view>
              <view class="font-28 C_333 bold flex-1">{{
              pickGroup[picker_value].serviceName
            }}</view>
              <view class="font-28 C_21b014 bold f-shrink-0">选择</view>
            </view>
          </template>
        </ori-picker>
      </template>
      <template v-else>
            <view class="user-edit-item flex-b-c">
              <view class="edit-item-title m-r-30 font-28 bold">咨询方式</view>
              <view class="font-28 bold C_8E f-shrink-0">暂无可选</view>
            </view>
          </template>
      <view class="user-edit-item flex-b-c" @click="selectReserveTime">
        <view class="edit-item-title m-r-30 font-28 bold">咨询时段</view>
        <view class="font-28 C_333 bold flex-1">{{selectDateTime.fullTime || ""}}</view>
        <!-- <view class="font-28 C_333 bold flex-1">{{}}</view> -->
        <view class="font-28 C_21b014 bold f-shrink-0">选择</view>
      </view>
      <view class="user-edit-item pay-type-box">
        <view class="font-28 bold C_7f">资费方式</view>
        <view class="pay-type-content flex-b-c">
          <template v-if="pickGroup[picker_value].serviceType == 'offline' || picker_value == -1">
            <template v-for="item in payTypeData">
              <view v-if="(item.key == 'company' && remainingCount > 0) || item.key != 'company'"
                class="pay-type-item flex-c-c flex-col" :class="{active:formData.payType == item.key}" :key="item.key"
                @click="formData.payType = item.key">
                <view class="name bold font-28">{{item.name}}</view>
                <view class="tips font-22">{{item.tips}}</view>
              </view>
            </template>
          </template>
          <template v-else>
            <view class="pay-type-item flex-c-c flex-col"
              :class="[formData.payType == payTypeData[1].key?'active':'pay-type-disabled']">
              <view class="name bold font-28">{{payTypeData[1].name}}</view>
              <view class="tips font-22">{{payTypeData[1].tips}}</view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view class="bottom-area-real-height"></view>
    <view class="bottom-area flex-col-1 flex-c-s">
      <view class="bottom-button flex flex-c-c C_fff font-30" @click="submit">立即预约</view>
      <view class="agree-area" @click="chooseAgree">
        <view class="agree-icon">
          <view class="select-switch" :class="{ selected: selectAgree }"></view>
        </view>
        <view class="flex-s-c">同意
          <!-- <view class="agree-link" @click.stop="jumpAction('')" data-type="service">《心理咨询服务协议》</view>
          、 -->
          <view class="agree-link" @click.stop="jumpAction('pages/psychology/service-agree/service-agree')">《知情同意书》
          </view>
        </view>
      </view>
    </view>
    </template>
    <view class="reserve-page flex-c-c" v-else>
		<loading-view></loading-view>
	</view>
  </view>
</template>

<script>
	import LoadingView from '@/components/css3/loading/loading.vue';
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import SMH from "@/common/helper/show-msg-handler.js";
  import WxSubscribe from '@/common/manager/wxSubscribe.js'
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        showLoading:true,
        wxSubscribeList: [],
        options: {},
        textareaValue: "",
        formData: {
          psychologicalDescription: "",
          name: "",
          mobilePhone: "",
          serviceId: "",
          payType: "self"
        },
        lockPage: false,
        pickGroup: [],
        picker_value: -1,
        selectDateTime: {
          fullTime: "",
          id: ""
        },
        textareaOptions: {
          placeholderStyle: "font-size: 26rpx;color: #8E8E8E;",
        },
        payTypeData: [{
            key: "self",
            name: "自费",
            tips: "预约后前往门店缴费",
          },
          {
            key: "company",
            name: "报销",
            tips: "企业报销",
          },
        ],
        remainingCount: 0,
        selectAgree: false
      };
    },
    components: {
      oriPicker,
      LoadingView
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.getRemainingCount().then(() => {
        this.getPickGroup();
      });
      WxSubscribe.getWxSub().then(res => {
        this.wxSubscribeList = res;
      })
    },
    methods: {
      pickerChange({
        detail
      }, type) {
        if (type == "sonsultType") {
          let pickGroup = this.pickGroup || [];
          let picker_value = detail.value || -1;
          let formData = JSON.parse(JSON.stringify(this.formData))
          formData.serviceId = pickGroup[picker_value].serviceId || "";
          if (pickGroup[picker_value].serviceType == 'offline') {
            formData.payType = "self"
          } else {
            let remainingCount = this.remainingCount || 0;
            let payTypeData = this.payTypeData || {}
            if (remainingCount) {
              formData.payType = payTypeData[1].key
            } else {
              formData.payType = ""
            }
          }
          this.picker_value = picker_value;
          this.formData = formData
        }
      },
      checkSubmit() {
        return new Promise((resolve, reject) => {
          let formData = JSON.parse(JSON.stringify(this.formData));
          if (formData.psychologicalDescription.trim().length == 0) {
            SMH.showToast({
              title: "请先填写引起烦恼的事件，便于获得更好的解答",
            });
            reject();
          } else if (formData.name.trim().length == 0) {
            SMH.showToast({
              title: "请输入姓名",
            });
            reject();
          } else if (formData.mobilePhone.trim().length == 0) {
            SMH.showToast({
              title: "请输入联系方式",
            });
            reject();
          } else if (formData.serviceId.toString().trim().length == 0) {
            SMH.showToast({
              title: "请选择咨询方式",
            });
            reject();
          } else if (this.selectDateTime.id.toString().trim().length == 0) {
            SMH.showToast({
              title: "请选择咨询时段",
            });
            reject();
          } else if (!/^1[123456789]\d{9}$/.test(formData.mobilePhone)) {
            SMH.showToast({
              title: "请输入正确的联系方式",
            });
            reject();
          } else if (formData.payType.trim().length == 0) {
            SMH.showToast({
              title: "请选择资费方式",
            });
            reject();
          } else if (!this.selectAgree) {
            SMH.showToast({
              title: "请先勾选知情同意书！",
              // title: "请先勾选心理咨询服务协议和知情同意书！",
            });
            reject();
          } else {
            resolve(true);
          }
        });
      },
      getPickGroup() {
        this.$Http(this.$Apis.selectAllConsultantServiceById, {
          data: {
            consultantId: this.options.consultantId
          }
        }).then((res) => {
          this.pickGroup = res.data;
          if (res.data.length == 1) {
            let picker_value = 0;
            let formData = JSON.parse(JSON.stringify(this.formData))
            formData.serviceId = this.pickGroup[picker_value].serviceId || "";
            if (pickGroup[picker_value].serviceType == 'offline') {
              formData.payType = "self"
            } else {
              let remainingCount = this.remainingCount || 0;
              let payTypeData = this.payTypeData || {}
              if (remainingCount) {
                formData.payType = payTypeData[1].key
              } else {
                formData.payType = ""
              }
            }
            this.picker_value = picker_value;
            this.formData = formData
          }
        }).finally(()=>{
          this.showLoading = false
          
        })
      },
      getRemainingCount() {
        return this.$Http(this.$Apis.getRemainingCount).then((res) => {
          if (res.code) {
            this.remainingCount = res.data || 0;
            return res.data
          }
        });
      },
      submit() {
        if (this.lockPage) return;
        this.lockPage = true;
        this.checkSubmit()
          .then(() => {
            this.$Http(this.$Apis.appointConsultant, {
                data: {
                  consultantId: Number(this.options.consultantId),
                  id: this.selectDateTime.id,
                  ...this.formData,
                },
                other: {
                  isShowLoad: true,
                },
              })
              .then((res) => {
                this.lockPage = false;
                this.getWxSubMainInfo().then(subRes => {
                  this.$Http(this.$Apis.submitSubscribe, {
                    data: {
                      keyId: res.data,
                      msgList: subRes
                    }
                  })
                }).then(() => {
                  this.redirectAction(
                    "/pages/psychology/reserve-result/reserve-result"
                  );
                })
              })
              .catch((err) => {
                this.lockPage = false;
              });
          })
          .catch((err) => {
            console.log(err, "错了错了")
            this.lockPage = false;
          });
      },
      getWxSubMainInfo() {
        let acceptArr = [];
        let wxSubscribeList = this.wxSubscribeList;
        return this.requestSubscribeMessage().then(res => {
          console.log(res, "res，submit调用订阅消息")
          for (let i in res) {
            if (i !== "errMsg") {
              let subscribeFilter = wxSubscribeList.filter(item => {
                return item.wxTplId == i
              })[0]
              console.log(subscribeFilter, i, "subscribeFilter")
              acceptArr.push({
                customerTplId: subscribeFilter.id,
                status: res[i] == 'accept' ? 1 : 0,
                type: subscribeFilter.type,
                wxTplId: i
              })
            }
          }
          return acceptArr
        }).catch(err => {
          console.log(err, "err，submit调用订阅消息")
        })
      },
      requestSubscribeMessage() {
        let wxSubscribeList = this.wxSubscribeList;
        let tmplIds = wxSubscribeList.reduce(function (accumulator, currentValue) {
          accumulator.push(currentValue.wxTplId)
          return accumulator
        }, []);
        return new Promise((rs, rj) => {
          return WxSubscribe.subGetSetting(tmplIds).then(res => {
            console.log(res, "订阅信息")
            rs(res)
          }).catch(err => {
            console.log(err, "错误信息")
            WxSubscribe.setWxSubscribe(tmplIds).then(wxSubRes => {
              console.log(wxSubRes, "wxSubRes订阅信息")
              rs(wxSubRes)
            }).catch(wxSubErr => {
              console.log(wxSubErr, "wxSubRes错误信息")
              rj(wxSubErr)
            })
          })
        })

      },
      chooseAgree() {
        this.selectAgree = !this.selectAgree;
      },
      selectReserveTime() {
        this.jumpAction(`/pages/psychology/reserve-time/reserve-time?id=${this.options.consultantId}`)
      },
      watchDateTimeSelect() {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        if (currPage.data != undefined) {
          let dateTime = currPage.data.selectDateTime;
          this.selectDateTime = dateTime;
          console.log(currPage.data, "有了")
        }
      }
    },
    onUnload() {},
    onShow() {
      this.watchDateTimeSelect()
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .reserve-page {
    padding: 30rpx 25rpx 160rpx;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #f7f7f7;

    .text-edit {
      width: 100%;
      height: 360rpx;
      background: #ffffff;
      border-radius: 20rpx;
      padding: 30rpx;
      box-sizing: border-box;

      textarea {
        width: 100%;
        flex: 1;
        box-sizing: border-box;
        resize: none;
        line-height: 37rpx;
      }
    }

    .user-edit-item {
      width: 100%;
      height: 130rpx;
      background: #ffffff;
      border-radius: 20rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
      margin-top: 25rpx;

      .edit-item-title {
        color: #7F7F7F;
        box-sizing: border-box;
        min-width: 112rpx;
        text-align: justify;
        text-align-last: justify;
        flex-shrink: 0;
        // 以下代码兼容ios的text-align: justify;
        padding-top: 34rpx;

        &:after {
          content: '';
          width: 100%;
          display: inline-block;
        }
      }

      input {
        flex: 1;
        height: 100%;
      }
    }

    .pay-type-box {
      height: auto;
      padding: 30rpx;
    }

    .pay-type-content {
      margin-top: 28rpx;

      .pay-type-item {
        width: 310rpx;
        height: 137rpx;
        background: rgba(216, 216, 216, 0.1);
        border-radius: 18rpx;
        border: 1px solid transparent;
        box-sizing: border-box;
        line-height: 42rpx;

        &.active {
          background: #FAFFF9;
          border: 2rpx solid rgba($color: $uni-main-color, $alpha: 0.3);
          color: $uni-main-color;

        }

        .tips {
          color: #7f7f7f;
        }
      }

      .pay-type-disabled {
        opacity: 0.2;
      }
    }

  }

  .bottom-area-real-height {
    height: calc(191rpx + env(safe-area-inset-bottom));
  }

  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 170rpx;
    padding-top: 21rpx;
    padding-bottom: env(safe-area-inset-bottom);
    background: #ffffff;
    box-shadow: 2rpx 2rpx 2rpx 1rpx rgba($color: #7f7f7f, $alpha: 0.2);

    .bottom-button {
      margin: 0 auto;
      width: 652rpx;
      height: 80rpx;
      background: $uni-main-color;
      border-radius: 44rpx;
    }
  }

  .agree-area {
    line-height: 30rpx;
    font-family: PingFangSC-Regular;
    font-size: 22rpx;
    margin-top: 17rpx;
    margin-left: 63rpx;
    display: flex;

    .agree-icon {
      padding: 5rpx 20rpx;

      .select-switch {
        background: #efefef;
        border: 1px solid #979797;
        border-radius: 4rpx;
        width: 23rpx;
        height: 23rpx;
        position: relative;
      }

      .selected::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30%;
        height: 80%;
        border-radius: 4rpx;
        border: 6rpx solid $uni-main-color;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: translate(-18%, -80%) rotate(40deg);
      }
    }

    .agree-link {
      display: inline-block;
      color: #4DA8D9;
      padding: 0px 10rpx;
      // text-decoration: underline;
    }
  }
</style>