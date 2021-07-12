<style lang="less">
	.staff-service-form{
	padding:10px;

  .image-box{
    width:60px;
    height:60px;
    margin-top:15px;
  }

  .img-item-list{
  	border-radius: 5px;
  	margin-bottom:12px;
  	margin-right:10px;
  	position: relative;
  	padding:5px;
  	background: #fff;
  	box-shadow: 0 0 4px 0 rgba(10,42,97,.2);

    .handle_s{
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
      .close, .handle_s{
        display: block;
      }
    }
  }
}
</style>

<template>
	<div class="staff-service-form">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="是否显示">
				<i-switch v-model="formItem.is_enable" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
			<FormItem label="标题文字">
				<Input v-model="formItem.title" placeholder="我的订单"></Input>
			</FormItem>
			<FormItem label="标题提示文字">
				<Input v-model="formItem.tip" placeholder=""></Input>
			</FormItem>
			<FormItem label="显示形式">
				<RadioGroup v-model="formItem.display_format">
					<Radio label="grid">宫格</Radio>
					<Radio label="list">列表</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-show="formItem.display_format =='grid' " label="宫格一行">
				<RadioGroup v-model="formItem.row">
					<Radio :label="3">3个</Radio>
					<Radio :label="4">4个</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem>
				<draggable ghost-class="ghost" :list="formItem.list" :group="{name:'iconList'}" handle=".handle_s" v-bind="dragOptions"
				 @start="dragStart" @end="dragEnd" @change="dragChange">
					<div v-for="(item,index) in formItem.list" :name="index" :key="index" class="img-item-list">
						<Icon type="md-apps" class="handle_s" title="拖拽排序" />
						<Row type="flex" :gutter="4">
							<Col style="width:60px">
							<i-switch v-model="item.is_enable" size="large" style="margin-top:35px;">
								<span slot="open">启用</span>
								<span slot="close">关闭</span>
							</i-switch>
							</Col>
							<Col style="width:70px;">
							<div class="image-box" :style="'background-image: url('+item.icon+');'" title="选择图标" @click="openIconsModal(index)"></div>
							</Col>
							<Col style="flex:1 1 0%;">
							<div>
								标题
								<Input v-model="item.name" size="small" placeholder="名称" style="font-size:12px;width:140px;margin-left:5px;" />
							</div>
							<div>
								提示
								<Input v-model="item.tip" size="small" placeholder="提示信息" style="font-size:12px;width:140px;margin-left:5px;" />
							</div>
							<div>关联功能 <tag style="margin-left:10px;">{{item.type_name}}</tag>
							</div>
							</Col>
						</Row>
					</div>
				</draggable>

			</FormItem>
		</Form>

		<!--图标选择组件-->
		<iconSelect ref="icon-select" @on-return-url="onReturnIcon"></iconSelect>
	</div>
</template>

<script>
	import iconSelect from '@/views/my-components/icon-select/icon-select';
	import draggable from "vuedraggable";

	/**
	 * 导购服务（个人中心）
	 */
	export default {
		name: 'staffServiceForm',
		components: {
			iconSelect,
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
					title: '导购服务',
					tip: '',
					order: [],
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
			// 调起icon选择器
			openIconsModal(name = '', url = '') {
				this.$refs['icon-select'].showModal({
					name: name,
					multi: 0,
					selectedImage: url,
					contentType: 'SYSTEM_ICON',
					maxSize: 500,
				});
			},
			// icon 回调
			onReturnIcon(obj) {
				this.$set(this.formItem.list[ obj.name ], 'icon', obj.val);
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
