export default {
  data () {
    return {
      tableColumns: [
        {
          title: '名称',
          key: 'offer_name',
          align: 'left'
        },
        {
          title: '类别',
          key: 'offer_type_str',
          align: 'left'
        },
        {
          title: '数值',
          key: 'offer_num',
          align: 'left'
        },
        {
          title: '开始时间',
          key: 'start_time',
          align: 'left',
          slot: 'start_time'
        },
        {
          title: '结束时间',
          key: 'end_time',
          align: 'left',
          slot: 'end_time'
        },
        {
          title: '是否开启',
          key: 'is_enabled',
          align: 'left',
          slot: 'is_enabled'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'left',
          slot: 'handle'
        }
      ]
    }
  }
}
