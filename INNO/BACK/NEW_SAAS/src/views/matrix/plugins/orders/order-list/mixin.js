// 每项数据的详细信息
import OrderDetail from './order-detail/order-details.jsx';
// import ErpOrderDetail from './erp-order-detail/erp-order-details.jsx';

export default {
  components: {
    OrderDetail,
    // ErpOrderDetail
  },
  data () {
    return {
      tableColums: [
        {
          type: 'expand',
          width: 10,
          render: (h, params) => {
            const that = this;
            // 这里是因为在最外层存在_expanded: true
						// if(!(params.row.order_message instanceof Array) && params.row.order_message){
						// 	let array = [];
						// 	for(let i in params.row.order_message){
						// 		array.push(params.row.order_message[i])
						// 	}
						// 	params.row.order_message = array;
						// }
            // let disabledExpand = Object.assign({}, params.row, {
            //   _expanded: true,
            //   _disableExpand: false
            // });
						// this.status != '1000' ? OrderDetail : ErpOrderDetail
            return h(OrderDetail, {
              props: {
                tableData: [params.row], //利用table进行嵌套，需要构造出table所需的数据格式=>数组
                rowData: params.row
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
          title: "商品信息",
          key: "order_sn",
          ellipsis: true,
          minWidth: 160,
          slot: 'orderInfo'
        },
        {
          title: "数量",
          key: "price",
          align: "right",
          minWidth: 100
        },
        {
          title: "用户",
          key: "card_num",
          align: "center",
          minWidth: 100
        },
        // {
        //   title: "会员卡号",
        //   key: "card_num",
        //   align: "center",
        //   minWidth: 140
        // },
        // {
        //   title: "财务状态",
        //   key: "pay_status_name",
        //   align: "center",
        //   minWidth: 100
        // },
        {
          title: "订单状态",
          key: "order_status_name",
          align: "center",
          minWidth: 100
        },
        {
          title: "送货信息",
          key: "user_info",
					slot:"user_info",
          align: "left",
          minWidth: 150
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          minWidth: 80,
          slot: 'handle'
        }
      ]
    }
  }
}
