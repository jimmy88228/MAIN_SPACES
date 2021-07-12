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
		<titleBar>图片广告组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="模板类型" prop="type">
				<RadioGroup v-model="formItem.type" size="small" type="button">
					<Radio label="t1">
						静态图
					</Radio>
					<Radio label="t2">
						轮播图
					</Radio>
				</RadioGroup>
			</FormItem>

			<template v-if="formItem.type == 't1'">
				<FormItem label="一列展示图片数量">
					<RadioGroup v-model="formItem.row">
						<Radio :label="1">1张</Radio>
						<Radio :label="2">2张</Radio>
						<Radio :label="3">3张</Radio>
						<Radio :label="4">4张</Radio>
						<Radio :label="5">5张</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="只在一行内展示，多出部分左右滑动">
					<i-switch v-model="formItem.open_slide" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<FormItem label="图片间距（有背景色的情况下，间距效果会更佳）">
					<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
				</FormItem>
			</template>
			<template v-else-if="formItem.type == 't2'">
				<FormItem label="自动轮播">
					<i-switch v-model="formItem.autoPlay" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<!-- // 暂时屏蔽
				<FormItem v-show="formItem.autoPlay==true" label="自动轮播时间间隔，单位:秒">
					<Slider v-model="formItem.interval" :min="3" :max="10" show-input style="margin:0 30px 0 10px;"></Slider>
				</FormItem>-->
				<FormItem label="指示灯">
					<RadioGroup v-model="formItem.indicator">
						<Radio label="dot">圆点</Radio>
						<Radio label="rect">条状</Radio>
						<!-- // 暂时屏蔽数字选项
						<Radio label="number">数字</Radio>
						-->
						<Radio label="none">不显示</Radio>
					</RadioGroup>
				</FormItem>
				<!-- // 暂时屏蔽
				<FormItem label="显示图片标题">
					<i-switch v-model="formItem.showTitle" size="large">
						<span slot="open">显示</span>
						<span slot="close">隐藏</span>
					</i-switch>
				</FormItem>
				<FormItem label="3D效果">
					<i-switch v-model="formItem.effect3d" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				-->
			</template>

			<FormItem label="图片列表 ( 为了美观，请尽量使用统一大小规格的图片 )">
				<draggable ghost-class="ghost" :list="formItem.images" :group="{name:'imageList'}" handle=".handle_ad" v-bind="dragOptions"
				 @start="dragStart" @end="dragEnd" @change="dragChange">

					<div v-for="(item,index) in formItem.images" :name="index" :key="index" class="item-list">
						<Icon type="ios-close-circle" class="close" title="移除" @click="removeImg(index)" />
						<Icon type="md-apps" class="handle_ad" title="拖拽排序" />

						<Row :gutter="16">
							<Col span="6">
							<div class="image-box" :style="'background-image: url('+item.img+');'"></div>
							<div class="image-box-text"><a @click="onImageHotmap(index)">绘热区</a> | <a @click="selectSingleImage(index)">换图</a></div>
							</Col>
							<Col span="18">
							<div>
								标题
								<Input v-model="item.title" size="small" placeholder="图片名称" style="width:160px;margin-left:10px;" />
							</div>
							<div>
								链接
								<!--添加链接组件-->
								<linkTo style="margin-left:9px;" :itemIndex="index" 
								:selectLink="(typeof(item.link) != 'undefined' && item.link != null ? item.link : {})"
								 @on-selected="onSelectLink">
								</linkTo>
							</div>
							<div>
								标签
								<Input v-model="item.tag" style="width:150px;margin-left:9px;" size="small"></Input>
							</div>
							</Col>
						</Row>
					</div>
				</draggable>

				<Button long @click="selectImage">
					<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加图片
				</Button>

			</FormItem>
		</Form>

		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>

		<!--图片热区编辑器-->
		<imageHotmapForm ref="image-hotmap-form"></imageHotmapForm>
	</div>
</template>

<script>
	/**
	 * 图片广告小工具
	 */
	import draggable from 'vuedraggable';
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userImages from '@/views/my-components/user-images/user-images';
	import linkTo from '@/views/my-components/link-to/link-to';
	import imageHotmapForm from './image-hotmap-form';

	export default {
		name: 'imageAdForm',
		components: {
			titleBar,
			userImages,
			linkTo,
			draggable,
			imageHotmapForm
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
					type: 't1',
					row: 1,
					gutter: 0,
					indicator: 3,
					images: [],
					open_slide: false,
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

				if (typeof(this.formItem.type) == 'undefined') {
					this.$set(this.formItem, 'type', 't1');
					this.$set(this.formItem, 'autoPlay', true);
					this.$set(this.formItem, 'row', 1);
					this.$set(this.formItem, 'interval', 3);
					this.$set(this.formItem, 'indicator', 'dot');
					this.$set(this.formItem, 'showTitle', true);
					this.$set(this.formItem, 'images', []);
					this.$set(this.formItem, 'open_slide', false);
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
					multi: 1,
					selectedImages: []
				});
			},
			// 图片选择组件的回调
			returnImageUrl(obj) {
				if (obj.name == 'single-image') {
					// 单张图片的切换
					this.$set(this.formItem.images[this.currImageIndex], 'img', obj.val);
				} else {
					let arrImg = [];
					for (let i in this.formItem.images) {
						arrImg.push(this.formItem.images[i].img);
					}

					for (let i in obj.val) {
						if (arrImg.indexOf(obj.val[i]) == -1) {
							this.formItem.images.push({
								img: obj.val[i],
								image: obj.val[i],
								title: '',
								width: obj.item[i].width,
								height: obj.item[i].height,
								tag: '',
							});
						}
					}
				}
			},
			// 图片的热区编辑
			onImageHotmap(index) {
				this.$refs['image-hotmap-form'].openModal(index, this.formItem);
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
