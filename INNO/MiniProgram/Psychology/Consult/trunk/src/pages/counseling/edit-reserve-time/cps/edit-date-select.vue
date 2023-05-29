<template>
  <view>
    <view class="time-select-tips flex-b-c">
      <view class="">
        <view class="font-26 bold">选择日期</view>
        <view class="font-18 C_7f m-t-10">显示最近30天的档期</view>
      </view>
      <view class="flex" @click="selectAllFun">
        <view class="select-icon">
          <view class="select-switch" :class="{ selected: selectAll}"></view>
        </view>
        <view class="font-26">全选</view>
      </view>
    </view>
    <view class="reserve-time-area">
      <view class="time-select">
        <view v-for="(item,i) in groupByMonthList" :key="i">
          <view class="font-26 p-t-40">{{item.month}}月</view>
          <!-- <view class="flex"> -->
          <view class="time-select-group">
            <view
              :class="['time-select-item','flex-col', 'flex','flex-c-c',dateItem.isFull && 'time-full',dateselectedGroup.includes(dateItem.year + '-' + dateItem.date) && 'time-selected']"
              v-for="(dateItem,dateIndex) in item.dateList" :key="dateIndex" :data-item="dateItem" @click="selectDate">
              <view :class="[dateItem.setTime?'font-20 m-b-5':'font-24 m-b-10']">{{dateItem.date}}</view>
              <view class="font-20">{{dateItem.week}}</view>
              <view class="font-16 C_5ecf68 m-t-10" v-if="dateItem.setTime">已设时段</view>
              <view class="selected-icon" v-if="dateselectedGroup.includes(dateItem.year + '-' + dateItem.date)">
                <view class="select-switch selected"></view>
              </view>
            </view>
            <!-- </view> -->
          </view>
        </view>
      </view>
      <view class="button-area flex-b-c font-26">
        <view class="left-button flex-c-c" @click="preview">预览</view>
        <view :class="['right-button','flex-c-c',String(dateselectedGroup).trim().length == 0 && 'right-button-disabled']" @click="setTime">配置时段</view>
      </view>
    </view>
    <!-- setTime="(e)=>{timeSelectedGroup = e} -->
    <editTimeSelect @setTimeTemporary="saveEdit" :selectedTime="selectedTime"
      :template-time-group="templateTimeGroup" ref="editTimePopup"></editTimeSelect>
    <previewReserve :time-all-data="timeAllData" ref="previewPopup">
    </previewReserve>
  </view>
</template>

<script>
  import editTimeSelect from "./edit-time-select.vue"
  import previewReserve from "./preview-reserve-time.vue"
  import dateUtil from "@/common/support/utils/date-util"

  const app = getApp();
  const pageOption = Page.BaseComp({
    props: {
      timeAllData: {
        type: Array,
        default: []
      },
      selectedTime: {
        type: Object,
        default: {
          scheduleDay: [],
          templateId: []
        }
      },
      dateList: {
        type: Array,
        default: []
      },
      templateTimeGroup: {
        type: Array,
        default: []
      }
    },
    components: {
      editTimeSelect,
      previewReserve
    },
    data() {
      return {
        moreIcon: '/more.png',
        selectAll: false,
        // 批量选择时间
        timeSelectedGroup: [],
        // 批量选择日期
        dateselectedGroup: [],
        // selectedInfo: []
      }
    },
    computed:{
      groupByMonthList(){
        let dateList = this.dateList;
        let newDate = new Date();
        let today = dateUtil.getDate(newDate, 0)
        let tomorrow = dateUtil.getDate(newDate, 1)
        let groupByMonthList = {}
          dateList.forEach(item => {
          let month = new Date(item.year + '-' + item.date).getMonth() + 1
          if (item.date == today.date) {
            item.week = '今日'
          } else if (item.date == tomorrow.date) {
            item.week = '明日'
          }
          groupByMonthList[item.year + '-' + month] || (groupByMonthList[item.year + '-' + month] = {
            month,
            dateList: []
          })
          groupByMonthList[item.year + '-' + month].dateList.push(item)
        })

        return groupByMonthList
      }
    },
    mounted() {

    },
    methods: {
      saveEdit(e) {
        console.log(e, 12321321321)
        this.timeSelectedGroup = e
        this.$emit("saveEditTime", {
          templateId: this.timeSelectedGroup,
          scheduleDay: this.dateselectedGroup
        })
        this.timeSelectedGroup = [],
        this.dateselectedGroup = []
      },
      selectDate({
        currentTarget
      }) {
        console.log(currentTarget.dataset.item)
        let item = currentTarget.dataset.item || {};
        let year = item.year;
        let date = item.date;
        let fullDate = year + '-' + date;
        let dateselectedGroup = this.dateselectedGroup;
        let hasSelected = dateselectedGroup.includes(fullDate)
        if (!!hasSelected) {
          this.dateselectedGroup = dateselectedGroup.filter(item => {
            return item != fullDate
          })
          console.log(this.dateselectedGroup,"this.dateselectedGroup ")
          // this.selectedInfo = this.selectedInfo.filter(item => {
          //   return item.date != date
          // })
        } else {
            this.dateselectedGroup.push(fullDate)
            console.log(this.dateselectedGroup,"this.dateselectedGroup2")
          // this.selectedInfo.push(item)
        }
      },
      selectAllFun() {
        let selectAll = this.selectAll;
        if (selectAll) {
          this.dateselectedGroup = []
        }
        this.selectAll = !selectAll
      },
      setTime() {
        if(this.dateselectedGroup.length <= 0){
          app.SMH.showToast({
            title:"请先选择需要配置的日期噢~"
          })
          return
        }
        this.$refs.editTimePopup.showTimeEdit()
      },
      preview() {
        console.log(this.timeSelectedGroup, this.dateselectedGroup)
        this.$refs.previewPopup.showTimePreview()
      }
    },
    watch: {
      dateselectedGroup: {
        handler(nV) {
          if (nV.length == this.dateList.length) {
            this.selectAll = true
          } else {
            this.selectAll = false
          }
          this.$emit("dateSelected", {
            templateId: this.timeSelectedGroup,
            scheduleDay: this.dateselectedGroup
          })
        }
      },
      selectAll: {
        handler(nV) {
          if (nV) {
            let dateList = this.dateList;
            let dateselectedGroup = [];
            // let selectedInfo = []
            dateList.forEach(item => {
              dateselectedGroup.push(item.year + '-' + item.date)
              // selectedInfo.push(item)
            })
            this.dateselectedGroup = dateselectedGroup;
            // this.selectedInfo = selectedInfo;
          }
        },
        immediate: true
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .time-select-tips {
    margin-bottom: 20rpx;
    padding: 0 20rpx;

    .select-icon {
      padding: 5rpx 10rpx;

      .select-switch {
        width: 25rpx;
        height: 25rpx;
        background: #FFFFFF;
        border: 2rpx solid #979797;
        border-radius: 50%;
        position: relative;
      }

      .selected::after {
        content: "";
        display: block;
        position: absolute;
        top: 55%;
        left: 40%;
        width: 30%;
        height: 80%;
        border-radius: 4rpx;
        border: 6rpx solid $uni-main-color;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: translate(-18%, -80%) rotate(40deg);
      }
    }
  }

  .reserve-time-area {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20rpx;

    .time-select {
      width: 100%;
      padding: 0 30rpx 0 31rpx;
      box-sizing: border-box;

      .time-select-group {
        width: 100%;
        padding-bottom: 12rpx;
        padding-top: 25rpx;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;

        .time-select-item {
          width: 18.122%;
          height: 122rpx;
          border-radius: 33rpx;
          font-size: 21rpx;
          box-sizing: border-box;
          border: 2rpx solid #B2B2B2;
          margin-right: 15rpx;
          margin-bottom: 14rpx;
          position: relative;
          color: #333333;

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

        .time-selected {
          background: rgba($color: $uni-main-color, $alpha: 0.05);
          border: 1px solid $uni-main-color;
          color: $uni-main-color;
        }

        .selected-icon {
          // padding: 5rpx 20rpx;
          position: absolute;
          right: 1rpx;
          bottom: 1rpx;

          .select-switch {
            width: 23rpx;
            height: 23rpx;
            background: $uni-main-color;
            border-radius: 50%;
            position: relative;
          }

          .selected::after {
            content: "";
            display: block;
            position: absolute;
            top: 60%;
            left: 40%;
            width: 20%;
            height: 50%;
            border-radius: 4rpx;
            border: 2rpx solid #ffffff;
            border-top-color: transparent;
            border-left-color: transparent;
            transform: translate(-18%, -80%) rotate(40deg);
          }
        }

        .time-select-item:nth-child(5n) {
          margin-right: 0;
        }
      }
    }

    .button-area {
      padding: 0 30rpx 27rpx 31rpx;

      &>view {
        width: 311rpx;
        height: 88rpx;
        border: 2rpx solid #D5D5D5;
        border-radius: 10rpx;
      }

      .left-button {
        background: #FFFFFF;
        color: #5f5f5f;
      }

      .right-button {
        transition: all 0.5s;
        background: $uni-main-color;
        color: #FFFFFF;
      }
      .right-button-disabled{
         background: rgba($color: #8f8f8f, $alpha: 0.1);
        color: #8f8f8f;
      }
    }
  }
</style>