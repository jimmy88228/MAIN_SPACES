<template>
  <view class="detail flex-col-1 w-break">
    <template v-if="showAct && (detail.joinState != 2 || detail.joinState != 3)">
      <fullScreenImg :src="imgError||!detail.signBg ? setStaticAddress(bgImage) : detail.signBg" @error="()=>{ imgError = true}"
        @load="()=>{showBg = true}"></fullScreenImg>
      <template>
        <oriScrollView :refresh="false" class="flex-col-1 scroll-view"
          customStyle="height:100%;padding:0 50rpx 0;box-sizing:border-box">
          <view class="customer-info flex-s-c">
            <image :class="['customer-logo','f-shrink-0',showBg ?'opacity-1':'transparent']"
              :src="customerInfo.logoThumbnail"></image>
            <view class="customer-name">{{detail.customerName || ""}}</view>
          </view>
          <view class="questionInfo-title">{{detail.name || ""}}</view>
          <view class="questionInfo-sub-title" v-if="detail.lecturer">主讲 {{detail.lecturer || ""}}</view>
          <view class="questionInfo-sub-title">活动时间 {{detail.startTime || ""}}</view>
          <view class="splite"></view>
          <view class="punch-tips">点击下方按钮进行签到</view>
        </oriScrollView>
        <view :class="['button-area','flex-c-s',showBg ?'opacity-1':'transparent']">
          <template v-if="!detail.isSign">
            <view v-if="isLogin" class="button-punch flex-c-c" @click="punch">签到</view>
            <auth-button v-else :auth="true" :openType="openType" @getphonenumber="getPhoneNumber">
              <view class="button-punch flex-c-c">
                签到
              </view>
            </auth-button>
          </template>
          <view v-else class="button-punch disabled flex-c-c">已签到</view>
        </view>
      </template>
    </template>
    <template v-else>
        <view class="has-no-data flex-c-c flex-col">
          <image :src="setStaticAddress('/course-video/course-disable.png')" mode="aspectFit" />
          <view class="font-28 C_7f">专项讲座已结束</view>
          <view class="back-button C_7f flex-c-c font-28" @click="backAction('/pages/startup/startup')">返回</view>
        </view>
      </template>
    <!-- loading----加载中 -->
    <view class="loading-view flex-c-c" v-if="showLoading">
      <loading-view></loading-view>
    </view>
    <punchTips ref="punchTips"></punchTips>
  </view>
</template>

<script>
  import SM from '@/common/manager/structure-manage'
  import LoadingView from "@/components/css3/loading/loading.vue";
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
  import fullScreenImg from "@/components/full-screen-img/full-screen-img.vue"
  import punchTips from "./components/punch-tips/punch-tips"
  import AuthButton from "@/components/auth-button/auth-button.vue";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriScrollView,
      LoadingView,
      fullScreenImg,
      punchTips,
      AuthButton,
    },
    data() {
      return {
        bgImage: "/questionnaire/detail_bg.png",
        showBg: false,
        imgError: false,
        options: {},
        detail: {},
        customerInfo: {},
        showAct:false,
        showLoading: false,
        isLogin: app.LM.isLogin,
        openType: "getPhoneNumber",
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    onReady() {
      this.getCustomerInfo()
      this.loadData()
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
      },
    },
    methods: {
      getCustomerInfo() {
        SM.getCustomerInfo().then(res => {
          this.customerInfo = res || {}
        })
      },
      loadData() {
        return this.$Http(this.$Apis.getLectureDetailInfo, {
          data: {
            lectureId: this.options.id
          }
        }).then(res => {
          if (res.code) {
            let data = res.data;
            this.detail = data;
            this.showAct = true;
            return data
          }
        })
      },
      getPhoneNumber({
        e
      }) {
        // 获取手机号
        if (e.detail.iv) {
          return this.$Http(this.$Apis.getPhoneNumber, {
            data: {
              code: e.detail.code || "",
              encryptedData: e.detail.encryptedData || "",
              iv: e.detail.iv || "",
              sessionId: app.LM.sessionId || 0,
            },
            other: {
              isShowLoad: true,
            },
          }).then((res) => {
            if (res.code) {
              console.log(res.data, "获取回来的手机号")
              this.miniRegister().then(()=>{
                this.punch()
              })
            }
          });
        }
      },
      miniRegister() {
        return this.$Http(this.$Apis.register, {
              data: {
                sessionId: app.LM.sessionId,
              },
              other: {
                isShowLoad: true,
              },
            }
          )
          .then((res) => {
            if (res.code == 1) {
              return res;
            }
          })
          .catch((e) => {
            return Promise.reject(e);
          })
      },
      punch() {
        return this.$Http(this.$Apis.sign, {
          customUrl:`${this.$Apis.sign.u}?lectureId=${this.detail.lectureId}`,
        }).then(res => {
          if (res.code) {
            this.$refs['punchTips'].show()
            this.loadData()
          }
        })
      },
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
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 40rpx;
    }
  }

  .questionInfo-title {
    margin-bottom: 61rpx;
    margin-top: 86rpx;
    font-size: 72rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 77rpx;
    letter-spacing: 1rpx;
  }

  .questionInfo-sub-title {
    font-size: 26rpx;
    margin-bottom: 20rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 37rpx;
    opacity: 0.5;
  }

  .splite {
    margin-top: 74rpx;
    margin-bottom: 27rpx;
    height: 1rpx;
    width: 100%;
    opacity: 0.4;
    background: #FFFFFF;
  }

  .punch-tips {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 45rpx;
    opacity: 0.3;
  }

  .button-area {
    height: 340rpx;
    box-sizing: border-box;
    padding-top: 20rpx;
    width: 100%;

    .button-punch {
      width: 239rpx;
      height: 239rpx;
      background: #FFFFFF;
      border-radius: 50%;
      font-size: 48rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #21B014;
      line-height: 44rpx;
      letter-spacing: 1px;
    }

    .button-punch.disabled {
      color: #B2B2B2;
      ;
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