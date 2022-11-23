<template>
  <view class="eval-item bg_fff">
    <view class="eval-item-top">
      <!-- <view class="bold font-24">
        课程任务
      </view> -->
      <view class="class-info flex-b-c">
        <image @error="imgerror()" :src="logo" class="class-info-image shrink0" mode="aspectFill"></image>
        <view class="class-info-detail flex1">
          <view class="font-22 C_7f m-b-10">课程任务</view>
          <view class="font-26 m-b-35 clamp2">{{dataInfo.activityName}}</view>
          <view v-if="dataInfo.joinType == 0 && dataInfo.limitTime == 1" class="C_B2 font-20 m-b-20" style="min-height:30rpx">课程开始时间 {{dataInfo.initStartTime}}
          </view>
          <template v-if="dataInfo.joinType == 1 || dataInfo.limitTime == 0">
            <view class="learning-count-progress m-b-10">
              <view class="learning-count-value" :style="{width:dataInfo.learningPrecent+'%'}"></view>
            </view>
            <view class="learning-count font-20">已学习{{dataInfo.hadLearnCount}}/{{dataInfo.contentCount}}</view>
          </template>
          <template v-else-if="dataInfo.joinType == 2">
            <view class="cannot-join flex-c-c font-20 C_7f">已过期</view>
          </template>
        </view>
      </view>
    </view>
    <view v-if="dataInfo.joinType != 2" class="eval-item-bottom flex-c-c C_7f font-22" @click="learnNow">
      进入课程
    </view>
  </view>
</template>

<script>
  const pageOption = Page.BasePage({
    name: "course-item",
    components: {},
    props: {
      itemInfo: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        activityIcon: "/activity-icon.jpg",
        logo: ""
      };
    },
    computed: {
      dataInfo() {
        let itemInfo = this.itemInfo;
        let learningPrecent = Math.floor((itemInfo.hadLearnCount / itemInfo.contentCount) * 100);
        let initStartTime = ''
        let initEndTime = ''
        let initTime = ''
        if (itemInfo.limitTime) {
          if(itemInfo.startTime.slice(11) == "00:00:00"){
            initStartTime = itemInfo.startTime.slice(0,10);
          }else{
            initStartTime = itemInfo.startTime.slice(0,16);
          }
          initEndTime = itemInfo.endTime.substr(0, 10);
          initTime = initStartTime + '至' + initEndTime;
        }
        let dataInfo = {
          ...itemInfo,
          initTime,
          initStartTime,
          initEndTime,
          learningPrecent
        }
        // console.log(dataInfo, "dataInfo")
        return dataInfo
      }
    },
    onReady() {},
    methods: {
      imgerror() {
        this.logo = this.staticAddress + this.activityIcon;
      },
      learnNow() {
        this.$emit("learnNow")
      }
    },
    watch: {
      itemInfo: {
        handler: function (nV) {
          // console.log("nV", nV)
          this.logo = nV.coverPic
        },
        immediate: true
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .eval-item {
    box-shadow: 0px 0rpx 14rpx 0px rgba(0, 0, 0, 0.07);
    border-radius: 22rpx;
    margin-bottom: 16rpx;

    .eval-item-top {
      padding: 30rpx;

      .class-info {

        .class-info-image {
          width: 193rpx;
          height: 145rpx;
          background: #D8D8D8;
          border-radius: 8rpx;
        }

        .class-info-detail {
          padding-left: 28rpx;

          .learning-count {
            color: $uni-main-color;
          }

          .learning-count-progress {
            width: 100%;
            height: 6rpx;
            background: #EFEFEF;
            border-radius: 4rpx;

            .learning-count-value {
              height: 100%;
              width: 0%;
              border-radius: 4rpx;
              background: $uni-main-color;
              transition: 1s all ease-in-out;
            }
          }

          .cannot-join {
            width: 85rpx;
            height: 34rpx;
            background: #F8F8F8;
            border-radius: 6rpx;
            border: 1px solid #E9E9E9;
          }
        }
      }
    }

    .eval-item-bottom {
      border-top: 1px solid rgba($color: #979797, $alpha: 0.2);
      height: 95rpx;
      width: 100%;
    }
  }
</style>