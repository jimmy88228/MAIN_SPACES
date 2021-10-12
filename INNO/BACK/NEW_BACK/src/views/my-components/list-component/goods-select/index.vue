<template>
	<div class="goods-select">
		<list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
			<template v-slot:selected="{ selectedData, delItem }">
				<span class="item goods_item" v-for="item in selectedData" :key="item.id">
					<div class="img_wrapper">
						<img :src="item.goods_thumb2" v-if="item.goods_thumb2" class="img" />
						<img src="@rs/images/default-img.jpg" v-else class="img" />
					</div>
					<p class="title text-clamp3">{{item.name}}</p>
					<Icon type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)" />
				</span>
			</template>
			<template v-slot:search="{ searchPage, data }">
				<Form ref="formSearch" :model="formSearch" :label-width="90" inline class="goods_search">
					<FormItem :label-width="0">
						<Input class="goods-search_input" v-model="formSearch.search" placeholder="请输入关键字" clearable search enter-button
						 @on-search="searchPage(formSearch)" @on-clear="searchPage" @keydown.native.enter.prevent>
						<Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
							<Option :value="1">商品名字</Option>
							<Option :value="2">商品货号</Option>
						</Select>
						</Input>
						<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
					</FormItem>
					<transition name="fade">
						<Row v-show="isShowExtra">
							<Col span="10">
							<FormItem label="所有分类">
								<Cascader :data="sortCatList" v-model="currentSort" class="basic_cascader basic_cascader_fixed" placeholder="请选择所有分类"
								 filterable change-on-select transfer ref="catRef" :clearable="isClear" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
							</FormItem>
							<FormItem label="自定义分类" :label-width="90">
								<Cascader :data="sortVcatList" v-model="currentVcatSort" class="basic_cascader basic_cascader_fixed"
								 placeholder="请选择自定义分类" filterable change-on-select transfer ref="vcatRef" :clearable="isClear" :render-format="renderSort"
								 @on-change="selectSortVcat"></Cascader>
							</FormItem>
							<FormItem label="商品分类">
								<Select v-model="formSearch.is_delete">
									<Option :value="0">正常商品</Option>
									<Option :value="1">回收站里面的商品</Option>
								</Select>
							</FormItem>
							</Col>
							<Col span="7">
							<FormItem label="相册筛选">
								<Select v-model="formSearch.is_on_image">
									<Option v-for="(item, index) in data.is_on_image" :value="index" :key="index">{{item}}</Option>
								</Select>
							</FormItem>
							<FormItem label="上架平台">
								<Select v-model="formSearch.platform_src" multiple>
									<Option v-for="item in data.goods_platform" :value="item.value" :key="item.value">{{item.name}}</Option>
								</Select>
							</FormItem>
							<FormItem label="售卖类型">
								<Select v-model="formSearch.sale_kind">
									<Option v-for="(item, index) in data.sale_kind" :value="index" :key="index">{{item}}</Option>
								</Select>
							</FormItem>
							</Col>
							<Col span="4">
							<FormItem label="是否上架">
								<Select v-model="formSearch.is_on_sale">
									<Option :value="0">全部</Option>
									<Option :value="1">上架</Option>
									<Option :value="2">下架</Option>
								</Select>
							</FormItem>
							<FormItem label="商品类别">
								<Select v-model="formSearch.sale_type">
									<Option v-for="(value, name) in data.sale_type" v-if="disableType(name)" :value="name" :key="name">{{value}}</Option>
								</Select>
							</FormItem>
							</Col>
						</Row>
					</transition>
				</Form>
			</template>
		</list-component>
	</div>
</template>

<script>
	import ListComponent from '../template/template';
	import Mixin from './mixin';
	import EventMixin from '../event-mixin';

	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};
	export default {
		props: {
			saleTypeArr: {
				type: Array,
				default(){
					return [0,1,4]
				}
			}
		},
		name: 'GoodsSelect',
		mixins: [Mixin, EventMixin],
		components: {
			ListComponent
		},
		data() {
			return {
				formSearch: {
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
					sale_type_arr: []
				},
				isShowExtra: false,
				sortCatList: [],
				currentSort: [],
				sortVcatList: [],
				currentVcatSort: [],
				isClear: false
			}
		},
		methods: {
			initParams(){
				let saleTypeArr = this.saleTypeArr || [];
				if(saleTypeArr instanceof Array){
					this.formSearch.sale_type_arr = saleTypeArr;
				}
			},
			beforeLoad(){
				return new Promise((rs, rj)=>{
					this.initParams();
					rs();
				})
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
							this.sortCatList = this.handleSortList([...catRes.data]);
							this.sortCatList.unshift(defaultItem);
						}
						let vcatRes = vcatData.data;
						if (vcatRes.code) {
							this.sortVcatList = this.handleSortList([...vcatRes.data]);
							this.sortVcatList.unshift(defaultItem);
						}
					})
				);
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
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			selectSortCat(value, selectedData) {
				this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
			},
			selectSortVcat(value, selectedData) {
				this.formSearch.vcat_id = selectedData[selectedData.length - 1].value;
			},
			disableType(id){
				let saleTypeArr = this.saleTypeArr || [];
				if(saleTypeArr.length > 0){
					if(saleTypeArr.indexOf(parseInt(id)) != -1){
						return true
					} else {
						return false
					}
				} else {
					return true;
				}
				
			}
		},
		mounted() {
			// 获取分类数据
			this.loadExtraData();
		}
	}
</script>

<style lang="less">
	.template-modal {
		.goods_item {
			display: flex;
			align-items: center;
			flex-direction: column;

			.img_wrapper {
				width: 50px;
				height: 50px;
				border: 1px solid #efefef;
				overflow: hidden;
				margin-bottom: 4px;

				.img {
					width: 50px;
					object-fit: contain;
				}
			}
		}

		.goods_search {
			.ivu-form-item {
				margin-bottom: 8px;
			}

			.ivu-form-item-content {
				display: flex;
				align-items: center;
			}

			.search_btn {
				display: inline-block;
				margin-left: 10px;
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
		}
	}
</style>
