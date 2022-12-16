<template>
  <view>
    <template v-if="showLoading">
      <view class="loading-view flex-c-c">
        <loading-view></loading-view>
      </view>
    </template>
    <template v-else>
      <view :class="isEmpty?'bg_fff':'bg_f7'">
        <view class="reserve-time">
          <page-nav :isFull="false">
            <template slot="title"> 选择时段 </template>
          </page-nav>
          <template v-if="!isEmpty">
            <view class="reserve-time-area">
              <dateSelect @changeDate="changeSelectDate" :allDate="timeAllData"></dateSelect>
              <timeSelect ref="timeSelect" @selectedTime="(e)=>{selectTimeItem = e}" :timeData="timeData"></timeSelect>
            </view>
            <view class="bottom-area-true-height"></view>
            <view class="bottom-area flex-c-c flex-col">
              <view class="selected-tips">{{formatDateStr}}</view>
              <view class="confirm flex-c-c" @click="confirmTime">
                确认
              </view>
            </view>
          </template>
          <view class="absolute empty" v-else>
            <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
            <view class="C_B2 font-32">暂无可选时段哦~</view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
  import dateSelect from "./cps/date-select.vue";
  import timeSelect from "./cps/time-select.vue"
  import dateUtil from "@/common/support/utils/date-util"
  import uitls from "@/common/support/utils.js"
  import LoadingView from '@/components/css3/loading/loading.vue';


  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      dateSelect,
      timeSelect,
      LoadingView
    },
    data() {
      return {
        emptyIcon: "/list-empty.png",
        isEmpty: false,
        showLoading: true,
        selectedDate: "",
        selectedTime: {},
        selectTimeItem: {
          beginTime:"",
          endTime:"",
          existAppointment:"",
          existExpired:"",
          scheduleId:""
        },
        timeData: {},
        timeAllData: [],
        formatDateStr:''
      };
    },
    onLoad(options) {
      this.options = options
      this.loadData()
    },
    computed:{
    },
    onReady() {

    },
    methods: {
      loadData() {
        // console.log('当天：', dateUtil.getDate(null, 0), "第三十天：", dateUtil.getDate(null, 30))
        let startDateObj = dateUtil.getDate(null, 0) || {}
        let endDateObj = dateUtil.getDate(null, 30) || {}
        let startDate = startDateObj.year + '-' + startDateObj.date
        let endDate = endDateObj.year + '-' + endDateObj.date
        this.getConsultantScheduleList(startDate, endDate).then(res => {
          let data = res || [];
          if (data.length > 0) {
            let dateGroup = []
            data.forEach((item, i) => {
              let consultantScheduleInfos = item.consultantScheduleInfos || [];
              let noExistExpired = false;
              consultantScheduleInfos.forEach(scheduleInfo => {
                // 检查是否有未过期的时间
                scheduleInfo.noExistExpired = !!scheduleInfo.scheduleInfos.find(scheduleItem => {
                  return !scheduleItem.existExpired
                })
                // 检查是否全部约满
                scheduleInfo.existAppointment = !scheduleInfo.scheduleInfos.find(scheduleItem => {
                  return !(scheduleItem.existAppointment || scheduleItem.existExpired)
                })
                !!scheduleInfo.noExistExpired && (noExistExpired = true)
              })
              this.timeData = {
                loading: false,
                timeData: consultantScheduleInfos
              }
              if (noExistExpired) {
                dateGroup.push({
                  date: item.scheduleDay.slice(5, 10),
                  year: item.scheduleDay.slice(0, 4),
                  week: dateUtil.weekDay(item.scheduleDay),
                  timeData: consultantScheduleInfos,
                  noExistExpired
                })
              }
            })
            this.timeAllData = dateGroup;
          } else {
            this.isEmpty = true
          }
        })
      },
      changeSelectDate(e) {
        if (e === undefined) return
        let timeAllData = this.timeAllData;
        let filterTimeData = timeAllData.filter(item => {
          return item.date == e.date
        })
        this.timeData = {
          refreshData: false,
          timeData: filterTimeData[0]?.timeData || []
        };
        let ref = "timeSelect"
        // 
        this.$refs[ref].initSelected()
        this.selectedDate = e.year + '-' + e.date
      },
      getConsultantScheduleList(startDate, endDate) {
        this.showLoading = true;
        return this.$Http(this.$Apis.getConsultantScheduleById, {
          data: {
            id: this.options.id,
            startDate,
            endDate
          }
        }).then(res => {
          if (res.code) {
            return res.data
          } else {
            return Promise.reject()
          }
        }).finally(() => {
          this.showLoading = false;
        })
      },
      replaceMonthStr(str) {
        const strAry = str.split('');
        strAry[4] = "年";
        strAry[7] = "月";
        strAry[11] = "日";
        return strAry.join('');
      },
      confirmTime() {
        let selectTimeItem = this.selectTimeItem;
        if(!selectTimeItem.beginTime || !selectTimeItem.endTime){
          app.SMH.showToast({
            title:"请先选择时间段噢~"
          })
          return
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        let dateTime = undefined;
        if (this.selectTimeItem?.scheduleId != undefined) {
          dateTime = {
            fullTime: this.replaceMonthStr(this.selectedDate) + " " + selectTimeItem.beginTime + "-" +
              selectTimeItem.endTime,
            id: selectTimeItem.scheduleId
          }
          // #ifdef H5
          prevPage.$vm.selectDateTime = dateTime;
          // #endif
          // #ifdef MP-WEIXIN
          prevPage.setData({
            selectDateTime: dateTime
          });
          // #endif
          uni.navigateBack({ //返回
            delta: 1
          })
        } else {
          app.SMH.showToast({
            title: "请选择预约时段"
          })
        }
      }
    },
    watch:{
      selectTimeItem:{
        handler(nV){
          let formatDateStr = ""
          let selectedDate = this.selectedDate;
          if(nV.beginTime && nV.endTime){
              formatDateStr = "已选择" + this.replaceMonthStr(selectedDate) + " " + nV.beginTime + "-" + nV.endTime
          }else{
            if(selectedDate){
              formatDateStr = "已选择" + this.replaceMonthStr(selectedDate)
            }else{
              formatDateStr = "请选择"
            }
          }
          this.formatDateStr = formatDateStr
        }
      }
      //  let selectTimeItem = this.selectTimeItem;
      
      //   return this.replaceMonthStr(selectedDate) + " " + selectTimeItem.beginTime + "-" + selectTimeItem.endTime
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .loading-view {
    height: 100vh;
    width: 100%;
  }

  .reserve-time {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 30rpx 24rpx;
  }

  // 暂无数据
  .empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .empty-icon {
      width: 254rpx;
      height: 254rpx;
      margin-bottom: 47rpx;
    }
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
      width: 652rpx;
      height: 80rpx;
      border-radius: 44rpx;
      background: $uni-main-color;
      font-size: 28rpx;
      color: #FFFFFF;
    }
    .selected-tips{
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #222222;
      line-height: 40rpx;
      
    }
  }
</style>