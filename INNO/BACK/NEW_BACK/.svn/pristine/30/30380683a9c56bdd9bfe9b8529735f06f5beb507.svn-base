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
          key: "order_sn",
          ellipsis: true,
          minWidth: 320,
          slot: 'orderInfo'
        },
        {
          title: "下单时间",
          key: "add_time",
          align: "left",
          minWidth: 120
        },
        {
          title: "收货人",
          key: "consignee",
          align: "left",
          minWidth: 100
        },
        {
          title: "最后更新时间",
          key: "update_time",
          align: "left",
          minWidth: 120
        },
        {
          title: "发货单状态",
          key: "status",
          align: "left",
          minWidth: 120
        },
        {
          title: "操作人",
          key: "action_user",
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
