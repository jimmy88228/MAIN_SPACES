export default {
  data () {
    return {
      tableColumns: [
        {
          title: '分销所属店铺',
          width: 140,
          key: 'store_name'
        },
        {
          title: '分销所属店铺代码',
          width: 160,
          key: 'store_code'
        },
        {
          title: '状态',
          width: 140,
          key: 'staff_status'
        },
        {
          title: '分销员名称',
          width: 140,
          key: 'dstb_staff_name'
        },
        {
          title: '分销员代码	',
          width: 140,
          key: 'dstb_staff_code'
        },
        {
          title: '关联会员卡号',
          width: 140,
          key: 'card_num'
        },
        {
          title: '分销员来源',
          width: 140,
          key: 'dstb_type_str'
        },
        {
          title: '货号	',
          width: 180,
          key: 'goods_sn'
        },
        {
          title: '条码	',
          width: 140,
          key: 'product_sn'
        },
        {
          title: '吊牌价	',
          width: 140,
          key: 'market_price'
        },
        {
          title: '订单编号	',
          width: 280,
          key: 'related_order_sn'
        },
        {
          title: '下单会员',
          width: 140,
          key: 'real_name'
        },
        {
          title: '会员编号',
          width: 140,
          key: 'card_num'
        },
        {
          title: '会员所属店铺',
          width: 140,
          key: 'm_store_name'
        },
        {
          title: '会员所属店铺编码',
          width: 160,
          key: 'm_store_code'
        },
        {
          title: '下单时间',
          width: 140,
          key: 'comm_date',
          slot: 'comm_date'
        },
        {
          title: '商品金额	',
          width: 140,
          key: 'total_real_price'
        },
        {
          title: '商品收益',
          width: 140,
          key: 'comm_amount'
        },
        {
          title: '收益状态',
          width: 140,
          key: 'comm_status_str'
        },
        {
          title: '操作',
          width: 140,
          key: '',
          slot: 'handle'
        }
      ]
    }
  }
}
