<template>
  <frame-box>
    <template v-slot:body>
      <view class="answer-result flex-col flex-c-c">
        <page-nav :isTransparent="true"></page-nav>
        <image class="submit-suc" :src="staticAddress+'/answer-result-bg.png'" mode="scaleToFill" />
        <view class="button-group">
          <view class="tips">感谢你参与本次评测</view>

          <!-- #ifdef MP -->
          <button v-if="options.recordId && options.recordId !=0" class="btn btn-primary flex-c-c C_fff"
            @click="getResult">查看测评报告</button>
          <button class="btn flex-c-c C_7f" @click="reLaunchAction" data-url="/pages/index/index">
            前往首页
          </button>

          <!-- #endif -->

          <!-- #ifdef H5 -->
          <button class="btn flex-c-c" @click="logout" data-url="/pages/index/index">
            退出登录
          </button>
          <!-- #endif -->
        </view>
      </view>
    </template>
  </frame-box>
</template>

<script>
  import UniApi from "../../../../common/support/tools/uni-api-promise";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {},
    data() {
      return {
        options: {}
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    methods: {
      logout() {
        app.LM.logout();
        app.LM.logout("bsnUserToken");
        uni.reLaunch({
          url: `/pages/startup/startup?id=${app.PM.getParams("initId") || 0}`,
        });
      },
      getResult() {
        UniApi.reLaunch({
          url: `/pages/report-info/report-info?recordId=${this.options.recordId}`,
        });
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import "./H5.scss";

  .answer-result {
    height: 80vh;

    .submit-suc {
      width: 100%;
      height: 650rpx;
      position: fixed;
      top: 0;
      left: 0;
      // margin-left: 50rpx;
    }

    .tips {
      color: #171717;
      font-size: 40rpx;
      opacity: 0.8;
      padding: 50rpx 0 90rpx 0;
      font-weight: bold;
    }

    .button-group {
      position: fixed;
      top: 650rpx;
      left: 0;
      width: 100%;
      text-align: center;
    }

    .btn {
      width: 380rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background: #f3f3f3;
      margin:0 auto;
    }

    .btn-primary {
      background: $uni-main-color;
      margin-bottom: 44rpx;
    }
  }
</style>