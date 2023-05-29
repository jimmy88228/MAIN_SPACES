<template>
  <view class="date-select">
    <scroll-view :enhanced="true" :show-scrollbar="false" :scroll-into-view="dateXScroll" scroll-with-animation class="date-select-list-scroll" :scroll-x="true"
      :refresh='false'>
      <view :id="'dateX'+i" class="date-item" v-for="(item,i) in dateList" :key="i" :data-item="item" :data-index="i" @click="selectDate">
        <view class="date-num font-24">{{item.date}}</view>
        <view :class="['date-week','font-20',i == selectIndex && 'date-item-act']">{{item.week}}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import dateUtil from "@/common/support/utils/date-util"
  const pageOption = Page.BaseComp({
    props:{
      serviceTime:{
        type:String,
        default:""
      },
      timeAllData:{
        type:Array,
        default:[]
      }
    },
    data() {
      return {
        dateList: [ ],
        selectIndex: 0,
        dateXScroll: '',
      }
    },
    mounted(){
      this.init()
    },
    methods: {
      init() {
        // let initDate = dateUtil.getFollowUpDate(30);
        if(!this.serviceTime) return
        this.selectIndex = 0;
        this.dateXScroll = '';
        let initDate = this.timeAllData || [];
        let newDate = new Date(this.serviceTime);
        let today = dateUtil.getDate(newDate, 0)
        let tomorrow = dateUtil.getDate(newDate, 1)
        initDate.forEach(item => {
          if (item.date == today.date) {
            item.week = '今日'
          } else if (item.date == tomorrow.date) {
            item.week = '明日'
          }
        })
        this.dateList = initDate
        this.$emit("selectDate",initDate[0] || {})
      },
      selectDate({
        currentTarget
      }) {
        let selectIndex = currentTarget.dataset.index;
        let item = currentTarget.dataset.item;
        this.dateXScroll = 'dateX' + selectIndex;
        this.selectIndex = selectIndex
        this.$emit("selectDate",item)
      }
    },
    watch:{
      timeAllData:{
        handler(){
          this.init()
        }
      },
      serviceTime:{
        handler(){
          this.init()
        }
      }
    }
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
        padding-bottom: 16rpx;
      }
    }
  }
</style>