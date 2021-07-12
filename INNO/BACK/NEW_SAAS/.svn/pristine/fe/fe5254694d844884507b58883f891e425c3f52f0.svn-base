<style lang="less">
	.filp-card-form{
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
	<div class="filp-card-form">
		<titleBar>营销logo组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="一列展示图片数量">
				<RadioGroup v-model="formItem.row">
					<Radio :label="2">2张</Radio>
					<Radio :label="3">3张</Radio>
					<Radio :label="4">4张</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="元素间距（有背景色的情况下，间距效果会更佳）">
				<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem>
			<FormItem label="logo图片( 为了美观，请尽量使用统一大小规格的图片 )">
				<draggable ghost-class="ghost" :list="formItem.images" :group="{name:'imageList'}" handle=".handle_ad" v-bind="dragOptions"
				 @start="dragStart" @end="dragEnd" @change="dragChange">

					<div v-for="(item,index) in formItem.images" :name="index" :key="index" class="item-list">
						<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg(index)" />
						<Icon type="md-apps" class="handle_ad" title="拖拽排序" />

						<Row :gutter="16">
							<Col span="6">
								<div class="image-box" :style="'background-image: url('+item.img+');'"></div>
							</Col>
							<Col span="18">
								<div class="image-box-text" style="margin-top:20px;"><a @click="selectSingleImage(index)">更换图片</a></div>
							</Col>
						</Row>
					</div>
				</draggable>

				<Button long @click="selectImage" style="height:100px;" v-if="formItem.images.length == 0">
					<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加图片
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
	// import linkTo from '@/views/my-components/link-to/link-to';

	export default {
		name: 'imageAdForm',
		components: {
			titleBar,
			userImages,
			// linkTo,
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
					row: 4,
					gutter: 0,
					images: [],
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
			},
			
		},
		methods: {
			// 初始化
			init() {
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[this.currIndex].setting;

				if (typeof(this.formItem.row) == 'undefined') {
					this.$set(this.formItem, 'row', 4);
					this.$set(this.formItem, 'gutter', 0);
					this.$set(this.formItem, 'images', [
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-1.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-2.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-3.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-4.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-5.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-6.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-7.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-8.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-9.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-10.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-11.png"
						},
						{
							img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/fan-12.png"
						}
					]);
					this.$set(this.formItem, 'backgroundImage',"https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/filpBg.png")
				}
			},
			// 链接到 选中后的回调
			onSelectLink(index, selectedLink) {
				this.$set(this.formItem.images[index], 'link', selectedLink);
			},
			// 移除图片
			removeImg(index) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除图片吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.images, index);
					},
				});
			},
			// 选择图片（单选）
			selectSingleImage(index) {
				this.currImageIndex = index;
				this.$refs['user-images'].showModal({
					name: 'single-image',
					multi: 0,
					selectedImages: [],
				});
			},
			// 选择图片（多选）
			selectImage() {
				this.$refs['user-images'].showModal({
					name: 'images',
					multi: 0,
					selectedImages: []
				});
			},
			// 图片选择组件的回调
			returnImageUrl(obj) {
				console.log("obj", obj);
				if (obj.name == 'single-image') {
					
					// 单张图片的切换
					this.$set(this.formItem.images[this.currImageIndex], 'img', obj.val);
				} else {
					let arrImg = [];
					for (let i in this.formItem.images) {
						arrImg.push(this.formItem.images[i].img);
					}
					let vals = obj.val instanceof Array ? obj.val : [obj.val];
					let items = obj.item instanceof Array ? obj.item : [obj.item];
					for (let i = 0; i < vals.length; i++) {
						if (arrImg.indexOf(vals[i]) == -1) {
							this.formItem.images.push({
								img: vals[i],
								image: vals[i],
								title: '',
								width: items[i].width,
								height: items[i].height,
								tag: '',
							});
						}
					}
				}
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
