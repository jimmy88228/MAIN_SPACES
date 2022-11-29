<style lang="less" scoped>
.goods-editor-header{
  // border:1px solid #8a8989;
  margin-bottom: 20px;
  margin-top:-30px;
}
</style>

<template>
    <div class="goods-editor-header flex-b-c bg-page">
				<!-- <Tooltip content="返回">
					<Icon v-show="isInner==false" type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip> -->
        <div></div>
				<Button type="primary" @click="onSave">保存</Button>
    </div>
</template>

<script>
export default {
  name: 'editorHeader',
  components: {
  },
  props: {
    // 当前编辑器是否作为内嵌编辑器使用
    isInner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    goBack () {
      window.close();
    },
    onSave () {
      console.log("save", this.$store.state.pages);
      let { compPageInfo, pageCompList } = this.$store.state.pages || {}
      this.$emit('on-save', {compPageInfo, pageCompList});
    },
  },
  mounted () {
  },
};
</script>
