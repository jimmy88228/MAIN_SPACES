<style lang="less">
	.system-images-modal-body{
	.image-cat{
		height:480px;
		overflow-y: auto;
		overflow-x: hidden;
		width:100%;
    	margin-top: 10px;

    	.cat-item{
    		font-size:14px;
    		margin: 5px 5px 5px 0;
		    padding: 8px 10px;
		    cursor: pointer;
		    border-radius: 5px;
    	}
    	.cat-item.curr{
    		color:#fff;
    		background: #5cadff;
    	}
	}
	.scroll-content.is-system{
		.list-box{
			.list-item{
				height:85px;
			}
		}
	}

	.scroll-content{
		height:480px;
		overflow-y: auto;
		overflow-x: hidden;
		width:100%;
		border: 1px solid #eee;
    	margin-top: 10px;

		.list-box{
			.list-item{
				border:1px solid rgba(0,0,0,.04);
				width:120px;
				height:160px;
				margin:10px;
				border-radius: 5px;
				background: #fff;
				cursor: pointer;

				&:hover{
					box-shadow: 0 0 3px 4px rgba(0,0,0,.05);
				}
				.close{
					display:none;
					position: absolute;
				    font-size: 24px;
				    right: -10px;
				    top: -10px;
				    color:orangered;
				    background: #fff;
				    border-radius: 100%;
				}
				&:hover .close{
					display:block;
				}

				.img-remark-box{
					font-size:12px;
					margin-top: 10px;

					.img-remark{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.icon{
						font-size: 18px;
    					margin-left: 10px;
    					color:#ddd;
					}
				}

				.checked-icon{
					position: absolute;
					right: -1px;
				    bottom: 0;
				    font-size: 24px;
				    color: orangered;
				    display:none;
				}
			}
			.act-thumb2{
				background:no-repeat center center;
				background-size: 100% auto;
				height:80px;
			}
		}
		.list-item.curr{
			border:2px solid red;

			.checked-icon{
				color:red;
				display: block;
			}
		}
		.list-item.multi.curr{
			border:2px solid #2b85e4;

			.checked-icon{
				color:#2b85e4;
				display: block;
			}
		}
		.list-item.multi.disabled{
			border:2px solid #ddd;

			.checked-icon{
				color:#ddd;
				display:block;
			}
		}
	}
}
</style>

<template>
	<div>
		<Modal v-model="modalShow" :width="980" :styles="{top:'20px'}" :title="modalTitle">

			<template v-if="mediaName == 'VIDEO' ">
				<!--我的视频列表-->
				<userVideoList ref="user-video-list" @on-selected-video="selectedImg" @reload-data="initData"></userVideoList>
			</template>
			<template v-else>
				<!--我的图片列表-->
				<userImagesList ref="user-images-list" @on-selected-img="selectedImg" @reload-data="initData"></userImagesList>
			</template>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

			<div slot="footer">
				<Button type="text" size="large" @click.native="onCancel">取消</Button>
				<Button type="primary" size="large" @click.native="onOk">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import userImagesList from './user-images-list';
	import userVideoList from './user-video-list';
	import userAudioList from './user-audio-list';

	export default {
		name: 'userImages',
		components: {
			userImagesList,
			userVideoList,
			userAudioList
		},
		data() {
			return {
				// 系统图片列表
				systemImages: [],
				showSystemImage: false,
				currTabName: 'IMAGE',

				// 返回出去的字段的名称
				cbName: '',

				modalShow: false,
				modalTitle: '选择图片',
				mediaName: '',

				spinShow: false,

				// 选中的图片
				selectedIndex: '',
				selectedImgUrl: '',
				selectedItem: {},

				// 是否支持多选图片
				multi: 0,
				multiSelectedImgUrlBind: [],
				multiSelectedImgUrl: [], // 分双向绑定
				multiSelectedItem: [],

				// 系统图库（选中）
				showCatIndex: 0,
				showUserCatIndex: 0,
				showVideo: false,
				showImage: false,
				// 缓存图片路径
				saveSelectedImgUrl: ''
			};
		},
		props: {

		},
		computed: {

		},
		methods: {
			init() {
				// 是否显示系统图片
				this.showSystemImage = util.canShowSystemImage;
			},
			// 提供给父级调用
			showModal(obj) {
				this.cbName = obj.name;
				// 上传类型
				// 1.VIDEO 音频类型
				// 2.IMAGE 图片类型
				// 3.BOTH 音频和图片类型
				// 默认展示音频和图片类型
				this.contentType = obj.type || 'BOTH';
				// 图片大小
				this.maxSize = obj.maxSize || 2048;
				// 图片格式
				this.format = obj.format || ['jpg', 'png', 'gif', 'jpeg'];
				this.multi = (typeof(obj.multi) !== 'undefined' && obj.multi == 1) ? 1 : 0;
				this.modalTitle = this.multi == 1 ? '选择素材 - 多选模式' : '选择素材 - 单选模式';

				// 单选模式，传递之前选中的图片(选中的图片>缓存选过的图片>空)
				this.selectedImgUrl = typeof(obj.selectedImage) !== 'undefined' && obj.selectedImage !== '' ? obj.selectedImage : (
					this.saveSelectedImgUrl ? this.saveSelectedImgUrl : '');
				// 多选模式，传递之前选中的图片
				if (typeof(obj.selectedImages) !== 'undefined') {
					// 双向绑定至
					this.multiSelectedImgUrlBind = obj.selectedImages;
					// 非双向绑定值
					this.multiSelectedImgUrl = [];
					for (var i in obj.selectedImages) {
						this.multiSelectedImgUrl.push(obj.selectedImages[i]);
					}
				}

				this.modalShow = true;

				// 素材类型的判断
				if (typeof(obj.type) !== 'undefined' && obj.type == 'VIDEO') {
					this.currTabName = 'VIDEO';
					this.mediaName = 'VIDEO';
				} else {
					this.currTabName = 'IMAGE';
					this.mediaName = 'IMAGE';
				}
				// 显示的类型
				if (this.contentType == 'BOTH') {
					this.showImage = true;
					this.showVideo = true;
				} else if (this.contentType == 'IMAGE') {
					this.showImage = true;
				} else if (this.contentType == 'VIDEO') {
					this.showVideo = true;
				}

				// 重新加载列表数据
				this.initData();
			},
			// 加载数据，
			initData() {
				this.spinShow = true;
				if (this.contentType == 'BOTH' || this.contentType == 'IMAGE') {
					// ajax 请求获取初始化数据，
					util.ajax.post(util.apiUrl.userImageList, {
							type: 'IMAGE',
							isInit: 1,
							cat_id: this.showUserCatIndex
						})
						.then((response) => {
							var res = response.data;

							if (res.code) {
								this.systemImages = res.data.systemImages;

								// 初始化用户素材列表的组件
								this.$refs['user-images-list'].initData(res, this.multi, this.multiSelectedImgUrlBind, this.selectedImgUrl,
									this.maxSize, this.format);

								this.spinShow = false;
								this.$refs['user-images-list'].clearStatus();
							} else {
								this.$Notice.warning({
									title: '获取图片列表失败',
									desc: res.message
								});
							}
						});
				}

				if (this.contentType == 'BOTH' || this.contentType == 'VIDEO') {
					// ajax 请求获取初始化数据，（视频列表）
					util.ajax.post(util.apiUrl.userImageList, {
							type: 'video',
							isInit: 1,
							cat_id: this.showUserCatIndex
						})
						.then((response) => {
							var res = response.data;

							if (res.code) {
								this.systemImages = res.data.systemImages;

								// 初始化用户素材列表的组件
								this.$refs['user-video-list'].initData(res, this.multi, this.multiSelectedImgUrlBind, this.selectedImgUrl);

								this.spinShow = false;
							} else {
								this.$Notice.warning({
									title: '获取视频列表失败',
									desc: res.message
								});
							}
						});
				}
			},
			// 列表的css 类
			itemClass(item) {
				return 'list-item ' + (this.multi == 1 ? 'multi' : '') +
					((this.selectedImgUrl != '' && item.img_src_format == this.selectedImgUrl) ? ' curr' : '') +
					((this.multiSelectedImgUrlBind.length > 0 && this.multiSelectedImgUrlBind.indexOf(item.img_src_format) !== -1) ?
						' disabled' : '');
			},
			// 确认按钮
			onOk() {
				// 返回指定参数名的值给父级
				if (this.multi == 0) {
					// 必须选择图片
					if (!this.selectedImgUrl) {
						this.modalShow = true;
						this.$Message.error('请选择图片！');
						return false;
					}
					// 单选的返回
					this.$emit('on-return-url', {
						name: this.cbName,
						val: this.selectedImgUrl,
						item: this.selectedItem
					});
				} else {
					// 必须选择图片
					if (this.multiSelectedImgUrl.length === 0) {
						this.modalShow = true;
						this.$Message.error('请选择图片！');
						return false;
					}
					// 多选的返回
					this.$emit('on-return-url', {
						name: this.cbName,
						val: this.multiSelectedImgUrl,
						item: this.multiSelectedItem
					});
				}
				if (this.contentType == 'BOTH' || this.contentType == 'IMAGE') {
					this.$refs['user-images-list'].hideContent();
				} else {
					this.$refs['user-video-list'].hideContent();
				}
				this.modalShow = false;
			},
			onCancel() {
				if (this.contentType == 'BOTH' || this.contentType == 'IMAGE') {
					this.$refs['user-images-list'].hideContent();
				} else {
					this.$refs['user-video-list'].hideContent();
				}
				this.modalShow = false;
			},
			// 选中素材
			// 该组件已废弃
			selectedImg(index, url, item) {
				if (this.multi == 0) {
					// 单选
					this.selectedIndex = index;
					this.selectedImgUrl = url;
					this.saveSelectedImgUrl = url;
					this.selectedItem = item;

					if (document.querySelector('.list-item.curr') != null) {
						this.removeClass(document.querySelector('.list-item.curr'), 'curr');
					}
					this.addClass(document.getElementById(index), 'curr');
				} else {
					// 多选
					this.selectedIndex = index;
					var mIndex = this.multiSelectedImgUrl.indexOf(url);

					if (mIndex == -1) {
						// 如果数组没有，就添加
						this.multiSelectedImgUrl.push(url);
						this.addClass(document.getElementById(index), 'curr');
						this.multiSelectedItem.push(item);
					} else {
						if (this.multiSelectedImgUrlBind.indexOf(url) !== -1) {
							this.$Message.error('请不要重复添加!');
						} else {
							// 如果数组已经存在，就减去
							this.$delete(this.multiSelectedImgUrl, mIndex);
							this.$delete(this.multiSelectedItem, mIndex);
							this.removeClass(document.getElementById(index), 'curr');
						}
					}
				}
			},
			hasClass(ele, cls) {
				return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
			},
			// 为指定的dom元素添加样式
			addClass(ele, cls) {
				if (!this.hasClass(ele, cls)) ele.className += ' ' + cls;
			},
			// 删除指定dom元素的样式
			removeClass(ele, cls) {
				if (this.hasClass(ele, cls)) {
					var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
					ele.className = ele.className.replace(reg, ' ');
				}
			},
			// 系统图库，分类按钮点击
			showCat(cindex) {
				this.showCatIndex = cindex;
			}
		},
		// 侦听数据的变化
		watch: {

		},
		mounted() {
			this.init();
		}
	};
</script>
