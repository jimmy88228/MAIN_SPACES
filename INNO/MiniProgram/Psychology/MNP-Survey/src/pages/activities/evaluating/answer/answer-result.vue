<template>
  <frame-box :showPage="mixShowPage">
    <template v-slot:body>
      <view class="answer-result flex-col ">
        <!-- #ifdef MP -->
        <image class="submit-suc" :src="requireStatic('/answer-result-bg.jpg')" mode="widthFix" />
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <image class="submit-suc" :src="requireStatic('/answer-result-bg-h5.png')" mode="widthFix" />
        <!-- #endif -->
        <view class="button-group">
          <view class="tips">已提交成功，感谢你的参与</view>

          <!-- #ifdef MP -->
          <button v-if="options.recordId && options.recordId !=0" class="btn btn-primary flex-c-c C_fff"
            @click="getResult">查看测评报告</button>
          <button class="btn flex-c-c" @click="reLaunchAction" data-url="/pages/index/index">返回首页</button>
          <!-- #endif -->

          <!-- #ifdef H5 -->
          <button class="btn flex-c-c" @click="logout" data-url="/pages/index/index">退出登录 ({{count}}s)</button>
          <!-- #endif -->
        </view>
      </view>
    </template>
  </frame-box>
</template>

<script>
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {},
    data() {
      return {
        count: 10,
        loginTimer: null
      }
    },
    methods: {
      logout() {
        this.clearTimer();
        app.LM.logout().logout('bsnUserToken');
        this.reLaunchAction(
          `/pages/startup/startup?id=${app.PM.getParams('initId')||0}&schoolId=${app.PM.getParams('schoolId')||0}&campusId=${app.PM.getParams('campusId')||0}&classId=${app.PM.getParams('classId')||0}`
          )
      },
      getResult() {
        this.reLaunchAction(`/pages/report/report-info/report-info?recordId=${this.options.recordId}`);
      },
      autoLoginOut() {
        // #ifdef H5
        if (this.count > 0) {
          this.count--;
          this.loginTimer = setInterval(() => {
            if (this.count > 0) {
              this.count--;
            } else {
              this.clearTimer();
              this.logout();
            }
          }, 1000)
        }
        // #endif
      },
      clearTimer() {
        if (this.loginTimer) {
          clearInterval(this.loginTimer)
          this.loginTimer = null;
        }
      }
    },
    onReady() {
      this.mixShowPage = true;
    },
    onLoad(options) {
      this.options = options;
      this.count = 10;
      this.autoLoginOut();
    },
    onunload() {
      this.clearTimer();
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  @import "./H5.scss";

  .answer-result {
    // height: 80vh;

    .submit-suc {
      width: 750rpx;
      margin: 0 auto;
      display: block;
      // position: fixed;
      // top: 0;
      // left: 0;
      // height: 223rpx;
      // width: 252rpx;
      // margin-left: 50rpx;
    }

    .button-group {
      // position: fixed;
      // top: 650rpx;
      // left: 0;
      width: 100%;
      text-align: center;
    }

    .tips {
      color: $uni-main-color;
      font-size: 40rpx;
      opacity: 0.8;
      padding: 50rpx 0 90rpx 0;
      font-weight: bold;
    }

    .btn {
      width: 380rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background: #f3f3f3;
      margin: 0 auto;

    }

    .btn-primary {
      background: $uni-main-color;
      margin-bottom: 44rpx;
    }
  }
</style>