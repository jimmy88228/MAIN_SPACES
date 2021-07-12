export default {
  data () {
    return {
      tableColumns: [
				{
					type: "selection",
					width:50,
				},
        {
          title: '商品名称',
					minWidth: 160,
          key: 'goods_name',
          align: 'left'
        },
        {
          title: '编号',
          key: 'goods_sn',
					minWidth: 120,
          align: 'left'
        },
        {
          title: '商品类型',
          key: 'is_virtual_str',
					minWidth: 160,
          align: 'left'
        },
        {
          title: '创建时间',
          key: 'created_at_from',
					minWidth: 160,
          align: 'left'
        },
        {
          title: '操作',
					width: 120,
          key: 'handle',
          align: 'center',
          width: 300,
          slot: 'handle'
        },
      ]
    }
  }
}
