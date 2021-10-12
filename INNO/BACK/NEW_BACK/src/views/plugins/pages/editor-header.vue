<style lang="less">
.goods-editor-header{
	padding: 10px 20px;
	line-height: 35px;
}
</style>

<template>
    <div class="goods-editor-header">
    	<Row>
			<Col :span="12">
				<Tooltip content="返回">
					<Icon v-show="isInner==false" type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
			</Col>
			<Col :span="12" style="text-align:right;">
				<Button type="success" @click="onSave">保存</Button>
			</Col>
		</Row>
    </div>
</template>

<script>
/**
 * 商品页面编辑器 - 头部
 */
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
  computed: {
  },
  methods: {
    	/**
    	 * @desc 初始化方法
    	 */
    init () {

    },
    // 返回
    goBack () {
        	window.close();
    },
    // 保存按钮
    onSave () {
      this.$emit('on-save');
    }
  },
  watch: {
  },
  mounted () {
    this.init();
  },
  created () {

  }
};
</script>
