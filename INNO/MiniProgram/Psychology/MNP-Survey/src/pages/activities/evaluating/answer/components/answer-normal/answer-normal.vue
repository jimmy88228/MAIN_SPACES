<template>
  <view>
    <animateCustom :animation-class="buttonAnimation" :animation-delay="current == index ? c_index*0.1 : 0" v-for="(c_item, c_index) in questionDetail.optionList"
      :key="c_index" >
     <template slot="content">
        <button
          :class="['answer-item','bold','flex-c-c', questionDetail.selectOptionId == c_item.optionId ? 'active' : '']"
          @click="onAnswer(c_item.optionId, index,c_item)">
          {{ c_item.optionContent }}
        </button>
      </template>
    </animateCustom>
  </view>
</template>

<script>
  import animateCustom from "@/components/animate-custom/animate-custom.vue"
  const pageOption = Page.BasePage({
    name: "answer-normal",
    components: {
      animateCustom,
    },
    props: {
      current:{
        type:Number,
        default:0
      },
      index: {
        type: Number,
        default: 0
      },
      questionDetail: {
        type: Object,
        default: {}
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
    computed: {},
    onShow() {},
    onReady() {},
    methods: {
      onAnswer(id, index, optionItem) {
        this.$emit("onAnswer", {
          id,
          index,
          optionItem
        })
      }
    },
    watch: {}
  });
  export default pageOption;
</script>

<style lang="scss" scoped>

  .answer-item {
    border-radius: 10rpx;
    font-size: 26rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
    width: 630rpx;
    min-height: 106rpx;
    padding: 0 60rpx;
    // border: 1px solid #e4e4e4;
    background: #FAFAFA;
    color: #333333;
    box-shadow: 0px 2rpx 17rpx 0px rgba(181, 181, 181, 0.17);
    border: 1px solid #EFEFEF;

    &.active {
      // color: #fff;
      // background: $uni-main-color;
      border: 2px solid $uni-main-color;
    }

    &.unactive:hover {
      background: rgba($color: #F3F3F3, $alpha: 1);
    }
  }
</style>