<style lang="less">
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
	<div class="ad-form">
		<titleBar>矩阵奖品池 设置</titleBar>

		<!-- <Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="标题logo( 为了美观，请尽量使用统一大小规格的图片 )">
				<div class="item-list" v-if="formItem.prizeTitle.img">
						<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg('prizeTitle')" />
						<Row :gutter="16">
							<Col span="6">
								<div class="image-box" :style="'background-image: url('+formItem.prizeTitle.img+');'"></div>
							</Col>
							<Col span="18">
								<div class="image-box-text"><a @click="selectSingleImage('prizeTitle')">更换图片</a></div>
								<div class="image-box-text flex f-align-center">
								<div class="f-shrink0" style="margin-right:15px;">图片占比</div> 
								<Slider v-model="formItem.prizeTitle.mix" 
								:min="50" :max="100" 
								show-input 
								style="width:100%;"></Slider>
								</div>
							</Col>
						</Row>
					</div>
				<Button long @click="selectSingleImage('prizeTitle')" style="height:100px;" v-else>
					<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加图片
				</Button>
			</FormItem>
		</Form> -->

		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userImages from '@/views/my-components/user-images/user-images';

	export default {
		name: 'matrixPrizesForm',
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
					// prizeTitle: {
					// 	mix: 50,
					// 	img: ""
					// }
				},

				dataList: [],
				currImageIndex: ""
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
				let item = obj.item || {};
				let _obj = this.formItem[this.currImageIndex] || {};
				this.$set(this.formItem, this.currImageIndex, {
					..._obj,
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
