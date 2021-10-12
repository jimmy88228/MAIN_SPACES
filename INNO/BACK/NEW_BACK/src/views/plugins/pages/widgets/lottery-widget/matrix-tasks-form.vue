<style lang="less" scoped="scoped">
	.ad-form{
	padding:5px;

	.image-box{
		width: 75px;
		height:75px;
		line-height:75px;
		border: 1px solid #eee;
		border-radius: 5px;
		text-align: center;
		cursor: pointer;
		background: center center no-repeat;
		background-size: 100% auto;
		margin-right:5px;
		position: relative;
	}
  .image-box-text{
    font-size:12px;
		position:absolute;
		left:0px;
		bottom:0px;
		width:100%;
		text-align:center;
		line-height:20px;
		height:20px;
		background-color:rgba(0,0,0,0.1);
  }
	.item-list{
		border-radius: 5px;
		margin-bottom:12px;
		margin-right:10px;
		position: relative;
		padding:5px;
		background: #fff;
		box-shadow: 0 0 4px 0 rgba(10,42,97,.2);

		.close{
			position: absolute;
			right:-10px;
			top:-10px;
			font-size: 10px;
			cursor: pointer;
			display:none;
			color:red;
			font-size: 22px;
			line-height:22px;
		}
		.handle_ad{
			position: absolute;
			right:25px;
			top:-10px;
			font-size: 10px;
			cursor: move;
			display:none;
			color: #2d8cf0;
			font-size: 22px;
		}
		&:hover{
			.close, .handle_ad{
				display: block;
			}
		}
	}
	.ghost {
		opacity: 0.5;
		background: #eee;
	}
	.link-to .link-tags{
		max-width: 115px;
	}
	.ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper{
		font-size:12px;
	}
}
</style>

<template>
	<div class="ad-form">
		<titleBar>矩阵任务池 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="任务样式设置">
				<draggable ghost-class="ghost" :list="formItem.tasks" :group="{name:'imageList'}" handle=".handle_ad" v-bind="dragOptions"
				 @start="dragStart" @end="dragEnd" @change="dragChange">
					<div v-for="(item,index) in formItem.tasks" :name="index" :key="index" class="item-list">
						
						<Icon type="md-apps" class="handle_ad" title="拖拽排序" />
						<Row :gutter="16">
							<Col span="10">
								<div>任务icon：</div>
								<div class="flex">
									<div class="image-box" :style="'background-image: url('+item.icon+');'">
										<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg(index, 'icon')" />
										<a class="image-box-text" @click="selectSingleImage(index, 'icon')">{{item.icon ? '更换图片':'选择图片'}}</a>
									</div>
								</div>
							</Col>
							<Col span="12">
									<div>按钮icon：</div>
									<div class="flex">
										<div class="image-box" :style="'background-image: url('+item.btn+');'">
											<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg(index, 'btn')" />
											<a class="image-box-text" @click="selectSingleImage(index, 'btn')">{{item.btn ? '更换图片':'选择图片'}}</a>
										</div>
									</div>
							</Col>
						</Row>
					</div>
				</draggable>
				<Button long @click="addTask">
					<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加任务
				</Button>
			</FormItem>
		</Form>

		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>
</template>

<script>
	/**
	 * 图片广告小工具
	 */
	import draggable from 'vuedraggable';
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userImages from '@/views/my-components/user-images/user-images';

	export default {
		name: 'imageAdForm',
		components: {
			titleBar,
			userImages,
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
					tasks: [],
				},
				dataList: [],
				drag: false,
				currImageIndex: 0,
				currImageType: ''
			}
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: 'description',
					disabled: false,
					ghostClass: 'ghost'
				};
			}
		},
		methods: {
			// 初始化
			init() {
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[this.currIndex].setting;
				if (typeof(this.formItem.tasks) == 'undefined') {
					this.$set(this.formItem, 'tasks', [{icon: "", btn: ""}]);
				}
			},
			addTask(){
				let formItem = this.formItem || {};
				this.$set(this.formItem.tasks, (formItem.tasks.length || 0), {icon: "", btn: ""})
			},
			// 移除图片
			removeImg(index, type) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除图片吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.tasks[index], type, '');
					},
				});
			},
			// 选择图片（单选）
			selectSingleImage(index, type) {
				this.currImageIndex = index;
				this.currImageType = type;
				let tasks = this.formItem.tasks || []
				this.$refs['user-images'].showModal({
					name: 'single-image',
					multi: 0,
					selectedImages: tasks[index][type] || "",
				});
			},
			// 图片选择组件的回调
			returnImageUrl(obj) {
				this.$set(this.formItem.tasks[(this.currImageIndex || 0)], this.currImageType, obj.val);
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
			}
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
