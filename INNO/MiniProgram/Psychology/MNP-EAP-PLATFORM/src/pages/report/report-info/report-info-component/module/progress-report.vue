<template>
  <view class="report-info" :style="progressReportStyle">
    <view class="evaluation-report">
      <view class="evaluation-score">
        <view class="flex-b-c evaluation-score-info">
          <view class="flex1">
            <view class="C_fff font-80">
              {{ caculateResult.coefficientPoints }}
              <text class="m-l-15 font-26">{{ caculateResult.pointType }}</text></view>
            <view class="font-24 C_84c7ff clamp2 flex1" style="">{{caculateResult.rangeShortDesc}}</view>
          </view>
          <image class="f-shrink-0" :src="staticAddress+'/report-info-heart.png'" mode="scaleToFill" />
        </view>
        <view class="evaluation-score-progress">
          <view class="scale">
            <view v-for="(item,i) in caculateResult.rangeList" :key="i" :style="{width:caculateResult.scalePercent}">
              <view class="font-20 C_fff m-l-10">{{item.rangeName}}</view>
              <view class="progress_scale_item" :style="item.selected ? `background-color:${item.style}`:''"></view>
              <view class="scale-ball" v-if="item.selected" :style="{left:`calc(${coefficientPercent} - 19rpx)`}">
                <view :style="{'background-color':caculateResult.ballColor}"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="evaluation-description">
        <view class="evaluation-description-title bold font-32">
          <image :src="staticAddress+'/report-info-background-a-tips.png'" mode="scaleToFill" />
          <view>{{caculateResult.ruleName || '报告评价'}}</view>
        </view>
        <view class="evaluation-description-detail C_50 font-28">
          <text>{{caculateResult.rangeDescription}}</text>
        </view>
      </view>
      <slot name="bottom-content"></slot>
    </view>
  </view>
</template>

<script>
  const pageOption = Page.BasePage({
    name: "progress-report",
    components: {},
    props: {
      progressItem: {
        type: Object,
        default: false
      },
      progressReportStyle:{
        type: String,
        default:''
      }
    },
    data() {
      return {
        caculateResult: {},
        coefficientPercent: "18rpx",
      };
    },
    computed: {},
    onShow() {},
    onReady() {},
    methods: {
      caculateChart(progressItem) {
        return new Promise((rs, rj) => {
          let value = progressItem.coefficientPoints;
          let maxValue = progressItem.rangeList ? progressItem.rangeList[progressItem.rangeList.length - 1]
            .maxValue : 0;
          let ballColor = "#32B924";
          let selectItem = {};
          progressItem.rangeList.forEach((item, i) => {
            item.percent = (((item.maxValue - item.minValue) / maxValue) * 100).toFixed(0) + "%"
            if (value <= 0 && i == 0) {
              item.selected = true;
              item.style = "#32B924";
              ballColor = "#32B924"

            } else if (value >= item.minValue && value < item.maxValue) {
              item.selected = true;
              switch (i) {
                case 0:
                  item.style = "#32B924";
                  ballColor = "#32B924"
                  break
                case 1:
                  item.style = "#3FB9FA";
                  ballColor = "#3FB9FA";

                  break
                case 2:
                  item.style = "#4E3FFA";
                  ballColor = "#4E3FFA";

                  break
                default:
                  item.style = "#F76043";
                  ballColor = "#F76043";
                  break
              }
              selectItem = item
            }
          })
          console.log(selectItem)
          let mediumValue = selectItem.maxValue-1 - selectItem.minValue;
          let coefficientValue = value - selectItem.minValue;
          progressItem.scalePercent = (100 / progressItem.rangeList.length).toFixed(0) + "%";
          let coefficientPercent = ((coefficientValue / mediumValue) * 100).toFixed(1);
          progressItem.ballColor = ballColor;
          this.$nextTick(() => {
            setTimeout(() => {
              // 分数在当前区间所占百分比
              if (coefficientPercent <= 10) {
                coefficientPercent = "18rpx"
              } else if (coefficientPercent >= 92) {
                coefficientPercent = 92 + '%'
              } else {
                coefficientPercent = coefficientPercent + '%'
              }
              this.coefficientPercent = coefficientPercent
            }, 600);
          })
          return rs(progressItem)
        })
      }
    },
    watch: {
      progressItem: {
        handler(nval, oval) {
          let progressItem = nval;
          this.caculateChart(progressItem).then(res => {
            this.caculateResult = res
          })
        },
        immediate: true
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .evaluation-report {
    border-radius: 30rpx;
    background-color: #FFFFFF;
    overflow: hidden;

    .evaluation-score {
      width: 100%;
      background: linear-gradient(180deg, #1564AE 0%, #5EA6D9 100%);

      .evaluation-score-info {
        padding: 32rpx 45rpx;

        image {
          width: 201rpx;
          height: 154rpx;
        }
      }

      .evaluation-score-progress {
        background-color: rgba($color: #1564AE, $alpha: 0.5);
        width: 100%;
        height: 187rpx;
        border-radius: 20rpx 20rpx 0 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .scale {
          width: 90%;
          display: flex;

          &>view {
            position: relative;
            height: 80rpx;
            border-left: 2rpx solid #519ED3;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          &>view:last-child {
            border-right: 2rpx solid #519ED3;
          }

          .progress_scale_item {
            background-color: rgba($color: #8BBADB, $alpha: 0.2);
            height: 15rpx;
            width: 100%;
          }

          .scale-ball {
            position: absolute;
            bottom: -10rpx;
            width: 36rpx;
            height: 36rpx;
            background: #FFFFFF;
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 1s all ease;

            &>view {
              width: 20rpx;
              height: 20rpx;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .evaluation-description {

      .evaluation-description-title {
        display: flex;
        align-items: center;
        padding: 50rpx 20rpx 38rpx;
        color: #1665AF;

        image {
          width: 38rpx;
          height: 32rpx;
          margin-right: 13rpx;
        }
      }

      .evaluation-description-detail {
        padding: 0 40rpx 60rpx;
        line-height: 60rpx;
      }
    }
  }
</style>