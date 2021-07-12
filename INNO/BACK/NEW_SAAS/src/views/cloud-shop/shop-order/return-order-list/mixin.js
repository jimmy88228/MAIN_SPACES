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
                reload() {
                  that.loadData();
                }
              }
            })
          }
        },
        {
          title: "订单详情",
          key: "return_sn",
          ellipsis: true,
          minWidth: 420,
          slot: 'orderInfo'
        },
        {
          title: "退单时间",
          key: "add_time",
          align: "left",
          minWidth: 120
        },
        {
          title: "下单人",
          key: "card_num",
          align: "left",
          minWidth: 100
        },
        {
          title: "退单类型",
          key: "return_type_str",
          align: "left",
          minWidth: 120
        },
        {
          title: "退货类型",
          key: "refund_type_str",
          align: "left",
          minWidth: 100
        },
        {
          title: "退单状态",
          key: "return_status_str",
          align: "left",
          minWidth: 100
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          minWidth: 80
        }
      ]
    }
  }
}
