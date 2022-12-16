<template>
  <view :class="!isEmpty ? 'bg_f7' : 'bg_fff'">
    <view class="reserve-time">
      <page-nav :isFull="false">
        <template slot="title"> 配置时段 </template>
      </page-nav>
      <view v-if="!isEmpty">
        <editDateSelect :time-all-data="timeAllData" :selectedTime="selectedTime"
          :templateTimeGroup="templateTimeGroup" :groupByMonthList="groupByMonthList" :dateList="dateList"
          @dateSelected="dateSelected" @saveEditTime="saveEditTime" >
        </editDateSelect>
      </view>
      <view class="absolute empty" v-else>
        <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
        <view class="C_B2 font-32">暂无可以咨询的时间噢~</view>
      </view>
    </view>
  </view>
</template>

<script>
  import editDateSelect from "./cps/edit-date-select.vue"
  import dateUtil from "@/common/support/utils/date-util"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      editDateSelect
    },
    data() {
      return {
        moreIcon: '/more.png',
        isEmpty: false,
        timeAllData:[],
        // 选择时间模板
        templateTimeGroup: [],
        // 选择时间模板 一维数组
        odTemplateTimeGroup: [],
        getTemplateTime: "",
        // 按照月份分类日期
        groupByMonthList: {},
        dateList: [],
        selectedTime: {
          scheduleDay: [],
          templateId: []
        }
      };
    },
    onShow() {
      this.getTemplateTimeGroup().then(() => {
        this.init()
      })
    },
    methods: {
      // 初始化日期选择
      init() {
        let thirtyDate = dateUtil.getFollowUpDate(30);

        // 获取30天所排版的日期
        this.getConsultantSchedule().then(schedRes => {
          console.log(schedRes.schedRes, "获取30天排版的日期")

          let data = schedRes.res
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

            let formatCon = consultantScheduleInfos.reduce((total,item,i)=>{
              item.scheduleInfos.forEach(conItem=>{
                total.push({...conItem,timeGroup:item.timeGroup})
              })
              return total
            },[])

            dateGroup.push({
              date: item.scheduleDay.slice(5, 10),
              year: item.scheduleDay.slice(0, 4),
              week: dateUtil.weekDay(item.scheduleDay),
              timeData: consultantScheduleInfos,
              formatCon
            })

            thirtyDate.find((thirtyDateItem,thirtyDateI)=>{
              if(thirtyDateItem.date == item.scheduleDay.slice(5, 10)){
                thirtyDate[thirtyDateI].setTime = true
              }
              return thirtyDateItem.date == item.scheduleDay.slice(5, 10)
            })
          })
          
          this.dateList = thirtyDate

          this.timeAllData = dateGroup;
        })
      },
      // 获取时间模板
      getTemplateTimeGroup() {
        let getTemplateTime = this.getTemplateTime;
        if (getTemplateTime) return getTemplateTime
        return this.getTemplateTime = this.$Http(this.$Apis.getTemplateTimeGroup).then(res => {
          if (res.code) {
            this.templateTimeGroup = res.data
            let arr = res.data.reduce((total, item, i) => {
              let obj = {}
              item.timeGroupDetails.forEach(tempItem => {
                obj = {
                  timeGroup: item.timeGroup,
                  ...tempItem
                }
                total.push(obj)
              })
              return total
            }, [])
            this.odTemplateTimeGroup = arr
            return res.data
          }
        })

      },
      getConsultantSchedule() {
        let startDateObj = dateUtil.getDate(null, 0) || {}
        let endDateObj = dateUtil.getDate(null, 29) || {}
        let startDate = startDateObj.year + '-' + startDateObj.date
        let endDate = endDateObj.year + '-' + endDateObj.date
        return this.getConsultantScheduleList(startDate, endDate).then(res => {
          let formatData = res.reduce((total, item, index) => {
            total[item.scheduleDay] = item.consultantScheduleInfos
            return total
          }, {})
          return {
            formatData,
            res
          }
        })
      },
      getConsultantScheduleList(startDate, endDate) {
        this.showLoading = true;
        return this.$Http(this.$Apis.getConsultantScheduleById, {
          data: {
            startDate,
            endDate
          }
        }).then(res => {
          if (res.code) {
            return res.data
          } else {
            return Promise.reject()
          }
        })
      },
      saveEdit() {
        return this.$Http(this.$Apis.insertSchedule, {
          data: {
            ...this.selectedTime
          }
        }).then(res => {
          if (res.code) {
            return res.data
          }
        })
      },
      // 更改日期/时间选择触发
      dateSelected(e,cb) {
        // console.log(e, "更改了日期或者时间")
        this.selectedTime = e;
        typeof (cb) == "function" && cb();
      },
      saveEditTime(e){
        this.dateSelected(e,()=>{
          // console.log(e,this,"选择了日期，选择了时间")
          this.saveEdit().then(()=>{
            app.SMH.showToast({
              title:"保存成功"
            })
            this.init()
          })
      })
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .reserve-time {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 30rpx 24rpx;
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
      width: 197rpx;
      height: 88rpx;
      border-radius: 10rpx;
      background: $uni-main-color;
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }
</style>