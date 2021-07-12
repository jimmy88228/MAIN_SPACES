<style lang="less" scoped="scoped">
	.big-wheel-form{
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
    background-color:rgba(0,0,0,0.2);
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
	<div class="big-wheel-form">
		<titleBar>营销大转盘组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="默认奖项设置">
				<div class="item-list">
					<Row :gutter="16">
						<Col span="24">
							<div>奖项背景：</div>
							<div class="flex" style="">
								<div class="image-box" :style="'background-image: url('+formItem.targetImg.img+');'">
									<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg('targetImg')" />
									<a class="image-box-text" @click="selectSingleImage('targetImg')">{{formItem.targetImg.img ? '更换图片' : '上传图片'}}</a>
								</div>
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
	 * 图片广告小工具
	 */
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userImages from '@/views/my-components/user-images/user-images';
	// import linkTo from '@/views/my-components/link-to/link-to';

	export default {
		name: 'bigWheelForm',
		components: {
			titleBar,
			userImages,
			// linkTo,
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
					row: 6,
					targetImg: {
						img: "",
					},
				},

				dataList: [],
				drag: false
			}
		},
		computed: {},
		methods: {
			// 初始化
			init() {
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[this.currIndex].setting;
				console.log("组件初始化",this.formItem);
				if (typeof(this.formItem.row) == 'undefined') {
					this.$set(this.formItem, 'row', 6);
				}
				if(!(this.formItem.targetImg && this.formItem.targetImg.img)){
					this.$set(this.formItem, 'targetImg', {
						img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/pointer.png"
					});
				}
			},
			// 移除图片
			removeImg(type) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除图片吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.formItem[type] && this.$set(this.formItem[type], 'img', '');
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
				console.log("obj", obj);
				let editObj = this.formItem[this.currImageIndex] || {};
				editObj = {
					...editObj
				}
				this.$set(this.formItem, this.currImageIndex, {
					...editObj,
					img: obj.val,
					width: obj.item && obj.item.width,
					height: obj.item && obj.item.height,
				});
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
