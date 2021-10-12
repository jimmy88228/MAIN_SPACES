<template>
	<Modal class="multi-norms" v-model="modalShow" :title="modalTitle" width="900" :loading="modalLoading"
		:mask-closable="maskClose" @on-visible-change="handleVisible">
		<div class="search p-left-15 p-right-15">
			<SearchForm ref="search" :data="data" :saleTypeArr="saleTypeArr" @on-search="searchPage"
				:isShowImport="isShowImport"></SearchForm>
		</div>
		<div class="content">
			<Table 
			:loading="tableLoading" 
			:columns="tableColumn" 
			:data="originData" 
			height="400" 
			ref="myTable">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.goods_thumb2" v-if="row.goods_thumb2" :alt="row.goods_thumb2" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
						</div>
						<div>
							<p>{{row.goods_name}}</p>
							<p>{{row.goods_sn}}</p>
						</div>
					</div>
				</template>
				<template slot-scope="{ row, index }" slot="norms">
					<Poptip placement="right" width="400" transfer v-model="row.isVisible"
						@on-popper-hide="popperHide(index)">
						<p><a @click.stop="showPop(row, index)">已选规格({{row._selectLen}})</a></p>
						<div slot="content">
							<row-norms 
							:is-multi="row._isMulti" 
							:cur-index="index"
							:ref="'rowNorms' + index"
							:is-checked="row._checked && checkTableAll"
							:customSpec="customSpec"
							@get-selected-len="e => handleSelectLen(e, index)"></row-norms>
						</div>
					</Poptip>
				</template>
				<template slot-scope="{ row }" slot="status">
					<Tag type="dot" :color="row.is_on_sale == 1 ? 'success' : 'error'">
						{{row.is_on_sale === '1' ? '上架' : '下架'}}</Tag>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<div>
					<span>已选商品(<a style="color: red;">{{selectAllGoodsLen}}</a>)</span>
					<Page style="display: inline;" :total="pageTotal" :page-size="pageSize" :current="currentPage"
						:page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
						@on-page-size-change="ps => handlePageSize(ps)" show-total show-sizer></Page>
				</div>
			</div>
		</div>
		<div slot="footer">
			<Button @click="cancel">取消</Button>
			<Button type="primary" @click="confirm">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import Dialog from '@/libs/dialog';
	import PageHelper from '@/libs/page-helper.js';
	import Mixins from './mixin';
	import RowNorms from './row-norms';
	import SearchForm from './search-form';

	export default {
		name: 'MultiNorms',
		props: {
			title: {
				type: String,
				default: '选择商品'
			},
			requestName: {
				type: String,
				default () {
					return 'goodsList'
				}
			},
			selected: {
				type: Array,
				default () {
					return [];
				}
			},
			extra: {
				type: Object,
				default () {
					return {};
				}
			},
			saleTypeArr: {
				type: Array,
				default () {
					return [0, 1, 4]
				}
			},
			isShowImport: {
				type: Boolean,
				default () {
					return false
				}
			},
			isShowImport: {
				type: Boolean,
				default () {
					return false
				}
			},
			customSpec:{
				type: Boolean,
				default(){
					return true
				}
			}
		},
		mixins: [Dialog, PageHelper, Mixins],
		components: {
			RowNorms,
			SearchForm
		},
		data() {
			return {
				modalTitle: this.title,
				originData: [], //添加_checked等属性
				freezeData: [], //原始数据
				selectData: [], //用来存放id，方便遍历
				selectList: [], //用来存放已选商品信息，方便界面展示
				initFlag: false,
				condition: {
					isInit: 2,
					search: '',
					type: 1,
					cat_id: 0,
					vcat_id: 0,
					is_delete: 0, // 0：正常商品 1：回收站里面的商品
					is_on_sale: 0, // 0：全部 1：上架 2：下架
					sale_type: '0',
					sale_kind: 0,
					is_on_image: 0,
					platform_src: [],
					sale_type_arr: [] // 默认[]为全部商品， [1, 14]只展示数据中类型1，14的商品
				}
			}
		},
		computed: {
			selectAllGoodsLen() {
				return this.selectList.length;
			},
			selectedLen() {
				return this.originData.filter(item => item._checked).length;
			},
			allLen() {
				return this.originData.length;
			},
			checkTableAll: {
				get() {
					let {
						checked,
						indeterminate
					} = this.handleCheckStatus(this.allLen, this.selectedLen);
					this.indeterminateTable = indeterminate;
					return checked;
				},
				set(val) {
					if (val) {
						let hasIds = this.selectData.map(item => Object.keys(item)[0]);
						let res = this.transferId(this.originData);
						res.forEach(item => {
							if (hasIds.includes(Object.keys(item)[0])) {
								let index = this.selectData.findIndex(selectItem => Object.keys(selectItem)[
									0] === Object.keys(item)[0]);
								this.selectData.splice(index, 1);
							}
						});
						this.selectData.push(...res);
						// selectList操作全选
						this.freezeData.forEach(item => {
							let listIndex = this.selectList.map(item => item.goods_id).findIndex(t => Number(
								t) === Number(item.goods_id));
							if (listIndex > -1) {
								this.selectList.splice(listIndex, 1);
							}
							let temp = Object.assign({}, item, {
								selectedList: item.get_products
							});
							this.selectList.push(temp);
						});
					} else {
						let delIds = this.originData.map(item => item.goods_id);
						for (let i = this.selectData.length - 1; i >= 0; i--) {
							if (delIds.includes(Number(Object.keys(this.selectData[i])[0]))) {
								this.selectData.splice(i, 1);
							}
						}
						// selectList操作全取消
						for (let i = this.selectList.length - 1; i >= 0; i--) {
							if (delIds.includes(this.selectList[i].goods_id)) {
								this.selectList.splice(i, 1);
							}
						}
					}
					this.originData.forEach(item => item._checked = val);
				}
			}
		},
		provide() {
			return {
				root: this
			};
		},
		methods: {
			onLoadData(page, data) {
				this.condition.sale_type_arr = this.saleTypeArr || [];
				let params = Object.assign({}, data, this.condition, {
					...this.extra
				});
				return this.$ajax.post(this.$api[this.requestName], params)
					.then(response => {
						const res = response.data;
						if (res.code) this.data = res.data;
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			handleVisible(val) {
				if (!val) {
					this.selectData = [];
				}
			},
			popperHide(index) {
				this.$set(this.originData[index], 'isVisible', false);
			},
			confirm() {
				this.$emit('get-data', this.selectList);
				this.hide();
			},
			cancel() {
				this.hide();
			},
			handleCheckStatus(allLen, selectLen) {
				let result;
				if (selectLen === 0) {
					result = {
						checked: false,
						indeterminate: false
					};
				} else {
					if (allLen === selectLen) {
						result = {
							checked: true,
							indeterminate: false
						};
					} else {
						result = {
							checked: false,
							indeterminate: true
						};
					}
				}
				return result;
			},
			setReactiveData(data, index) {
				this.$set(data[index], '_selectLen', 0);
				this.$set(data[index], '_allLen', data[index].get_products.length);
				this.$set(data[index], 'isVisible', false);
				this.$set(data[index], '_checked', false);
				this.$set(data[index], '_indeterminate', false);
				data[index].get_products.forEach((item, normsIndex) => {
					this.$set(data[index].get_products[normsIndex], '_colorChecked', false);
					this.$set(data[index].get_products[normsIndex], '_sizeChecked', false);
					this.$set(data[index].get_products[normsIndex], '_colorIndeterminate', false);
				});
			},
			// 打开模态框
			setData() {
				this.initFlag = true;
				this.loadData();
				return this;
			},
			handleSelectLen(val, index) {
				this.originData[index]._selectLen = val;
			},
			showPop(row, index) {
				let _rowNorms = this.$refs['rowNorms' + index];
				if(_rowNorms) {
					_rowNorms.rowDataWatch(row.get_products);
				}
				this.$nextTick(() => {
					let originData = this.originData || [];
					// 剔除其他显示
					for (let i = 0; i < originData.length; i++) {
						if (index != i && originData[i].isVisible) {
							this.originData[i].isVisible = false;
						}
					}
					this.originData[index].isVisible = true;
				})
			},
			hidePop(index) {
				this.originData[index].isVisible = false;
			},
			normsCancel(index) {
				this.hidePop(index);
			},
			normsComfirm(index, data, normData) {
				let ids = this.selectData.map(item => Object.keys(item)[0]);
				let id = Object.keys(data)[0];
				// 去重
				if (ids.includes(id)) {
					let index = this.selectData.findIndex(item => Object.keys(item)[0] === id);
					this.selectData.splice(index, 1);
				}
				this.selectData.push(data);
				// selectList操作
				let listIndex = this.selectList.map(item => item.goods_id).findIndex(item => Number(item) === Number(id));
				if (listIndex > -1) {
					this.selectList.splice(listIndex, 1);
				}
				let temp = Object.assign({}, this.freezeData[index], {
					selectedList: normData
				})
				this.selectList.push(temp);
				this.hidePop(index);
			},
			renderData() {
				this.originData.forEach(item => {
					item.get_products.forEach(normItem => {
						normItem._colorChecked = false;
						normItem._sizeChecked = false;
						normItem._colorIndeterminate = false;
					});
				})
				this.originData.forEach(item => {
					item._selectLen = 0;
					this.selectData.forEach(selectedItem => {
						if (Number(Object.keys(selectedItem)[0]) === Number(item.goods_id)) {
							// 找到相同商品
							item._checked = true;
							let selectedCollection = Object.values(selectedItem)[0];
							if (!item._isMulti) {
								// 单选下选中
								let selectedIds = selectedCollection.map(item => item.color_id);
								item.get_products.forEach(normItem => {
									if (selectedIds.includes(normItem.color_id)) {
										normItem._colorChecked = true;
									}
								});
							} else {
								// 双规格两种情况
								let selectedLen = selectedCollection.length;
								let originLen = item.get_products.length;
								if (selectedLen === originLen) {
									// 双规格所有选中
									item.get_products.forEach(normItem => {
										normItem._colorChecked = true;
										normItem._sizeChecked = true;
									});
								} else {
									if (!selectedCollection.length) return false;
									let originTemp = {};
									item.get_products.forEach(originNorm => {
										if (!(originNorm.color_id in originTemp)) {
											originTemp[originNorm.color_id] = [];
											originTemp[originNorm.color_id].push(originNorm
												.size_id);
										} else {
											originTemp[originNorm.color_id].push(originNorm
												.size_id);
										}
									});
									let newTemp = {};
									selectedCollection.forEach(selectedNorm => {
										if (!(selectedNorm.color_id in newTemp)) {
											newTemp[selectedNorm.color_id] = [];
											newTemp[selectedNorm.color_id].push(selectedNorm
												.size_id);
										} else {
											newTemp[selectedNorm.color_id].push(selectedNorm
												.size_id);
										}
									});
									let checkAllArr = []; //选中所有的color_id
									let checkLostArr = []; //选中部分的color_id
									let notCheckArr = []; //整项都不存在的
									for (let o in originTemp) {
										if (newTemp[o]) {
											if (originTemp[o].length === newTemp[o].length) {
												checkAllArr.push(o);
											} else {
												checkLostArr.push(o);
											}
										} else {
											notCheckArr.push(o);
										}
									}
									item.get_products.forEach(normItem => {
										if (checkAllArr.includes(normItem.color_id)) {
											// 该color_id下的所有size_id都选中
											normItem._colorChecked = true;
											normItem._sizeChecked = true;
										}
										if (checkLostArr.includes(normItem.color_id)) {
											// 该color_id下部分size_id选中
											normItem._colorChecked = false;
											normItem._colorIndeterminate = true;
											normItem._sizeChecked = newTemp[normItem.color_id]
												.includes(normItem.size_id);
										}
										if (notCheckArr.includes(normItem.color_id)) {
											normItem._colorChecked = false;
											normItem._colorIndeterminate = false;
											normItem._sizeChecked = false;
										}
									});
								}
							}
							item._selectLen = selectedCollection.length;
						}
					})
				});
			},
			transferId(data) {
				return data.map(item => {
					return {
						[item.goods_id]: item.get_products.map(item => {
							return {
								color_id: item.color_id,
								size_id: item.size_id
							}
						})
					}
				});
			}
		},
		watch: {
			tableData(nV) {
				this.originData = nV.map(item => {
					return {
						goods_name: item.goods_name,
						goods_thumb2: item.goods_thumb2,
						goods_id: item.goods_id,
						goods_sn: item.goods_sn,
						goods_number: item.goods_number,
						market_price: item.market_price,
						cat_name: item.cat_name,
						min_market_price: item.min_market_price,
						max_market_price: item.max_market_price,
						goods_price_min: item.goods_price_min,
						goods_price_max: item.goods_price_max,
						inventory: item.inventory,
						sale_type_name: item.sale_type_name,
						is_on_sale_type: item.is_on_sale_type,
						is_force_sys_inventory: item.is_force_sys_inventory,
						created_at_format: item.created_at_format,
						is_on_sale: item.is_on_sale,
						get_products: item.get_products,
						_isMulti: item._isMulti
					}
				});
				this.freezeData = JSON.parse(JSON.stringify(this.originData));
				this.originData.forEach((item, index) => {
					item._isMulti = Number(item._isMulti) === 1 ? false : true;
				});
				this.originData.forEach((item, index) => {
					item._key = index + 1;
					this.setReactiveData(this.originData, index);
				});
				if (this.initFlag) {
					this.selectList = [];
					this.selectData = [];
					let formatData = this.selected.map(item => {
						return Object.assign({}, item, {
							selectedList: item.get_products
						});
					});
					let res = this.transferId(formatData);
					this.selectList.push(...formatData);
					this.selectData.push(...res);
					this.initFlag = false;
				}
				this.renderData();
			},
			selectData(nV) {
				this.renderData();
			}
		}
	}
</script>
