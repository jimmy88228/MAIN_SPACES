export default {
  data () {
    return {
      defaultColumns: [
        {
          title: '红包名称',
          key: 'redpack_name',
          align: 'left',
          minWidth: 220
        },
        {
          title: '红包编码',
          key: 'redpack_sn',
          align: 'left',
          width: 120
        },
        {
          title: '初始面值',
          key: 'amount',
          align: 'left',
          width: 100
        },
        {
          title: '剩余余额',
          key: 'have_amount',
          align: 'left',
          width: 140
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'left',
          slot: 'phone',
          width: 140
        },
        {
          title: '会员卡号',
          key: 'card',
          align: 'center',
          slot: 'card',
          minWidth: 100
        },
        {
          title: '发放时间',
          key: 'created_at',
          align: 'center',
          slot: 'sendTime',
          minWidth: 140
        }
      ],
      useTimeItem: {
        title: '使用时间',
        key: 'useTime',
        align: 'center',
        slot: 'useTime',
        minWidth: 140
      },
      handleItem: {
        title: '操作',
        key: 'handle',
        align: 'center',
        slot: 'handle',
        width: 120
      }
    }
  },
  computed: {
    tableColumns () {
      let result = this.defaultColumns;
      if (this.$route.query.act === 'use-list') {
        result = this.defaultColumns.concat(this.useTimeItem);
      } else if (this.$route.query.act === 'send-list') {
        result = this.defaultColumns.concat(this.handleItem);
      }
      return result;
    }
  }
}
