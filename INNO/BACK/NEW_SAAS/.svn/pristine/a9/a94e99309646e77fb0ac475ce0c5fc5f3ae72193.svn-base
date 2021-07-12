<style lang="less">
	.system-icon-modal-body {
		.image-cat {
			height: 480px;
			overflow-y: auto;
			overflow-x: hidden;
			width: 100%;
			margin-top: 10px;

			.cat-item {
				font-size: 14px;
				margin: 5px 5px 5px 0;
				padding: 8px 10px;
				cursor: pointer;
				border-radius: 5px;
			}

			.cat-item.curr {
				color: #fff;
				background: #5cadff;
			}
		}

		.scroll-content {
			height: 480px;
			overflow-y: auto;
			overflow-x: hidden;
			width: 100%;
			border: 1px solid #eee;
			margin-top: 10px;

			.list-box {
				.list-item {
					border: 1px solid rgba(0, 0, 0, .04);
					width: 80px;
					height: 65px;
					margin: 10px;
					border-radius: 5px;
					background: #fff;
					cursor: pointer;

					&:hover {
						box-shadow: 0 0 3px 4px rgba(0, 0, 0, .05);
					}

					.close {
						display: none;
						position: absolute;
						font-size: 24px;
						right: -10px;
						top: -10px;
						color: orangered;
						background: #fff;
						border-radius: 100%;
					}

					&:hover .close {
						display: block;
					}

					.img-remark-box {
						font-size: 12px;
						margin-top: 10px;

						.img-remark {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.icon {
							font-size: 18px;
							margin-left: 10px;
							color: #ddd;
						}
					}

					.checked-icon {
						position: absolute;
						right: -1px;
						bottom: 0;
						font-size: 24px;
						color: orangered;
						display: none;
					}
				}

				.act-thumb2 {
					background: no-repeat center center;
					background-size: 60% auto;
					height: 60px;
				}
			}

			.list-item.curr {
				border: 2px solid red;

				.checked-icon {
					color: red;
					display: block;
				}
			}

			.list-item.multi.curr {
				border: 2px solid #2b85e4;

				.checked-icon {
					color: #2b85e4;
					display: block;
				}
			}

			.list-item.multi.disabled {
				border: 2px solid #ddd;

				.checked-icon {
					color: #ddd;
					display: block;
				}
			}
		}
	}
</style>

<template>
	<div>
		<Modal v-model="modalShow" :styles="{top: '20px'}" :width="modalWidth" :title="modalTitle" @on-ok="onOk">

			<div class="system-icon-modal-body">
				<Row :gutter="8">
					<Col span="4">
					<!--分类名-->
					<div class="image-cat">
						<div v-for="(cat,cindex) in systemIcons" :name="cindex" :key="cindex" :class="'cat-item'+(showCatIndex == cindex ? ' curr':'')"
						 @click="showCat(cindex)">{{cat.name}}</div>
					</div>
					</Col>

					<Col span="20">
					<!--图片列表-->
					<div class="scroll-content is-system" :style="getContentHeight">

						<Row v-for="(cat,cindex) in systemIcons" :name="cindex" :key="cindex" class="list-box" v-show="showCatIndex == cindex">
							<Col v-for="(item,index) in cat.children" :key="('e'+index)" :id="('iconx'+timestamp+cindex+index)" span="5"
							 :class="itemClass(item)">

							<div class="act-thumb2" :style="'background-image:url('+ item.icon_src_format +')'" @click="selectedImg('iconx'+timestamp+cindex+index, item.icon_src_format)"
							 title="请点击选择ICON">
								<Icon class="checked-icon ionmy ion-my-checked"></Icon>
							</div>

							</Col>
						</Row>
					</div>
					</Col>
				</Row>
			</div>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'iconSelect',
		components: {

		},
		data() {
			return {
				// 返回出去的字段的名称
				cbName: '',

				modalShow: false,
				modalTitle: '选择ICON',
				modalWidth: 940,
				showCatIndex: 0,
				timestamp: 0,

				systemIcons: [],
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
			};
		},
		props: {

		},
		computed: {
			// 获取内容框高度
			getContentHeight() {
				// 动态计算弹出框的高度
				return {
					height: (document.body.clientHeight - 240) + 'px',
					display: 'block',
				};
			},
		},
		methods: {
			init() {
				this.timestamp = (new Date().getTime());
			},
			// 提供给父级调用
			showModal(obj) {
				this.cbName = obj.name;
				this.multi = (typeof(obj.multi) != 'undefined' && obj.multi == 1) ? 1 : 0;
				this.modalTitle = this.multi == 1 ? '选择ICON - 多选模式' : '选择ICON - 单选模式';

				// 单选模式，传递之前选中的图片
				this.selectedImgUrl = typeof(obj.selectedImage) != 'undefined' ? obj.selectedImage : '';

				// 多选模式，传递之前选中的图片
				if (typeof(obj.selectedImages) != 'undefined') {
					// 双向绑定至
					this.multiSelectedImgUrlBind = obj.selectedImages;
					// 非双向绑定值
					this.multiSelectedImgUrl = [];
					for (var i in obj.selectedImages) {
						this.multiSelectedImgUrl.push(obj.selectedImages[i]);
					}
				}

				this.modalShow = true;
				// 重新加载列表数据
				this.initData();
			},
			// 加载数据，
			initData() {
				this.spinShow = true;


				// ajax 请求获取初始化数据，
				this.$ajax.post(this.$api.userImageList, {
						type: 'SYSTEM_ICON',
						isInit: 1,
						cat_id: this.showUserCatIndex,
					})
					.then((response) => {
						var res = response.data;

						if (res.code) {
							this.systemIcons = res.data.items;
							this.spinShow = false;
						}
					});


			},
			// 确认按钮
			onOk() {
				// 返回指定参数名的值给父级
				if (this.multi == 0) {
					// 单选的返回
					this.$emit('on-return-url', {
						name: this.cbName,
						val: this.selectedImgUrl,
						item: this.selectedItem
					});
				} else {
					// 多选的返回
					this.$emit('on-return-url', {
						name: this.cbName,
						val: this.multiSelectedImgUrl,
						item: this.multiSelectedItem
					});
				}
			},
			// 选中素材
			selectedImg(index, url, item) {

				// 单选
				this.selectedIndex = index;
				this.selectedImgUrl = url;
				this.selectedItem = item;
				if (document.querySelector('.list-item.curr') != null) {
					this.removeClass(document.querySelector('.list-item.curr'), 'curr');
				}

				this.addClass(document.getElementById(index), 'curr');
			},
			// 系统图库，分类按钮点击
			showCat(cindex) {
				this.showCatIndex = cindex;
			},
			hasClass(ele, cls) {
				return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
			},
			//为指定的dom元素添加样式
			addClass(ele, cls) {
				if (!this.hasClass(ele, cls)) ele.className += " " + cls;
			},
			//删除指定dom元素的样式
			removeClass(ele, cls) {
				if (this.hasClass(ele, cls)) {
					var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
					ele.className = ele.className.replace(reg, " ");
				}
			},
			// 列表的css 类
			itemClass(item) {
				return 'list-item ' + (this.multi == 1 ? 'multi' : '') +
					((this.selectedImgUrl != '' && item.icon_src_format == this.selectedImgUrl) ? ' curr' : '') +
					((this.multiSelectedImgUrlBind.length > 0 && this.multiSelectedImgUrlBind.indexOf(item.icon_src_format) !== -1) ?
						' disabled' : '');
			},

		},
		// 侦听数据的变化
		watch: {

		},
		mounted() {
			this.init();
		},
	};
</script>
