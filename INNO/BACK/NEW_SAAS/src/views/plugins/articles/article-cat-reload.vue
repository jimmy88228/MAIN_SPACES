<style lang="less">
</style>

<template>
	<div>
	</div>
</template>

<script>
/**
 * 文章分类 列表 刷新跳转 中间页
 */

export default {
  components: {
  },
  props: {
  },
  data () {
    	return {
    	}
   	},
   	methods: {
    	// 初始化
    	init () {
    		this.$router.push('/plugins/article-cat');
    	}
  },
  watch: {

  },
  mounted () {
    	this.init();
  }
}
</script>
