export default {
  data () {
    return {
      tableColumns: [
        // {
        //   title: '序号',
        //   key: 'name',
        //   align: 'left'
        // },
        {
          title: '砍价发起人昵称',
          key: 'cut_real_name',
          align: 'left'
        },
        {
          title: '砍价发起人卡号',
          key: 'cut_card_num',
          align: 'left'
        },
        {
          title: '发起时间',
          key: 'cut_create_time',
          align: 'left',
          slot: 'cut_create_time'
        },
        {
          title: '成功时间',
          key: 'success_time',
          align: 'left',
          slot: 'success_time'
        },
        {
          title: '商品名称',
          key: 'cut_goods_name',
          align: 'left'
        },
        {
          title: '商品货号',
          key: 'cut_goods_sn',
          align: 'left'
        },
        {
          title: '帮砍人卡号',
          key: 'help_cut_card_num',
          align: 'left'
        },
        {
          title: '帮砍人手机号',
          key: 'help_cut_mobile_phone',
          align: 'left'
        },
        {
          title: '帮砍时间',
          key: 'help_cut_create_time',
          align: 'left',
          slot: 'help_cut_create_time'
        },
        {
          title: '砍价状态',
          key: 'activity_status_str',
          align: 'left'
        }
      ]
    }
  }
}
