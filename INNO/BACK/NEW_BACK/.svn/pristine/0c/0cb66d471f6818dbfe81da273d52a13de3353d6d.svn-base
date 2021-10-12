<style lang="less">
.uc-sign-form{
	padding:10px;
}
</style>

<template>
	<div class="uc-sign-form">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="是否显示">
				<i-switch v-model="formItem.is_enable" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
			<FormItem label="标题文字">
				<Input v-model="formItem.title" placeholder=""></Input>
			</FormItem>
			<FormItem label="标题提示文字">
				<Input v-model="formItem.tip" placeholder="标题提示文字"></Input>
			</FormItem>

		</Form>

	</div>
</template>

<script>
	import draggable from "vuedraggable";

	/**
	 * 签到（个人中心）
	 */
	export default {
		name: 'ucSignForm',
		components: {
			draggable,
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
					title: '签到',
					tip: '',
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
			dragChange() {

			},
			// 拖动开始
			dragStart(e) {
				this.drag = true;
			},
			// 拖动结束
			dragEnd(e) {
				this.drag = false;
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
