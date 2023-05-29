<template>
  <view class="picker-answer">
    <ori-picker @pickerChange="(e) => pickerChange(e, 'optionSelect')" range-key="optionContent" mode="selector"
      :range="questionDetail.optionList" :pickerValue="questionDetail.pickerValue">
      <template v-slot:content>
        <view :class="['font-32', 'answer-select', 'flex-b-c',buttonAnimation]">
          <template v-if="questionDetail.pickerValue == -1">
            <view class="C_8E">请选择选项</view>
          </template>
          <template v-else>
            <view class="bold">{{questionDetail.optionList[questionDetail.pickerValue].optionContent}}</view>
          </template>
          <view :style="{color:brandStyle.themeColor}">选择</view>
        </view>
      </template>
    </ori-picker>
    <view v-if="showNext"
      :class="['answer-confirm','flex-c-c','font-32','bold',buttonAnimation,questionDetail.pickerValue == -1 || disableNext?'grey-button':'primary-button']"
      @click="selectPicker()">
      下一题
    </view>
  </view>
</template>

<script>
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  const pageOption = Page.BasePage({
    name: "answer-picker",
    components: {
      oriPicker
    },
    props: {
      questionDetail: {
        type: Object,
        default: {}
      },
      buttonAnimation: {
        type: String,
        default: ""
      },
      disableNext: {
        type: Boolean,
        default: false
      },
      showNext:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {

      };
    },
    computed: {},
    onShow() {},
    onReady() {},
    methods: {
      pickerChange(e) {
        this.$emit('pickerChange', e)
      },
      selectPicker() {
        this.$emit('selectPicker')
      }
    },
    watch: {

    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import "../../animate.scss";

  

  .picker-answer {
    width: 100%;
    height: 100%;
  }

  .answer-select {
    opacity: 0;
    width: 558rpx;
    height: 120rpx;
    background: #FAFAFA;
    border-radius: 10rpx;
    padding: 0 30rpx 0 40rpx;
    animation-duration: 0.5s;
  }

  .answer-confirm {
    animation-duration: 0.5s;
    margin-top: 26rpx;
    width: 325rpx;
    height: 100rpx;
    border-radius: 10rpx;
    margin: 26rpx auto 0;
    transition: 0.5s all;
    opacity: 0;
  }

  .primary-button {
    color: #FFFFFF;
    background-color: $uni-main-color;
  }

  .grey-button {
    color: #000000;
    background-color: #FAFAFA;
  }

</style>