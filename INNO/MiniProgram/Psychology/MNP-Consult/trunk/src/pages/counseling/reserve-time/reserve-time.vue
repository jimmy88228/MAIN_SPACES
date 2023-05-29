<template>
  <view :class="[!isEmpty ? 'bg_f7' : 'bg_fff','flex-col-1','reserve-time']">
    <view>
      <page-nav :isFull="true">
        <template slot="title"> 坐班表 </template>
      </page-nav>
    </view>
    <view class="reserve-time-info flex-col-1">
      <view class="flex-col-1" style="overflow-y:hidden;">
        <view v-if="!isEmpty" class="flex-col-1" style="overflow-y:hidden">
          <view class="reserve-time-area flex-col-1" v-show="!showEdit">
            <dateSelect @changeDate="changeDate"></dateSelect>
            <timeSelect :time-group="truthTimeGroup" class="flex-col-1" style="overflow-y:hidden"></timeSelect>
            <view class="edit-time C_7f flex-c-c" @click="editSchedule">编辑坐班表</view>
          </view>
          <template v-if="showEdit">
            <editTimeSelect :time-group="truthTimeGroup" :date="selectedDate.date+' '+selectedDate.week"
              class="flex-col-1" style="overflow-y:hidden" @cancel="cancelEditSchedule" @save="saveSchedule">
            </editTimeSelect>
          </template>
        </view>
        <view class="absolute empty" v-else>
          <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
          <view class="C_B2 font-32">暂无可以咨询的时间噢~</view>
        </view>
      </view>
    </view>
    <view class="bottom-area flex-e-c">
      <view class="confirm flex-c-c" @click="jumpAction('/pages/counseling/edit-reserve-time/edit-reserve-time')">
        配置时段
      </view>
    </view>
  </view>
</template>

<script>
  import dateSelect from "./cps/date-select.vue"
  import timeSelect from "./cps/time-select.vue"
  import editTimeSelect from "./cps/edit-time-select.vue"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      dateSelect,
      timeSelect,
      editTimeSelect
    },
    data() {
      return {
        moreIcon: '/more.png',
        isEmpty: false,
        showEdit: false,
        templateTimeGroup: [],
        getTemplateTime: "",
        truthTimeGroup: [],
        serviceTime:"",
        selectedDate: {
          year: "",
          date: "",
          week: ""
        }
      };
    },
    onShow() {
      this.getTemplateTimeGroup();
      if (this.selectedDate.date && this.selectedDate.year) {
        let searchDate = this.selectedDate.year + '-' + this.selectedDate.date
        this.getConsultantSchedule(searchDate, searchDate)
      }
    },
    methods: {
      getTemplateTimeGroup() {
        let getTemplateTime = this.getTemplateTime;
        if (!getTemplateTime) {
          this.getTemplateTime = this.$Http(this.$Apis.getTemplateTimeGroup).then(res => {
            if (res.code) {
              this.templateTimeGroup = res.data
              return res.data
            }
          })
        } else {
          return getTemplateTime
        }

      },
      // 初始化时间段数据
      getConsultantSchedule(startDate, endDate) {
        return this.$Http(this.$Apis.getConsultantScheduleById, {
          data: {
            startDate,
            endDate,
          },
          orther: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code) {
            console.log(res.data, "res.data1232131232141")
            let data = res.data || [];
            let templateTimeGroup = JSON.parse(JSON.stringify(this.templateTimeGroup)) || []
            if (data.length > 0) {
              let consultantScheduleInfos = data[0].consultantScheduleInfos
              templateTimeGroup.forEach(templateGroup => {

                consultantScheduleInfos.forEach(scheduleInfoGroup => {

                  if (templateGroup.timeGroup == scheduleInfoGroup.timeGroup) {

                    scheduleInfoGroup.scheduleInfos.forEach(scheduleInfoItem => {

                      templateGroup.timeGroupDetails.forEach(templateItem => {

                        if (scheduleInfoItem.beginTime == templateItem.beginTime &&
                          scheduleInfoItem.endTime == templateItem.endTime) {
                          // 排班id
                          templateItem.scheduleId = scheduleInfoItem.scheduleId
                          // 是否有预约记录existAppointment
                          templateItem.existAppointment = scheduleInfoItem.existAppointment
                        }
                      })
                    })
                  }
                })

              })
            }
            this.truthTimeGroup = templateTimeGroup
          }
        })
      },
      changeDate(e) {
        console.log(e, "123")
        this.selectedDate = e;
        this.getTemplateTimeGroup().then(() => {
          let searchDate = e.year + '-' + e.date
          this.getConsultantSchedule(searchDate, searchDate)
        })
      },
      editSchedule() {
        this.showEdit = true
      },
      cancelEditSchedule() {
        this.showEdit = false
      },
      saveSchedule(e) {
        this.showEdit = false;
        let selectedDate = this.selectedDate;
        let editDate = selectedDate.year + '-' + selectedDate.date
        return this.$Http(this.$Apis.updateOneDaySchedule, {
          data: {
            ...e,
            scheduleDay:editDate
          },
          orther: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code) {
            if (selectedDate.date && selectedDate.year) {
              this.getConsultantSchedule(editDate, editDate)
            }
          }
        })
      },
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .reserve-time {
    height: 100vh;
    overflow-y: hidden;
  }

  .reserve-time-info {
    box-sizing: border-box;
    padding: 30rpx 24rpx;
    overflow-y: hidden;
  }

  .reserve-time-area {
    overflow-y: hidden;
    width: 100%;
    padding-bottom: 47rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
  }

  .bottom-area {
    width: 100%;
    height: 130rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #FFFFFF;
    box-shadow: 0rpx -16rpx 20rpx 0rpx rgba($color: #000000, $alpha: 0.02);

    .confirm {
      margin-right: 24rpx;
      width: 333rpx;
      height: 100rpx;
      background: $uni-main-color;
      border-radius: 10rpx;
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }

  .edit-time {
    margin: 20rpx auto 0;
    width: 620rpx;
    height: 88rpx;
    background: #FFFFFF;
    border-radius: 10rpx;
    border: 1px solid #979797;
  }
</style>