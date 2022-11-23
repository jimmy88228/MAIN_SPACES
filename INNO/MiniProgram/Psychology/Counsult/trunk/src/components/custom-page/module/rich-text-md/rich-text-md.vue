<template>
  <view>
    <view v-for="(groupItem, groupIndex) in richTextGroup" :key="groupIndex">
      <view class="rich-text-list-between">
        <view
          class="rich-text-item"
          v-for="(richTextItem, index) in groupItem.richText"
          :key="index"
          style="width:100%"
        >
          <mp-html :content="richTextItem.content || ''" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mpHtml from '@/common/support/mp-html/mp-html'
const pageOption = Page.BasePage({
    components: {
        mpHtml,
    },
  name: "rich-text-md",
  props: {
    moduleInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dynamicSetting() {
      return this.moduleInfo.dynamicSetting || {};
    },
    richTextGroup() {
      let moduleInfo = this.moduleInfo || {};
      let moduleData = moduleInfo.moduleData || {};
      return moduleData.richTextGroup || [];
    },
  },
  data() {
    return {
    };
  },
  methods: {},
});
export default pageOption;
</script>

<style lang="less" scoped>
.rich-text-list-between {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  width: 100%;
  .rich-text-item {
    // 后端传回来的row进行计算获得
    // width: 47%;
    // margin-bottom: 26rpx;
    .rich-text-icon {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 75%;
      overflow: hidden;
      image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }
    .rich-text-info {
      width: 100%;
    }
  }
} 
</style>