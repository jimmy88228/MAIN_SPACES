<template>
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="1000">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="90" inline>
				<FormItem prop="search" label="关键词">
					<Input
					class=""
					style="width:300px"
					v-model="formSearch.search"
					placeholder="请输入名称/货号搜索"
					clearable
					search
					enter-button
					@on-search="searchPage"
					@on-clear="searchPage"
					@keydown.native.enter.prevent="searchPage">
						<Select v-model="formSearch.type" slot="prepend" class="goods-search_select" style="width:100px;">
							<Option :value="1">商品名字</Option>
							<Option :value="2">商品货号</Option>
						</Select>
					</Input>
				</FormItem>
			</Form>
		</template>
	</modalTemplate>
</template>
<script>
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	export default{
		mixins: [eventMiXin],
		components: {
			modalTemplate
		},
		data(){
			return {
				formSearch: {
					isInit: 2,
					search: '',
					type: 2,
					cat_id: 0,
					vcat_id: 0,
					is_delete: 0, // 0：正常商品 1：回收站里面的商品
					is_on_sale: 0, // 0：全部 1：上架 2：下架
					sale_type: '0',
					sale_kind: 0,
					is_on_image: 0,
					platform_src: []
				},
				columns: [
					{
					  type: "selection",
					  width: 60,
					  align: "center"
					},
					{
						key: "goods_img",
						title: "商品图片",
						minWidth: 100,
						align: "left",
						render: (h, params) => {
							return h('div', [
								h('Avatar', {
									props: {
										icon:(params.row.goods_img !='' ? '' : 'images'),
										shape:'square',
										size:'large',
									},
									style:{
										margin:'5px 0',
										width:'50px',
										height:'50px',
										border:'1px solid #eee',
										background: (params.row.goods_img !='' ? 'url(' + params.row.goods_img + ') center center/100% no-repeat' : '') ,backgroundSize: '100% auto',
									},
								})
							]);
						}
					},
					{
						key: "name",
						minWidth: 100,
						align: "center",
						title: "商品名称"
					},
					{
						key: "color_name",
						width: 80,
						align: "center",
						title: "颜色",
						render: (h, params) => {
							return h('div', params.row.product.color_name);
						}
					},
					{
						key: "size_name",
						width: 80,
						align: "center",
						title: "尺码",
						render: (h, params) => {
							return h('div', params.row.product.size_name);
						}
					},
					{
						key: "product_number",
						width: 70,
						align: "center",
						title: "库存",
						render: (h, params) => {
							return h('div', params.row.product.product_number);
						}
					},
					{
						key: "market_price",
						width: 100,
						align: "center",
						title: "市场价格",
						render: (h, params) => {
							return h('div', params.row.product.market_price);
						}
					},
					{
						key: "sale_price",
						width: 80,
						align: "center",
						title: "售价",
						render: (h, params) => {
							return h('div', params.row.product.sale_price);
						}
					}
				],
			}
		},
		computed: {
			status() {
				let props = this.$props || {};
				props.title = "选择商品SKU";
				console.log("props", props)
				return props
			}
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				if(!formSearch.search){ this.$Message.error("请输入货号搜索"); return Promise.reject(); }
				return this.$ajax.post( this.$api.goodsList, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								console.log("res", res)
								let productList = [];
								for(let i = 0; i < items.length; i++){
									let get_products = items[i].get_products || [];
									let item = JSON.parse(JSON.stringify(items[i]));
									delete item.get_products;
									for(let j = 0; j < get_products.length; j++){
										productList.push({
											...item,
											product: get_products[j],
											id: get_products[j].product_id,
											name: item.goods_name + "(" + get_products[j].product_sn + ")"
										})
									}
								}
								data.items = productList || [];
								return Promise.resolve(data)
							} else {
								return Promise.reject();
							}
				}).catch(()=>{
					
				})
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			}
		}
	}
</script>
<style>
	
</style>