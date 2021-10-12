export default {
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "商品主图",
          key: "goods_thumb2",
          align: "left",
          slot: 'goods_thumb2',
        },
        {
          title: "商品",
          key: "goods_name",
          align: "left",
          width:350,
          slot: 'name',
        },
        {
          title: "售卖价",
          key: "price",
          slot: 'price',
        },
        {
          title: "修改时间",
          key: "updated_at",
          width:120,
          align: "left"
        },
        {
          title: "同步时间",
          key: "last_sys_date",
          width:120,
          align: "left"
        },
        {
          title: "操作",
          key: "handle",
          align: "left",
          slot:"handle"
        },
      ]
    }
  }
}
