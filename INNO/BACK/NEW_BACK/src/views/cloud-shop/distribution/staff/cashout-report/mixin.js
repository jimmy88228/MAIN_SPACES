export default {
  data () {
    return {
      tableColumns: [
        {
          title: '分销员名称',
          width: 140,
          key: 'dstbStaffName'
        },
        {
          title: '分销员代码',
          width: 140,
          key: 'dstbStaffCode'
        },
        {
          title: '手机号',
          width: 140,
          key: 'dstbStaffPhone'
        },
        {
          title: '累计收益',
          width: 140,
          key: 'allCommAmount'
        },
        {
          title: '累计可提现收益',
          width: 160,
          key: 'allCanCashoutAmount'
        },
        {
          title: '累计已提现金额',
          width: 160,
          key: 'allTransCashoutAmount'
        },
        {
          title: '销量',
          width: 120,
          key: 'orderAmount'
        },
        {
          title: '收益',
          width: 120,
          key: 'commAmount',
          slot: 'commAmount'
        },
        {
          title: '冻结中收益',
          width: 140,
          key: 'frozenCommAmount'
        },
        {
          title: '已提现金额',
          width: 140,
          key: 'allTransCashoutAmount'
        },
        {
          title: '余额',
          width: 120,
          key: 'accountBalance',
          slot: 'accountBalance'
        }
      ]
    }
  }
}
