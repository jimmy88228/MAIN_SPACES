<template>
  <view class="edit-time-select flex-col-1">
    <view class="date flex-c-c font-28 bold C_333"> {{date}} </view>
    <view class="time-select flex-col-1">
      <oriScrollView style="height:100%;" :scroll-y="true" :refresh='false'>
        <view class="flex" v-for="(item,i) in timeList" :key="i">
          <view class="flex-col-1 flex-c-c">
            <view class="font-24">{{item.timeGroup}}</view>
            <view class="font-20 C_B1 m-t-15" v-if="item.isFull">已约满</view>
          </view>
          <view class="time-select-group" :style="i == timeList.length-1 && 'border-bottom:none;padding-bottom:0'">
            <view
              :class="['time-select-item','flex-col', 'flex','flex-c-c',timeItem.existAppointment ? 'time-full':(selectedGroup.includes(timeItem.templateId) && 'time-select-item-active')]"
              v-for="(timeItem,timeIndex) in item.timeGroupDetails" :key="timeIndex" :data-item="timeItem"
              @click="selectTime">
              <view v-if="timeItem.existAppointment" class="time-full-tips">约满</view>
              <view>{{timeItem.beginTime}}</view>
              <view>-</view>
              <view>{{timeItem.endTime}}</view>
              <view class="selected-icon">
                <!-- <view class="select-switch selected"></view> -->
                <view class="select-switch disabled"  v-if="timeItem.existAppointment"></view>
                <view v-else
                  :class="{'select-switch':true,selected:selectedGroup.includes(timeItem.templateId),disabled:false}">
                </view>
              </view>
            </view>
          </view>
        </view>
      </oriScrollView>
    </view>
    <view class="button-group flex-c-c">
      <view class="bottom-button font-28 flex-c-c button-left" @click="cancel">取消</view>
      <view class="bottom-button font-28 flex-c-c button-right" @click="save">保存</view>
    </view>
  </view>
</template>

<script>
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"

  const pageOption = Page.BaseComp({
    props: {
      timeGroup: {
        type: Array,
        default: []
      },
      date: {
        type: String,
        default: ""
      }
    },
    components: {
      oriScrollView
    },
    data() {
      return {
        timeList: [],
        selectedGroup: [],
        oldSelectedGroup: [],
        cancelTemplateIds: [],
        insertTemplateIds: []
      }
    },
    methods: {
      initData(data) {
        data.forEach(itemGroup => {
          itemGroup.timeGroupDetails.forEach(item => {
            console.log(item, item.scheduleId)
            if (item.scheduleId) {
              this.oldSelectedGroup.push(item.templateId)
              this.selectedGroup.push(item.templateId)
            }
          })
        })
        // console.log(this.selectedGroup, "selectedGroup")
        // console.log(this.oldSelectedGroup, "selectedGroup")
        this.timeList = data
      },
      selectTime({
        currentTarget
      }) {
        console.log(currentTarget.dataset.item)
        let item = currentTarget.dataset.item || {};

        let selectedId = item.templateId || ""
        let selectedGroup = this.selectedGroup || [];

        let oldSelectedGroup = this.oldSelectedGroup || [];
        let cancelTemplateIds = this.cancelTemplateIds || [];
        let insertTemplateIds = this.insertTemplateIds || [];

        let hasSelected = selectedGroup.includes(selectedId)

        let hasOldSelected = oldSelectedGroup.includes(selectedId)

        if (!!hasSelected) {

          //  旧的数据如果有就新增到取消数组
          if (!!hasOldSelected) {
            this.cancelTemplateIds.push(selectedId)
          } else {
            this.insertTemplateIds = insertTemplateIds.filter(item => {
              return item != selectedId
            })
          }

          this.selectedGroup = selectedGroup.filter(item => {
            return item != selectedId
          })
        } else {
          // 旧的数据如果有就从取消数组剔除
          if (!!hasOldSelected) {
            this.cancelTemplateIds = cancelTemplateIds.filter(item => {
              return item != selectedId
            })
          } else {
            this.insertTemplateIds.push(selectedId)
          }

          this.selectedGroup.push(selectedId)
        }



        console.log(this.selectedGroup, "selectedGroup")
        console.log(this.cancelTemplateIds, "cancelTemplateIds")
        console.log(this.insertTemplateIds, "insertTemplateIds")
      },
      cancel() {
        this.$emit("cancel")
      },
      save() {
        this.$emit("save", {
          cancelTemplateIds: this.cancelTemplateIds,
          insertTemplateIds: this.insertTemplateIds
        })
      }
    },
    watch: {
      timeGroup: {
        handler(nV) {
          console.log(nV, "nV")
          this.initData(nV)
        },
        immediate: true
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .edit-time-select {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    background: #FFFFFF;
    border-radius: 20rpx;
  }

  .date {
    height: 111rpx;
    width: 100%;
    box-shadow: 0rpx 16rpx 20rpx 0rpx rgba($color: #000000, $alpha: 0.02);
  }

  .time-select {
    width: 100%;
    height: 100%;
    padding: 26rpx;
    overflow-y: hidden;
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
        border: 1px solid #B2B2B2;
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
          border: 2rpx solid rgba($color: #B2B2B2, $alpha: 0.5);
        }

        .selected-icon {
          // padding: 5rpx 20rpx;
          position: absolute;
          right: 0;
          bottom: 0;

          .select-switch {
            width: 23rpx;
            height: 23rpx;
            background: #FFFFFF;
            border-radius: 50%;
            position: relative;
            box-sizing: border-box;
            border: 1rpx solid #7F7F7F;
          }

          .selected {
            background: $uni-main-color;
            border: none;
          }

          .disabled {
            background: #F6F6F6;
            border: 1rpx solid #D1D1D1;
          }

          .selected::after {
            content: "";
            display: block;
            position: absolute;
            top: 60%;
            left: 40%;
            width: 25%;
            height: 50%;
            border-radius: 4rpx;
            border: 2rpx solid #ffffff;
            border-top-color: transparent;
            border-left-color: transparent;
            transform: translate(-18%, -80%) rotate(40deg);
          }
        }

      }

      .time-select-item-active {
        color: $uni-main-color;
        border: 1rpx solid #A8E0A3;
        background: #F2FFF0;
      }

      .time-full {
        // background: rgba($color: #F7F7F7, $alpha: 0.4);
        pointer-events: none;
        color: rgba($color: #222222, $alpha: 0.4);
        border: 2rpx solid rgba($color: #333333, $alpha: 0.4);
      }

      .time-select-item:nth-child(4n) {
        margin-right: 0;
      }
    }
  }

  .button-group {
    width: 100%;
    padding-bottom: 30rpx;

    .bottom-button {
      width: 316rpx;
      height: 88rpx;
      border-radius: 6rpx;
      box-sizing: border-box;
    }

    .button-left {
      border: 1rpx solid #979797;
      color: #7f7f7f;
      margin-right: 16rpx;
    }

    .button-right {
      color: #FFFFFF;
      background: $uni-main-color;
    }
  }
</style>