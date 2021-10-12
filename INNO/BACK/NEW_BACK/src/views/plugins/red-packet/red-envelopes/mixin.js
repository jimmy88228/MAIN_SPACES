export default {
  data () {
    return {
      tableColumns: [
        {
          title: '红包名称',
          key: 'act_name',
          align: 'left'
        },
        {
          title: '红包金额',
          key: 'amount',
          align: 'left'
        },
        {
          title: '发放数量',
          key: 'send_number',
          align: 'left'
        },
        {
          title: '使用数量',
          key: 'used_red_num',
          align: 'left'
        },
        {
          title: '使用时间',
          key: 'from_date',
          align: 'left',
          slot: 'fromDate'
        },
        {
          title: '到期时间',
          key: 'to_date',
          align: 'left',
          slot: 'toDate'
        },
        {
          title: '最后修改时间',
          key: 'modify_time',
          align: 'left',
          slot: 'modifyTime'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          width: 300,
          slot: 'handle'
        }
      ]
    }
  }
}
