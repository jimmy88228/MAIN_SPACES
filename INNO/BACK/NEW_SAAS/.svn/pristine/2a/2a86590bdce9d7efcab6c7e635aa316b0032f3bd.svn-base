export default{
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称	',
          key: 'rule_name',
          align: 'left'
        },
        {
          title: '活动开始时间	',
          key: 'from_time',
          align: 'left',
          slot: 'from_time'
        },
        {
          title: '活动结束时间	',
          key: 'to_time',
          align: 'left',
          slot: 'to_time'
        },
        {
          title: '价格区间',
          key: 'to_time',
          align: 'left',
          render (h, {row}) {
            return h('p', `${row.from_value} - ${row.to_value}`)
          }
        },
        {
          title: '赠送优惠券',
          key: 'to_time',
          align: 'left',
          render (h, {row}) {
            let r = row.type_name.map(i => {
              return h('p', i)
            })
            return h('div', r);
          }
        },
        {
          title: '赠送积分',
          key: 'points',
          align: 'left'
        },
        {
          title: '是否可用',
          key: 'is_enable',
          slot: 'is_enable'
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
