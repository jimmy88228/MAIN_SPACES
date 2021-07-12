// 每项数据的详细信息
import OrderDetail from './order-detail/order-details.jsx';

export default {
  components: {
    OrderDetail
  },
  data () {
    return {
      tableColums: [
        {
          type: 'expand',
          width: 5,
          render: (h, params) => {
            const that = this;
            // 这里是因为在最外层存在_expanded: true
            let disabledExpand = Object.assign({}, params.row, {
              _expanded: false,
              _disableExpand: true
            });
            return h(OrderDetail, {
              props: {
                tableData: [disabledExpand], //利用table进行嵌套，需要构造出table所需的数据格式=>数组
                rowData: disabledExpand
              },
              on: {
                reload () {
                  that.loadData();
                }
              }
            })
          }
        },
        {
          title: "拼团信息",
          key: "order_sn",
          ellipsis: true,
          minWidth: 220,
          slot: 'orderInfo'
        },
        {
          title: "会员信息",
          key: "user",
          align: "left",
          minWidth: 100
        },
        {
          title: "下单时间",
          key: "price",
          align: "left",
          width: 260
        },
        {
          title: "订单信息",
          key: "money_paid",
          align: "left",
          width: 320
        },
        {
          title: "拼团状态",
          key: "pay_status_name",
          align: "left",
          minWidth: 100
        },
        {
          title: "操作",
          key: "handle",
          align: "left",
          minWidth: 80,
          slot: 'handle'
        }
      ]
    }
  }
}
