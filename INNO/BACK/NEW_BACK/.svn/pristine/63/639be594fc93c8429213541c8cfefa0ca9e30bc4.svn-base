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
          title: "退换单详情",
          key: "order_sn",
          ellipsis: true,
          minWidth: 420,
          slot: 'orderInfo'
        },
        {
          title: "退换时间",
          key: "add_time",
          align: "left",
          minWidth: 120
        },
        {
          title: "申请人",
          key: "user_name",
          align: "left",
          minWidth: 100
        },
        {
          title: "类型",
          key: "return_type_str",
          align: "left",
          minWidth: 120
        },
        {
          title: "状态",
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
