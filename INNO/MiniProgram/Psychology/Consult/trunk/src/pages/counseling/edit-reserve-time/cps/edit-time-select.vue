<template>
  <view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" ref="popup" type="center" :is-mask-click="false"
      :safe-area="false">
      <template v-slot:content>
        <view class="reserve-time-area flex-col-1">
          <view class="select-tips flex-b-c">
            <view class="font-24 bold">选择可被预约的时段</view>
            <view class="flex" @click="selectAllFun">
              <view class="select-icon">
                <view class="select-switch" :class="{ selected: selectAll}"></view>
              </view>
              <view class="font-24">全选</view>
            </view>
          </view>
          <view class="flex-col-1 time-select" style="overflow: hidden;">
            <oriScrollView style="height:100%" :scroll-y="true" :refresh='false'>
              <view class="flex" v-for="(item,i) in timeList" :key="i">
                <view class="flex-col-1 flex-c-c">
                  <view class="font-24">{{item.timeGroup}}</view>
                </view>
                <view class="time-select-group"
                  :style="i == timeList.length-1 && 'border-bottom:none;padding-bottom:0'">
                  <view
                    :class="['time-select-item','flex-col', 'flex','flex-c-c',selectedTimeTemporary.includes(timeItem.templateId) && 'time-selected']"
                    v-for="(timeItem,timeIndex) in item.timeGroupDetails" :key="timeIndex" :data-item="timeItem"
                    @click="selectTime">
                    <view>{{timeItem.beginTime}}</view>
                    <view>-</view>
                    <view>{{timeItem.endTime}}</view>
                    <view class="selected-icon" v-if="selectedTimeTemporary.includes(timeItem.templateId)">
                      <view class="select-switch selected"></view>
                    </view>
                  </view>
                </view>
              </view>
            </oriScrollView>
          </view>
          <view class="button-area flex-b-c font-26">
            <view class="left-button flex-c-c" @click="cancel">取消</view>
            <view class="right-button flex-c-c" @click="setTimeTemporary">保存</view>
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"

  const pageOption = Page.BaseComp({
    props: {
      selectedTime: {
        type: Object,
        default: {
          scheduleDay: [],
          templateId: []
        }
      },
      templateTimeGroup: {
        type: Array,
        default: []
      }
    },
    components: {
      oriPopup,
      oriScrollView
    },
    data() {
      return {
        moreIcon: '/more.png',
        selectAll: false,
        itemLen: 0,
        timeList: [],
        selectedTimeTemporary: []
      }
    },
    methods: {
      selectTime({
        currentTarget
      }) {
        console.log(currentTarget.dataset.item)
        let item = currentTarget.dataset.item || {};
        let selectedId = item.templateId || ""
        let selectedTimeTemporary = this.selectedTimeTemporary
        let hasSelected = selectedTimeTemporary.includes(selectedId)
        if (!!hasSelected) {
          this.selectedTimeTemporary = selectedTimeTemporary.filter(item => {
            return item != selectedId
          })
        } else {
          this.selectedTimeTemporary.push(selectedId)
        }
      },
      initData() {
        this.selectAll = false,
          this.selectedTimeTemporary = []
      },
      selectAllFun() {
        let selectAll = this.selectAll;
        if (selectAll) {
          this.selectedTimeTemporary = []
        }
        this.selectAll = !selectAll
      },
      setTimeTemporary() {
        this.$emit('setTimeTemporary', this.selectedTimeTemporary);
        this.dismiss()
        this.selectAll = false;
        this.selectedTimeTemporary = []
      },
      cancel() {
        console.log(this.selectedTime)
        this.selectedTimeTemporary = this.selectedTime.templateId;
        this.dismiss();
      },
      showTimeEdit() {
        let ref = "popup";
        this.$refs[ref].show();
      },
      dismiss() {
        let ref = "popup";
        this.$refs[ref].dismiss()
        //  setTimeout(() => {
        //   this.initData()
        // }, 200);
      },
    },
    watch: {
      templateTimeGroup: {
        handler(nV) {
          let itemLen = 0;
          nV.forEach(itemGroup => {
            itemLen += itemGroup.timeGroupDetails.length;
          })
          this.itemLen = itemLen;
          this.timeList = nV;
        },
        immediate: true
      },
      selectedTimeTemporary: {
        handler(nV) {
          if (nV.length == this.itemLen) {
            this.selectAll = true
          } else {
            this.selectAll = false
          }
        }
      },
      selectAll: {
        handler(nV) {
          if (nV) {
            let timeList = this.timeList;
            let selectedTimeTemporary = [];
            timeList.forEach(itemGroup => {
              let timeGroupDetails = itemGroup.timeGroupDetails || [];
              timeGroupDetails.forEach(item => {
                selectedTimeTemporary.push(item.templateId)
              })
            })
            this.selectedTimeTemporary = selectedTimeTemporary
          }
        },
        immediate: true
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .reserve-time-area {
    width: 700rpx;
    height: 1060rpx;
    margin-top: 124rpx;
    padding-top: 23rpx;
    background: #FFFFFF;
    border-radius: 20rpx;

    .select-tips {
      margin: 0 auto;
      padding: 0 35rpx 0 40rpx;
      box-sizing: border-box;
      width: 650rpx;
      height: 88rpx;
      background: #F6F6F6;
      border-radius: 20rpx;

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

    .time-select {
      width: 100%;
      padding: 26rpx;
      box-sizing: border-box;

      .time-select-group {
        position: relative;
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
          font-size: 21rpx;
          font-weight: bold;
          box-sizing: border-box;
          border-radius: 33rpx;
          border: 2rpx solid #B2B2B2;
          margin-right: 8rpx;
          margin-bottom: 14rpx;
          position: relative;

        }

        .time-selected {
          background: rgba($color: $uni-main-color, $alpha: 0.05);
          border: 1px solid $uni-main-color;
          color: $uni-main-color;
        }

        .time-select-item:nth-child(4n) {
          margin-right: 0;
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
      }
    }

    .button-area {
      padding: 0 25rpx 27rpx 25rpx;

      &>view {
        height: 88rpx;
        border: 2rpx solid #D5D5D5;
        border-radius: 10rpx;
      }

      .left-button {
        width: 292rpx;
        background: #FFFFFF;
        color: #5f5f5f;
      }

      .right-button {
        width: 344rpx;
        background: $uni-main-color;
        color: #FFFFFF;
      }
    }
  }
</style>