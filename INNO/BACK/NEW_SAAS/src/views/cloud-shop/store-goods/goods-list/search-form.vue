<template>
	<div class="goods-search-form">
		<Form ref="formSearch" :model="formSearch" inline>
			
			<FormItem v-if="canSelectStore">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						<store-select :data="storeData" type="checkbox" @del-tag="delTag"></store-select>
					</Col>
					<Col style="width:120px;">
						<Button type="dashed" @click="handleSelect">选择所属店铺</Button>
					</Col>
				</Row>
			</FormItem>
			<FormItem>
				<Input class="goods-search_input" v-model="formSearch.searchq" 
				placeholder="请输入关键字" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" 
				 @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.listType" slot="prepend" class="goods-search_select">
					<Option value="goods_name">商品名字</Option>
					<Option value="goods_sn">商品货号</Option>
				</Select>
				</Input>
			</FormItem>
			<FormItem>
				<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
			</FormItem>
			
			<transition name="fade">
				<Row v-show="isShowExtra">
					<Col span="8">
						<FormItem label="所有分类">
							<Cascader class="basic_cascader" :data="sortCatList" v-model="currentSort" placeholder="请选择所有分类" filterable
							 change-on-select transfer :clearable="isClear" ref="catRef" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
						</FormItem>
						<FormItem label="自定义分类">
							<Cascader class="basic_cascader" :data="sortVcatList" v-model="currentVcatSort" placeholder="请选择自定义分类" filterable
							 change-on-select transfer :clearable="isClear" ref="vcatRef" :render-format="renderSort" @on-change="selectSortVcat"></Cascader>
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem label="相册筛选">
							<Select v-model="formSearch.is_on_image" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">无相册图</Option>
								<Option :value="2">部分无相册图</Option>
							</Select>
						</FormItem>
						<FormItem label="商品类别">
							<Select v-model="formSearch.sale_type" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">普通商品</Option>
								<Option :value="4">促销商品</Option>
								<Option :value="99">赠品</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<div style="margin-bottom: 10px;text-align: center;">
							<Button type="primary" @click="searchPage">搜索</Button>
							<a @click="showExtra" class="search_btn" style="margin-left:10px">
								<Icon type="ios-arrow-up" /> 收起选项</a>
						</div>
					</Col>
				</Row>
			</transition>

		</Form>
	</div>
</template>

<script>
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	
	/**
	 * 商品列表 搜索框
	 */
	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};

	export default {
		name: 'searchForm',
		components: {
			StoreSelect
		},
		props: {
			catList: {
				type: Array,
				default () {
					return [];
				}
			},
			vcatList: {
				type: Array,
				default () {
					return [];
				}
			},
			goodSaleType: {
				type: Object,
				default () {
					return {};
				}
			},
			goodSaleKind: {
				type: Array,
				default () {
					return [];
				}
			},
			goodImage: {
				type: Array,
				default () {
					return [];
				}
			},
			platForm: {
				type: Array,
				default () {
					return [];
				}
			},
			canSelectStore:{
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				// 搜索表单
				formSearch: {
					searchq: '',
					listType: 'goods_name',
					cat_id: 0,
					vcat_id: 0,
					store_ids: [],
					// is_delete: 0, // 0：正常商品 1：回收站里面的商品
					// is_on_sale: 0, // 0：全部 1：上架 2：下架
					sale_type: 0,
					sale_kind: 0,
					is_on_image: 0,
					platform_src: []
				},
				sortCatList: [],
				sortVcatList: [],
				currentSort: [],
				currentVcatSort: [],
				saleType: {},
				saleKind: [],
				isOnImage: [],
				goodsPlatform: [],
				isClear: false,
				isShowExtra: false,
				storeData: []
			}
		},
		methods: {
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			handleSortList(context) {
				const format = context.map(item => {
					return {
						value: item.cat_id || item.vcat_id,
						label: item.cat_name || item.vcat_name,
						parent_id: item.parent_id,
						children: item.children.length ? this.handleSortList(item.children) : []
					}
				});
				return format;
			},
			// 搜索按钮触发
			searchPage() {
				this.$emit('on-search', Object.assign({}, this.formSearch, {
					platform_src: this.formSearch.platform_src.join(',')
				}));
			},
			selectSortCat(value, selectedData) {
				this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
			},
			selectSortVcat(value, selectedData) {
				this.formSearch.vcat_id = selectedData[selectedData.length - 1].value;
			},
			// 选择
			handleSelect() {
				this.$selectContent({
					mode: 'store',
					type: 'checkbox',
					data: this.storeData,
					getList: (data) => {
						this.storeData = data;
						
						let tmp = [];
						data.forEach(( item)=>{
							tmp.push( item.id );
						});
						this.formSearch.store_ids = tmp;
					}
				})
			},
			delTag(data) {
				this.storeData = data;
				
				let tmp = [];
				data.forEach(( item)=>{
					tmp.push( item.id );
				});
				this.formSearch.store_ids = tmp;
			},
		},
		watch: {
			catList: {
				handler(nV) {
					this.sortCatList = this.handleSortList([...nV]);
					this.sortCatList.unshift(defaultItem);
				},
				immediate: true
			},
			vcatList: {
				handler(nV) {
					this.sortVcatList = this.handleSortList([...nV]);
					this.sortVcatList.unshift(defaultItem);
				},
				immediate: true
			},
			goodSaleType(nV) {
				this.saleType = { ...nV
				};
			},
			goodSaleKind(nV) {
				this.saleKind = [...nV];
			},
			goodImage(nV) {
				this.isOnImage = [...nV];
			},
			platForm(nV) {
				this.goodsPlatform = [...nV];
			}
		}
	}
</script>

<style lang="less">
	.goods-search-form {
		.search_wrapper {
			.ivu-form-item-content {
				display: flex;
				align-items: center;
			}

			.search_btn {
				display: inline-block;
				margin-left: 10px;
			}
		}

		.ivu-form-item {
			margin-bottom: 10px;
			margin-right: 10px;
		}

		.ivu-input-icon-clear {
			right: 50px;
		}

		.goods-search_input {
			width: 320px;

			.goods-search_select {
				width: 90px;
			}
		}

		.ivu-form-item-label {
			text-align: left;
		}
	}
</style>
