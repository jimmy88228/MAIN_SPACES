// 每项数据的详细信息
import OrderDetail from './order-detail/order-details.jsx';
import ErpOrderDetail from './erp-order-detail/erp-order-details.jsx';

export default {
  components: {
    OrderDetail,
    ErpOrderDetail
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
            return h(this.status != '1000' ? OrderDetail : ErpOrderDetail, {
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
          title: "订单详情",
          key: "order_sn",
          ellipsis: true,
          minWidth: 160,
          slot: 'orderInfo'
        },
        {
          title: "买家",
          key: "user_name",
          align: "left",
          minWidth: 100
        },
        {
          title: "实付金额",
          key: "money_paid",
          align: "left",
          minWidth: 120,
          slot: 'money'
        },
        {
          title: "下单时间",
          key: "create_time_format",
          align: "left",
          minWidth: 100,
          slot: 'createTime'
        },
        {
          title: "财务状态",
          key: "pay_status_name",
          align: "left",
          minWidth: 100
        },
        {
          title: "订单状态",
          key: "order_status_name",
          align: "center",
          minWidth: 100,
          slot: 'orderStatus'
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
