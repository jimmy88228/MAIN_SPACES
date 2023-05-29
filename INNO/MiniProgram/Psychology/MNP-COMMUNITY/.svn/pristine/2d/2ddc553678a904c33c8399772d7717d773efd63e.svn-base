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
      <view class="relative">
        <view class="score m-b-32">
          <view class="font-24 C_7f">报告结果</view>
          <view class="flex-c-c flex1 C_0083ce">
            <template v-if="analyze.coefficientPoints && analyze.coefficientPoints >= analyze.mainPointBoundary">
              <view class="font-66">{{ analyze.coefficientPoints }}</view>
              <view class="m-l-12 p-t-20 font-24">分</view>
            </template>
            <template v-else>
              <view class="font-66">{{analyze.healthDesc}}</view>
            </template>
          </view>
        </view>
        <image :src="staticAddress+reportInfoIcon" class="report-info-icon" mode="scaleToFill" />
      </view>
      <view class="report-score-table m-b-25">
        <view class="flex bg_eff7fd C_0083ce font-20 p-l-20 p-r-20">
          <view class="report-score-table-row1 p-t-20 p-b-20 p-l-20 p-r-20">因子</view>
          <view class="report-score-table-row2 p-t-20 p-b-20 p-l-20 p-r-20">原始分</view>
          <view class="report-score-table-row3 p-t-20 p-b-20 p-l-20 p-r-20">参考判断</view>
        </view>
        <view class="flex C_333 font-22 p-l-20 p-r-20" v-for="(item, i) in analyze.dimensionList" :key="i">
          <view class="report-score-table-row1 p-t-20 p-b-20 p-l-20 p-r-20">{{
            item.ruleName
          }}</view>
          <view class="report-score-table-row2 p-t-20 p-b-20 p-l-20 p-r-20">{{
            item.coefficientPoints
          }}</view>
          <view class="report-score-table-row3 p-t-20 p-b-20 p-l-20 p-r-20">{{
            item.rangeName
          }}</view>
        </view>
      </view>
      <view class="wrap m-b-25">测评分析</view>
      <view class="analyze-item m-t-20 p-l-32 p-r-32" v-for="(item, i) in analyze.bottomRuleList" :key="i">
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
      <custom-page v-if="analyze.adviseModules && analyze.adviseModules.length>0" :fullScreen="false" :isShowNav="false" ref="customPageRef"></custom-page>
    </view>
  </view>
</template>

<script>
  import oriImage from "@/components/ori-comps/image/ori-image"
  const pageOption = Page.BasePage({
    components:{oriImage},
    name: "report-info-component-rutter",
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
      };
    },
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
      },
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
        max-width: 400rpx;
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
        padding: 19rpx 45rpx;
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

      .report-score-table {
        border-radius: 20rpx;
        background: #ffffff;
        overflow: hidden;

        &>view:nth-child(n + 2) {
          font-weight: bold;
        }

        .report-score-table-row1,
        .report-score-table-row2 {
          width: 25%;
        }

        .report-score-table-row3 {
          width: 50%;
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