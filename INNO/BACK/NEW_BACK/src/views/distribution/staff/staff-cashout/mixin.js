export default {
  data () {
    return {
      tableColumns: [
        {
          title: '请款码',
          width: 260,
          key: 'transfer_account_no'
        },
        {
          title: '分销员名称',
          width: 140,
          key: 'dstb_staff_name'
        },
        {
          title: '会员昵称',
          width: 140,
          key: 'real_name'
        },
        {
          title: '手机号',
          width: 140,
          key: 'dstb_staff_phone'
        },
        {
          title: '当前余额',
          width: 140,
          key: 'account_balance'
        },
        {
          title: '申请提现金额',
          width: 140,
          key: 'request_amount'
        },
        {
          title: '转款时间',
          width: 140,
          key: 'transfer_time',
          slot: 'transfer_time'
        },
        {
          title: '申请时间',
          width: 140,
          key: 'create_time',
          slot: 'create_time'
        },
        {
          title: '审核时间',
          width: 140,
          key: 'confirm_time',
          slot: 'confirm_time'
        },
        {
          title: '审核状态',
          width: 140,
          key: 'status_str'
        },
        {
          title: '申请审核类型',
          width: 160,
          key: 'confirm_type_str'
        },
        {
          title: '转账审核类型',
          width: 140,
          key: 'tranfer_type_str'
        },
        {
          title: '转账类型',
          width: 140,
          key: 'paymentType'
        },
        {
          title: '操作',
          key: 'handle',
          width: 140,
          slot: 'handle'
        }
      ]
    }
  }
}
