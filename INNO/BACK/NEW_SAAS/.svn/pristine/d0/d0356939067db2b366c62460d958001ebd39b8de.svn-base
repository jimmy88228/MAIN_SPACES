<template>
	<div class="goods-cat">
		<template>
			<div class="goods-cat-inner">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						<Form ref="formSearch" :model="formSearch" inline>
							<FormItem>
								<Input v-model="formSearch.searchq" style="width:280px;" placeholder="分类名称 模糊查询" clearable search enter-button
								 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage"></Input>
							</FormItem>
						</Form>
					</Col>
					<Col style="width:320px;text-align: right;">
						<Button v-if="canCreate" type="info" icon="md-add" @click="createCat">添加商品分类</Button>
						<Button v-if="canRapidAllocation" type="success" icon="md-swap" @click="handleTransfer">转移商品</Button>
						<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
				<Row class-name="goods-cat_header">
					<Col v-for="item in columns" :span="item.span" :key="item.key" class-name="goods-cat_columns left">{{item.title}}</Col>
				</Row>
				<Tree :data="catListData" :render="renderContent" @on-toggle-expand="handleToggle"></Tree>
				<Spin fix v-show="showSpin"></Spin>
			</div>
		</template>
		<goodsCatForm ref="goods-cat-form" @on-success="handleSuccess" v-if="showForm"></goodsCatForm>
	</div>
</template>
<script>
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import goodsCatForm from './goods-cat-form';

	export default {
		components: {
			goodsCatForm
		},
		data() {
			return {
				canCreate: false,
				canRapidAllocation: false,
				searchForm: {
					searchq: ''
				},
				showSpin: false,
				catListData: [],
				// 原始数据的ui
				columns: [],
				// 初始化数据
				formatColumns: {},
				// 搜索表单
				formSearch: {
					searchq: ''
				},
				showForm: false
			}
		},
		mixins: [PageHelper, Mixin],
		methods: {
			onLoadData(page) {
				this.showSpin = true;
				return this.$ajax.post(this.$api.ShopGoodsCatList, {
						page,
						isInit: 1
					})
					.then(response => {
						const res = response.data;
						this.showSpin = false;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
							// 转移商品
							this.canRapidAllocation = res.data && res.data.canRapidAllocation;
							this.columns = [{
									title: "分类名",
									key: "cat_name",
									align: "left",
									span: document.body.offsetWidth <= 1600 ? 8 : 10
								},
								{
									title: "商品数",
									key: "get_goods_count",
									span: 2
								},
								{
									title: "分类ID",
									key: "cat_id",
									span: 4
								},
								{
									title: "分类代码",
									key: "cat_code",
									span: 4
								},
								{
									title: "操作",
									key: "handle",
									align: "center",
									span: document.body.offsetWidth <= 1600 ? 6 : 4
								}
							];
							const catData = (res.data && res.data.items) || [];
							this.catListData = this.dealTreeData(catData);
							this.formatColumns = this.handleColums(this.columns);
							
							this.$nextTick(() => {
								this.calcArrow('ivu-tree');
							});
						}
					});
			},
			handleToggle() {
				this.$nextTick(() => {
					this.calcArrow('ivu-tree');
				});
			},
			calcArrow(className) {
				const parentCol = document.querySelector(`.${className}`).childNodes;
				for (let i = 0; i < [...parentCol].length; i++) {
					if ([...parentCol][i].nodeType === 1) this.mapArrow([...parentCol][i]);
				}
			},
			mapArrow(dom) {
				if (!dom.children[0]) return false;
				const parent = dom.children[0].childNodes;
				const arrow = dom.children[0].children[0];
				const title = dom.children[0].children[1].children[0].children[0];
				if (arrow.children.length === 0 && Number(title.dataset.index) === 1) {
					// 当前不存在箭头，需要手动添加横杆
					const html = '<i class="ivu-icon icon-line"></i>';
					const iDom = document.createElement('i');
					iDom.className = "ivu-icon icon-line";
					arrow.appendChild(iDom);
				}
				arrow.style.left = ((Number(title.dataset.index) - 1) * 12) + 'px';
				for (let i = 0; i < parent.length; i++) {
					const className = parent[i].className;
					const formatName = className && className.split(' ') || '';
					if (formatName.includes('ivu-tree-children')) {
						this.mapArrow(parent[i]);
					}
				}
			},
			searchPage() {
				this.showSpin = true;
				return this.$ajax.post(this.$api.ShopGoodsCatList, this.formSearch)
					.then((response) => {
						this.showSpin = false;
						var res = response.data;
						if (res.code) {
							this.data = res.data;
							const catData = (res.data && res.data.items) || [];
							this.catListData = this.dealTreeData(catData);
							this.currentPage = 1;
							this.$nextTick(() => {
								this.calcArrow('ivu-tree');
							});
						}
					});
			},
			// 添加分类
			createCat() {
				this.showForm = true;
				this.$nextTick(() => {
					this.$refs['goods-cat-form'].openModal(this.catListData);
				});
			},
			handleSuccess() {
				this.loadData();
			},
			// 商品转移
			handleTransfer() {
				this.$router.push({
					name: 'shop-goods-allocation',
					params: {
						type: 'cat'
					}
				});
			},
			// 编辑按钮
			editGoodsCat(data) {
				this.showForm = true;
				this.$nextTick(() => {
					this.$refs['goods-cat-form'].openModal(this.catListData, data);
				});
			},
			handleDistribute(data) {
				this.$router.push({
					name: 'shop-goods-distribute',
					params: {
						data: JSON.stringify({
							title: data.title,
							id: data.id,
							type: 'cat'
						})
					}
				});
			},
			onDelItem(row) {
				this.showSpin = true;
				return this.$ajax.post(this.$api.ShopGoodsCatRemove, {
						cat_id: row.id
					})
					.then((response) => {
						var res = response.data;
						this.showSpin = false;
						if (res.code) {
							// 删除后重新加载
							this.$Message.success(res.message);
							this.loadData();
						}
					});
			}
		}
	}
</script>
<style lang="less">
	.goods-cat {
		.icon-line {
			margin-top: -4px;
		}

		.icon-line::before {
			content: '\2013';
			font-weight: 1000;
		}

		.ivu-tree-title {
			width: 100%;
			border-bottom: 1px solid #dcdee2;
			border-radius: 0;
		}

		.goods-cat-inner {
			.ivu-form-item {
				margin-bottom: 10px;
			}

			.ivu-input-icon-clear {
				right: 50px;
			}

			.goods-cat_header {
				border: 1px solid #dcdee2;
				border-bottom: none;

				.goods-cat_columns {
					color: #515a6e;
					font-weight: bold;
					font-size: 12px;
					text-align: center;
					line-height: 40px;
					height: 40px;
					white-space: nowrap;
					overflow: hidden;
					background-color: #f8f8f9;
					padding-left: 18px;
					padding-right: 18px;

					&.left {
						text-align: left;
					}
				}
			}

			.cat-item {
				text-align: left;
				background-color: #fff;
				height: 48px;
				line-height: 48px;
				box-sizing: border-box;
				text-overflow: ellipsis;
				padding-left: 18px;
				padding-right: 18px;
			}

			.ivu-tree {
				border: 1px solid #dcdee2;

				li {
					ul {
						padding: 0;
					}
				}

				.ivu-tree-children {
					li {
						position: relative;

						.ivu-tree-arrow {
							position: absolute;
							left: 0;
							top: 2px;
							width: 16px;
							height: 48px;
							line-height: 42px;
							z-index: 1;

							i {
								font-size: 16px;
								// color: transparent;
							}
						}
					}

					// .ivu-tree-children{
					// 	.ivu-tree-arrow{
					// 		left: 30px;
					// 	}
					// }
				}
			}
		}
	}
</style>
