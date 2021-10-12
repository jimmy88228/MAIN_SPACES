export default {
  data () {
    return {
      tableColumns: [
        {
          title: '优惠券名称',
          key: 'type_name'
        },
        {
          title: '优惠券编码',
          key: 'type_code'
        },
        {
          title: '派发分销员名称',
          key: 'staff_name'
        },
        {
          title: '派发分销员代码',
          key: 'staff_code'
        },
        {
          title: '派发开始时间',
          key: 'activityDate',
          slot: 'activityDate'
        },
        {
          title: '派发结束时间',
          key: 'activityDateEnd',
          slot: 'activityDateEnd'
        },
        {
          title: '派发备注	',
          key: 'remark'
        },
        {
          title: '派发数量	',
          key: 'total_qty'
        },
        {
          title: '已派数量	',
          key: 'send_qty'
        },
        {
          title: '操作',
          key: '',
          slot: 'handle'
        }
      ]
    }
  }
}
