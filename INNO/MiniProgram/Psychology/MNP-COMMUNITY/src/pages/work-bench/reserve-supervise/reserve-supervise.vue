<template>
  <view class="reserve-supervise">
    <page-nav>
      <template slot="title">
        <view>预约督导</view>
      </template>
    </page-nav>
    <view class="form-list">
      <view class="input-panel flex-s-c">
        <view class="input-title">姓名</view>
        <view class="flex1">{{formData.name}}</view>
      </view>
      <view class="input-panel flex-s-c">
        <view class="input-title">联系方式</view>
        <input class="flex1" type="number" maxlength="11" v-model="formData.mobilePhone">
      </view>
      <ori-picker @pickerChange="(e) => pickerChange(e, 'superviseType')" range-key="serviceName" mode="selector"
        :range="superviseTypeGroup" :pickerValue="superviseTypeValue">
        <template v-slot:content>
          <view class="input-panel flex-b-c">
            <view class="flex flex1">
              <view class="input-title">督导方式</view>
              <view class="flex1">{{superviseTypeGroup[superviseTypeValue].serviceName || ''}}</view>
            </view>
            <view class="font-26 m-l-13 C_80abae">
              选择
            </view>
          </view>
        </template>
      </ori-picker>
      <ori-picker @pickerChange="(e) => pickerChange(e, 'consultDirection')" range-key="fieldName" mode="selector"
        :range="consultDirectionGroup" :pickerValue="consultDirectionValue">
        <template v-slot:content>
          <view class="input-panel flex-b-c">
            <view class="flex flex1">
              <view class="input-title">咨询方向</view>
              <view class="flex1">{{consultDirectionGroup[consultDirectionValue].fieldName || ''}}</view>
            </view>
            <view class="font-26 m-l-13 C_80abae">
              选择
            </view>
          </view>
        </template>
      </ori-picker>
      <view class="text-area-input">
        <view class="C_7f font-28 m-b-30">是否有其他提问/想说的话</view>
        <textarea placeholder="请在此输入" v-model="formData.description" placeholder-style="color:#DDDDDD;"
          maxlength="200"></textarea>
      </view>
    </view>
    <view class="bottom-area flex-c-c">
      <view class="submit-button flex-c-c font-30" @click="submitForm">
        提交
      </view>
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
        // formData: {
        //   name: "谢海树",
        //   mobilePhone: "13545545687",
        //   serviceId: "",
        //   fieldId: "",
        //   remark: ""
        // },
        formData: {
          "fieldId": "",
          "mobilePhone": "",
          "name": "",
          "serviceId": "",
          "description":""
        },
        lockPage:false,
        superviseTypeGroup: [],
        consultDirectionGroup: [],
        superviseTypeValue: -1,
        consultDirectionValue: -1
      }
    },
    components: {
      oriPicker,
    },
    methods: {
      loadconsultDirection() {
        this.$Http(this.$Apis.getAllSupervisorField).then((res) => {
          this.consultDirectionGroup = res.data;
          if (res.data.length == 1) {
            this.consultDirectionValue = 0;
            this.formData.fieldId = this.consultDirectionGroup[0].fieldId || "";
          }
        });
      },
        getConsultantGroup() {
        this.$Http(this.$Apis.selectAllConsultantService).then((res) => {
          this.superviseTypeGroup = res.data;
          if (res.data.length == 1) {
            this.superviseTypeValue = 0;
            this.formData.serviceId = this.superviseTypeGroup[0].serviceId || "";
          }
        });
      },
      init() {
        let userInfo = app.IM.authUserInfo;
        console.log(userInfo)
        this.$set(this.formData, "name", userInfo.realName)
        this.$set(this.formData, "mobilePhone", userInfo.mobilePhone)
        this.loadconsultDirection()
        this.getConsultantGroup()
      },
      pickerChange({
        detail
      }, type) {
        if (type == "superviseType") {
          this.superviseTypeValue = detail.value;
          this.formData.serviceId = String(this.superviseTypeGroup[this.superviseTypeValue].serviceId) || "";
        }
        if (type == "consultDirection") {
          this.consultDirectionValue = detail.value;
          this.formData.fieldId = String(this.consultDirectionGroup[this.consultDirectionValue].fieldId) || "";
        }
      },
      checkForm() {
        let msg = "";
        let formData = this.formData;
        if (String(formData.mobilePhone).trim().length == 0) {
          msg = "请输入联系方式"
        } else if (!/^1[123456789]\d{9}$/.test(formData.mobilePhone)) {
          msg = "请输入正确的联系方式"
        } else if (!formData.serviceId) {
          msg = "请选择督导方式"
        } else if (!formData.fieldId) {
          msg = "请选择咨询方向"
        }
        if (msg) {
          SMH.showToast({
            title: msg,
          });
          return false
        } else {
          return true
        }

      },
      submitForm() {
        if (this.checkForm()) {
          if (this.lockPage) return;
          this.lockPage = true;
          this.$Http(this.$Apis.supervisionInsert, {
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
              this.backAction()
            })
            .catch((err) => {
              this.lockPage = false;
            });
        }
      }
    },
    onShow() {
      this.init()
    },
    onReady() {

    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .reserve-supervise {
    min-height: 100vh;
    background-color: #F7F7F7;

    .form-list {
      // padding: 30rpx 25rpx calc(env(safe-area-inset-bottom) + 165rpx);
      padding: 30rpx 25rpx 165rpx;

      .input-panel {
        box-sizing: border-box;
        padding: 0 30rpx;
        height: 130rpx;
        background-color: #FFFFFF;
        width: 100%;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        font-size: 28rpx;

        .input-title {
          width: 110rpx;
          margin-right: 37rpx;
          color: #7f7f7f;
          flex-shrink: 0;
        }
      }

      .text-area-input {
        background-color: #FFFFFF;
        padding: 40rpx 36rpx;
        border-radius: 20rpx;

        textarea {
          width: 100%;
          height: 500rpx;
          resize: none;
          line-height: 37rpx;
        }
      }
    }
  }

  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 140rpx;
    background: #FFFFFF;
    z-index: 2;

    .submit-button {
      background: $uni-main-color;
      color: #FFFFFF;
      width: 660rpx;
      height: 100rpx;
      border-radius: 16rpx;
    }
  }
</style>