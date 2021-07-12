export default {
  data () {
    const _this = this;
    return {
      tableColumns: [
        {
          title: '规则名',
          key: 'rule_name'
        },
        {
          title: '促销类型',
          key: 'type',
          slot: 'type'
        },
        {
          title: '是否开启',
          key: 'is_enable',
          render(h, params) {
            return h('i-switch', {
              props: {
                value: params.row.is_enable,
                'true-value': '1',
                'false-value': '0',
                'before-change'() {
                  return new Promise((resolve, reject) => {
                    _this.updateAsync(params.row.rule_id, params.row.is_enable)
                    /*.then(() => {
                      resolve();
                    });*/
                  });
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '是'),
              h('span', {
                slot: 'close'
              }, '否')
            ])
          }
        },
        {
          title: '开始时间',
		  width:120,
          key: 'start_time',
          slot: 'startTime'
        },
        {
          title: '结束时间',
		  width:120,
          key: 'end_time',
          slot: 'endTime'
        },
        {
          title: '操作',
		  width:140,
		  align: 'center',
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
