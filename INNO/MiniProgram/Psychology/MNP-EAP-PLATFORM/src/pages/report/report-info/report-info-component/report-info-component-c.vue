<template>
  <view class="report-info" v-if="hasData">
    <image class="report-background"  :src="staticAddress+'/scale_background.png'" mode="scaleToFill" />
    <view class="report-area relative p-l-25 p-r-25 p-b-32">
      <view class="report-title">
        {{analyze.modelName}}
      </view>
      <view class="report-title-line"></view>
      <view class="report-tips">
        <view class="report-tips-title font-32">
          <view class="C_333 bold">感谢你的参与</view>
          <view class="C_50">阅读本报告时，请注意以下事项：</view>
        </view>
        <view class="tips-info">
          <view class="tips-info-item C_50 font-22" v-for="(item,i) in reportInfoTips" :key="i">
            <view class="tips-info-item-index">{{i+1}}</view>
            <view class="font-22">{{item}}</view>
          </view>
        </view>
      </view>
      <image class="big-report-title" :src="setStaticAddress('/sdq-report/evaluation-results.png')" mode="aspectFit" />
      <progressReport progressReportStyle="margin-bottom:30rpx" :progressItem="analyze.mainStat"></progressReport>
      <image class="big-report-title" :src="setStaticAddress('/sdq-report/difficulty-analysis.png')" mode="aspectFit" />
      <dimension v-for="(item,i) in analyze.dimensionList" :key="i" dimensionStyle="margin-bottom:20rpx"
        :dimensionItem="item"></dimension>
      <image class="big-report-title" :src="setStaticAddress('/sdq-report/influence-level.png')" mode="aspectFit" />
      <progressReport :progressItem="analyze.effectStat">
        <template slot="bottom-content" v-if="ballGroup && ballGroup.length > 0">
          <view>
            <view class="top-splite"></view>
            <view class="personal-perception">
              <view class="evaluation-description-title bold font-32">
                <image :src="staticAddress+'/report-info-background-a-tips.png'" mode="scaleToFill" />
                <view>个人感知概况</view>
              </view>
              <view class="ball-group-tips flex-s-c font-22">
                <view class="C_BE">图形释意：</view>
                <view class="ball-group-tips-item flex-c-c">
                  <view class="ball-group-tips-circle circle-first"></view>
                  <view>6-7分</view>
                </view>
                <view class="ball-group-tips-item flex-c-c">
                  <view class="ball-group-tips-circle circle-second"></view>
                  <view>4-5分</view>
                </view>
                <view class="ball-group-tips-item flex-c-c">
                  <view class="ball-group-tips-circle circle-third"></view>
                  <view>2-3分</view>
                </view>
              </view>
              <view class="ball-group flex-c-c">
                <view class="ball-item flex-c-c" :style="item.style" v-for="(item,i) in ballGroup" :key="i">
                  <view class="ball-item-content">
                    <view>{{item.ruleName}}</view>
                    <view v-for="(stringItem,stringIndex) in item.optionList" :key="stringIndex">{{stringItem}}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </progressReport>
      <custom-page v-if="analyze.adviseModules && analyze.adviseModules.length>0" :fullScreen="false" :isShowNav="false"
        ref="customPageRef"></custom-page>
    </view>
  </view>
</template>

<script>
  import LoadingView from "@/components/css3/loading/loading.vue";
  import progressReport from "./module/progress-report.vue";
  import dimension from "./module/dimension.vue";
  const pageOption = Page.BasePage({
    name: "report-info-component-c",
    components: {
      LoadingView,
      progressReport,
      dimension
    },
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
        dimensionList: [],
        effectStat: [],
        mainStat: [],
        animationBall: {},
        reportInfoTips: [
          '本报告不可作为临床诊断的依据，也不建议把它作为你生活和工作中重大决策的唯一依据；',
          '如报告与你自己的感知有所出入，可能是因为测试时受到了其他因素的影响，或答题时是否有所顾虑。'
        ],
        pointsLevel: {
          2: {
            percent: 2,
          },
          3: {
            percent: 2,
          },
          4: {
            percent: 2.5,
          },
          5: {
            percent: 2.5,
          },
          6: {
            percent: 3,
          },
          7: {
            percent: 3,
          },
        }
      };
    },
    computed: {
      ruleInfo() {
        let analyze = this.analyze || [];
        let ruleInfo = analyze.ruleList ? analyze.ruleList[0] : {}
        return ruleInfo
      },
      ballGroup() {
        let analyze = this.analyze;
        let selfSenseList = analyze.selfSenseList;
        let totalCount = 0;
        // 2,3->小圈(1)
        // 4,5->中圈(2)
        // 6,7->大圈(3)
        selfSenseList.forEach((item, i) => {
          let points = item.coefficientPoints;
          let pointsConf = this.pointsLevel[points]
          if (pointsConf) {
            totalCount += pointsConf.percent
            switch (pointsConf.percent) {
              case 2:
                item.style =
                  `background-color:rgba(0, 159, 255, 0.6);`
                // `line-height: 22rpx;background-color:rgba(0, 159, 255, 0.6);font-size: 16rpx;`
                break;
              case 2.5:
                item.style =
                  `background-color:rgba(78,63,250,0.7);`
                // `line-height: 25rpx;background-color:rgba(78,63,250,0.7);font-size: 18rpx;`
                break;
              case 3:
                item.style =
                  `background-color:rgba(247,96,67,0.7);`
                // `line-height: 30rpx;background-color:rgba(247,96,67,0.7);font-size: 22rpx;`
                break;
            }
          }
        })
        console.log(totalCount, "所有数量")
        let onePrecent = Math.floor(100 / totalCount)
        selfSenseList.forEach((item, i) => {
          let points = item.coefficientPoints;
          let pointsConf = this.pointsLevel[points]
          if (pointsConf) {
            let ballWidth = (pointsConf.percent * onePrecent) > 70 ? 70 : (pointsConf.percent * onePrecent);
            let fontSize = ""
            if (selfSenseList.length == 1) {
              fontSize = pointsConf.percent * onePrecent * 0.4;
            } else {
              fontSize = pointsConf.percent * onePrecent * 0.7;
            }
            let lineHeight = ballWidth * 1.4;
            item.style +=
              `width:${ballWidth}%;padding-top:${ballWidth}%;font-size:${fontSize}rpx;line-height:${lineHeight}rpx;`
            console.log(item.ballWidth, "计算width")
          }
        })

        console.log(selfSenseList, "整体list")
        return selfSenseList
      }
    },
    onShow() {},
    onReady() {},
    methods: {
      init() {
        if (this.analyze && this.analyze.adviseModules && this.analyze.adviseModules.length > 0) {
          setTimeout(() => {
            this.$refs.customPageRef && this.$refs.customPageRef.initData({
              moduleList: this.analyze.adviseModules
            }, 'report');
          }, 500);
        }
      },
      formatDate(date) {
        return date.slice(0, 10)
      },
    },
    watch: {
      analyze: {
        handler(nV) {
          this.init();
        },
        immediate: true
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
      top: 0px;
      left: 0px;
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

      .report-tips {
        width: 700rpx;
        min-height: 535rpx;
        background: #FFFFFF;
        box-shadow: 0px 9rpx 27rpx 0px rgba(0, 138, 203, 0.15);
        border-radius: 20rpx;
        margin-bottom: 30rpx;

        .report-tips-title {
          padding: 40rpx 45rpx;
          line-height: 55rpx;
        }

        .tips-info {
          padding: 40rpx 35rpx 40rpx 55rpx;
          box-sizing: border-box;
          width: 100%;
          margin-bottom: 40rpx;

          .tips-info-item {
            position: relative;
            padding: 25rpx 30rpx 25rpx 70rpx;
            width: 100%;
            min-height: 129rpx;
            line-height: 40rpx;
            border-radius: 20rpx;
            background: #F3FBFF;
            margin-bottom: 40rpx;
            box-sizing: border-box;

            .tips-info-item-index {
              position: absolute;
              left: -30rpx;
              top: 50%;
              transform: translateY(-50%);
              font-size: 140rpx;
              color: rgba($color: #0083CE, $alpha: 0.2);
            }
          }
        }
      }

      .big-report-title {
        width: 750rpx;
        height: 93rpx;
        margin: 0 -25rpx;
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
    }
  }

  .top-splite {
    border-top: 1px solid rgba($color: #979797, $alpha: 0.1);
    margin: 0 32rpx;


  }

  .personal-perception {

    .evaluation-description-title {
      display: flex;
      align-items: center;
      padding: 50rpx 20rpx 10rpx;
      color: #1665AF;

      image {
        width: 38rpx;
        height: 32rpx;
        margin-right: 13rpx;
      }
    }

    .ball-group-tips {
      width: 100%;
      height: 77rpx;
      padding: 0rpx 20rpx 0rpx;

      .ball-group-tips-item {
        margin-right: 25rpx;

        .ball-group-tips-circle {
          width: 25rpx;
          height: 25rpx;
          border-radius: 50%;
          margin-right: 10rpx;
        }

        .ball-group-tips-circle.circle-first {
          background: rgba(247, 96, 67, 0.7);
        }

        .ball-group-tips-circle.circle-second {
          background: rgba(78, 63, 250, 0.7);
        }

        .ball-group-tips-circle.circle-third {
          background: rgba(0, 159, 255, 0.6);
        }
      }
    }
  }

  .ball-group {
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx;

    .ball-item {
      flex-shrink: 0;
      height: 0px;
      background-color: rgba($color: #F76043, $alpha: 0.7);
      border-radius: 50%;
      flex-direction: column;
      color: #FFFFFF;
      white-space: nowrap;
      margin: 0px -10rpx;
      position: relative;

      .ball-item-content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }
    }
  }
</style>