import expandRow from "./goods-row.vue";
export default{
	data(){
		return {
				columns: [
					{
						type: 'expand',
						width: 60,
						render: (h, params) => {
								let that = this;
								return this.$createElement(expandRow, {
										props: {
												row: params.row
										},
										ref: "expandRow" + params.index,
										on: {
											syncSkuRow: function({ _row }){
												let sku = _row.sku;
												that.goodsForm.editGoodsList && that.$set(that.goodsForm.editGoodsList[params.index], "sku", sku);
											}
										}
								})
						}
					},
					{
							title:'商品图片',
							align: 'center',
							width:120,
							slot:'goods_img'
					},
					{
							title:'商品名称',
							key:'goods_name',
							align: 'center',
							width:120,
							slot:'goods_name'
					},
					{
							title:'商品货号',
							key:'goods_sn',
							align: 'center',
							width:120,
					},
					{
							title:'库存',
							key:'inventory',
							align: 'center',
							width:80
					},
					{
							title:'限购数量',
							key:'user_buy_limit',
							align: 'center',
							width:120,
							slot:'user_buy_limit'
					},
					{
							title:'每单限购数量',
							key:'order_buy_limit',
							align: 'center',
							width:120,
							slot:'order_buy_limit'
					},
					{
							title:'排序',
							key:'sort',
							align: 'center',
							width:120,
							slot: 'sort'
					},
					{
							title:'操作',
							align: 'center',
							width:120,
							slot:'action'
					},
				]
		}
	}
}