export default {
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 80,
          align: "center"
        },
        {
          title: '商品名称',
          key: 'name',
          slot: 'name',
          align: 'left',
          minWidth: 200
        },
        {
          title: '货号',
          key: 'goods_sn',
          align: 'left',
          minWidth: 200
        },
        {
          title: '是否上架',
          key: 'is_on_sale_type',
          align: 'left',
          minWidth: 100
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle',
          align: 'left',
          width: 140
        }
      ]
    }
  }
}
