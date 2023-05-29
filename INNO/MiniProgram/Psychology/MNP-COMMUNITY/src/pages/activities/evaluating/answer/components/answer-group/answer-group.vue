<template>
  <view class="answer-group w-break">
    <view :style="{'animation-delay':`${i*0.1}s`,'padding': `${item.optionList.length <= 2?'32rpx 27rpx':'32rpx 17rpx'}`}" :class="['question-item','flex-b-c','f-wrap',buttonAnimation]" v-for="(item,i) in questionList"
      :key="i">
      <view class="question-title p-l-20">{{item.question}}</view>
      <view class="answers flex" v-if="item.optionList.length <= 2">
        <view @click="onAnswer(cItem.optionId, i,cItem)"
          :class="[qId == 0 && 'm-r-25',cItem.optionId == item.selectOptionId && 'active']"
          v-for="(cItem,qId) in item.optionList" :key="qId">
          <view :class="[cItem.optionId == item.selectOptionId ?'icon-true-active':'icon-true' ,'m-b-15']"
            v-if="cItem.optionContent == '正确'"></view>
          <view :class="[cItem.optionId == item.selectOptionId ?'icon-false-active':'icon-false', 'm-b-10']"
            v-if="cItem.optionContent == '错误'"></view>
          {{cItem.optionContent}}
        </view>
      </view>
      <view class="answers-more flex flex-wrap" v-else>
        <view @click="onAnswer(cItem.optionId, i,cItem)"
          :class="[cItem.optionId == item.selectOptionId && 'active']"
          v-for="(cItem,qId) in item.optionList" :key="qId">
          <view :class="[cItem.optionId == item.selectOptionId ?'icon-true-active':'icon-true' ,'m-b-15']"
            v-if="cItem.optionContent == '正确'"></view>
          <view :class="[cItem.optionId == item.selectOptionId ?'icon-false-active':'icon-false', 'm-b-10']"
            v-if="cItem.optionContent == '错误'"></view>
          {{cItem.optionContent}}
        </view>
      </view>
    </view>
   
    <view class="next flex-c-c" @click="next">确定</view>
  </view>
</template>

<script>
  const app = getApp()
  const pageOption = Page.BasePage({
    name: "answer-normal",
    components: {},
    props: {
      questionDetail: {
        type: Object,
        default: {}
      },
      index: {
        type: String,
        default: ""
      },
      buttonAnimation: {
        type: String,
        default: ""
      },
    },
    data() {
      return {

      };
    },
    computed: {
      questionList() {
        let questionDetail = this.questionDetail || {};
        let questionList = this.questionDetail.questionList || [];
        console.log(questionDetail, "questionDetail")
        return questionList
      }
    },
    onShow() {},
    onReady() {},
    methods: {
      onAnswer(optionId, qId, optionItem) {
        this.$emit("onAnswer", {
          optionId,
          qId,
          optionItem
        })
      },
      checkOption() {
        let questionList = this.questionList || {};
        let optionList = [];
        for (let i = 0; i < questionList.length; i++) {
          let item = questionList[i];
          if (item.selectOptionId) {
            console.log(item.optionList.filter(oItem=>{return oItem.optionId == item.selectOptionId}))
            let selectOption = item.optionList.filter(oItem=>{return oItem.optionId == item.selectOptionId})[0]
            optionList.push({
              nextQuestionId:selectOption.nextQuestionId,
              selectOptionId:selectOption.optionId,
              questionId:item.questionId
            })
          }
        }
        return optionList
      },
      next() {
        let questionList = this.questionList || [];
        let allOptionItem = this.checkOption();
        if (allOptionItem.length !== questionList.length) {
          app.SMH.showToast({
            title: "还有未答完的题目喔~"
          })
          return
        }
        let lastOptionItem = allOptionItem[allOptionItem.length-1]
        this.$emit("next", {lastOptionItem,allOptionItem})
      }
    },
    watch: {}
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import "../../animate.scss";

  .icon-true-active {
    width: 24rpx;
    height: 12rpx;
    border-left: 4rpx solid #FFFFFF;
    border-bottom: 4rpx solid #FFFFFF;
    transform: rotate(-45deg);
  }

  .icon-true {
    width: 24rpx;
    height: 12rpx;
    border-left: 4rpx solid #7F7F7F;
    border-bottom: 4rpx solid #7F7F7F;
    transform: rotate(-45deg);
  }

  .icon-false {
    position: relative;
    width: 28rpx;
    height: 28rpx;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0rpx;
      height: 100%;
      border-left: 4rpx solid #7F7F7F;
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0;
      height: 100%;
      border-left: 4rpx solid #7F7F7F;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  .icon-false-active {
    position: relative;
    width: 28rpx;
    height: 28rpx;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0rpx;
      height: 100%;
      border-left: 4rpx solid #FFFFFF;
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0;
      height: 100%;
      border-left: 4rpx solid #FFFFFF;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  .answers {
    &>view {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 148rpx;
      height: 103rpx;
      font-weight: 500;
      background: #FFFFFF;
      color: #434343;
      border: 1rpx solid #F0F0F0;
      box-shadow: 0px 0px 13px 0px #F3F3F3;
      border-radius: 10rpx;
      font-size: 24rpx;
    }

    .active {
      color: #FFFFFF;
      background: $uni-main-color;
    }

  }
  .answers-more{
    width: 100%;
    margin-top: 18rpx;
    &>view {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 176rpx;
      height: 103rpx;
      font-weight: 500;
      background: #FFFFFF;
      color: #434343;
      border: 1rpx solid #F0F0F0;
      box-shadow: 0px 0px 13px 0px #F3F3F3;
      border-radius: 10rpx;
      font-size: 24rpx;
      box-sizing: border-box;
      margin: 15rpx 3.5% 0 0;
    }
    &>view:nth-child(3n){
      margin-right: 0;
    }
    .active {
      color: #FFFFFF;
      background: $uni-main-color;
    }
  }

  .question-item {
    animation-duration: 0.5s;
    opacity: 0;
    margin-bottom: 44rpx;
    box-sizing: border-box;
    width: 606rpx;
    background: #FAFAFA;
    border: 1rpx solid #DFE3E8;
    border-radius: 22rpx;

    .question-title {
      text-align: left;
      font-size: 34rpx;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #000000;
      line-height: 31rpx;
    }
  }

  .next {
    width: 606rpx;
    height: 118rpx;
    background: #FAFAFA;
    border-radius: 22rpx;
    font-size: 28rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #7F7F7F;
    line-height: 49rpx;
  }
</style>