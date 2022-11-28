<template>
  <view :class="!isEmpty ? 'bg_f7' : 'bg_fff'">
    <view class="reserve-time">
      <page-nav :isFull="false">
        <template slot="title"> 坐班表 </template>
      </page-nav>
      <view v-if="!isEmpty">
        <view class="reserve-time-area">
          <dateSelect></dateSelect>
          <timeSelect></timeSelect>
        </view>
        <view class="bottom-area-true-height"></view>
        <view class="bottom-area flex-c-c">
          <view class="confirm flex-c-c">
            确认
          </view>
        </view>
      </view>
      <view class="absolute empty" v-else>
        <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
        <view class="C_B2 font-32">暂无可以咨询的时间噢~</view>
      </view>
    </view>
  </view>
</template>

<script>
  import dateSelect from "./cps/date-select.vue"
  import timeSelect from "./cps/time-select.vue"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      dateSelect,
      timeSelect
    },
    data() {
      return {
        moreIcon: '/more.png',
        isEmpty: false,
        selectedTime: {

        }
      };
    },
    onReady() {

    },
    methods: {

    },
    onShow() {},
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .reserve-time {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 30rpx 24rpx;
  }

  .reserve-time-area {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20rpx;
  }


  .bottom-area-true-height {
    height: 150rpx;
  }

  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 130rpx;
    background: #FFFFFF;
    box-shadow: 0rpx -16rpx 20rpx 0rpx rgba($color: #000000, $alpha: 0.02);

    .confirm {
      width: 680rpx;
      height: 100rpx;
      border-radius: 10rpx;
      background: $uni-main-color;
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }
</style>