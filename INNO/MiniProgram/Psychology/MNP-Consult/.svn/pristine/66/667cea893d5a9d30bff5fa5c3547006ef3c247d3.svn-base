<template>
  <view class="date-select">
    <scroll-view :enhanced="true" :scroll-into-view="dateXScroll" :show-scrollbar="false" scroll-with-animation class="date-select-list-scroll" :scroll-x="true"
      :refresh='false'>
      <view :id="'dateX'+i" class="date-item" v-for="(item,i) in dateList" :key="i" :data-index="i" @click="selectDate">
        <view class="date-num font-24">{{item.date}}</view>
        <view :class="['date-week','font-20',i == selectIndex && 'date-item-act']">{{item.week}}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import dateUtil from "@/common/support/utils/date-util"
  const pageOption = Page.BaseComp({
    data() {
      return {
        dateList: [ ],
        selectIndex: 0,
        dateXScroll: '',
        serviceTime:""
      }
    },
    mounted(){
      dateUtil.getServiceTime().then(res=>{
        this.serviceTime = res
        this.init()
      })
    },
    methods: {
      init() {
        let serviceTime = this.serviceTime;
        console.log(serviceTime,"serviceTime")
        let newDate = new Date(serviceTime);
        let thirtyDate = dateUtil.getFollowUpDate(serviceTime,30);
        console.log(thirtyDate,"thirtyDate")
        let today = dateUtil.getDate(newDate, 0)
        let tomorrow = dateUtil.getDate(newDate, 1)
        thirtyDate.forEach(item => {
          if (item.date == today.date) {
            item.week = '今日'
          } else if (item.date == tomorrow.date) {
            item.week = '明日'
          }
        })
        this.dateList = thirtyDate
        this.$emit("changeDate",this.dateList[this.selectIndex])
      },
      selectDate({
        currentTarget
      }) {
        console.log(currentTarget.dataset.index, "index")
        let selectIndex = currentTarget.dataset.index;
        this.dateXScroll = 'dateX' + selectIndex;
        this.selectIndex = selectIndex
        this.$emit("changeDate",this.dateList[selectIndex])
      }
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
      height: 100%;
      white-space: nowrap;

      .date-item {
        display: inline-block;
        // padding: 23rpx 0rpx;
        padding-top: 23rpx;
        height: 100%;
        box-sizing: border-box;
        padding: 23rpx 30rpx 0;
        text-align: center;

        .date-num {
          line-height: 40rpx;
        }
      }

      .date-item-act {
        border-bottom: 4rpx solid $uni-main-color;
        padding-bottom: 14rpx;
      }
    }
  }
</style>