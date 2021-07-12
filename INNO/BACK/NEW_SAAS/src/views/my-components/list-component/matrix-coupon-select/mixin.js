export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "优惠券名称",
          key: "type_name"
        },
        {
          title: '优惠券编码',
          key: 'type_code',
          align: 'left'
        }
      ]
    }
  }
}
