<template>
  <view class="time-select">
    <view class="flex" v-for="(item,i) in timeList" :key="i">
      <view class="flex-col-1 flex-c-c">
        <view class="font-24">{{item.moment}}</view>
        <view class="font-20 C_B1 m-t-15" v-if="item.isFull">已约满</view>
      </view>
      <view class="time-select-group" :style="i == timeList.length-1 && 'border-bottom:none;padding-bottom:0'">
        <view
          :class="['time-select-item','flex-col', 'flex','flex-c-c',timeItem.isFull && 'time-full']"
          v-for="(timeItem,timeIndex) in item.timeList" :key="timeIndex">
          <view>{{timeItem.startTime}}</view>
          <view>-</view>
          <view>{{timeItem.endTime}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  const pageOption = Page.BaseComp({
    data() {
      return {
        moreIcon: '/more.png',
         timeList: [{
            moment: '上午',
            isFull: true,
            timeList: [{
                startTime: '07:00',
                endTime: '07:50',
                isFull: true
              },
              {
                startTime: '08:00',
                endTime: '08:50',
                isFull: true
              },
              {
                startTime: '09:00',
                endTime: '09:50',
                isFull: true
              },
              {
                startTime: '10:00',
                endTime: '10:50',
                isFull: true
              },
              {
                startTime: '11:00',
                endTime: '11:50',
                isFull: true
              },
              {
                startTime: '12:00',
                endTime: '12:50',
                isFull: true
              }
            ]
          },
          {
            moment: '下午',
            isFull: false,
            timeList: [{
                startTime: '14:00',
                endTime: '14:50',
                isFull: true
              },
              {
                startTime: '15:00',
                endTime: '15:50',
                isFull: false
              },
              {
                startTime: '16:00',
                endTime: '16:50',
                isFull: false
              },
              {
                startTime: '17:00',
                endTime: '17:50',
                isFull: true
              },
              {
                startTime: '18:00',
                endTime: '18:50',
                isFull: false
              },
              {
                startTime: '19:00',
                endTime: '19:50',
                isFull: true
              }
            ]
          },
          {
            moment: '晚上',
            isFull: false,
            timeList: [{
                startTime: '20:00',
                endTime: '20:50',
                isFull: true
              },
              {
                startTime: '21:00',
                endTime: '21:50',
                isFull: false
              },
              {
                startTime: '22:00',
                endTime: '22:50',
                isFull: false,
              },
              {
                startTime: '23:00',
                endTime: '23:50',
                isFull: true
              }
            ]
          },
        ]
      }
    },
    methods: {

    },
  })
  export default pageOption
</script>

<style lang="scss" scoped>
.time-select {
    width: 100%;
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