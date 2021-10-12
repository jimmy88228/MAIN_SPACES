<style lang="less">
	.cs-setting {}
</style>

<template>
	<div class="cs-setting">

		<!--客服组件设置-->
		<options ref="options" :showCodes="settingCodes" @on-success="init"></options>
	</div>
</template>

<script>
	/**
	 * 客服设置
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
					'customerService',
					'customerServiceComment',
					'customerServiceTags',
					'customerServiceTplMessage',
					'customerServiceMobile',
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
