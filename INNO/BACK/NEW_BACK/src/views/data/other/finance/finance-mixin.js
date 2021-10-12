export default {
	data(){
		return {
			columns: [
			    {
			        title: '店铺',
			        key: 'store_name',
			        align: 'center',
			        width: 120,
			        fixed: 'left',
			        slot:'store',
			        rows:'deal'
			    },
			    {
			        title: '流水号（订单号）',
			        key: 'order_sn',
			        align: 'center',
			        minWidth: 200,
			        fixed: 'left',
			        slot:'order_sn',
			        rows:'deal'
			    },
			    {
			        title: '发货门店',
			        key: 'delivery_store_code',
			        align: 'center',
			        width: 120,
			        fixed: 'left',
			        rows:'deal'
			    },
			    {
			        title: '下单会员',
			        key: 'card_num',
			        align: 'center',
			        minWidth: 130,
			        fixed: 'left',
			        slot:'order_user',
			        rows:'deal'
			    },
			    {
			        title: '商品信息',
			        align: 'center',
			        minWidth:200,
			        key:'goods',
			        children: [
			            {
			                title: '商品名称',
			                key: 'goods_name',
			                align: 'center',
			                minWidth:160,
			                slot:'goods_name',
			                rows:1
			            },
			            {
			                title:'商品条码',
			                key:'product_sn',
			                align:'center',
			                minWidth:120,
			                rows:1,
			            },
			            {
			                title:'商品品牌',
			                key:'goods_brand_name',
			                align:'center',
			                minWidth:100,
			                rows:1,
			            },
			            {
			                title: '商品属性',
			                key: 'goods_attr',
			                align: 'left',
			                minWidth: 200,
			                slot:'goods_attr',
			                rows:1
			            },
			            {
			                title: '吊牌价',
			                key: 'market_price',
			                align: 'center',
			                width: 90,
			                rows:1
			            },
			            {
			                title: '吊牌总价',
			                key: 'goods_market_sum',
			                align: 'center',
			                width: 90,
			                rows:1
			            },
			            {
			                title: '销售价（促销价）',
			                key: 'goods_price',
			                align: 'center',
			                width: 90,
			                rows:1
			            },
			            {
			                title: '销售总价（促销总价）',
			                key: 'goods_price_sum',
			                align: 'center',
			                width: 90,
			                rows:1
			            },
			            {
			                title: '积分抵扣',
			                key: 'integral_amount_sum',
			                align: 'center',
			                width: 90,
			                rows:1,
			            },
			            {
			                title: '优惠券抵扣',
			                key: 'bonus_amount_sum',
			                align: 'center',
			                width: 90,
			                rows:1,
			            },
			            {
			                title: '活动抵扣',
			                key: 'discount_manual_sum',
			                align: 'center',
			                width: 90,
			                rows:1,
			            },
			            {
			                title: '实卖价',
			                key: 'real_sale_price',
			                align: 'center',
			                width: 90,
			                rows:1,
			            }
			        ]
			    },
			    {
			        title: '订单实售价（交易金额）',
			        key: 'real_sale_price_sum',
			        align: 'center',
			        width: 100,
			        rows:'deal'
			    },
			    {
			        title: '订单吊牌总价',
			        key: 'order_market_sum',
			        align: 'center',
			        width: 90,
			        rows:'deal'
			    },
			    {
			        title: '类型',
			        key: 'platform_src',
			        align: 'center',
			        width: 80,
			        rows:'deal'
			    },
			    {
			        title: '支付方式',
			        key: 'pay_name',
			        align: 'center',
			        width: 80,
			        rows:'deal'
			    },
			    {
			        title: '收货时间',
			        key: 'rec_time',
			        align: 'center',
			        width: 100,
			        rows:'deal'
			    },
			    {
			        title: '下单时间',
			        key: 'add_time',
			        align: 'center',
			        width: 100,
			        rows:'deal'
			    },
			    {
			        title: '收件人',
			        key: 'consignee',
			        align: 'center',
			        width: 100,
			        rows:'deal'
			    },
			],
		}
	}
}