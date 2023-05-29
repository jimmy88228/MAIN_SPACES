<template>
  <view class="radio">
    <view class="title">
      <text class="m-r-10">{{questionInfo.index+1 || ''}}</text><text v-show="questionInfo.isMust" class="require">*</text>{{questionInfo.title || ''}}
      <view class="multiple-choice clear-select" @click="clearSelect">清空选项</view>
    </view>
    <view class="radio-item" @click="chooseItem(item)" v-for="item in questionInfo.optionInfos"
      :key="item.optionContent">
      <view :class="valueGroup.includes(item.optionId) ? 'select-icon-active':'select-icon'"></view>
      <view class="select-info">{{item.optionContent}}</view>
    </view>
    <view v-if="questionInfo.isMust && valueGroup.length == 0 && error" class="require-tips">*该题为必选 请选择</view>
  </view>
</template>

<script>
  const pageOption = Page.BasePage({
     props:{
      questionInfo:{
        type:Object,
        default:{}
      },
      required:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        valueGroup: [],
        error:false,
      };
    },
    watch:{
      questionInfo:{
        handler(nV){
           let answerResult = nV.answerResult || {};
          let optionList = answerResult.optionList || "";
          this.valueGroup = optionList;
        }
      }
    },
    methods: {
      chooseItem(e) {
        let optionId = e.optionId || ''
        let valueGroup = this.valueGroup || [];
        if(valueGroup.includes(optionId)){
          valueGroup = []
        }else{
          valueGroup = [optionId]
        }
        this.valueGroup = valueGroup;
        if(this.valueGroup.length > 0 && this.error){
          this.error = false
        }
        this.$emit("changeSelect",{...this.questionInfo,valueGroup:this.valueGroup})
      },
      clearSelect(){
        this.valueGroup = [];
        this.$emit("changeSelect",{...this.questionInfo,valueGroup:this.valueGroup})
      },
      showError(){
        if(this.valueGroup.length == 0 && !this.error){
          this.error = true
        }
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .radio {
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
    padding-bottom: 60rpx;
    padding-left: 20rpx;
    text-indent: -24rpx;
    .require{
      color: #ED2A2A;
    }
  }

  .multiple-choice {
    position: absolute;
    bottom: 20rpx;
    left: 45rpx;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 28rpx;
  }

  .clear-select {
    color: #27A3DD;
    text-decoration: underline;
  }

  .radio-item {
    display: flex;
    padding: 10rpx 0;
    margin-bottom: 23rpx;

    .select-icon {
      flex-shrink: 0;
      width: 30rpx;
      height: 30rpx;
      background: #FFFFFF;
      border: 1rpx solid #B2B2B2;
      border-radius: 50%;
      box-sizing: border-box;
    }

    .select-icon-active {
      flex-shrink: 0;
      width: 30rpx;
      height: 30rpx;
      background: #5ECF68;
      border-radius: 50%;
      box-sizing: border-box;
      position: relative;
    }

    .select-icon-active::after {
      content: '';
      height: 6rpx;
      width: 12rpx;
      border-left: 3rpx solid #FFF;
      border-bottom: 3rpx solid #FFF;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-50deg);
    }

    .select-info {
      margin-left: 17rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 33rpx;
    }
  }

  .radio-item:last-child {
    margin-bottom: 0;
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