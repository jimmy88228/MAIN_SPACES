<template>
  <view class="eval-item bg_fff">
    <view class="flex-s-c eval-item-title">
      <view class="C_7f font-22 m-r-10">量表测评</view>
      <view class="font-20 C_B2 clamp" v-if="itemInfo.status == 0">活动开始日期
        {{formatDate(itemInfo.startTime)}}
      </view>
      <view v-if="itemInfo.status != 2 && itemInfo.status != 3" class="eval-status flex-c-c">
        {{checkStatus(itemInfo.status)}}</view>
      <view v-else class="eval-status eval-status-finish flex-c-c">{{checkStatus(itemInfo.status)}}</view>
    </view>
    <view class="eval-detail">
      <view class="eval-detail-title flex-b-c">
        <view class="flex-s-c flex1">
          <oriImage class="eval-icon f-shrink-0" customStyle="border-radius:8rpx;" @error="imgerror()" :src="logo || requireStatic(activityIcon)"
            mode="aspectFill" />
          <view class="flex1 clamp">
            <view class="font-26 m-b-10 flex1 clamp">{{itemInfo.activityName}}</view>
            <!-- <view class="C_B2 flex font-20">
              <view>使用量表：</view>
              <view class="flex1 text-wrap inline-block">{{itemInfo.modelName}}</view>
            </view> -->
            <template v-if="itemInfo.limitTime != 0">
            <view class="font-22 C_B2 flex1 clamp" v-if="itemInfo.status == 0">活动开始日期
              {{formatDate(itemInfo.startTime)}}
            </view>
            <view class="font-22 C_B2 flex1 clamp" v-else>{{formatDate(itemInfo.endTime)}} 截止</view>
            </template>
          </view>
        </view>
        <view class="activity-code" v-if="itemInfo.status == 0">
          <image :src="staticAddress+greenCodeIcon" mode="widthFix" @click="createCode(itemInfo)" />
          <view class="font-20 C_7f">活动码</view>
        </view>
      </view>
      <view class="count-group flex-b-c" v-if="itemInfo.status != 0">
        <view class="count-item">
          <view class="font-22 C_7f">应收测评</view>
          <view class="C_008acb">{{itemInfo.receiveCount || 0}}</view>
        </view>
        <view class="count-item">
          <view class="font-22 C_7f">待收测评</view>
          <view class="C_008acb">{{itemInfo.waitCount || 0}}</view>
        </view>
        <view class="count-item">
          <view class="font-22 C_7f">风险预警</view>
          <view class="C_008acb">{{itemInfo.warningCount || 0}}</view>
        </view>
      </view>
      <view class="split" v-if="itemInfo.status != 0"></view>
      <view class="eval-button flex-b-c" v-if="itemInfo.status != 0">
        <view class="flex-c-c" @click="createCode(itemInfo)">
          <image :src="staticAddress+bgreyCodeIcon" mode="widthFix" />
          <view class="font-24 C_7f">生成活动码</view>
        </view>
        <view class="button-split"></view>
        <view class="flex-c-c" @click="participation">
          <image :src="staticAddress+participationIcon" mode="widthFix" />
          <view class="font-24 C_7f">参与情况</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import oriImage from "@/components/ori-comps/image/ori-image"
  const pageOption = Page.BasePage({
    name: "class-teacher-item",
    components: {oriImage},
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
        greenCodeIcon: "/green-code.png",
        bgreyCodeIcon: "/grey-code.png",
        participationIcon: "/participation.png",
        logo: ""
      };
    },
    computed: {},
    onReady() {},
    methods: {
      imgerror() {
        this.logo = this.staticAddress + this.activityIcon;
      },
      formatDate(date) {
        return date.slice(0, 10)
      },
      checkStatus(status) {
        let tips = ""
        switch (status) {
          case 0:
            tips = "待开始";
            break
          case 1:
            tips = "进行中"
            break
          case 2:
            tips = "已结束";
            break
          case 3:
            tips = "已关闭";
            break
          default:
            break
        }
        return tips
      },
      createCode() {
        this.$emit("createCode")
      },
      participation() {
        this.$emit("participation")
      }
    },
    watch: {
      itemInfo: {
        handler: function (nV) {
          this.logo = nV.logo
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

    .eval-item-title {
      padding: 32rpx 32rpx 0rpx;

      .eval-status {
        color: $uni-main-color;
        font-size: 17rpx;
        width: 64rpx;
        height: 24rpx;
        background: rgba($color: #E2F4E0, $alpha: 0.6);
        border-radius: 4rpx;
        opacity: 0.6;
        border: 1px solid rgba($color: #BCECB7, $alpha: 0.6);
      }

      .eval-status-finish {
        color: #9E9E9E !important;
        background: rgba($color: #F1F1F1, $alpha: 0.6) !important;
        border: 1px solid rgba($color: #B2B2B2, $alpha: 0.6) !important;
      }
    }


    .eval-detail {
      width: 100%;

      .eval-detail-title {
        padding: 0 32rpx 0rpx;
        min-height: 130rpx;

        &>view:first-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .eval-icon {
          width: 61rpx;
          height: 61rpx;
          margin-right: 16rpx;
        }

        .activity-code {
          border-left: 2rpx solid #EFEFEF;
          padding-left: 44rpx;

          &>image {
            width: 55rpx;
            height: 55rpx;
            border-radius: 50%;
            margin-bottom: 16rpx;
          }
        }

      }

      .count-group {
        padding: 0 32rpx 32rpx;

        .count-item {
          width: 200rpx;
          height: 150rpx;
          background: #FAFAFA;
          border-radius: 22rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          &>view:nth-child(2) {
            font-size: 44rpx;
            line-height: 62rpx;
            color: $uni-main-color;
          }
        }
      }

      .split {
        height: 2rpx;
        width: 100%;
        background-color: rgba($color: #979797, $alpha: 0.1);
      }

      .eval-button {
        position: relative;

        &>view {
          width: 50%;
          box-sizing: border-box;
          padding: 32rpx 0;

          &>image {
            width: 26rpx;
            height: 26rpx;
            margin-right: 10rpx;
          }
        }

        .button-split {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba($color: #979797, $alpha: 0.3);
          height: 27rpx;
          width: 1rpx;
          padding: 0;
        }
      }
    }
  }
</style>