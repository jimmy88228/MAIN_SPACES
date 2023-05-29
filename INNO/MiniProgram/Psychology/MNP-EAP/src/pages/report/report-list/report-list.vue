<template>
  <view class="" :class="!isEmpty ? 'bg_f7 report-list' : 'bg_fff report-list-empty'">
    <page-nav :isTransparent="true" :scroll-height="scrollHeight" :full="true">
      <template slot="title">
        <view>
          报告列表
        </view>
      </template>
    </page-nav>
    <template v-if="!showLoading">
    <view v-if="!isEmpty">
      <view class="report-background"></view>
      <view class="report-list-area relative p-l-15 p-r-15 p-b-32">
        <view class="p-l-15 font-38 C_fff p-t-32 p-b-32">测评报告</view>
        <view v-for="(listItem, itemIndex) in list" :key="itemIndex">
          <view class="report-item animate-fade-in-right" :style="{'animation-delay':`${item.showTime}s`}" v-for="(item, i) in listItem" :key="i" @click="jump" :data-p-index="itemIndex"
            :data-url="`pages/report/report-info/report-info?recordId=${item.recordId}`">
            <image :src="staticAddress+reportItemIcon" class="report-item-background" />
            <view class="report-item-info flex-b-s">
              <view class="relative">
                <image class="report-item-image" :src="item.logo ? item.logo : staticAddress+activityIcon"
                  @error="imgerror($event, i, itemIndex)" mode="aspectFill"></image>
                <image class="report-icon absolute" :src="staticAddress+reportIcon" mode="scaleToFill" />
              </view>
              <view class="report-item-info-right">
                <view class="p-b-18 C_4a clamp">{{ item.activityName }}</view>
                <view v-if="item.hasReport == 0">
                  <view class="report-item-type-getting">报告生成中...</view>
                </view>
                <view v-else>
                  <view class="flex-s-c C_86">
                    <view>已生成</view>
                    <view class="split"></view>
                    <view>测评时间 {{ item.completeTime }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="absolute empty" v-else>
      <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
      <view class="C_B2 font-32">暂无报告哦</view>
    </view>
    </template>

    <view class="loading-view flex-c-c" v-if="showLoading">
      <loading-view></loading-view>
    </view>
  </view>
</template>

<script>
  import LoadingView from "@/components/css3/loading/loading.vue";
  import utils from "@/common/support/utils.js";
  import UniApi from "../../../common/support/tools/uni-api-promise";
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      LoadingView,
    },
    onPageScroll(res) {
      this.scrollHeight = res.scrollTop;
      // uni.$emit('onPageScroll', res.scrollTop); //传递参数
    },
    data() {
      return {
        activityIcon: "/activity-icon.jpg",
        reportItemIcon: "/report-item.png",
        reportIcon: "/icon-report.png",
        emptyIcon: "/list-empty.png",
        // 页面配置
        list: [],
        pageIndex: 0,
        hasMore: true,
        pageSize: app.Conf.PAGE_SIZE,
        clickPage: '',
        isEmpty: false,
        scrollHeight: 0,
        showLoading:true
      };
    },
    onLoad(options) {},
    onShow() {
      if (this.clickPage || this.clickPage === 0) {
        this.pageIndex = this.clickPage && this.clickPage - 1 || 0;
        this.clickPage = 0
        this.loadData();
      } else {
        this.init();
      }
    },
    onReady() {},
    methods: {
      init() {
        this.showLoading = true
        this.list = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.clickPage = 0;
        this.isEmpty = false;
        this.loadData();
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        return this.$Http(this.$Apis.getReportList, {
          data: {
            pageIndex,
            pageSize: this.pageSize,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.pageIndex = pageIndex;
            let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
            data.list.forEach((item, index) => {
              // 动画延时
              let time = 0.1;
              item.showTime = (index * time).toFixed(1);
            })
            this.list[currPage] = data.list || [];
            this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
            this.setEmpty(this.list);
          }
          return res;
        }).catch(() => {
          this.setEmpty(this.list)
        }).finally(() => {
          setTimeout(() => {
            uni.stopPullDownRefresh()
            this.showLoading = false
          }, 300);
        });
      },
      jump({
        currentTarget
      }) {
        let dataset = currentTarget.dataset || {};
        this.clickPage = dataset.pIndex || 0;
        this.jumpAction(dataset.url);
      },
      imgerror(e, img_index, index) {
        var _this = this;
        var imgChildList = _this.list[index];
        if (imgChildList.length > 0) {
          imgChildList[img_index].logo = this.staticAddress + this.activityIcon;
        }
        this.$forceUpdate()
      },
      setEmpty(data) {
        if (data instanceof Array) {
          if (data.length == 0 || !data[0] || (data[0] && data[0].length == 0)) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        } else {
          this.isEmpty = false;
        }
      },
      getUserInfo() {
        uni.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            console.log(res, "获取到的用户资料")
          },
          fail: (err) => {
            console.log(err, "拒绝授权")
          }
        })
      }
    },
    onHide() {
      if (!this.clickPage && this.clickPage !== 0) {
        this.list = [];
        this.showLoading = true
      }
    },
    onPullDownRefresh() {
      this.init();
    },
    onReachBottom() {
      console.log("到达底部");
      if (this.hasMore) {
        this.loadData();
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .loading-view {
    width: 100%;
    height: 100vh;
  }

  .animate-fade-in-right {
    animation-name: fadeInRight;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .report-list {
    min-height: calc(100vh - 125rpx);
  }

  .report-list-empty {
    min-height: 100vh;
  }

  .report-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 520rpx;
    background: linear-gradient(180deg,
        $uni-main-color 0%,
        #2084ca 42%,
        #f7f7f7 100%);
  }

  .report-list-area {
    margin-top: 125rpx;
    overflow-x: hidden;

    .report-item {
      opacity: 0;
      animation-duration: 0.6s;
      position: relative;
      height: 194rpx;
      margin-top: 32rpx;
      box-shadow: 0rpx 7rpx 17rpx 0rpx rgba(6, 80, 155, 0.07);

      .report-item-background {
        position: absolute;
        width: 724rpx;
        height: 194rpx;
        z-index: 99;
      }

      &:first-child .report-bg-right {
        opacity: 0.2;
      }

      .report-bg-right {
        position: absolute;
        right: 28rpx;
        top: 18rpx;
        z-index: 9;
        width: 308rpx;
        height: 137rpx;
        background: #cfe2f3;
        border-radius: 16rpx;
      }

      .report-item-info {
        position: relative;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 36rpx 64rpx 39rpx 34rpx;
        z-index: 999;

        .report-item-image {
          width: 119rpx;
          height: 119rpx;
          border-radius: 16rpx;
          // background: $uni-main-color;
        }

        .report-item-info-right {
          padding-top: 28rpx;
          width: 468rpx;
          text-align: left;

          .report-item-type-getting {
            width: 142rpx;
            // height: 32rpx;
            text-align: center;
            padding: 2rpx 0;
            box-sizing: border-box;
            background: #f2fff1;
            color: #21b014;
            font-size: 20rpx;
            border-radius: 3px;
            border: 1px solid rgba(33, 176, 20, 0.26);
          }
        }
      }
    }
  }

  // 暂无数据
  .empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .empty-icon {
      width: 254rpx;
      height: 254rpx;
      margin-bottom: 47rpx;
    }
  }

  .report-icon {
    width: 66rpx;
    height: 66rpx;
    right: -22rpx;
    bottom: -11rpx;
  }

  .split {
    width: 1rpx;
    height: 17rpx;
    background: #979797;
    margin: 0 18rpx;
  }
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>