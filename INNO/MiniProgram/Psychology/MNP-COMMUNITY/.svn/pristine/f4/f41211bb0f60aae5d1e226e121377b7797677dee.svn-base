<template>
  <frame-box>
    <template v-slot:body>
      <view class="answer-result flex-col flex-c-c">
        <page-nav :isTransparent="true"></page-nav>
        <image class="submit-suc" :src="staticAddress+'/answer-result-bg.png'" mode="scaleToFill" />
        <view class="button-group">
          <view class="tips">提交成功啦，请耐心等待</view>
          <view class="tips-small">我们会尽快与你联系</view>
          <button class="btn btn-primary flex-c-c C_fff" @click="getResult">我的预约</button>
          <button class="btn flex-c-c C_7f" @click="reLaunchAction" data-url="/pages/index/index">
            返回首页
          </button>
        </view>
      </view>
    </template>
  </frame-box>
</template>

<script>
  import UniApi from "@/common/support/tools/uni-api-promise";

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
        this.redirectAction("/pages/psychology/my-reserve/my-reserve")
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
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
      padding: 50rpx 0 31rpx 0;
      font-weight: bold;
    }

    .tips-small {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #171717;
      line-height: 40rpx;
      padding-bottom: 94rpx;
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
      margin: 0 auto;
    }

    .btn-primary {
      background: $uni-main-color;
      margin-bottom: 44rpx;
    }
  }
</style>