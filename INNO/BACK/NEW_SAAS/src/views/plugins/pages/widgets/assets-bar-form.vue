<style lang="less">
	.assets-bar-form{
	padding:10px;

  .img-item-list{
  	border-radius: 5px;
  	margin-bottom:12px;
  	margin-right:10px;
  	position: relative;
  	padding:5px;
  	background: #fff;
  	box-shadow: 0 0 4px 0 rgba(10,42,97,.2);

    .handle_a{
      position: absolute;
      right:5px;
      top:-10px;
      font-size: 10px;
      cursor: move;
      display:none;
      color: #2d8cf0;
      font-size: 22px;
    }
    &:hover{
      .close, .handle_a{
        display: block;
      }
    }
  }
}
</style>

<template>
	<div class="assets-bar-form">
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
			<FormItem>
				<draggable ghost-class="ghost" :list="formItem.list" :group="{name:'iconList'}" handle=".handle_a" v-bind="dragOptions"
				 @start="dragStart" @end="dragEnd" @change="dragChange">
					<div v-for="(item,index) in formItem.list" :name="index" :key="index" class="img-item-list">
						<Icon type="md-apps" class="handle_a" title="拖拽排序" />
						<Row :gutter="8">
							<Col span="6">
							<i-switch v-model="item.is_enable" size="large" style="margin-top:35px;">
								<span slot="open">启用</span>
								<span slot="close">关闭</span>
							</i-switch>
							</Col>
							<Col span="18">
							<div>
								标题
								<Input v-model="item.name" size="small" placeholder="名称" style="font-size:12px;width:160px;margin-left:10px;" />
							</div>
							<div>
								提示
								<Input v-model="item.tip" size="small" placeholder="提示信息" style="font-size:12px;width:160px;margin-left:10px;" />
							</div>
							<div>关联功能 <tag style="margin-left:10px;">{{item.type_name}}</tag>
							</div>
							</Col>
						</Row>
					</div>
				</draggable>

			</FormItem>
		</Form>

	</div>
</template>

<script>
	import draggable from "vuedraggable";

	/**
	 * 我的资产（个人中心）
	 */
	export default {
		name: 'assetsBarForm',
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
