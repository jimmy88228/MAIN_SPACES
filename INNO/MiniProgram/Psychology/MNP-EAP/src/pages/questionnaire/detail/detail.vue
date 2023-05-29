<template>
  <view class="detail flex-col-1 w-break">
    <template v-if="!showLoading">
      <fullScreenImg v-if="!empty" :src="setStaticAddress(bgImage)" @load="()=>{showBg = true}"></fullScreenImg>
      <page-nav :full="true"></page-nav>
      <!-- 暂无内容 -->
      <view class="empty flex-c-c flex-col" v-if="empty">
        <image class="empty-icon" :src="setStaticAddress(emptyIcon)" />
        <view class="empty-message" v-if="questionInfo.questionaireState == 'UNRELEASE'">该问卷暂未发布</view>
        <view class="empty-message" v-else-if="questionInfo.questionaireState == 'FINISH'">此问卷活动已结束</view>
      </view>
      <template v-else>
        <oriScrollView :refresh="false" class="flex-col-1 scroll-view"
          customStyle="height:100%;padding:0 50rpx 0;box-sizing:border-box">
          <view class="customer-info flex-s-c">
            <image :class="['customer-logo','f-shrink-0',showBg ?'opacity-1':'transparent']" :src="customerInfo.smallLogo"></image>
            <view class="customer-name">{{customerInfo.customerName || ""}}</view>
          </view>
          <view class="questionInfo-title">{{questionInfo.title || ""}}</view>
          <view class="questionInfo-sub-title">{{questionInfo.sub_title || ""}}</view>
        </oriScrollView>
        <view class="button-area flex-c-c">
          <button @click="start"
            :class="['button',questionInfo.questionaireState !== 'STARTING' && 'C_7f',showBg ?'opacity-1':'transparent']">{{typeKey[questionInfo.questionaireState]}}</button>
        </view>
      </template>
    </template>
    <!-- loading----加载中 -->
    <view class="loading-view flex-c-c" v-if="showLoading">
      <loading-view></loading-view>
    </view>
  </view>
</template>

<script>
  import SM from '@/common/manager/structure-manage'
  import utils from '@/common/support/utils.js'
  import LoadingView from "@/components/css3/loading/loading.vue";
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
  import fullScreenImg from "@/components/full-screen-img/full-screen-img.vue"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriScrollView,
      LoadingView,
      fullScreenImg
    },
    data() {
      return {
        emptyIcon: "/questionnaire/empty.png",
        bgImage: "/questionnaire/detail_bg.png",
        showBg:false,
        options: {},
        customerInfo: {},
        questionInfo: {},
        showLoading: true,
        // UNRELEASE(0，desc:"待发布"),
        // UNSTART(1，desc:"未开始")，
        // STARTING(2，desc:"进行中(可以参与问卷)")
        // FINISH(3，desc:"已结束（活动时间已结束/达到回收目标)")
        // REACHLIMIT(4，desc:"达到个人参与次数上限")，
        // CLOSED(5，desc:"已关闭");
        typeKey: {
          UNRELEASE: '待发布',
          UNSTART: "问卷还未开启",
          STARTING: "马上开始",
          FINISH: "已结束",
          REACHLIMIT: "已完成",
          CLOSED: "问卷已关闭",
        },
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    onReady() {
      this.getCustomerInfo()
      this.getQuestionaireStateInfo()
    },
    computed: {
      empty() {
        let questionInfo = this.questionInfo || {};
        let state = questionInfo.questionaireState || "";
        if (state == "UNRELEASE" || state == "FINISH") {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getCustomerInfo() {
        SM.getCustomerInfo().then(res => {
          this.customerInfo = res || {}
        })
      },
      getQuestionaireStateInfo() {
        return this.$Http(this.$Apis.getQuestionaireStateInfo, {
          data: {
            qId: this.options.id
          }
        }).then(res => {
          if (res.code) {
            let questionInfo = res.data || {};
            this.questionInfo = questionInfo;
            return questionInfo
          }
        }).finally(() => {
          this.showLoading = false
        })
      },
      start() {
        let questionInfo = this.questionInfo || {};
        if (questionInfo.questionaireState !== 'STARTING') {
          if (questionInfo.questionaireState == "REACHLIMIT")
            app.SMH.showToast({
              title: "你的参与次数已达到上限"
            })
          return
        } else {
          this.jumpAction(`/pages/questionnaire/answer/answer?id=${this.options.id}`)
        }
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

  .detail {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .detail-bg {
    transition: opacity 0.3s;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  .scroll-view {
    overflow: hidden;
  }

  .customer-info {
    padding-top: 180px;

    .customer-logo {
      transition: opacity 0.6s;
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
    }

    .customer-name {
      margin-left: 18rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 40rpx;
    }
  }

  .questionInfo-title {
    margin-top: 86rpx;
    font-size: 48rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 77rpx;
    letter-spacing: 1rpx;
  }

  .questionInfo-sub-title {
    margin-top: 60rpx;
    padding: 70rpx 0 80rpx;
    border-top: 1rpx solid #FFFFFF;
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 37rpx;
    opacity: 0.5;
  }

  .button-area {
    padding: 10rpx 0 91rpx;
    box-sizing: border-box;

    .button {
      transition: opacity 0.6s;
      width: 640rpx;
      height: 110rpx;
      background: #FFFFFF;
      box-shadow: 0px 2px 33px 0px rgba(34, 140, 24, 0.77);
      border-radius: 10rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #21B014;
      line-height: 44rpx;
    }
  }

  // 暂无内容
  .empty {
    width: 100%;
    flex: 1;

    .empty-icon {
      width: 346rpx;
      height: 346rpx;
    }

    .empty-message {
      margin-top: 34rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #A1A1A1;
      line-height: 33rpx;
    }
  }

</style>