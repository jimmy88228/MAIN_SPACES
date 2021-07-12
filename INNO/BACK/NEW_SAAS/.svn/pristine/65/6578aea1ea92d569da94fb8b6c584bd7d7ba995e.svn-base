<style lang="less">
	.user-center-header-form {
		padding: 10px;

		.image-box {
			width: 65px;
			height: 65px;
		}

		.img-item-list {
			border-radius: 5px;
			margin-bottom: 12px;
			margin-right: 10px;
			position: relative;
			padding: 5px;
			background: #fff;
			box-shadow: 0 0 4px 0 rgba(10, 42, 97, .2);

			.handle {
				position: absolute;
				right: 5px;
				top: -10px;
				font-size: 10px;
				cursor: move;
				display: none;
				color: #2d8cf0;
				font-size: 22px;
			}

			&:hover {

				.close,
				.handle {
					display: block;
				}
			}
		}
	}
</style>

<template>
	<div class="user-center-header-form">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="用户条码">
				<i-switch v-model="formItem.myQRcode" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
			<FormItem label="条码内容">
				<RadioGroup v-model="formItem.barcode_card">
					<Radio :label="1" :disabled="!formItem.myQRcode">手机号</Radio>
					<Radio :label="0" :disabled="!formItem.myQRcode">仅卡号</Radio>
					<Radio v-if="$route.fullPath.indexOf('cloud-shop') == -1" :label="2" :disabled="!formItem.myQRcode">第三方卡号</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="会员动态码">
				<i-switch v-model="formItem.dynamicCode" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
			<FormItem label="用户二维码">
				<i-switch v-model="formItem.user_qrcode" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
		</Form>

	</div>
</template>

<script>
	/**
	 * 头部（个人中心）
	 */
	export default {
		name: 'assetsBarForm',
		components: {
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				formItem: {
					is_enable: true,
					title: '我的资产',
					tip: '',
					assets: [],
				},

				// 表单数据规则
				ruleValidate: {}
			}
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: "description",
					disabled: false,
					ghostClass: "ghost",
				};
			}
		},
		methods: {
			init() {
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[this.currIndex].setting;
			},
		},
		watch: {
			'currIndex'(to) {
				this.init();
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
