<template>
	<div class='goods-select'>
		<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="1000">
			<template slot="search">
				<Form ref="formSearch" :model="formSearch" :label-width="68" inline class="goods_search">
					<Row>
						<Col span="8">
							<FormItem label="标准分类">
								<Cascader :data="sortCatList" v-model="currentSort" class="basic_cascader basic_cascader_fixed" placeholder="请选择所有分类"
								filterable change-on-select transfer ref="catRef" :clearable="isClear" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
							</FormItem>
						</Col>
						<Col span="5">
							<FormItem label="商品状态">
								<Select v-model="formSearch.sale_state">
									<Option :value="0">全部</Option>
									<Option :value="1">上架</Option>
									<Option :value="2">下架</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem :label-width="0" style="width:100%;">
								<div class="flex f-just-between" style="width:100%;">
									<div class="flex">
										<Input class="goods-search_input" v-model="formSearch.searchq" placeholder="请输入商品货号" clearable search enter-button
										@on-search="searchPage()" @on-clear="searchPage" @keydown.native.enter.prevent>
										</Input>
									</div>
								</div>
							</FormItem>
						</Col>
					</Row>	
	
				</Form>
			</template>
		</modalTemplate> 
	</div>
</template>
<script>
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	import Mixin from './mixin';
	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};
	export default{
		props: {},
		mixins: [eventMiXin, Mixin],
		components: {
			modalTemplate
		},
		data(){
			return {
				formSearch: {
					searchq: '',
					cat_id: 0,
					sale_state: 1, // 0：全部 1：上架 2：下架
				},
				sortCatList: [],
				currentSort: [],
				currentVcatSort: [],
				isClear: false
			}
		},
		computed: {
		},
		methods: {
			beforeShowModal(){
				return new Promise((rs, rj)=>{
					let saleTypeArr = this.saleTypeArr || [];
					if(saleTypeArr instanceof Array){
						this.formSearch.sale_type_arr = saleTypeArr;
					}
					rs();
				})
			},
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.videoNumberGoodsInfo, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								if(items instanceof Array){
									for(let i = 0; i < items.length; i++){
										if(items[i].mg_count>0){
											items[i]._disabled = true;
											items[i].goods_sn = items[i].goods_sn + "("+'已添加'+")";
										}
										items[i].id = items[i].goods_id;
										items[i].name = items[i].goods_name;
										items[i].img = items[i].goods_thumb2;
									}
								}
								this.data = data;
								let result = {
									items: items,
									total: data.total
								}
								return Promise.resolve(result)
							} else {
								return Promise.reject();
							}
				}).catch(()=>{
					
				})
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			},
			loadExtraData() {
				this.$ajax.all(
					[
						this.$ajax.post(this.$api.catTree)
					]
				).then(
					this.$ajax.spread((catData) => {
						let catRes = catData.data;
						if (catRes.code) {
							this.sortCatList = this.handleSortList([...catRes.data]);
							this.sortCatList.unshift(defaultItem);
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
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			selectSortCat(value, selectedData) {
				this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
			},
		},
		mounted(){
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
				width: 200px;
			}
		}
	}
</style>