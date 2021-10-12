<template>
	<div class="ad-item-form">
		<draggable ghost-class="ghost" :list="formItem.images" :group="{name:'imageList'}" handle=".handle_ad"
			v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="dragChange">

			<div v-for="(item,index) in formItem.images" :name="index" :key="index" class="item-list">

				<Icon type="ios-close-circle-outline" class="close" title="移除" @click="removeImg(index)" />
				<Icon type="md-apps" class="handle_ad" title="拖拽排序" />

				<div>
					<template v-if="info.row == 1">
						<span v-if="index%2==0" style="color:green">已登录-显示的图片</span>
						<span v-else style="color:orangered">未登录-显示的图片</span>
					</template>
					<template v-else>
						<span v-if="index%4==0 || index%4==1" style="color:green">已登录-显示的图片</span>
						<span v-else style="color:orangered">未登录-显示的图片</span>
					</template>
				</div>

				<Row :gutter="16">
					<Col span="6">
					<div class="image-box" :style="'background-image: url('+item.img+');'"></div>
					<div class="image-box-text"><a @click="onImageHotmap(index)">绘热区</a> | <a
							@click="selectSingleImage(index)">换图</a></div>
					</Col>
					<Col span="18">
					<div>
						标题
						<Input v-model="item.title" size="small" placeholder="图片名称"
							style="width:160px;margin-left:10px;" />
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


		<Button @click="selectImage" style="width:96%; margin:5px;">
			<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加图片
		</Button>


		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>

		<!--图片热区编辑器-->
		<imageHotmapForm ref="image-hotmap-form"></imageHotmapForm>
	</div>
</template>

<script>
	import draggable from "vuedraggable";
	import userImages from '@/views/my-components/user-images/user-images';
	import linkTo from '@/views/my-components/link-to/link-to';
	import imageHotmapForm from './image-hotmap-form';

	export default {
		name: 'imageAdItemForm',
		components: {
			draggable,
			userImages,
			linkTo,
			imageHotmapForm
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0,
			},
			groupIndex: {
				type: [Number, String],
				default: 0,
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
		data() {
			return {
				formItem: {
					images: [],
				},
				info: {},
				panelVal: '1',
				drag: false,
			}
		},
		methods: {
			init() {
				// 双向绑定store 的数据
				let dataList = this.$store.state.app.pageCompList;
				this.info = dataList[this.currIndex].setting;
				this.formItem = dataList[this.currIndex].setting.imagesGroup[this.groupIndex];

				if (typeof(this.formItem.images) == 'undefined') {
					this.$set(this.formItem, 'images', []);
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
			},
		},
		watch: {
			'currIndex'(to) {
				this.init();
			},
			'groupIndex'(to) {
				this.init();
			},
			'formItem.images'(to) {
				this.$emit('on-change', {
					data: this.formItem.images,
					groupIndex: this.groupIndex,
				});
			}
		},
		mounted() {
			this.init();
		},
	}
</script>

<style lang="less">
	.ad-item-form {
		.image-box {
			width: 75px;
			height: 75px;
			line-height: 75px;
			border: 1px solid #eee;
			border-radius: 5px;
			text-align: center;
			cursor: pointer;
			background: center center no-repeat;
			background-size: 100% auto;
			margin-right: 5px;
			position: relative;
		}

		.image-box-text {
			font-size: 12px;
		}

		.item-list {
			border-radius: 5px;
			margin-bottom: 12px;
			margin-right: 10px;
			position: relative;
			padding: 5px;
			background: #fff;
			box-shadow: 0 0 4px 0 rgba(10, 42, 97, .2);

			.close {
				position: absolute;
				right: -10px;
				top: -10px;
				font-size: 10px;
				cursor: pointer;
				display: none;
				color: red;
				font-size: 22px;
			}

			.handle_ad {
				position: absolute;
				right: 25px;
				top: -10px;
				font-size: 10px;
				cursor: move;
				display: none;
				color: #19be6b;
				font-size: 22px;
			}

			&:hover {

				.close,
				.handle_ad {
					display: block;
				}
			}
		}

		.ghost {
			opacity: 0.5;
			background: #eee;
		}

		.link-to .link-tags {
			max-width: 115px;
		}

		.ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper {
			font-size: 12px;
		}
	}
</style>
