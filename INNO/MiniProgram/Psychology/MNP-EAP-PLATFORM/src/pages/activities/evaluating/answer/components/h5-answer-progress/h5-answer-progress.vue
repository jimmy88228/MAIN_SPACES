<template>
  <view class="margin-box">
    <view class="progress-box flex-b-c">
      <view class="msg-box">
        <view class="progress">
          <progress :percent="getPercent(answerCount, answerCount + restQuestions)" active active-mode="forwards"
            :duration="10" stroke-width="6" border-radius="8" :activeColor="brandStyle.themeColor"
            backgroundColor="rgba(216,216,216,0.3)" />
        </view>
        <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text class="font-24">进度{{ answerCount }}</text>/<text
            class="font-18 C_B2">{{ answerCount + restQuestions }}</text>
        </view>
      </view>
      <view class="flex-s-c">
        <button class="sm-btn flex-c-c" @click="last">上一题</button>
        <button class="sm-btn flex-c-c" @click="back('check')">
          暂停
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  const pageOption = Page.BasePage({
    name: "mp-answer-progress",
    components: {

    },
    props: {
      // 当前量表信息
      acInfo: {
        type: Object,
        default: {},
      },
      // 当前模块的ID
      modelId: {
        type: Number,
        default: 0
      },
      // 回答题数
      answerCount: {
        type: Number,
        default: 0
      },
      // 剩余最大可能回答提数
      restQuestions: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {};
    },
    computed: {
      allProcress() {
        let acInfo = this.acInfo;
        let modelIds = acInfo.modelIds || [];
        let modelId = this.modelId || 0;
        let procress = modelIds.indexOf(modelId) + 1;
        return procress + '/' + modelIds.length
      },
      progressItemStyle() {
        let acInfo = this.acInfo;
        let modelIds = acInfo.modelIds || [];
        let count = modelIds.length;
        let width = 100
        if (count > 1) {
          width = (100 / count).toFixed(0) - 1
        }
        return `width:${width}%`
      },
    },
    onShow() {},
    onReady() {},
    methods: {
      getPercent(cur, len) {
        console.log(cur, len, "百分比")
        return Number((cur / len).toFixed(2)) * 100;
      },
    },
    watch: {

    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .margin-box {
    padding: 20px;
    box-sizing: border-box;
    border-radius: 20rpx;
  }

  .progress-box {
    padding: 0 38rpx;
    box-sizing: border-box;
    width: 550rpx;
  }

  .progress {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>