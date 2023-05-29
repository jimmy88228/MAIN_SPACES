<template>
  <view class="punch-tips">
    <oriPopup ref="oriPopup" type="center">
      <template v-slot:content>
        <view class="popup-content flex-c-c flex-col">
          <view class="right-icon"></view>
          <view class="tips-title">签到成功 感谢你的参与</view>
          <view class="confirm flex-c-c" @click="close">确认</view>
        </view>
      </template>
    </oriPopup>
  </view>
</template>

<script>
  import oriPopup from '@/components/ori-comps/popup/ori-popup'
  const pageOption = Page.BasePage({
    name: "punch-tips",
    components: {
      oriPopup
    },
    props: {

    },
    data() {
      return {
        finishIcon: "/finish_stage.png",
        infoData: {}
      };
    },
    methods: {
      show() {
        this.$refs.oriPopup.show()
      },
      close() {
        this.$refs.oriPopup.dismiss()
      },
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .popup-content {
    width: 556rpx;
    height: 457rpx;
    background: #FFFFFF;
    border-radius: 34rpx;
  }
  .right-icon{
    width: 45rpx;
    height: 20rpx;
    border-left: 8rpx solid #000000;
    border-bottom: 8rpx solid #000000;
    transform: rotate(-45deg);
    margin-bottom: 51rpx;
  }
  .tips-title{
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 45rpx;
    margin-bottom:71rpx
  }
  .confirm{
    width: 221rpx;
    height: 90rpx;
    background: #14AC05;
    border-radius: 17rpx;
    border: 1rpx solid #979797;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 40rpx;
  }
</style>