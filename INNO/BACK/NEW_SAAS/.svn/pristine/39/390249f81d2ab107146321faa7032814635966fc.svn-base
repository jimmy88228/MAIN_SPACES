<template>
	<div class="area-list">
		<template>
			<Card class="area-list-inner">
				<div style="text-align: right;margin-bottom: 10px;">
					<Button type="primary" icon="md-add" @click="createArea">新建区域</Button>
				</div>
				<Row class-name="goods-cat_header">
					<Col v-for="item in columns" :span="item.span" :key="item.key" class-name="goods-cat_columns left">{{item.title}}</Col>
				</Row>
				<Tree :data="catListData" :render="renderContent" @on-toggle-expand="handleToggle"></Tree>
				<Spin fix v-show="showSpin"></Spin>
			</Card>
		</template>
		<area-list-form ref="area-list-form" @on-success="handleSuccess" v-if="showForm"></area-list-form>
	</div>
</template>
<script>
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import areaListForm from './area-list-form';

	export default {
		components: {
			areaListForm
		},
		data() {
			return {
				showSpin: false,
				catListData: [],
				// 原始数据的ui
				columns: [],
				// 初始化数据
				formatColumns: {},
				showForm: false
			}
		},
		mixins: [PageHelper, Mixin],
		methods: {
			onLoadData(page) {
				this.showSpin = true;
				return this.$ajax.post(this.$api.channelAreaList)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
							// 转移商品
							this.canRapidAllocation = res.data && res.data.canRapidAllocation;
							this.columns = [{
									title: "区域名称",
									key: "agent_name",
									align: "left",
									span: document.body.offsetWidth <= 1600 ? 8 : 10
								},
								{
									title: "区域代码",
									key: "agent_code",
									span: 4
								},
								{
									title: "区域类型",
									key: "agent_type_str",
									span: 2
								},
								{
									title: "店铺数量",
									key: "getstore_count",
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
							this.showSpin = false;
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
			// 添加分类
			createArea() {
				this.showForm = true;
				this.$nextTick(() => {
					this.$refs['area-list-form'].openModal(this.catListData);
				});
			},
			editArea(data) {
				this.showForm = true;
				this.$nextTick(() => {
					this.$refs['area-list-form'].openModal(this.catListData, data);
				});
			},
			handleSuccess() {
				this.loadData();
			},
			// 编辑按钮
			editGoodsCat(data) {
				this.showForm = true;
				this.$nextTick(() => {
					this.$refs['goods-cat-form'].openModal(this.catListData, data);
				});
			},
			onDelItem(row) {
				this.showSpin = true;
				return this.$ajax.post(this.$api.channelRemove, {
						id: row.id
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 删除后重新加载
							this.$Message.success(res.message);
							this.showSpin = false;
							this.loadData();
						}
					});
			},
			handleDistribute(data) {
				this.$router.push({
					name: 'area-allocation',
					params: {
						agent: data
					}
				})
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>
<style lang="less">
	.area-list {
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

		.area-list-inner {
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
