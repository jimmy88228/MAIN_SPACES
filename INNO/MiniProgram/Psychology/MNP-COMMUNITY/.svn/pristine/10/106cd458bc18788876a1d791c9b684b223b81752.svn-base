<template>
  <view class="">
    <!-- #ifdef MP -->
    <page-nav :hideBtn="true" :full="false" :isTransparent="true"></page-nav>
    <!-- #endif -->
    <template v-if="!isAccountLogin">
      <!-- <view class="main">
        <image class="login-logo" :src="loginData.logo"></image>
        <view class="" v-if="schoolInfo.schoolId">
          <view class="title">{{ schoolInfo.schoolName }}</view>
          <view v-if="actInfo.activityId" class="content">{{
            actInfo.activityName
          }}</view>
        </view>
        <view v-else>
          <view class="title">{{loginData.customerName}}</view>
        </view>
      </view> -->
      <view class="login-logo-container">
        <image class="audio-detail-background" :src="loginData.logo" @load="getBgSize"
          :style="{height:bgHeight,width:bgWidth}" v-if="loginData.logo"></image>
      </view>
      <view class="footer flex-c-c">
        <button class="btn-box" @click="register">
          <text class="C_fff font-36">进入心理健康平台</text>
        </button>
        <view class="agree-area" @click="chooseAgree">
          <view class="agree-icon">
            <view class="select-switch" :class="{ selected: selectAgree }"></view>
          </view>
          <view>我同意广州市白云区精神卫生中心使用我所提交的信息用于快捷登录，查看
            <view class="agree-link" @click.stop="checkAgree">用户隐私保护指引</view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="account-main">
        <image class="login-logo" :src="loginData.logo"></image>
        <view class="input-area">
          <view class="input-item">
            <ori-input @onInput="(e) => onInput(e, 'schoolCode')" :value="inputData.schoolCode || ''"
              placeholder="输入检验ID" placeholderClass="hold-style" class="_input" :boxStyle="inputStyle">
            </ori-input>
          </view>
          <view class="input-item">
            <ori-input @onInput="(e) => onInput(e, 'account')" :value="inputData.account || ''" placeholder="输入账号"
              placeholderClass="hold-style" class="_input" :boxStyle="inputStyle">
            </ori-input>
          </view>
          <view class="input-item">
            <ori-input @onInput="(e) => onInput(e, 'password')" :value="inputData.password || ''" placeholder="请输入密码"
              type="password" placeholderClass="hold-style" class="_input" :boxStyle="inputStyle">
            </ori-input>
          </view>
        </view>
        <view class="agree-area" @click="chooseAgree">
          <view class="agree-icon">
            <view class="select-switch" :class="{ selected: selectAgree }"></view>
          </view>
          <view>已阅读并同意广州市白云区精神卫生中心
            <view class="agree-link" @click.stop="checkAgree">用户隐私保护指引</view>
          </view>
          <!-- <view>已阅读并同意白云心理 <view class="agree-link" @click.stop="checkAgree">用户隐私保护指引</view></view> -->
        </view>
        <button class="btn-box" @click="bindStudentByPwd">
          <text class="C_fff font-36">确认</text>
        </button>
      </view>
    </template>
  </view>
</template>

<script>
  import utils from '@/common/support/utils.js'
  import SIH from "@/common/helper/sys-infos-handler";
  import AuthButton from "@/components/auth-button/auth-button.vue";
  import oriInput from "@/components/ori-comps/input/ori-input.vue";
  import scanCode from "@/common/helper/scan-code-handler.js";
  import StorageH from "@/common/helper/storage-handler.js";
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      AuthButton,
      oriInput,
    },
    data() {
      return {
        lockPage: false,
        selectAgree: false,
        isAccountLogin: false,
        inputData: {
          schoolCode: "",
          account: "",
          password: "",
        },
        activityId: 0,
        schoolInfo: {},
        actInfo: {},
        loginData: {},
        bgHeight: 0,
        bgWidth: 0
      };
    },
    computed: {
      inputStyle() {
        return "width:100%;height:100%;padding:20rpx 20rpx 20rpx 50rpx;box-sizing:border-box;";
      },
    },
    onLoad(options) {
      this.schoolInfo = scanCode.schoolInfo || {};
      this.actInfo = scanCode.actBaseInfo || {};
      this.options = options || {};
    },
    onShow() {
      this.init();
    },
    methods: {
      getBgSize({
        detail
      }) {
        let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
        })
      },
      init() {
        // #ifdef H5
        app.LM.logout();
        app.LM.logout("bsnUserToken");
        this.isAccountLogin = true;
        console.log(
          "login进来",
          this.activityId,
          this.options.id,
          app.PM.getParams("initId") || 0
        );
        app.PM.setParams(
          "initId",
          parseInt(this.options.id || 0) ||
          parseInt(app.PM.getParams("initId") || 0)
        );
        this.activityId = app.PM.getParams("initId");
        if (this.options.id == 0 && this.activityId) {
          this.reLaunchAction(`/pages/login/login?id=${this.activityId}`);
        }
        // #endif

        // #ifdef MP
        // app.Sysm.getSysConf("applet_login_type").finally(() => {
        //   this.isAccountLogin =
        //     app.Sysm.sysConf["applet_login_type"] == "password";
        // });

        this.$Http(this.$Apis.getCustomerInfo).then((res) => {
          this.loginData = res.data
          console.log(res, "获得的首页")
        });
        // #endif
      },
      register() {
        if (!this.selectAgree) {
          app.SMH.showToast({
            title: "请先勾选用户协议！",
          });
          return;
        }
        // if (this.lockPage) return;
        // this.lockPage = true;
        // return this.beforeLogin()
        //   .then((res) => {
        //     if (this.isLogin) {
        //       app.SMH.showToast({
        //         title: "注册成功",
        //       });
        StorageH.set("LOGIN_AUTH", true);
        this.redirectAction("/pages/register/register");
        //   } else {
        //     app.SMH.showToast({
        //       title: "注册异常",
        //     });
        //   }
        //   return res;
        // })
        // .finally(() => {
        //   this.lockPage = false;
        // });
      },
      beforeLogin() {
        // #ifdef H5
        return Promise.resolve();
        // #endif

        // #ifdef MP
        return this._getTokenRegister().then((res) => {
          return this._checkLogin();
        });
        // #endif
      },
      bindStudentByPwd() {
        if (this.lockPage) return;
        let inputData = this.inputData || {},
          warn = "";
        if (!inputData.schoolCode) {
          warn = "请输入校验ID";
        } else if (!inputData.account) {
          warn = "请输入账号";
        } else if (!inputData.password) {
          warn = "请输入密码";
        } else if (!this.selectAgree) {
          warn = "请先勾选用户协议！";
        }
        if (warn) {
          app.SMH.showToast({
            title: warn,
          });
          return;
        }
        this.lockPage = true;
        return this.beforeLogin()
          .then(() => {
            let api = "bindStudentByPwd",
              params = inputData;
            // #ifdef H5
            api = "loginByH5";
            params.activityId = this.activityId;
            // #endif
            return this.$Http(this.$Apis[api], {
              data: params,
              other: {
                isShowLoad: true,
              },
            }).then((res) => {
              if (res.code == 1) {
                if (res.data) {
                  let data = res.data || "";
                  let bsnUserToken = data,
                    recordId = data,
                    authUserToken = "";
                  // #ifdef H5
                  bsnUserToken = data.authUserToken;
                  authUserToken = data.authUserToken;
                  app.LM.savePrivateInfo({
                    authUserToken
                  });
                  recordId = data.recordId;
                  // #endif
                  app.LM.savePrivateInfo({
                    recordId
                  });
                  app.IM.getUserInfoByToken().then(() => {
                    // #ifdef H5
                    this.redirectAction(
                      this.options.fromRoute ||
                      `/pages/activities/evaluating/detail/detail?activityId=${
                        this.activityId || 0
                      }`
                    );
                    // #endif

                    // #ifdef MP
                    this.backAction(
                      this.options.fromRoute || "/pages/index/index"
                    );
                    // #endif
                  });
                }
              }
            });
          })
          .finally(() => {
            this.lockPage = false;
          });
      },
      onInput(e, key) {
        console.log("onInput", e, key);
        let detail = e.detail || {};
        let value = detail.value;
        this.inputData[key] = value;
      },
      chooseAgree() {
        this.selectAgree = !this.selectAgree;
      },
      checkAgree() {
        this.jumpAction("/pages/agree/agree");
      },
    },
  });
  export default pageOption;
</script>

<style scoped lang="scss">
  .login-logo-container {
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;


    .audio-detail-background {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .main {
    // padding: 220rpx 0rpx 0 96rpx;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    color: #333;
    display: flex;
    flex-flow: column;
    align-items: center;

    .title,
    .content {
      color: $uni-main-color;
      font-size: 38rpx;
      font-weight: bold;
      white-space: nowrap;
    }

    .login-logo {
      width: 206rpx;
      height: 197rpx;
      display: block;
      margin-bottom: 102rpx;
    }

  }

  .footer {
    position: fixed;
    flex-direction: column;
    bottom: 80rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .btn-box {
    width: 580rpx;
    height: 110rpx;
    border-radius: 55rpx;
    overflow: hidden;
    background-color: $uni-main-color;
  }

  .btn {
    width: 100%;
    height: 100%;
    border-radius: 55rpx;
  }

  .box {
    position: fixed;
    bottom: 30rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .account-main {
    padding-top: 200rpx;
    text-align: center;

    .hold-style {
      color: #e9e9e9;
    }

    .login-logo {
      width: 236rpx;
      height: 236rpx;
      display: block;
      margin: 0 auto;
      margin-bottom: 36rpx;
    }

    .input-area {
      .input-item {
        text-align: left;
        margin: 0px auto;
        margin-bottom: 25rpx;
        width: 600rpx;
        height: 120rpx;
        display: flex;
        background: #fafafa;
        border-radius: 60rpx;

        ._input {
          width: 100%;
          height: 100%;
        }
      }
    }

    .btn-box {
      width: 300rpx;
      height: 100rpx;
      border-radius: 55rpx;
      overflow: hidden;
      background-color: $uni-main-color;
      margin: 0 auto;
    }

    .agree-area {
      justify-content: center;
      margin: 0px;
      margin-bottom: 144rpx;
    }
  }

  .agree-area {
    line-height: 30rpx;
    font-family: PingFangSC-Regular;
    font-size: 22rpx;
    margin-top: 35rpx;
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
      color: #178ed2;
      padding: 0px 10rpx;
      text-decoration: underline;
    }
  }
</style>