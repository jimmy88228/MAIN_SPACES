<template>
  <view class="fun-assessment-detial" :style="acInfo.questionCount ?'background-color: #F7F6F9':'background-color: #FFFFFF'">
    <template v-if="showLoading">
      <view class="loading-view flex-c-c">
        <loading-view></loading-view>
      </view>
    </template>
    <template v-else-if="!showLoading && acInfo.questionCount">
      <page-nav :isTransparent="true" mode="Close" :full="true"></page-nav>
      <view class="cover-image-area">
        <swiper class="swiper" :current="current" circular :indicator-dots="imgSwiperOpts.indicatorDots"
          :autoplay="imgSwiperOpts.autoplay" :interval="imgSwiperOpts.interval" :duration="imgSwiperOpts.duration">
          <swiper-item v-for="(item,i) in acInfo.pictureList" :key="i">
            <oriImage class="cover-image" :src="item.picture" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>
      <view class="detail-info">
        <view v-show="acInfo.testName" class="font-46 bold detail-title">
          {{acInfo.testName}}
        </view>
        <view v-show="acInfo.quotation" class="font-26 C_7f detail-tips">
          {{acInfo.quotation}}
        </view>
        <view v-show="acInfo.questionCount" class="font-26 detail-question-count">
          {{acInfo.questionCount}}个题目
        </view>
        <view v-show="acInfo.detail" class="content_box">
          <mp-html :content="acInfo.detail" />
        </view>
        <view style="height:140rpx"></view>
      </view>
      <view class="button-area flex-c-c">
        <template v-if="acInfo.joinStatus == 0">
          <button class="font-30 button"
            @click="jumpAction(`/pages/activities/fun-assessment/answer/answer?testId=${options.testId}`)">马上测试</button>
        </template>
        <template v-else-if="acInfo.joinStatus == 1">
          <button class="font-30 button"
            @click="jumpAction(`/pages/activities/fun-assessment/answer/answer?testId=${options.testId}`)">继续测试({{process}})</button>
        </template>
        <template v-else-if="acInfo.joinStatus == 2 || acInfo.joinStatus == 3">
          <view class="flex-a-c two-button-box">
            <button class="font-30 button-two btn-white"
              @click="jumpAction(`/pages/activities/fun-assessment/answer/answer-result?recordId=${acInfo.recordId}&testId=${options.testId}`)">查看报告</button>
            <button v-if="acInfo.joinStatus == 2" class="font-30 button-two"
              @click="jumpAction(`/pages/activities/fun-assessment/answer/answer?testId=${options.testId}`)">再测一次</button>
            <button v-else-if="acInfo.joinStatus == 3" class="font-30 button-two"
              @click="jumpAction(`/pages/activities/fun-assessment/answer/answer?testId=${options.testId}`)">继续测试({{process}})</button>
          </view>
        </template>
      </view>
    </template>
     <template v-else>
        <empty>暂无内容噢～</empty>
      </template>
  </view>
</template>
<script>
  import mpHtml from '@/common/support/mp-html/mp-html'
  import SIH from "@/common/helper/sys-infos-handler"
  import oriImage from "@/components/ori-comps/image/ori-image"
  import LoadingView from '@/components/css3/loading/loading.vue';

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      mpHtml,
      LoadingView,
      oriImage,
    },
    data() {
      return {
        imgSwiperOpts: {
          indicatorDots: false,
          autoplay: true,
          interval: 5000,
          duration: 500,
        },
        showLoading: true,
        acInfo: {},
        current: 0,
        navTop: SIH.navPlace,
        testImg: "https://eapadmin.innourl.com/v/files/public/eap/SURVEY_INNO/images/custom_page/20220810/1660121280128pON4GX.jpeg",
        options: []
      };
    },
    computed: {
      process() {
        let answerCount = Number(this.acInfo.answerCount);
        let acInfo = this.acInfo;
        let lastQuestion = acInfo.lastQuestion;
        let restQuestions = lastQuestion ? Number(lastQuestion.restQuestions) : Number(acInfo.questionCount);
        return `${answerCount}/${answerCount + restQuestions}`;
      }
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {

    },
    onShow() {
      this.loadData()
    },
    onHide() {
        
    },
    // onShareAppMessage(e){},
    methods: {
      loadData() {
        this._getAuthUserInfo().then((res) => {
          this.userInfo = res;
        });
        this.userInfo = {
          ...app.IM._authUserInfo
        };
        return this.$Http(this.$Apis.getFunTestPage, {
          data: {
            testId: this.options.testId,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.acInfo = {
              ...this.acInfo,
              ...data,
            };
          }
        }).finally(() => {
          setTimeout(() => {
            this.showLoading = false;
          }, 200);
        });
      },
      jump() {
        let acInfo = this.acInfo || {};
        if (acInfo.joinState == "cannot_join") {
          SMH.showToast({
            title: `不属于本次测评对象`,
          });
          return;
        }
        if (!(acInfo.joinState == "unjoin" || acInfo.joinState == "joining"))
          return;
        let url = `/pages/activities/evaluating/answer/answer?activityId=${
        acInfo.activityId || 0
      }&current=${acInfo.answerCount || 0}&allCount=${acInfo.questionCount}`;
        this.jumpAction(url);
      },
    },
  });
  export default pageOption
</script>
<style lang="scss" scoped>
  .loading-view {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100vh;
    background: #FFFFFF;
  }

  .fun-assessment-detial {
    width: 100%;
    min-height: 100vh;
  }

  .cover-image-area {
    position: sticky;
    top: 0;
    left: 0;

    .swiper {
      height: 500rpx;
    }

    .swiper-item {
      display: block;
      height: 500rpx;
      line-height: 500rpx;
    }

    .cover-image {
      width: 100%;
      height: 500rpx;
    }
  }

  .detail-info {
    position: absolute;
    top:470rpx;
    width: 100%;
    border-radius: 30rpx 30rpx 0px 0px;
    box-sizing: border-box;
    overflow: hidden;

    &>view:nth-child(1),
    &>view:nth-child(2),
    &>view:nth-child(3) {
      background: #FFFFFF;
    }

    .detail-title {
      padding: 52rpx 56rpx 0rpx;
    }

    .detail-tips {
      padding: 29rpx 56rpx 0rpx;
    }

    .detail-question-count {
      padding: 56rpx 56rpx 50rpx;
    }

    .content_box {
      width: 100%;
      background-color: #F7F6F9;
    }
  }

  .button-area {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 140rpx;
    width: 100%;
    background: #FFFFFF;

    .button {
      color: #FFFFFF;
      width: 645rpx;
      height: 100rpx;
      background: #35952E;
      border-radius: 58rpx;
    }

    .two-button-box {
      padding: 0 52rpx;
      width: 100%;

      .button-two {
        width: 310rpx;
        height: 100rpx;
        background: #35952E;
        color: #FFFFFF;
        border-radius: 58rpx;
      }

      .btn-white {
        background: #FFFFFF;
        color: #35952E;
        box-shadow: 0px 2px 10px 0px rgba(33, 176, 20, 0.29);
      }
    }
  }
</style>