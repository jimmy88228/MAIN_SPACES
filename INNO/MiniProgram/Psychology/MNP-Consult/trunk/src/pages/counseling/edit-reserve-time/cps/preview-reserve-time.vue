<template>
  <view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" ref="popup" type="center" :is-mask-click="false"
      :safe-area="false">
      <template v-slot:content>
        <view :class="[!isEmpty ? 'bg_f7' : 'bg_fff','preview-out-view']">
          <view class="flex-b-c p-t-20 p-l-35 p-r-25">
            <view class="font-26 C_7f bold">预览</view>
            <view class="close-icon" @click="closePupup"></view>
          </view>
          <view class="reserve-time">
            <view class="reserve-time-area flex-col-1" v-if="!isEmpty">
              <dateSelect :serviceTime="serviceTime" @selectDate="selectDate" :time-all-data="timeAllData" ></dateSelect>
              <view class="flex-col-1" style="overflow: hidden;">
                <oriScrollView style="height:100%" :scroll-y="true" :refresh='false'>
                  <timeSelect :timeData="timeData"></timeSelect>
                </oriScrollView>
              </view>
            </view>
            <view class="absolute empty" v-else>
              <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
              <view class="C_B2 font-32">暂无可以咨询的时间噢~</view>
            </view>
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import dateSelect from "./date-select.vue"
  import timeSelect from "./time-select.vue"
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
  import oriPopup from "@/components/ori-comps/popup/ori-popup";

  const app = getApp();
  const pageOption = Page.BasePage({
    props:{
      serviceTime:{
        type:String,
        default:""
      },
      timeAllData:{
        type:Array,
        default:[]
      },
    },
    components: {
      dateSelect,
      timeSelect,
      oriPopup,
      oriScrollView
    },
    data() {
      return {
        moreIcon: '/more.png',
        isEmpty: false,
        timeData:[],
        selectedDate:''
      };
    },
    onReady() {

    },
    methods: {
      showTimePreview() {
        this.$refs.popup.show()
      },
      closePupup(){
        this.$refs.popup.dismiss()
      },
      selectDate(e){
        console.log(e,"选择回来的日期")
        // let timeAllData = this.timeAllData;
         if (e === undefined) return
        let timeAllData = this.timeAllData;
        let filterTimeData = timeAllData.filter(item => {
          return item.date == e.date
        })
        this.timeData = filterTimeData[0]?.timeData || []
        this.selectedDate = e.year + '-' + e.date;
        console.log(this.timeData,"timeData")
        console.log(this.selectedDate,"this.selectedDate")
      }
    },
    watch:{
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .preview-out-view {
    border-radius: 20rpx;
    margin-top: 124rpx;
  }

  .reserve-time {
    width: 700rpx;
    // min-height: 100vh;
    height: 1060rpx;
    box-sizing: border-box;
    padding: 30rpx 24rpx;
    border-radius: 20rpx;
  }

  .top-tips {

    .reserve-type {
      margin-right: 12rpx;
    }

    .begin-type {
      background: #E3FFE7;
      border-radius: 5rpx;
      opacity: 0.5;
      border: 1rpx solid #35AC47;
      font-size: 16rpx;
      color: $uni-main-color;
      padding: 0 5rpx;
      margin-right: 9rpx;
      box-sizing: border-box;
      line-height: 22rpx;
    }

    .pay-type {
      background: #E9E9E9;
      border-radius: 5rpx;
      opacity: 0.5;
      border: 1rpx solid #B2B2B2;
      font-size: 16rpx;
      color: #7F7F7F;
      padding: 0 5rpx;
      box-sizing: border-box;
      line-height: 22rpx;
    }
  }

  .close-icon {
    width: 56rpx;
    height: 56rpx;
    line-height: 52rpx;
    // border: 1px solid #025299;
    background-color: transparent;
    position: relative;
  }

  .close-icon::before,
  .close-icon::after {
    content: "";
    position: absolute;
    height: 28rpx;
    width: 4rpx;
    top: 16rpx;
    left: 26rpx;
    background: #7F7F7F ;
  }

  .close-icon::before {
    transform: rotate(45deg);
  }

  .close-icon::after {
    transform: rotate(-45deg);
  }

  .reserve-time-area {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 20rpx;
  }
</style>