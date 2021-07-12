<template>
	<Card class="goods-list">
		<Row type="flex" style="margin-bottom: 10px;">
			<Col style="flex:1 1 0%;">
			<searchForm @on-search="searchPage" :cat-list="catList" :vcat-list="vcatList" :good-sale-type="goodSaleType"
			 :good-sale-kind="goodSaleKind" :good-image="goodImage" :plat-form="platForm"></searchForm>
			</Col>
			<Col style="width:400px; text-align: right;">
			<Button type="success" icon="md-add" @click="createGoods">发布商品</Button>
			<Button type="info" @click="handleExport">导出商品</Button>
			<Button icon="md-refresh" @click="reloadList" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>

		<Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="all" label="全部">
				<goodsListTable ref="list-all" @get-search-data="getData" v-if="tabsName === 'all'"></goodsListTable>
			</TabPane>
			<TabPane name="on-sale" label="上架">
				<goodsListTable ref="list-on-sale" @get-search-data="getData" v-if="tabsName === 'on-sale'"></goodsListTable>
			</TabPane>
			<TabPane name="not-sale" label="下架">
				<goodsListTable ref="list-not-sale" @get-search-data="getData" v-if="tabsName === 'not-sale'"></goodsListTable>
			</TabPane>
			<TabPane name="trash" label="回收站">
				<goodsListTable ref="list-trash" @get-search-data="getData" v-if="tabsName === 'trash'"></goodsListTable>
			</TabPane>
		</Tabs>
	</Card>
</template>

<script>
	import goodsListTable from './goods-list-table';
	import searchForm from './search-form';

	export default {
		components: {
			goodsListTable,
			searchForm
		},
		data() {
			return {
				tabsName: 'on-sale',
				catList: [],
				vcatList: [],
				goodSaleType: {},
				goodSaleKind: [],
				goodImage: [],
				platForm: [],
				searchData: {
					search: '',
					type: 1,
					cat_id: 0,
					vcat_id: 0,
					sale_type: '0',
					sale_kind: 0,
					is_on_image: 0,
					platform_src: []
				},
				saleType: {
					'all': 0,
					'on-sale': 1,
					'not-sale': 2,
					'trash': 0
				},
				canCreate: false
			}
		},
		methods: {
			// 初始化
			init() {
				var tname = this.$route.hash.replace('#', '');
				if (['all', 'on-sale', 'not-sale', 'trash'].indexOf(tname) !== -1) {
					this.tabsName = tname;
				}
				this.$store.commit('setCanCreateGoods', false);
				// 选中的tabs 加载数据
				this.$nextTick(() => {
					this.$refs['list-' + this.tabsName].initData(this.tabsName);
					this.loadExtraData();
				});
			},
			// tabs 点击事件
			onTabsClick(name) {
				this.$router.push('/goods/goods-list#' + name);
				this.tabsName = name;
				// 动态加载列表数据
				this.$nextTick(() => {
					this.$refs['list-' + this.tabsName].searchPage(this.searchData, name);
				});
			},
			// 刷新列表
			reloadList() {
				this.$refs['list-' + this.tabsName].initData(this.tabsName);
			},
			createGoods() {
				this.$router.push({
					name: 'goods-create',
					params: {
						id: 0
					}
				});
			},
			loadExtraData() {
				this.$ajax.all(
					[
						this.$ajax.post(this.$api.catTree),
						this.$ajax.post(this.$api.vcatTree)
					]
				).then(
					this.$ajax.spread((catData, vcatData) => {
						let catRes = catData.data;
						if (catRes.code) {
							this.catList = catRes.data;
						}
						let vcatRes = vcatData.data;
						if (vcatRes.code) {
							this.vcatList = vcatRes.data;
						}
					})
				);
			},
			getData({
				goodSaleType,
				goodSaleKind,
				goodImage,
				platForm,
				canCreate
			}) {
				this.goodSaleType = goodSaleType;
				this.goodSaleKind = goodSaleKind;
				this.goodImage = goodImage;
				this.platForm = platForm;
				this.canCreate = canCreate;
			},
			searchPage(searchData) {
				this.searchData = searchData;
				this.$refs['list-' + this.tabsName].searchPage(this.searchData);
			},
			handleExport() {
				this.$refs['list-' + this.tabsName].handleExport();
			}
		},
		mounted() {
			this.init();
		}
	}
</script>

<style lang="less">
	.goods-list {
		.ivu-tabs-tab {
			font-size: 12px;
			line-height: 23px;
		}

		@media screen and (max-width: 1450px) {
			.action_btn {
				margin-bottom: 10px;
			}
		}
	}
</style>
