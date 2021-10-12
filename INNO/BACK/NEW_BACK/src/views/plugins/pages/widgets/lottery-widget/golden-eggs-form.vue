<style lang="less" scoped="scoped">
	.fruit-lottery{
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
	<div class="fruit-lottery">
		<titleBar>营销水果机 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<!-- <FormItem label="元素间距（有背景色的情况下，间距效果会更佳）">
				<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem> -->
			<FormItem label="默认奖项设置">
				<div class="item-list">
					<Row :gutter="16">
						<Col span="12">
							<div>奖项图：</div>
							<div class="flex" style="">
								<div class="image-box" :style="'background-image: url('+formItem.defaultPrize.img+');'">
									<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg('defaultPrize')" />
									<a class="image-box-text" @click="selectSingleImage('defaultPrize')">{{ formItem.defaultPrize.img ? '更换图片' : '选择图片' }}</a>
								</div>
							</div>
						</Col>
						<!-- <Col span="12">
							<div>文字颜色：</div>
							<ColorPicker v-model="formItem.defaultPrize.color" />
						</Col> -->
					</Row>
				</div>
			</FormItem>
			<FormItem label="触发奖项设置">
				<div class="item-list">
					<Row :gutter="16">
						<Col span="12">
							<div>奖项图：</div>
							<div class="flex" style="">
								<div class="image-box" :style="'background-image: url('+formItem.activePrize.img+');'">
									<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg('activePrize')" />
									<a class="image-box-text" @click="selectSingleImage('activePrize')">{{ formItem.activePrize.img ? '更换图片' : '选择图片' }}</a>
								</div>
							</div>
						</Col>
						<!-- <Col span="12">
							<div>文字颜色：</div>
							<ColorPicker v-model="formItem.activePrize.color" />
						</Col> -->
					</Row>
				</div>
			</FormItem>
			<FormItem label="点击按钮设置">
				<div class="item-list">
					<Row :gutter="16">
						<Col span="12">
							<div>锤子图：</div>
							<div class="flex" style="">
								<div class="image-box" :style="'background-image: url('+formItem.lotteryBtn.img+');'">
									<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg('lotteryBtn')" />
									<a class="image-box-text" @click="selectSingleImage('lotteryBtn')">{{ formItem.lotteryBtn.img ? '更换图片' : '选择图片' }}</a>
								</div>
							</div>
						</Col>
						<!-- <Col span="12">
							<div>文字颜色：</div>
							<ColorPicker v-model="formItem.lotteryBtn.color" />
						</Col> -->
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
		name: 'imageAdForm',
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
					// row: 3,
					// gutter: 0,
					defaultPrize: {
						img: "",
						// color: ""
					},
					activePrize: {
						img: "",
						// color: ""
					},
					lotteryBtn: {
						img: "",
						// color: ""
					}
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

				if (typeof(this.formItem.row) == 'undefined') {
					// this.$set(this.formItem, 'row', 3);
					// this.$set(this.formItem, 'gutter', 0);
					this.$set(this.formItem, 'defaultPrize', {
						img: "http://devimgtest.innourl.com/SAAS_IMAGE/images/TES/index/gallery/20210719/20210719190539835_4636085.png",
						// color: "#B3711C"
					});
					this.$set(this.formItem, 'activePrize', {
						img: "http://devimgtest.innourl.com/SAAS_IMAGE/images/TES/index/gallery/20210720/20210720140741355_6281355.png",
						// color: "#ECED92"
					});
					this.$set(this.formItem, 'lotteryBtn', {
						img: "http://devimgtest.innourl.com/SAAS_IMAGE/images/TES/index/gallery/20210719/20210719190539827_7854274.png",
						// color: "#fff"
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
				let editObj = this.formItem[this.currImageIndex] || {};
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
