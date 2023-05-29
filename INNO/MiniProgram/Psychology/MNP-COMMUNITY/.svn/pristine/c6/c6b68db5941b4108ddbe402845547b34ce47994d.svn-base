<template>
  <view class="stage-popup w-break">
    <oriPopup ref="oriPopup" type="center" :isMaskClick="false">
      <template v-slot:content>
        <view class="popup-content flex-col flex-s-c">
          <view class="guide">{{formatData.guide || ''}}</view>
          <view class="guideKeyword flex-c-c" v-for="(item,i) in formatData.guideKeywordsArr" :key="i">{{item}}</view>
          <view class="guideDesc">{{formatData.guideDesc || ''}}</view>
          <view class="button-group flex-c-c">
            <view class="back flex-c-c m-r-20" @click="back">返回</view>
            <view class="next flex-c-c" @click="close">下一步</view>
          </view>
        </view>
      </template>
    </oriPopup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  const pageOption = Page.BasePage({
    name: "question-tips",
    components: {
      oriPopup
    },
    props: {
      tipsInfo: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {

      };
    },
    computed: {
      formatData() {
        let tipsInfo = this.tipsInfo || {};
        let guideKeywords = tipsInfo.guideKeywords || "";
        let guideKeywordsArr = [];
        if (guideKeywords.trim().length > 0) {
          guideKeywordsArr = guideKeywords.split(';')
        }
        return {
          ...tipsInfo,
          guideKeywordsArr
        }
      }
    },
    onShow() {},
    onReady() {},
    methods: {
      back(){
        this.backAction()
      },
      show() {
        this.$refs.oriPopup.show()
      },
      close() {
        this.$refs.oriPopup.dismiss()
      },
    },
    watch: {}
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .popup-content {
    width: 636rpx;
    padding: 46rpx 56rpx 56rpx;
    box-sizing: border-box;
    background-image: linear-gradient(to bottom, #E1E7EE, #F0F0F0);
    box-shadow: 0px 0px 16px 0px rgba(191, 192, 192, 0.6);
    border-radius: 19rpx;
  }

  .guide {
    font-size: 26rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    line-height: 34rpx;
    margin-bottom: 31rpx;
  }

  .guideKeyword {
    width: 422rpx;
    height: 143rpx;
    background: #F6FAFF;
    border: 1rpx solid #D7D7D7;
    box-shadow: 0px 0px 16px 0px rgba(206, 216, 234, 0.6);
    border-radius: 22rpx;
    font-size: 60rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #000000 rgba($color: #000000, $alpha: 0.89);
    line-height: 89rpx;
    margin: 0 auto 31rpx;
  }

  .guideDesc {
    margin: 0 auto;
    width: 421rpx;
    font-size: 20rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #707070;
    line-height: 30rpx;
  }

  .button-group {
    margin-top: 42rpx;

    &>view {
      width: 254rpx;
      height: 94rpx;
      border-radius: 47rpx;
      font-size: 32rpx;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 46rpx;
    }

    .back {
      background: #E5E5E5;
      color: #B5B5B5;
    }

    .next {
      background: $uni-main-color;
      color: #FFFFFF;
    }
  }
</style>