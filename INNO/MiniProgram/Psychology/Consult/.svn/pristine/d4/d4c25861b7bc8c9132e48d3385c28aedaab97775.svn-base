<template>
  <view class="date-select">
    <oriScrollView class="date-select-list-scroll" :scroll-y="false" :refresh='false'>
      <view :class="['date-item',i == 0 && 'date-item-act']" v-for="(item,i) in dateList" :key="i">
        <view class="date-num font-24">{{item.date}}</view>
        <view class="date-week font-20">{{item.week}}</view>
      </view>
    </oriScrollView>
  </view>
</template>

<script>
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
  const pageOption = Page.BaseComp({
    data() {
      return {
         dateList: [{
            date: '02-16',
            week: '今日'
          },
          {
            date: '02-17',
            week: '明日'
          },
          {
            date: '02-18',
            week: '周一'
          },
          {
            date: '02-19',
            week: '周二'
          },
          {
            date: '02-20',
            week: '周三'
          },
          {
            date: '02-21',
            week: '周四'
          },
          {
            date: '02-22',
            week: '周五'
          },
        ],
      }
    },
    components: {
      oriScrollView,
    },
    methods: {

    },
  })
  export default pageOption
</script>

<style lang="scss" scoped>
 .date-select {
    width: 100%;
    height: 110rpx;
    position: relative;
    box-shadow: 0rpx 16rpx 20rpx 0rpx rgba($color: #000000, $alpha: 0.02);

    .date-select-list-scroll {
      // overflow: hidden;
      white-space: nowrap;

      .date-item {
        display: inline-block;
        // padding: 23rpx 0rpx;
        padding-top: 23rpx;
        height: 100%;
        box-sizing: border-box;
        margin-left: 45rpx;
        text-align: center;

        .date-num {
          line-height: 40rpx;
        }
      }

      .date-item:last-child {
        margin-right: 45rpx;
      }

      .date-item-act {
        border-bottom: 4rpx solid $uni-main-color;
      }
    }

    .fold-date-select {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 154rpx;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #FFFFFF 55%, #FFFFFF 100%);
      border-radius: 0px 20rpx 0px 0px;
      overflow: hidden;

      .fold-date-icon {
        position: absolute;
        right: 0;
        top: 0;
        background: #FFFFFF;
        height: 100%;
        padding-right: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        image {
          width: 46rpx;
          height: 46rpx;
        }
      }
    }
  }
</style>