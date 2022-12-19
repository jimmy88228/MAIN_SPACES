<template>
  <view class="progress-box-mp">
    <view v-if="acInfo.modelIds.length == 1" class="progress-title C_7f font-22 f-shrink-0 p-r-20 m-b-20 flex-s-c">
      测评活动进度
      {{ answerCount }}/{{ answerCount + restQuestions }}
    </view>
    <view v-else class="progress-title C_7f font-22 f-shrink-0 p-r-20 m-b-20 flex-s-c">测评活动进度 {{allProcress}}
    </view>
    <view class="progress">
      <view v-for="(item,i) in acInfo.modelIds" :key="i" :style="progressItemStyle">
        <template v-if="item == modelId">
          <progress :percent="getPercent(answerCount, answerCount + restQuestions)" active active-mode="forwards"
            :duration="10" stroke-width="6" border-radius="8" :activeColor="brandStyle.themeColor"
            backgroundColor="rgba(216,216,216,0.3)" />
        </template>
        <template v-else>
          <template v-if="acInfo.modelIds.indexOf(item) > acInfo.modelIds.indexOf(modelId)">
            <progress :percent="0" active active-mode="forwards" duration="0" stroke-width="6" border-radius="8"
              :activeColor="'rgb(33,176,20,0.3)'" backgroundColor="rgba(216,216,216,0.3)" />
          </template>
          <template v-if="acInfo.modelIds.indexOf(item) < acInfo.modelIds.indexOf(modelId)">
            <progress :percent="0" active active-mode="forwards" duration="0" stroke-width="6" border-radius="8"
              :activeColor="'rgb(33,176,20,0.3)'" backgroundColor="rgb(33,176,20,0.3)" />
          </template>
        </template>
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
  .progress-box-mp {
    padding: 25rpx 30rpx;
    box-sizing: border-box;
    width: 700rpx;
    background: rgba($color: #D8D8D8, $alpha: 0.07);
    border-radius: 22rpx;
    border: 1px solid rgba($color: #979797, $alpha: 0.07);
    margin: 32rpx auto 0;
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