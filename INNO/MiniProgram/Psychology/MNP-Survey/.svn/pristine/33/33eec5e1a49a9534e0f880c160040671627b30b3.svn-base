<template>
  <view>
    <view class="reserve-page">
      <page-nav></page-nav>
      <view class="text-edit">
        <textarea v-model="formData.psychologicalDescription" placeholder="尽量清晰地讲述引起烦恼的事件，可以获得更好的解答"
          :placeholder-style="textareaOptions.placeholderStyle" maxlength="200"></textarea>
      </view>
      <view class="user-edit-item flex-b-c">
        <view class="edit-item-title m-r-30 flex-b-c font-28 bold">姓名</view>
        <input class="font-28 bold" maxlength="20" v-model="formData.name" />
      </view>
      <ori-picker @pickerChange="(e) => pickerChange(e, 'sonsultType')" range-key="serviceName" mode="selector"
        :range="pickGroup" :pickerValue="picker_value">
        <template v-slot:content>
          <view class="user-edit-item flex-b-c">
            <view class="edit-item-title m-r-30 flex-b-c font-28 bold">咨询方式</view>

            <view class="edit-disable font-28 C_B2 bold" v-if="picker_value == -1">请选择</view>
            <view class="edit-disable font-28 C_B2 bold" v-else>{{
              pickGroup[picker_value].serviceName
            }}</view>
          </view>
        </template>
      </ori-picker>
      <view class="user-edit-item flex-b-c">
        <view class="edit-item-title m-r-30 flex-b-c font-28 bold">联系方式</view>
        <input type="number" maxlength="11" class="font-28 bold" v-model="formData.mobilePhone" />
      </view>
      <view class="user-edit-item pay-type-box">
        <view class="font-28 bold">资费方式</view>
        <view class="pay-type-content flex-b-c">
          <template v-for="item in payTypeData">
            <view v-if="(item.key == 'company' && remainingCount > 0) || item.key != 'company'"
              class="pay-type-item flex-c-c flex-col" :class="{active:formData.payType == item.key}" :key="item.key"
              @click="formData.payType = item.key">
              <view class="name bold font-28">{{item.name}}</view>
              <view class="tips font-22">{{item.tips}}</view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view class="bottom-area flex flex-c-c">
      <view class="bottom-button flex flex-c-c C_fff font-30 bold" @click="submit">提交</view>
    </view>
  </view>
</template>

<script>
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import SMH from "@/common/helper/show-msg-handler.js";
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        options: {},
        textareaValue: "",
        formData: {
          psychologicalDescription: "",
          name: "",
          mobilePhone: "",
          serviceId: "",
          payType:"self"

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
        lockPage: false,
        pickGroup: [],
        picker_value: -1,
        textareaOptions: {
          placeholderStyle: "font-size: 26rpx;color: #8E8E8E;",
        },
      };
    },
    components: {
      oriPicker,
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.getPickGroup();
      this.getRemainingCount();
    },
    methods: {
      pickerChange({
        detail
      }, type) {
        if (type == "sonsultType") {
          this.picker_value = detail.value;
          this.formData.serviceId =
            this.pickGroup[this.picker_value].serviceId || "";
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
          } else if (formData.serviceId.toString().trim().length == 0) {
            SMH.showToast({
              title: "请选择咨询方式",
            });
            reject();
          } else if (formData.mobilePhone.trim().length == 0) {
            SMH.showToast({
              title: "请输入联系方式",
            });
            reject();
          } else if (!/^1[123456789]\d{9}$/.test(formData.mobilePhone)) {
            SMH.showToast({
              title: "请输入正确的联系方式",
            });
            reject();
          } else {
            resolve(true);
          }
        });
      },
      getPickGroup() {
        this.$Http(this.$Apis.selectAllConsultantService).then((res) => {
          this.pickGroup = res.data;
          if (res.data.length == 1) {
            this.picker_value = 0;
            this.formData.serviceId = this.pickGroup[0].serviceId || "";
          }
        });
      },
      getRemainingCount() {
        this.$Http(this.$Apis.getRemainingCount).then((res) => {
          if (res.code) {
            this.remainingCount = res.data || 0;
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
                  ...this.formData,
                },
                other: {
                  isShowLoad: true,
                },
              })
              .then(() => {
                this.lockPage = false;
                this.redirectAction(
                  "/pages/psychology/reserve-result/reserve-result"
                );
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
    },
    onUnload() {},
    onShow() {},
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
      height: 527rpx;
      background: #ffffff;
      border-radius: 20rpx;

      textarea {
        width: 100%;
        height: 100%;
        padding: 30rpx;
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
        min-width: 112rpx;
        flex-shrink: 0;
      }

      input {
        text-align: right;
        flex: 1;
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
        border-radius: 10rpx;
        border: 1px solid transparent;
        box-sizing: border-box;
        line-height: 42rpx;

        &.active {
          background: #F7FDFF;
          border: 1px solid #E5F7FD;
          color: #06509B;

          .tips {
            color: #06509B;
          }
        }

        .tips {
          color: #7f7f7f;
        }
      }
    }
  }

  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    width: 750rpx;
    height: 140rpx;
    background: #ffffff;
    box-sizing: border-box;

    .bottom-button {
      width: 660rpx;
      height: 100rpx;
      background: $uni-main-color;
      border-radius: 16rpx;
    }
  }
</style>