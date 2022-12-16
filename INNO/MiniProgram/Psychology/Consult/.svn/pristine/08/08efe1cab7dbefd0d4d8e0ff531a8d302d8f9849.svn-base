<template>
  <view class="participation">
    <page-nav>
      <template slot="title">
        <view>参与情况</view>
      </template>
    </page-nav>
    <view class="organize-title" :style="{top:navHeight+'px'}">
      <view class="font-22 C_B2 clamp m-b-10">{{myOrganize.structureName}}</view>
      <view class="flex-b-c">
        <view class="font-36 C_33 flex-s-c" @click="toggleOrganizeLsit"><text class="clamp"
            style="max-width:300rpx">{{selectedOrganize.structureName}}</text><text>（{{successCount || 0}}/{{organizeList.length || 0}}）</text>
          <view class="select-icon" :style="selectRotate"></view>
        </view>
        <view v-if="organizeCount > 0" class="C_7f font-24 f-shrink-0">共{{organizeCount}}个小组</view>
      </view>
    </view>
    <view class="organize-situation">
      <view class="organize-item flex-c-c" :style="item.style" v-for="(item,i) in organizeList" :key="i">
        <view v-if="item.code == 1" class="check-style check-style-1"></view>
        <view v-if="item.code == 2" class="check-style check-style-2">!</view>
        <view class="font-22 text-c p-l-5 p-r-5">{{item.memberName}}</view>
      </view>
    </view>
    <work-bench ref="workBench" :isChild="true" :activityId="activityId" @loadSuccess="loadOrganizeSuccess"
      @selected="selectOrganize" @popupChange="popupChange">
    </work-bench>
  </view>
</template>

<script>
  import SIH from "@/common/helper/sys-infos-handler"
  import workBench from "@/components/custom-page/work-bench/work-bench"

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        navHeight: SIH.navPlace,
        organizeList: [],
        popupShow: false,
        successCount: 0,
        organizeCount: 0,
        myOrganize: {},
        selectedOrganize: {},
        activityId: 0
      }
    },
    components: {
      workBench
    },
    computed: {
      selectRotate() {
        let popupShow = this.popupShow;
        let style = !popupShow ? '' : 'transform: rotate(180deg)';
        return style
      }
    },
    onLoad(options) {
      console.log(options, "进入页面获取的参数")
      this.activityId = options.activityId
    },
    onReady() {},
    // onShareAppMessage(e){},
    methods: {
      initPage(isAll) {
        console.log(app.SM.structureInfo, "获取组织信息")
        this.myOrganize = app.SM.structureInfo;
        this.loadData(isAll)
      },
      loadData(isAll = 0) {
        console.log(isAll,"isAll")
        this.successCount = 0;
        this.organizeList = [];
        this.$Http(this.$Apis.getActivityParticipation, {
          data: {
            isAll,
            activityId: this.activityId,
            structureId: this.selectedOrganize?.structureId
          },
        }).then((res) => {
          if (res.code == 1) {
            console.log(res.data)
            let data = res.data;
            let successCount = 0
            data.forEach(item => {
              if (item.hadJoin == 1 && item.isWarning == 0) {
                item.code = 1;
                item.style = 'background:#FAFAFA;border: 1px solid #008ACB;color: #008ACB;'
                successCount += 1
              }
              if (item.hadJoin == 1 && item.isWarning == 1) {
                item.code = 2;
                item.style = 'background: #FFF2F2; border: 1px solid #E69C9E;color: #E89EA0;'
                successCount += 1
              }
              if (item.hadJoin == 0) {
                item.code = 0;
                item.style = 'background:#DCDCDD;border: 1px solid #DDDDDD;color: #B2B2B2;'
              }
            });
            this.successCount = successCount;
            this.organizeList = data;
          }
        });
        // 2红 1蓝 0灰
      },
      toggleOrganizeLsit() {
        let ref = "workBench";
        if (!this.popupShow) {
          this.$refs[ref].showBench();
        } else {
          this.$refs[ref].hideBench()
        }
      },
      loadOrganizeSuccess(e) {
        this.selectedOrganize = e[0];
        this.organizeSelectList = e;
        console.log(e,"小组长度")
        this.organizeCount = e[0].isAll ? e.length - 1 : e.length;
        this.initPage(this.selectedOrganize.isAll)
      },
      selectOrganize(e) {
        this.selectedOrganize = e;
        console.log(e,"选择的项")
        if (e.isAll) {
          this.loadData(1)
        } else {
          this.loadData()
        }
      },
      popupChange(e) {
        this.popupShow = e
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .participation {
    background-color: #F7F7F7;
    min-height: 100vh;
  }

  .organize-title {
    position: sticky;
    position: -webkit-sticky;
    left: 0;
    padding: 38rpx 31rpx;
    background-color: #FFFFFF;
    z-index: 999;

    .select-icon {
      width: 0px;
      height: 0px;
      border: 15rpx solid transparent;
      border-top-color: #000000;
      margin-top: 22rpx;
      transform-origin: 15rpx 7.5rpx;
      transition: 0.5s all;
    }
  }

  .organize-situation {
    padding: 28rpx 24rpx;
    display: flex;
    flex-wrap: wrap;


    .organize-item {
      box-sizing: border-box;
      position: relative;
      margin-right: 2%;
      margin-bottom: 8rpx;
      width: 15%;
      height: 112rpx;
      position: relative;
      border-radius: 33rpx;
      border: 2rpx solid #008ACB;
      flex-direction: column;
      background-color: #FAFAFA;

      .check-style {
        position: absolute;
        right: -8rpx;
        top: -8rpx;
        display: inline-block;
        height: 26rpx;
        width: 26rpx;
        border-radius: 50%;

      }

      .check-style-1 {
        border: 2px solid #008ACB;
        background: #008ACB;
      }

      .check-style-1::after {
        content: ' ';
        position: absolute;
        display: inline-block;
        width: 14rpx;
        height: 8rpx;
        border-width: 0 0 3rpx 3rpx;
        overflow: hidden;
        border-color: #FFFFFF;
        border-style: solid;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg) translate(-50%, -50%);
        left: 50%;
        top: 15%;
      }

      .check-style-2 {
        border: 2px solid #E89EA0;
        background: #E89EA0;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
      }
    }

    .organize-item:nth-child(6n) {
      margin-right: 0;

    }
  }
</style>