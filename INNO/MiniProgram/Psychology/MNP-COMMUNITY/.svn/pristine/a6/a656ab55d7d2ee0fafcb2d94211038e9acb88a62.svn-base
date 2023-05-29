<template>
  <view class="report-info" v-if="hasData">
    <view class="report-background">
      <oriImage :showLoading="false" :src="staticAddress+'/scale_background.png'" mode="scaleToFill"></oriImage>
    </view>
    <view class="report-area relative p-l-25 p-r-25 p-b-32">
       <view class="report-title">
        {{analyze.modelName}}
      </view>
      <view class="report-title-line"></view>
      <view class="evaluation-report">
        <view class="evaluation-score">
          <view class="flex-b-c evaluation-score-info">
            <view class="flex1">
              <view class="C_fff font-80">
                {{ ruleInfo.coefficientPoints }}
                <text class="m-l-15 font-26">{{ ruleInfo.pointType }}</text></view>
              <view class="font-24 C_84c7ff clamp2 flex1" style="">{{ruleInfo.rangeShortDesc}}</view>
            </view>
            <image class="f-shrink-0" :src="staticAddress+'/report-info-heart.png'" mode="scaleToFill" />
          </view>
          <view class="evaluation-score-progress">
            <view class="scale">
              <view v-for="(item,i) in rangeList" :key="i" :style="{width:scalePercent}">
                <view class="font-20 C_fff m-l-10">{{item.rangeName}}</view>
                <view class="progress_scale_item" :style="item.selected ? `background-color:${item.style}`:''"></view>
                <view class="scale-ball" v-if="item.selected" :style="{left:`calc(${coefficientPercent} - 18rpx)`}">
                  <view :style="{'background-color':ballColor}"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="evaluation-description">
          <view class="evaluation-description-title bold font-32">
            <image :src="staticAddress+'/report-info-background-a-tips.png'" mode="scaleToFill" />
            <view>报告评价</view>
          </view>
          <view class="evaluation-description-detail C_50 font-28">
            <text>{{ruleInfo.rangeDescription}}</text>
          </view>
        </view>
      </view>
      <custom-page v-if="analyze.adviseModules && analyze.adviseModules.length>0" :fullScreen="false" :isShowNav="false" ref="customPageRef"></custom-page>
    </view>
  </view>
</template>

<script>
  import oriImage from "@/components/ori-comps/image/ori-image"
  const pageOption = Page.BasePage({
    components:{oriImage},
    name: "report-info-component-b",
    props: {
      analyze: {
        type: Object,
        default: false
      },
      hasData: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coefficientPercent: "18rpx",
        ballColor: "#32B924",
        scalePercent: "0%",
        animationBall: {}
      };
    },
    computed: {
      ruleInfo() {
        let analyze = this.analyze || [];
        let ruleInfo = analyze.ruleList ? analyze.ruleList[0] : {}
        return ruleInfo
      },
      rangeList() {
        let analyze = this.analyze;
        let rangeList = analyze.rangeList ? analyze.rangeList : [];
        let value = analyze.coefficientPoints;
        let maxValue = analyze.rangeList ? analyze.rangeList[analyze.rangeList.length - 1].maxValue : 0;
        let ballColor = "";
        let selectItem = {};
        let animationBall = {};
        rangeList.forEach((item, i) => {
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
          // console.log(item, i)
        })
        console.log(selectItem)
        let mediumValue = selectItem.maxValue - selectItem.minValue;
        let coefficientValue = value - selectItem.minValue;
        this.scalePercent = (100 / rangeList.length).toFixed(0) + "%";
        let coefficientPercent = ((coefficientValue / mediumValue) * 100).toFixed(1);
        this.ballColor = ballColor;
        this.$nextTick(() => {
          setTimeout(() => {
            // 分数在当前区间所占百分比
            if (coefficientPercent <= 10) {
              coefficientPercent = "18rpx"
            } else if (coefficientPercent >= 88) {
              coefficientPercent = 88 + '%'
            } else {
              coefficientPercent = coefficientPercent + '%'
            }
            this.coefficientPercent = coefficientPercent
          }, 600);
        })


        // animation动画


        console.log(this.coefficientPercent, "百分比")
        return rangeList
      }
    },
    onShow() {},
    onReady() {},
    methods: { 
      init(){ 
        if(this.analyze && this.analyze.adviseModules && this.analyze.adviseModules.length>0) {
          setTimeout(() => {
            this.$refs.customPageRef && this.$refs.customPageRef.initData({moduleList:this.analyze.adviseModules},'report');
          }, 500);
        }
      },
      formatDate(date) {
        return date.slice(0, 10)
      }
    }, 
    watch : {
      analyze : {
        handler(nV){
          this.init();
        },immediate:true
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .report-info {
    position: relative;
    padding-top: 81rpx;
    .report-background {
      position: absolute;
      top:0px;
      left:0px;
      width: 100%;
      height: 587rpx;
    }

    .report-area {
    position: relative;
      z-index: 1;

      .report-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #FFFFFF;
        margin-bottom: 27rpx;
        margin-left: 45rpx;
        position: relative;
      }

      .report-title-line {
        width: 98rpx;
        height: 4rpx;
        background: #1E7FC5;
        border-radius: 5rpx;
        opacity: 0.2;
        margin-left: 45rpx;
        margin-bottom: 62rpx;
      }

      .report-info-icon {
        position: absolute;
        right: 0rpx;
        top: -205rpx;
        width: 184rpx;
        height: 191rpx;
        margin-top: 21rpx;
        flex-shrink: 0;
        z-index: 1;
      }

      .analyze-item {
        border-radius: 20rpx;
        background: #ffffff;

        &>view:nth-child(3) {
          line-height: 42rpx;
        }
      }

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

              &>view:nth-last-child(2) {
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
            padding: 0 40rpx 80rpx;
            line-height: 60rpx;
          }
        }
      }
    }
  }
</style>