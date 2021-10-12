export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: '分销员名称',
          key: 'name'
        },
        {
          title: '分销员代码',
          key: 'code'
        },
        {
          title: '电话',
          key: 'dstb_staff_phone'
        }
      ]
    }
  }
}
