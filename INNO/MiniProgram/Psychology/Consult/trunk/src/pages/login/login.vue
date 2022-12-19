<template>
  <view class="">
    <!-- #ifdef MP -->
    <page-nav :hideBtn="true" :full="false" :isTransparent="true"></page-nav>
    <!-- #endif -->
    <template v-if="isInited">
      <!-- 授权登录 -->
      <template v-if="!isAccountLogin"> 
        <view class="login-logo-container">
          <image class="audio-detail-background" :src="logo" @load="getBgSize"
            :style="{height:bgHeight,width:bgWidth}" v-if="logo"></image>
        </view>
        <view class="footer flex-c-c">
          <button class="btn-box relative">
            <text class="C_fff font-36">进入心理咨询平台</text>
            <template v-if="selectAgree">
              <auth-button class="authorized_phone_button absolute" :auth="true" :openType="openType"
                @getphonenumber="getPhoneNumber"></auth-button>
            </template>
            <template v-else>
              <view class="authorized_phone_button absolute" @click="checkSelectAgree"></view>
            </template>
          </button>
          <view class="agree-area" @click="chooseAgree">
            <view class="agree-icon">
              <view class="select-switch" :class="{ selected: selectAgree }"></view>
            </view>
            <view>已阅读并同意
              <view class="agree-link" @click.stop="checkAgree">用户隐私保护指引</view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <!-- 账号登录 -->
        <view class="account-main">
          <image class="login-logo" :src="logo"></image>
          <view class="input-area">
            <view class="input-item">
              <ori-input @onInput="(e) => onInput(e, 'mobilePhone')" :value="inputData.mobilePhone || ''" placeholder="请输入手机号"
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
            <view>
              <span>已阅读并同意</span>
              <view class="agree-link" @click.stop="checkAgree">用户隐私保护指引</view>
            </view>
          </view>
          <button class="btn-box" @click="bindStudentByPwd">
            <text class="C_fff font-36">确认</text>
          </button>
        </view>
      </template>
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
          mobilePhone: "",
          password: "",
        },
        activityId: 0,
        schoolInfo: {},
        actInfo: {},
        loginData: {},
        bgHeight: 0,
        bgWidth: 0,
        openType: "getPhoneNumber",
        isInited:false,
      };
    },
    computed: {
      inputStyle() {
        return "width:100%;height:100%;padding:20rpx 20rpx 20rpx 50rpx;box-sizing:border-box;";
      },
      logo(){
        return (this.loginData.imageDomain||"") + (this.loginData.appCoverPic||"") 
      }
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
      init() {
        // #ifdef MP
          app.Sysm.getSysConf("psyc_consult_login").finally(() => {
            this.isAccountLogin = app.Sysm.sysConf["psyc_consult_login"] == "password";
            this.isInited = true;
            if(!this.isAccountLogin){//不是审核登录->静默注册
              this.checkRegister();
            }
          });
        
          this.$Http(this.$Apis.getCoverInfo).then((res) => {
            this.loginData = res.data
          });
        // #endif
      }, 
      checkRegister(){
        return this._checkLogin(true).then(()=>{
          if(!app.LM.isLogin){
            return this.registerUserInfo().then((res) => {
              console.log('静默注册 then',res);
              if (res.code == 1) {
                return this._checkLogin(true);
              }
              return Promise.reject(res);
            })
          }else{
            return Promise.resolve(true);
          }
        })
      },
      getPhoneNumber({
        e
      }) { 
        console.log('getPhoneNumber',app.LM.isLogin,e);
        if(!app.LM.isLogin){
          app.SMH.showToast({title:"尚未登录,请重新扫码进入"});
          return Promise.reject();
        }
        return this.$Http(this.$Apis.getPhoneNumber, {
          data: {
            code: e.detail.code || "",
            encryptedData: e.detail.encryptedData || "",
            iv: e.detail.iv || "",
            sessionId: app.LM.sessionId || 0,
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if(res.code == 1){
            // let data = res.data||"";
            return this.bindMobilePhone(); //绑定手机
          }
          return res;
        });
      },
      bindMobilePhone(){
        return this._bindMobilePhone(true).then(res=>{
          console.log('_bindMobilePhone then',res)
          if(res.code == 1){ //是咨询师
            app.SMH.showToast({
              title: "登录成功",
            });
            return this.getAuthUserInfo();
          }
          return Promise.reject(res);
        }).catch(e=>{
          app.SMH.showToast({title:e&&e.msg||"绑定失败,稍后再试"});
          return Promise.reject(e);
        });
      },
      getAuthUserInfo(){
          return app.IM.getAuthUserInfo().then(()=>{ //刷新用户信息
            setTimeout(() => {
              this.backAction('/pages/startup/startup');
              // this.reLaunchAction('/pages/counseling/person-info/person-info');
            }, 800);
            return true;
          }); 
      },
      registerUserInfo(name) { //微信注册
        return app.LM.registerAsync(true,app.LM.sessionId,{
          name:name||"",
          sessionId: app.LM.sessionId,
        })
      }, 
      auditLogin(sessionId,mobilePhone,password){ //审核注册
        return this.$Http(this.$Apis.auditLogin, {
          data: {
            sessionId,mobilePhone,password
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code == 1) {
            return this._checkLogin().then(()=>{
              app.SMH.showToast({
                title: "登录成功",
              });
              return this.getAuthUserInfo();
            })
          }
          return Promise.reject(res)
        }).catch(e=>{
          app.SMH.showToast({
            title:e&&e.msg||"注册异常,稍后再试"
          })
          return Promise.reject(e)
        })
      },
      bindStudentByPwd() { //输入框授权
        if (this.lockPage) return;
        let inputData = this.inputData || {},warn = "",mobilePhone=inputData.mobilePhone.trim(),password=inputData.password.trim();
        if (!mobilePhone) {
          warn = "请输入账号";
        } else if (!password) {
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
        this.checkRegister().then(()=>{
          this.auditLogin(app.LM.sessionId,mobilePhone,password).finally(()=>{
            this.lockPage = false;
          });
        }).finally(()=>{
          this.lockPage = false;
        })
      },
      onInput(e, key) {
        console.log("onInput", e, key);
        let detail = e.detail || {};
        let value = detail.value;
        this.inputData[key] = value;
      }, 
      getBgSize({
        detail
      }) {
         let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
          this.isLoadBg = true;
        })
      },
      checkSelectAgree() {
        if (!this.selectAgree) {
          app.SMH.showToast({
            title: "请先勾选用户协议！",
          });
          return Promise.reject();
        } else {
          return Promise.resolve()
        }
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

  .authorized_phone_button {
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2;

    button {
      padding: 0;
    }
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