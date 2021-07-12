<template>
	<div class="comment-setting">
		<!--客服组件设置-->
		<options ref="options" :showCodes="settingCodes" @on-success="init"></options>
	</div>
</template>

<script>
	/**
	 * 评论设置
	 */
	import options from '@/views/settings/options/options';
	
	export default {
		components: {
			options,
		},
		props: {},
		data() {
			return {
				settingCodes: [
					'storeComments',
					'shopComments',
				],
			}
		},
		methods: {
			// 初始化
			init() {
				this.$refs['options'].openModal();
			},
		},
		watch: {
	
		},
		mounted() {
			this.init();
		},
	}
</script>
	
<style lang="less">
.comment-setting {
	
}
</style>