<template>
  <view class="report-info" v-if="hasData">
    <image class="report-background" :src="staticAddress+'/scale_background.png'" mode="scaleToFill"></image>
    <view class="report-area p-l-25 p-r-25 p-b-32">
      <view class="report-title">
        {{analyze.modelName}}
      </view>
      <view class="report-title-line"></view>
      <view class="m-l-30 report-item-title">量表剖面图</view>
      <view class="report-score-table m-b-25">
        <view class="flex bg_eff7fd C_0083ce font-22">
          <view class="report-score-table-row1 p-t-20 p-b-20 text-c">因子</view>
          <view class="report-score-table-row2 p-t-20 p-b-20 text-c">标准分连接线</view>
          <view class="report-score-table-row3 p-t-20 p-b-20 text-c">所属特征</view>
        </view>
        <view class="flex-c-c font-20 scoring-rules">
          <view class="report-score-table-row1 font-18 flex-c-c scoring-rules-side scoring-rules-left">标准分</view>
          <view class="report-score-table-row2 flex">
            <view
              :class="[i>4?'report-score-orange-item':'report-score-green-item','report-score-key','flex-c-c','font-22','C_333']"
              v-for="i in 10" :key="i">
              {{i+1}}
            </view>
          </view>
          <view class="report-score-table-row3 flex-c-c scoring-rules-side scoring-rules-right">
            <view class="iden iden-green"></view>
            <view class="m-r-13">低分</view>
            <view class="iden iden-orange"></view>
            <view>高分</view>
          </view>
        </view>
        <view class="report-score-ergodic relative">
          <view class="flex C_333 font-22 scoring-item" v-for="(item, i) in infoData.ruleList" :key="i">
            <view
              :class="['report-score-rule-name','border-box','flex-c-c','w-break','bg_eff7fd',item.ruleName.length>4?'font-18':'font-22']">{{
            item.ruleName
          }}</view>
            <view class="report-score-table-row2 flex-c-c">
              <view :class="[i>4?'report-score-orange':'report-score-green','report-score','flex-c-c']" v-for="i in 10"
                :key="i">
                <view v-if="item.coefficientPoints == i+1" class="score-ball"></view>
              </view>
            </view>
            <view class="report-score-table-row3 p-l-5 p-r-5 border-box flex-s-c font-22">
              <view class="text-overflow" style="width:100%">{{item.rangeName}}</view>
            </view>
          </view>
          <image class="absolute" :src="canvasImg" :style="{'height':'100%','width':`${canvasWidth}px`,'left':'115rpx','top':0}" />
        </view>
      </view>
      <view class="wrap m-b-25">测评分析</view>
      <view class="analyze-item m-t-20 p-l-32 p-r-32" v-for="(item, i) in infoData.ruleList" :key="i">
        <view class="C_06509b p-t-32">
          {{ item.ruleName }} ({{ item.coefficientPoints }}{{ item.pointType }})
        </view>
        <view class="C_333 font-24 p-t-32 bold">
          <text user-select>{{ item.rangeShortDesc }}</text>
        </view>
        <view class="C_50 font-22 p-t-32 p-b-32">
          <text user-select>{{ item.rangeDescription }}</text>
        </view>
      </view>
      <custom-page v-if="infoData.adviseModules && infoData.adviseModules.length>0" :fullScreen="false"
        :isShowNav="false" ref="customPageRef"></custom-page>
      <canvas canvas-id="myCanvas" class="canvas-painter"
        :style="{'height':`${canvasHeight}px`,'width':`${canvasWidth}px`}"></canvas>
    </view>
  </view>
</template>

<script>
  const app = getApp();
  import LoadingView from "@/components/css3/loading/loading.vue";
  const pageOption = Page.BasePage({
    name: "report-info-component-a",
    components: {
      LoadingView,
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
        reportInfoIcon: "/report-info.png",
        canvasHeight: 0,
        canvasWidth: 0,
        canvasImg: '',
      };
    },
    onShow() {},
    onReady() {},
    computed: {
      infoData() {
        let analyze = this.analyze;
        analyze.ruleList.forEach(item => {
          item.coefficientPoints = parseInt(item.coefficientPoints / 10)
          let coefficientPoints = 0
          switch (true) {
            // 最大只能是10
            case item.coefficientPoints > 10:
              coefficientPoints = 10
              break
            // 最小只能是1
            case item.coefficientPoints < 1:
              coefficientPoints = 1
              break
            default:
              coefficientPoints = item.coefficientPoints
              break
          }

          item.coefficientPoints = coefficientPoints;
        })
        return analyze
      }
    },
    methods: {
      formatDate(date) {
        return date.slice(0, 10)
      },
      init() {
        if (this.analyze && this.analyze.adviseModules && this.analyze.adviseModules.length > 0) {
          setTimeout(() => {
            this.$refs.customPageRef && this.$refs.customPageRef.initData({
              moduleList: this.analyze.adviseModules
            }, 'report');
          }, 500);
        }

      },
      caculatePx(rpx) {
        return Number(app.SIH.getConvert(rpx, 'px'))
      },
      canvasToFile(canvasId) {
        let that = this;
        return uni.canvasToTempFilePath({
          canvasId,
          success(res) {
            that.canvasImg = res.tempFilePath || ''
          },
        }, that)
      },
      // 绘制连线
      lineCanvas() {
        if (this.infoData && this.infoData.ruleList) {
          let infoData = this.infoData;
          let scoreCard = Number(app.SIH.screenWidth) - this.caculatePx(50);
          let canvasWidth = scoreCard - this.caculatePx(112) - this.caculatePx(165); //画布宽度
          let scoreItemWidth = (canvasWidth / 10).toFixed(1); //分数块的宽度
          let scoreItemHeight = this.caculatePx(75); //分数块的高度
          let canvasHeight = scoreItemHeight * infoData.ruleList.length; //画布高度
          let lineWidth = this.caculatePx(2) //连线的线宽
          this.canvasHeight = canvasHeight;
          this.canvasWidth = canvasWidth;
          // 声明canvas常量
          const ctx = uni.createCanvasContext('myCanvas', this)

          ctx.setStrokeStyle('#0083CE')

          ctx.setLineWidth(lineWidth)

          console.log(ctx, "ctx")
          let spotX = 0;
          let spotY = 0;
          infoData.ruleList.forEach((item, i) => {
            spotX = item.coefficientPoints * scoreItemWidth - (scoreItemWidth / 2)
            spotY = (i + 1) * scoreItemHeight - (scoreItemHeight / 2)
            if (spotX === 0 && spotY === 0) {
              ctx.moveTo(spotX, spotY)
            } else {
              ctx.lineTo(spotX, spotY)
              ctx.stroke()
              ctx.moveTo(spotX, spotY)
            }
          })

          ctx.draw(false, () => {
           // 冷却200豪秒生成图片避免样式出现错乱
            setTimeout(() => {
              this.canvasToFile('myCanvas')
            }, 200);
          })
        }
      }
    },
    watch: {
      analyze: {
        handler(nV) {
          this.init();
        },
        immediate: true
      },
      infoData: {
        handler(nV) {
          this.lineCanvas()
        },
        immediate: true
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .canvas-painter {
    position: fixed;
    top: 999999999px;
    left: 0;
    opacity: 0;
    z-index: -1;
  }

  .report-info {
    // min-height: 100vh;
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

      .score {
        position: relative;
        display: flex;
        flex-flow: column;
        width: 700rpx;
        height: 200rpx;
        padding: 19rpx 31rpx;
        box-sizing: border-box;
        background: #ffffff;
        box-shadow: 0rpx 7rpx 17rpx 0rpx rgba(6, 80, 155, 0.07);
        border-radius: 20rpx;
        z-index: 2;
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

      .report-item-title {
        padding: 28rpx 0;
        font-size: 32rpx;
        font-family: SourceHanSerifCN-Bold, SourceHanSerifCN;
        font-weight: bold;
        color: #1665AF;
        line-height: 46rpx;
      }

      .report-score-table {
        border-radius: 20rpx;
        background: #ffffff;
        box-shadow: 0px 9rpx 27rpx 0px rgba(0, 138, 203, 0.15);
        overflow: hidden;

        // &>view:nth-child(n + 2) {
        //   font-weight: bold;
        // }

        .report-score-table-row1 {
          width: 113rpx;
        }

        .report-score-table-row2 {
          flex: 1;
        }

        .report-score-table-row3 {
          width: 165rpx;
        }

        .scoring-rules {

          .report-score-orange-item {
            border: 4rpx solid #FFA569;
            background: #FDEBDF;
            border-right: none;
          }

          .report-score-orange-item:last-child {
            border-right: 4rpx solid #FFA569;
          }

          .report-score-green-item {
            border: 4rpx solid #75CA1A;
            background: #EFFBE3;
            border-right: none;
          }

          .report-score-key {
            box-sizing: border-box;
            height: 40rpx;
            flex: 1;
          }

          .scoring-rules-side {
            height: 40rpx;
            box-sizing: border-box;
            border: 4rpx solid #C8E8FF;
          }

          .scoring-rules-left {
            font-size: 18rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0083CE;
            line-height: 25rpx;
            border-right: 0;
          }

          .scoring-rules-right {
            border-left: 0;
            font-size: 16rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #B2B2B2;
            line-height: 22rpx;

            .iden {
              width: 13rpx;
              height: 12rpx;
              margin-right: 5rpx;
            }

            .iden-green {
              background: #EFFBE3;
              border: 4rpx solid #75CA1A;
            }

            .iden-orange {
              background: #FDEBDF;
              border: 4rpx solid #FFA569;
            }
          }

        }

        .scoring-item {

          border-bottom: 1rpx solid rgba($color: #979797, $alpha: 0.2);

          .report-score-rule-name {
            width: 115rpx;
            padding: 0 5rpx;
          }

          .report-score-green {
            background: rgba($color: #EFFBE3, $alpha: 0.5);
          }

          .report-score-orange {
            background: rgba($color: #FDEBDF, $alpha: 0.5);
          }

          .report-score {
            flex: 1;
            height: 75rpx;
            // box-sizing: border-box;
            border-right: 1rpx solid rgba($color: #979797, $alpha: 0.2);

            .score-ball {
              width: 17rpx;
              height: 17rpx;
              border-radius: 50%;
              background: #C1E4FF;
              z-index: 2;
            }
          }

          .report-score:last-child {
            border-right: 2rpx solid #F6EEE8;
          }
        }


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

  .wrap {
    display: table;
    width: 100%;
    white-space: nowrap;
    border-spacing: 2rpx 0;
    font-size: 24rpx;
    color: #8e8e8e;
    text-align: center;
    box-sizing: border-box;
    padding: 0 32rpx;
  }

  .wrap::before,
  .wrap::after {
    display: table-cell;
    content: "";
    width: 35%;
    background: -webkit-linear-gradient(#dddddd, #dddddd) repeat-x left center;
    background: linear-gradient(#dddddd, #dddddd) repeat-x left center;
    background-size: 1rpx 1rpx;
  }
</style>