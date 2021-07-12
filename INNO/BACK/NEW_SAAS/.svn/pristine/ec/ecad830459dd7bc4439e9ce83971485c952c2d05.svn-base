<style lang="less">
	.matrix-active-form{
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
	.ivu-slider-input .ivu-input-number{
		margin:0px;
	}
}
</style>

<template>
	<div class="matrix-active-form">
		<titleBar>矩阵按钮组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="按钮图片( 为了美观，请尽量使用统一大小规格的图片 )">
				<div class="item-list">
						<Row :gutter="16">
							<Col span="6">
								<div class="image-box" :style="'background-image: url('+formItem.activeBtn.img+');'">
									<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg('activeBtn')" />
									<a class="image-box-text" @click="selectSingleImage('activeBtn')">更换图片</a>
								</div>
							</Col>
							<Col span="18">
								<div class="flex f-align-center" style="margin-top:35px;">
									<div class="f-shrink0" style="margin-right:15px;">图片占比</div> 
									<Slider v-model="formItem.activeBtn.mix" 
									:min="0" :max="100" 
									show-input 
									style="width:100%;"></Slider>
								</div>
							</Col>
						</Row>
					</div>
			</FormItem>
		</Form>
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>
</template>

<script>
	/**
	 * 矩阵按钮组件
	 */
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userImages from '@/views/my-components/user-images/user-images';
	export default {
		name: 'matrixActive',
		components: {
			titleBar,
			userImages,
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
					activeBtn: {
						img: "",
						mix: 0
					}
				},
				dataList: [],
				drag: false
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

				if (typeof(this.formItem.activeBtn) == 'undefined') {
					this.$set(this.formItem, 'activeBtn', {img: "", mix: 0});
				}
			},
			// 移除图片
			removeImg(type) {
				this.currImageIndex = type;
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除图片吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$set(this.formItem[type], 'img', "")
					},
				});
			},
			// 选择图片（单选）
			selectSingleImage(type) {
				this.currImageIndex = type;
				this.$refs['user-images'].showModal({
					name: 'single-image',
					multi: 0,
					selectedImages: [],
				});
			},
			// 图片选择组件的回调
			returnImageUrl(obj) {
				console.log("obj",obj)
				let item = obj.item || {};
				this.$set(this.formItem, this.currImageIndex, {
					width: item.width,
					height:item.height,
					img: obj.val
				});
				
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
