<template>
  <view>
    <oriPopup ref="popup" @touchmove.stop.prevent="disabledScroll" :isMaskClick="false" type="bottom"
      :safe-area="false">
      <template v-slot:content>
        <view class="record-content">
          <view class="record-tips flex-c-c">你有未答完的题目，是否继续？</view>
          <view class="flex-c-c p-b-38">
            <view class="flex-c-c btn btn-restart m-r-15" @click="restart">重新开始</view>
            <view class="flex-c-c btn btn-continue" @click="next">继续</view>
          </view>
        </view>
      </template>
    </oriPopup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";

  const pageOption = Page.BasePage({
    components: {
      oriPopup
    },
    data() {
      return {};
    },
    methods: {
      showBench() {
        let ref = "popup";
        this.$refs[ref].show();
        this.$emit("showBench")
      },
      hideBench() {
        let ref = "popup";
        this.$refs[ref].dismiss();
        this.$emit("closeBench")
      },
      restart(){
        this.$emit("restart")
      },
      next(){
        this.$emit("next")
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .record-content {
    background: #FFFFFF;
    border-radius: 50rpx 50rpx 0px 0px;
  }

  .record-tips {
    height: 310rpx;
    width: 100%;
    font-size: 36rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 44rpx;
  }

  .btn {
    width: 318rpx;
    height: 110rpx;
    border-radius: 10rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    line-height: 44px;
    border-radius: 10rpx;
    font-size: 32rpx;
    font-weight: 400;
  }

  .btn-restart {
    background: #FAFAFA;
    color: #B1B4B1;
  }

  .btn-continue {
    background: #F4FDEE;
    color: #21B014;
  }
</style>