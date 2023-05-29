<template>
  <view class="radio-group">
    <view class="title">
      <text class="m-r-10">{{questionInfo.index+1 || ''}}</text><text v-show="questionInfo.isMust"
        class="require">*</text>{{questionInfo.title || ''}}
    </view>
    <view class="text-area">
      <textarea :style="textAreaStyle" :autoHeight="true" placeholder="输入文字" :value="textValue" maxlength="500" @input="setValue">
    </textarea>
    </view>
    <view v-if="questionInfo.isMust && textValue.trim().length == 0 && error" class="require-tips">*该题为必填 请填写</view>
  </view>
</template>

<script>

  const pageOption = Page.BasePage({
    components: {

    },
    props: {
      questionInfo: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        textValue: "",
        textAreaStyle: "width: 100%",
        error: false
      };
    },
    watch: {
      questionInfo: {
        handler(nV) {
          let answerResult = nV.answerResult || {};
          let essayContent = answerResult.essayContent || "";
          this.textValue = essayContent;
        }
      }
    },
    methods: {
      setValue({
        detail
      }) {
        let value = detail.value || ''
        this.textValue = value;
        if (this.textValue && this.error) {
          this.error = false
        }
        this.$emit("changeInput", {
          ...this.questionInfo,
          value
        })
      },
      showError() {
        if (this.textValue.trim().length == 0 && !this.error) {
          this.error = true
        }
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .radio-group {
    background: #FFFFFF;
    border-radius: 19rpx;
    box-sizing: border-box;
    width: 100%;
    padding: 29rpx 37rpx 40rpx;
  }

  .title {
    position: relative;
    font-size: 30rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 40rpx;
    padding-bottom: 31rpx;
    padding-left: 20rpx;
    text-indent: -24rpx;

    .require {
      color: #ED2A2A;
    }
  }

  .text-area {
    min-height: 40rpx;
    border-radius: 12rpx;
    font-size: 26rpx;
    padding: 19rpx 15rpx;
    box-sizing: border-box;
    border: 1px solid #EFEFEF;
  }

  .require-tips {
    box-sizing: border-box;
    width: 100%;
    margin-top: 21rpx;
    padding: 8rpx 21rpx 7rpx;
    background: #FFF7F7;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #EE5C5C;
    line-height: 40rpx
  }
</style>