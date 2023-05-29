<template>
  <view class="answer-result flex-col flex-c-c">
    <page-nav :isTransparent="true"></page-nav>
    <image class="submit-suc" :src="staticAddress+'/answer-result-bg.png'" mode="scaleToFill" />
    <view class="button-group">
      <view class="tips">提交成功啦，感谢你的参与</view>
      <button class="btn flex-c-c C_7f" @click="reLaunchAction" data-url="/pages/index/index">
        前往首页
      </button>
    </view>
  </view>
</template>

<script>
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
      margin: 0 auto;
    }

  }
</style>