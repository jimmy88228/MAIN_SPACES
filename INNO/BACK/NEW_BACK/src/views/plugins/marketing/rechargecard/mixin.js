export default{
  data () {
    return {
      tableColumns: [
        {
          title: '名称	',
          key: 'card_name',
          align: 'left'
        },
        {
          title: '标识码',
          key: 'card_code',
          align: 'left'
        },
        {
          title: '充值面额',
          key: 'card_value',
          align: 'left'
        },
        {
          title: '赠送面额',
          key: 'card_attached_value',
          align: 'left'
        },
        {
          title: '有效期',
          key: 'time_rand',
          width: 160,
          align: 'left'
        },
        {
          title: '是否可用',
          key: 'is_enabled',
          slot: 'is_enabled',
          align: 'left'
        },
        {
          title: '购买量',
          key: 'card_period',
          align: 'left',
          slot: 'card_period'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          slot: 'handle'
        }
      ]
    }
  }
}
