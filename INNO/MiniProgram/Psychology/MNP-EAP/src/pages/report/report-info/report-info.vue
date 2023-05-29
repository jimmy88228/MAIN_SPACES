<template>
  <view class="report-info bg_f9fcfe" v-if="hasData">
    <view class="report-background"></view>
    <page-nav :isTransparent="true"></page-nav>
    <view class="report-area relative p-l-25 p-r-25 p-b-32">
      <view class="flex-b-s m-r-13 m-l-13 p-b-38">
        <view class="">
          <view class="report-title C_fff font-24 m-b-20">测评报告</view>
          <view class="font-38 C_fff m-b-15 clamp2" style="width: 460rpx">{{
              analyze.reportDetailActivity.activityName
            }}</view>
          <view class="font-22 C_fff opa-50">测评时间 {{ analyze.reportDetailActivity.completeTime }}</view>
        </view>
      </view>
    </view>
    <view class="report-item" v-for="(item,i) in analyze.reportDetailBase" :key="i">
        <template v-if="item.reportStyle == 'default'">
          <reportInfoA :analyze="item" :has-data="hasData"></reportInfoA>
        </template>
        <template v-else-if="item.reportStyle == 'progress'">
          <reportInfoB :analyze="item" :has-data="hasData"></reportInfoB>
        </template>
        <template v-else-if="item.reportStyle == 'sdq'">
          <reportInfoC :analyze="item" :has-data="hasData"></reportInfoC>
        </template>
        <template v-else-if="item.reportStyle == 'rutter'">
          <reportInfoRutter :analyze="item" :has-data="hasData"></reportInfoRutter>
        </template>
        <template v-else-if="item.reportStyle == 'sectional'">
          <reportInfoSectional :analyze="item" :has-data="hasData"></reportInfoSectional>
        </template>
        <template v-else>
          <reportInfoA :analyze="item" :has-data="hasData"></reportInfoA>
        </template>
      </view>
  </view>
</template>

<script>
  import reportInfoA from "@/pages/report/report-info/report-info-component/report-info-component-a.vue"
  import reportInfoB from "@/pages/report/report-info/report-info-component/report-info-component-b.vue"
  import reportInfoC from "@/pages/report/report-info/report-info-component/report-info-component-c.vue"
  import reportInfoRutter from "@/pages/report/report-info/report-info-component/report-info-component-rutter.vue"
  import reportInfoSectional from "@/pages/report/report-info/report-info-component/report-info-component-sectional.vue"

  const pageOption = Page.BasePage({
    components: {
      reportInfoA,
      reportInfoB,
      reportInfoC,
      reportInfoRutter,
      reportInfoSectional
    },
    data() {
      return {
        options: {},
        hasData: false,
        analyze: {},
      };
    },
    onLoad(options) {
      this.options = options;
      this.loadData();
    },
    onShow() {
    },
    onReady() {
    },
    methods: {
      loadData() {
        let recordId = this.options.recordId;
        return this.$Http(this.$Apis.getReportDetail, {
          data: {
            recordId,
          },
          other: {
            showLoading: true,
          },
        }).then((res) => {
          let analyze = res.data || {};
          let reportDetailBase = analyze.reportDetailBase||[];
          reportDetailBase.forEach(item=>{
            item.adviseModules && (item.adviseModules = this.trans(item.adviseModules||[]))
          })
          console.log('reportDetailBase',reportDetailBase)
          this.analyze = analyze;
          this.hasData = true; 
          return res;
        });
      },
      trans(data){
        data = data.map(item=>{
          return {
            ...item,
            dynamicSetting:JSON.parse(item.dynamicSetting||'{}'),
            moduleData:JSON.parse(item.moduleData||'{}'),
            setting:JSON.parse(item.setting||'{}'),
          }
        })
        console.log('data',data)
        return data
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .report-info {
    min-height: 100vh;

    .report-background {
      position: absolute;
      width: 100%;
      height: 520rpx;
      background: linear-gradient(180deg,
          $uni-main-color 0%,
          #2084ca 42%,
          #f9fcfe 100%);
    }

    .report-area {
      margin-top: 50rpx;

      .report-title {
        width: 123rpx;
        padding: 8rpx 0;
        background: rgba($color: #00456d, $alpha: 0.65);
        border-radius: 4rpx;
        text-align: center;
      }
    }
    .report-item{
      margin-bottom: 103rpx;
    }
  }
</style>