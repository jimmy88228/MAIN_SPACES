<template>
	<div class="goods-list-table">
		<Table :columns="columns" :data="data" @on-selection-change="getSelectGoods" @on-select-all="handleSelectAll"
		 @on-sort-change="sortPage" ref="myTable">
			<template slot-scope="{ row }" slot="name">
				<div class="img_list_wrap">
					<div class="img_fixed">
						<img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.goods_thumb" v-viewer />
						<img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
					</div>
					<div class="sort_wrapper" style="overflow: hidden;">
						<p class="text" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{row.goods_name}}</p>
						<p class="text" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{row.goods_sn}}</p>
						<p v-show="row.cat_name">分类: {{row.cat_name}}</p>
					</div>
				</div>
			</template>
			<template slot-scope="{ row }" slot="price">
				<p>
					<span>原价:{{row.min_market_price}}</span>
					<span v-show="Number(row.min_market_price) !== Number(row.max_market_price)">~ {{row.max_market_price}}</span>
				</p>
				<p v-if="Number(row.sale_type)===1">
					<span>促销价:</span>
				</p>
				<p v-else>
					<span>促销价:{{row.min_price}}</span>
					<span v-show="Number(row.min_price) !== Number(row.max_price)">~ {{row.max_price}}</span>
				</p>
			</template>
			<template slot-scope="{ row }" slot="store_name">
				<p>
					{{row.store_name}}
				</p>
			</template>
			<template slot-scope="{ row }" slot="sort_order">
				<p>{{row.sort_order}}</p>
				<!-- <goods-list-sort :sort="row.sort_order" :goods-id="row.goods_id" @edit-sort="initData(listType)"></goods-list-sort> -->
			</template>
			<template slot-scope="{ row }" slot="time">
				<span v-if="row.stime && row.etime">
					<span>{{row.stime}}</span>~<span>{{row.etime}}</span>
				</span>
				<span v-else>-</span>
			</template>
			<template slot-scope="{ row }" slot="handle">
				<span @click="editGoods(row)"><a>查看</a></span>
				<!-- <span v-show="row.handle.edit && listType !== 'trash'" @click="editGoods(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove && listType !== 'trash'"/>
          <span v-show="row.handle.remove && listType === 'trash'" @click="goodsHandle(row, false)"><a>还原</a></span>
          <Divider type="vertical" v-show="row.handle.remove && listType === 'trash'"/> -->
				<!-- <span v-show="row.handle.remove && listType === 'trash'" @click="goodsClear(row)"><a>删除</a></span>
          <span v-show="row.handle.remove && listType !== 'trash'" @click="goodsHandle(row, true)"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.remove && row.handle.goods_log"/>
          <span v-show="row.handle.goods_log" @click="goodsLog(row)"><a>日志</a></span>
          <Divider type="vertical" v-show="row.handle.goods_log"/>
          <span v-show="row.handle.goods_log" @click="copyUrl(row)"><a>复制链接</a></span> -->
			</template>
		</Table>
		<div v-show="pageTotal > 0" class="handle_wrapper">
			<div style="padding-left:12px;">
				<!-- <Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
        <ButtonGroup v-show="listType != 'trash'">
          <Button @click="handleGoods('UpperShelf')">上架</Button>
          <Button @click="handleGoods('LowerShelf')">下架</Button>
          <Button @click="handleGoods('recycleBin')">回收站</Button>
          <Button @click="handleGoods('Synchronous')">强制同步库存</Button>
          <Button @click="handleGoods('NoSynchronous')">不强制同步库存</Button>
        </ButtonGroup>
        <Button v-show="listType == 'trash'" style="margin-left:10px;" @click="handleGoods('recycleBinBack')">还原</Button> -->
			</div>
			<div class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currPage" :page-size-opts="pageSizeOpts" @on-change="changePage"
				 @on-page-size-change="handlePageSize" show-total show-elevator show-sizer></Page>
			</div>
		</div>
		
		<!--异步处理导出excel组件-->
		<notice ref="notice"></notice>
	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import VueUtils from '@/libs/vue-utils.js';
	import searchForm from './search-form';
	import Conf from '@/config/index.js';
	import Mixin from './mixin.js';
	import ListEdit from './goods-list-edit';
	import goodsListSort from './goods-list-sort';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	
	const tipText = {
		UpperShelf: '上架',
		LowerShelf: '下架',
		recycleBin: '回收站',
		Synchronous: '同步库存',
		NoSynchronous: '不同步库存',
		recycleBinBack: '还原'
	}

	export default {
		name: 'goodsListTable',
		components: {
			searchForm,
			ListEdit,
			goodsListSort,
			notice
		},
		mixins: [Mixin],
		data() {
			return {
				data: [],
				pageTotal: 0,
				pageSize: Conf.PAGE_SIZE_DEF,
				currPage: 1,
				pageSizeOpts: Conf.PAGE_SIZE_OPTS,
				sortColumn: '',
				sortVal: '',
				// 列表类型
				listType: '',
				selectGoods: [],
				saleType: {
					'all': 0,
					'on-sale': 1,
					'not-sale': 2,
					'trash': 0
				},
				searchForm: {
					searchq: '',
					listType: 2,
					cat_id: 0,
					vcat_id: 0,
					// is_delete: 0, // 0：正常商品 1：回收站里面的商品
					// is_on_sale: 0, // 0：全部 1：上架 2：下架
					sale_type: '0',
					sale_kind: 0,
					is_on_image: 0,
					platform_src: []
				},
				isCheckAll: false,
				changeSizeSign: false
			}
		},
		methods: {
			// 初始化 加载数据，（不会自动加载，而是父组件触发加载）
			initData(type) {
				this.$store.commit('setLoading', true);
				this.listType = type;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.StoreGoodsList, {
						isInit: 1,
						is_delete: this.listType == 'trash' ? 1 : 0,
						sortColumn: this.sortColumn,
						sortVal: this.sortVal,
						is_on_sale: this.saleType[this.listType],
						page: this.currPage,
						pageSize: this.pageSize,
						...this.searchForm
					})
					.then((response) => {
						var res = response.data;

						if (res.code) {
							this.data = res.data.items.map(item => {
								return {
									goods_name: item.goods_name,
									goods_thumb: item.goods_thumb,
									goods_thumb2: item.goods_thumb2,
									goods_id: item.goods_id,
									goods_sn: item.goods_sn,
									cat_name: item.cat_name,
									store_name: item.store_name,
									min_market_price: item.min_market_price,
									max_market_price: item.max_market_price,
									min_price: item.min_price,
									max_price: item.max_price,
									goods_price_min: item.goods_price_min,
									goods_price_max: item.goods_price_max,
									inventory: item.inventory,
									sale_type_name: item.sale_type_name,
									is_on_sale_type: item.is_on_sale_type,
									is_force_sys_inventory: item.is_force_sys_inventory,
									sort_order: item.sort_order,
									created_at_format: item.created_at_format,
									copy_url: item.copy_url,
									is_delete: item.is_delete,
									is_on_sale: item.is_on_sale,
									handle: item.handle,
									goods_number: item.goods_number,
									sale_type: item.sale_type,
									sale_type_str: item.sale_type_str,
									stime: item.stime,
									etime: item.etime,
									id: item.id
								}
							});
							this.pageTotal = Number(res.data.total);
							this.canCreate = res.data.canCreate;
							this.$emit('get-search-data', {
								canCreate: res.data.canCreate,
								canSelectStore: res.data.canSelectStore,
							});
							this.isCheckAll = false;
						}
						this.$store.commit('setLoading', false);
					});
			},
			// 切换分页
			changePage(page) {
				if (this.changeSizeSign) {
					this.changeSizeSign = false;
					return false;
				}
				this.currPage = page;
				this.initData(this.listType);
			},
			handlePageSize(pageSize) {
				this.currPage !== 1 && (this.changeSizeSign = true);
				this.currPage = 1;
				this.pageSize = pageSize;
				this.initData(this.listType);
			},
			// 搜索 - 回调函数
			searchPage(searchForm, type) {
				this.searchForm = searchForm;
				this.initData(type);
			},
			// 页面排序
			sortPage(val) {
				this.sortColumn = val.key;
				this.sortVal = val.order;
				this.currPage = 1;
				this.initData(this.listType);
			},
			// 编辑商品
			editGoods(row) {
				this.$router.push({
					name: 'store-goods-info',
					params: {
						id: row.id
					}
				});
			},
			// 查看商品日志
			goodsLog(row) {
				this.$router.push({
					name: 'goods-log',
					params: {
						id: row.goods_id
					}
				});
			},
			// 回收/还原 商品
			goodsHandle(row, reduction) {
				this.$Modal.confirm({
					title: '操作提示',
					content: (reduction === true ? '确定把商品加入回收站吗？' : '确定还原商品吗？'),
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$store.commit('setLoading', true);
						// ajax 请求获取数据
						util.ajax.post(util.apiUrl.goodsHandle, {
								goods_id: row.goods_id,
								is_delete: reduction ? 1 : 0
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.initData(this.listType);
								}
								this.$store.commit('setLoading', false);
							});
					}
				});
			},
			goodsClear(row) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定永久删除该商品',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$store.commit('setLoading', true);
						// ajax 请求获取数据
						util.ajax.post(util.apiUrl.goodsDel, {
								goods_id: row.goods_id
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.initData(this.listType);
								}
								this.$store.commit('setLoading', false);
							});
					}
				});
			},
			handleCheck() {
				this.data.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.data[index], '_checked', this.isCheckAll);
					}
				});
				this.selectGoods = [...this.data].filter(item => item._checked);
			},
			handleGoods(type) {
				if (this.selectGoods.length === 0) {
					this.$Message.error('请选择商品')
					return false;
				}
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行${tipText[type]}操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						util.ajax.post(util.apiUrl.goodsBatch, {
								goods_type: type,
								goods_ids: this.selectGoods.map(item => item.goods_id)
							})
							.then((response) => {
								var res = response.data;

								if (res.code) {
									this.$Message.success(res.message);
									this.selectGoods = [];
									this.initData(this.listType);
								}
							});
					}
				});
			},
			updateAsync(id, val) {
				this.$store.commit('setLoading', true);
				return util.ajax.post(util.apiUrl.goodsBatch, {
						goods_type: 'forceSynchronous',
						goods_ids: [id],
						// 如果能让接口
						is_force_sys_inventory: Number(val) ? 0 : 1
					})
					.then((response) => {
						var res = response.data;

						if (res.code) {
							this.$Message.success(res.message);
							this.initData(this.listType);
						}
						this.$store.commit('setLoading', false);
					});
			},
			updateStatus(id, val) {
				this.$store.commit('setLoading', true);
				return util.ajax.post(util.apiUrl.goodsSale, {
						goods_id: id,
						status: Number(val) ? 0 : 1
					})
					.then((response) => {
						var res = response.data;

						if (res.code) {
							this.$Message.success(res.message);
							this.initData(this.listType);
						}
						this.$store.commit('setLoading', false);
					});
			},
			getSelectGoods(selection) {
				this.selectGoods = selection;
				let allLen = this.data.length;
				this.isCheckAll = allLen > 0 && allLen === selection.length;
				const hasSelected = this.selectGoods.map(item => item.goods_id);
				this.data.forEach((item, index) => {
					this.$set(this.data[index], '_checked', hasSelected.includes(item.goods_id));
				});
			},
			handleSelectAll() {
				this.isCheckAll = true;
			},
			copyUrl(row) {
				util.copyTextToClipBoard(row.copy_url);
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定导出当前筛选的商品结果？`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let params = Object.assign({}, {
							isInit: 1,
							is_delete: this.listType == 'trash' ? 1 : 0,
							sortColumn: this.sortColumn,
							sortVal: this.sortVal,
							is_on_sale: this.saleType[this.listType],
						}, this.searchForm)
						this.$store.commit('setLoading', true);
						return this.$ajax.post(this.$api.StoreExplodeGoods, params)
							.then(response => {
								const res = response.data;
								if (res.code) {
									let jobId = res.data;
									
									// 打开异步提示组件
									this.$nextTick(() => {
										this.$refs['notice'].showNotice(jobId);
									});
									
									//VueUtils.createDownload(res.data, '商品导出');
								}
								this.$store.commit('setLoading', false);
							});
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.goods-list-table {
		.ivu-table {
			font-size: 13px;
		}

		.table-bg-image {
			background-size: 100% auto !important;
		}

		.handle_wrapper {
			margin: 10px 10px 0 10px;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}

		@media screen and (max-width: 1350px) {
			.handle_wrapper {
				flex-direction: column;
				align-items: flex-start;
			}
		}

		.ivu-row-flex {
			align-items: center;
		}

		.sort_wrapper {
			flex-grow: 1;
			flex-shrink: 1;
			flex-basis: 150px;
		}
	}
</style>
