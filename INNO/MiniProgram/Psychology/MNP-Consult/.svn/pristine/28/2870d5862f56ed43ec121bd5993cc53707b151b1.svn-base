<template>
  <view class="time-select">
    <template v-for="(item,i) in timeHasData">
      <view class="flex" v-if="item.scheduleInfos.length>0" :key="i">
        <view class="flex-col-1 flex-c-c">
          <view class="font-24">{{item.timeGroup}}</view>
          <view class="font-20 C_B1 m-t-15" v-if="item.existAppointment">已约满</view>
        </view>
        <view class="time-select-group" :style="i == timeList.length-1 && 'border-bottom:none;padding-bottom:0'">
          <view :class="['time-select-item','flex-col', 'flex','flex-c-c',timeItem.existAppointment && 'time-full']"
            v-for="(timeItem,timeIndex) in item.scheduleInfos" :key="timeIndex">
            <view>{{timeItem.beginTime}}</view>
            <view>-</view>
            <view>{{timeItem.endTime}}</view>
            <view class="time-full-tips" v-if="timeItem.existAppointment">约满</view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
  const pageOption = Page.BaseComp({
    props: {
      templateTimeGroup: {
        type: Array,
        default: []
      },
      timeData: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        moreIcon: '/more.png',
        timeList: [],
        timeHasData: []
      }
    },
    methods: {

    },
    watch: {
      templateTimeGroup: {
        handler(nV) {
          console.log(nV, "预览模板")
          this.timeList = nV
        }
      },
      timeData: {
        handler(nV) {
          console.log(nV, "预览所选时间段")
          this.timeHasData = nV
        }
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .time-select {
    width: 100%;
    height: 100%;
    padding: 26rpx;
    box-sizing: border-box;

    .time-select-group {
      width: 490rpx;
      padding-bottom: 12rpx;
      padding-top: 25rpx;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      border-bottom: 2rpx solid rgba($color: #979797, $alpha: 0.2);

      .time-select-item {
        width: 116rpx;
        height: 122rpx;
        border-radius: 33rpx;
        font-size: 21rpx;
        font-weight: bold;
        box-sizing: border-box;
        border: 1px solid #333333;
        margin-right: 8rpx;
        margin-bottom: 14rpx;
        position: relative;

        .time-full-tips {
          position: absolute;
          left: 0;
          text-align: center;
          font-size: 18rpx;
          top: -14rpx;
          width: 48rpx;
          height: 27rpx;
          background: #F7F7F7;
          border-radius: 6rpx;
          border: 2rpx solid #D4D4D4;
        }
      }

      .time-full {
        // background: rgba($color: #F7F7F7, $alpha: 0.4);
        color: rgba($color: #222222, $alpha: 0.4);
        border: 2rpx solid rgba($color: #333333, $alpha: 0.4);
      }

      .time-select-item:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
</style>