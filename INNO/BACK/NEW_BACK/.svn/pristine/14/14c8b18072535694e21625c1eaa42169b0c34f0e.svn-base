import '../common-order-details.less';
import Mixin from './mixin.js';

export default {
  props: ['rowData', 'tableData'],
  data () {
    return {
      isShowHeader: false
    }
  },
  mixins: [Mixin],
  mounted() {
    this.tableColums.unshift({
      title: '占位符',
      key: 'isSlot',
      width: 30
    });
  },
  render() {
    const Divider = 'Divider';
    const Table = 'Table';
    return (
      <div>
        {
          <div class="order-details">
            <Table columns={this.tableColums} data={this.tableData} show-header={this.isShowHeader} {...{
              scopedSlots: {
                orderInfo: ({ row }) => {
                  return <div class="info_wrap">
                    {
                      row.order_message.map((item, index) => {
                        return (
                          <div class="goods_wrapper">
                            <div class="goods">
                              <div class="goods_inner">
                                <p class="goods_item clamp2">{item.goods_name}</p>
                                {
                                  item.goods_sn ? <p class="goods_item clamp2">款号:{item.goods_sn}</p> : <span></span>
                                }
                                <p class="goods_item clamp2">吊牌价:￥{item.unitprice}</p>
                                <p class="goods_item clamp2">实卖价:￥{item.realprice}</p>
                                <p class="goods_item clamp2">折后价:￥{item.disprice}</p>
                                <p class="goods_item">商品数量:{item.goods_number}</p>
                              </div>
                            </div>
                            {row.order_message.length - 1 == index ? <span></span> : <Divider class="common_divider" />}
                          </div>
                        )
                      })
                    }
                  </div>
                },
                user: ({ row }) => {
                  return <div class="user_info">
                    <p>{row.user_name}</p>
                  </div>
                },
                money: ({ row }) => {
                  return <div>
                    <p>总额:￥{row.goods_amount}</p>
                    <p>实付:￥{row.money_paid}</p>
                    <p>{row.pay_name}</p>
                    <p>{row.pay_type}</p>
                  </div>
                },
                createTime: ({ row }) => {
                  return <div>
                    <p>{row.create_time_format.split(' ')[0]}</p>
                    <p>{row.create_time_format.split(' ')[1]}</p>
                  </div>
                },
                payStatus: ({ row }) => {
                  return <p>{row.pay_status_name}</p>
                },
                orderStatus: ({ row }) => {
                  return <div class="order_status">
                    <p>{row.order_status_name}</p>
                    <p>{row.cancel_reason}</p>
                  </div>
                },
                handle: () => {
                  return <div></div>
                }
              }
            }}/>
          </div>
        }
      </div>
    )
  }
}
