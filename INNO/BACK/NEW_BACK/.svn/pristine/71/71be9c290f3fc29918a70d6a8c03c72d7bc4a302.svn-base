<template>
	<div class="goods-search-form">
		<Form ref="formSearch" :model="formSearch" :label-width="86">
			<FormItem :label-width="0" class="search_wrapper">
				<Input class="goods-search_input" v-model="formSearch.search" :placeholder="formSearch.note" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.type" @on-change="editplaceholder" slot="prepend" class="goods-search_select">
					<Option :value="1">商品名字</Option>
					<Option :value="2">商品货号</Option>
					<Option :value="3">商品条码</Option>
				</Select>
				</Input>
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
					<FormItem label="市场价区间" >
							<Input v-model="formSearch.min_market_price" clearable  class="basic_input" style="width:100px" />~<Input v-model="formSearch.max_market_price" clearable  class="basic_input" style="width:100px" />
					</FormItem>
					<FormItem label="商品品牌" prop="goods_brand_id">
						<Select v-model="formSearch.goods_brand_id" class="basic_select">
							<Option :value="0">全部</Option>
							<Option v-for="(item) in goodsBrandList" :value="item.goods_brand_id" :key="item.goods_brand_id">{{ item.goods_brand_name }}</Option>
						</Select>
					</FormItem>
					</Col>
					<Col span="8">
					<FormItem label="相册筛选">
						<Select v-model="formSearch.is_on_image" class="basic_select">
							<Option v-for="(item, index) in isOnImage" :value="index" :key="index">{{item}}</Option>
						</Select>
					</FormItem>
					<FormItem label="商品类别">
						<Select v-model="formSearch.sale_type" class="basic_select">
							<Option v-for="(value, name) in saleType" :value="name" :key="name">{{value}}</Option>
						</Select>
					</FormItem>
					<FormItem label="创建时间" :label-width="70" class="date-form-item">
						<date-select ref="dateSelect" @sT="handleAddTimeBegin" @eT="handleAddTimeEnd"/>
					</FormItem>
					</Col>
					<Col span="8">
					<FormItem label="售卖类型">
						<Select v-model="formSearch.sale_kind" class="basic_select">
							<Option v-for="(item, index) in saleKind" :value="index" :key="index">{{item}}</Option>
						</Select>
					</FormItem>
					<FormItem label="上架平台">
						<Select v-model="formSearch.platform_src" multiple class="basic_select">
							<Option v-for="item in goodsPlatform" :value="item.value" :key="item.value">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="上架时间" :label-width="70" class="date-form-item">
						<date-select ref="dateSelect" @sT="handleOnSaleTimeBegin" @eT="handleOnSaleTimeEnd"/>
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
			<!-- <FormItem label="商品分类" class="common_inline">
        <Select v-model="formSearch.is_delete">
          <Option :value="0">正常商品</Option>
          <Option :value="1">回收站里面的商品</Option>
        </Select>
      </FormItem>
      <FormItem label="是否上架" class="common_inline">
        <Select v-model="formSearch.is_on_sale">
          <Option :value="0">全部</Option>
          <Option :value="1">上架</Option>
          <Option :value="2">下架</Option>
        </Select>
      </FormItem> -->
		</Form>
	</div>
</template>

<script>
	import DateSelect from '@/views/my-components/date-select/index.vue';
	/**
	 * 商品列表 搜索框
	 */
	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};
	 
	export default {
		components: {
			DateSelect
		},
		name: 'searchForm',
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
			}
		},
		data() {
			return {
				// 搜索表单
				formSearch: {
					search: '',
					type: 2,
					cat_id: 0,
					vcat_id: 0,
					// is_delete: 0, // 0：正常商品 1：回收站里面的商品
					// is_on_sale: 0, // 0：全部 1：上架 2：下架
					sale_type: '0',
					sale_kind: 0,
					is_on_image: 0,
					platform_src: [],
					add_time_begin: '',
					add_time_end: '',
					on_sale_time_begin: '',
					on_sale_time_end: '',
					goods_brand_id: '',
					min_market_price: '',
					max_market_price: '',
					note:"多货号(逗号相隔)",
				},
				sortCatList: [],
				sortVcatList: [],
				currentSort: [],
				currentVcatSort: [],
				saleType: {},
				saleKind: [],
				isOnImage: [],
				goodsPlatform: [],
				isClear: true,
				isShowExtra: false,
				goodsBrandList: [],
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
			editplaceholder(){
				this.formSearch.note=Number(this.formSearch.type)==2?"多货号(逗号相隔)":"请输入关键字"; 
			},
			// 搜索按钮触发
			searchPage() {
				this.$emit('on-search', Object.assign({}, this.formSearch, {
					platform_src: this.formSearch.platform_src.join(',')
				}));
			},
			selectSortCat(value, selectedData) {
				if (selectedData.length == 0) {
					this.formSearch.cat_id = 0;
				} else {
					this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
				}
				
			},
			selectSortVcat(value, selectedData) {
				if (selectedData.length == 0) {
					this.formSearch.vcat_id = 0;
				} else {
					this.formSearch.vcat_id = selectedData[selectedData.length - 1].value;
				}
			},
			handleAddTimeBegin (date) {
				this.formSearch.add_time_begin = date;
			},
			handleAddTimeEnd (date) {
				this.formSearch.add_time_end = date;
			},
			handleOnSaleTimeBegin (date) {
				this.formSearch.on_sale_time_begin = date;
			},
			handleOnSaleTimeEnd (date) {
				this.formSearch.on_sale_time_end = date;
			},
			getGoodsBrandList () {
				this.$ajax.post(this.$api.goodsBrandList, {
					is_all : 1
				}).then(response => {
					const goodsBrands = response.data;
					this.goodsBrandList = goodsBrands.data;
				});
    
			}
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
		},
		created () {
			this.getGoodsBrandList();
		},
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
