import '../common-order-details.less';
import Mixin from './mixin.js';

export default {
  props: ['rowData', 'tableData'],
  data() {
    return {
      isVisible: false,
      nodeValue: '',
      spinShow: false,
      isShowHeader: false
    }
  },
  mixins: [Mixin],
  mounted () {
    this.tableColums.unshift({
      title: '占位符',
      key: 'isSlot',
      width: 5
    });
  },
  methods: {
    view(orderId) {
      this.$router.push({
        name: 'order-info',
        params: {
          sn: orderId
        }
      })
    },
    cancelPop(mode, orderIndex) {
      if (mode == 'single') {
        // 未拆单
        this.isVisible = false;
      } else if (mode == 'apartOrder') {
        // 拆分订单
        this.rowData.order_message[orderIndex].isVisible = false;
      }
    },
    confirmPop(order_id, remark, mode, orderIndex) {
      if (!remark.trim()) {
        this.$Message.error('请输入备注');
        if (mode == 'single') {
          // 未拆单
          this.isVisible = true;
        } else if (mode == 'apartOrder') {
          // 拆分订单
          this.rowData.order_message[orderIndex].isVisible = true;
        }
        return false;
      } else {
        this.cancelPop(mode, orderIndex);
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.orderAdminRemark, {
        order_id,
        remark,
        remark_type: 'admin_remark' // admin_remark订单备注 pay_note支付备注（用于订单详情）
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('reload');
        }
        // 未拆分与拆分结构不一致，更新数据
        if (mode == 'single') {
          this.rowData.admin_remark = res.data.remark;
        } else if (mode == 'apartOrder') {
          this.rowData.order_message[orderIndex].admin_remark = res.data.remark;
        }
        this.spinShow = false;
      })
    }
  },
  render() {
    const Divider = 'Divider';
    const Tooltip = 'Tooltip';
    const Poptip = 'Poptip';
    const Input = 'Input';
    const Button = 'Button';
    const Spin = 'Spin';
    const Table = 'Table';
    return (
      // 1.普通订单(未拆单的) + 2.拆单的(order_status == 10)
      <div>
        {
          this.rowData.order_status != '10' ?
            <div class="big-order-details">
              <Table columns={this.tableColums} data={this.tableData} show-header={this.isShowHeader}  {...{
                scopedSlots: {
                  orderInfo: ({ row }) => {
                    return <div class="info_wrap">
                      {
                        row.order_message.map((item, index) => {
                          return (
                            <div class="goods_wrapper">
                              <div class="img_list_wrap img_list_wrap_add">
                                <div style="display: flex;">
                                  <div class="img_fixed img_fixed_add">
                                    <img src={item.goods_thumb} class="goods_thumb" />
                                  </div>
                                  <div class="goods_item_limit">
                                    <p class="goods_item clamp2">{item.goods_name}</p>
                                    <p class="goods_item clamp2">款号:{item.goods_sn}</p>
                                    <p class="goods_item clamp2">{item.goods_attr}</p>
                                    <p class="goods_item clamp2">{item.refund_reason}</p>
                                  </div>
                                </div>
                                <div>
                                  <p class="goods_item clamp2">x{item.goods_number}</p>
                                  <p class="goods_item clamp2">{item.saleKind}</p>
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
                    return <div>
                      <p>{row.user_name}</p>
                      <Tooltip placement="right" transfer>
                        <a>收货人:{row.consignee}</a>
                        <div class="user_info" slot="content">
                          <p>{row.consignee}</p>
                          <p>地址:{row.address}</p>
                          <p>联系电话:{row.mobile}</p>
                        </div>
                      </Tooltip>
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
                  handle: ({ row }) => {
                    return <div class="handle_content">
                      {row.handle.edit ? <a class="edit_item" onClick={this.view.bind(this, row.order_id)}>查看</a> : <span></span>}
                      {row.handle.message ?
                        <Poptip placement="left" width="250" v-model={this.isVisible} transfer>
                          <a class="edit_item">备注</a>
                          <div slot="title">备注</div>
                          <div slot="content">
                            <Input style="width: 200px;" type="textarea" placeholder="备注原因" v-model={this.nodeValue} />
                            <div style="margin-top: 10px;text-align: right;padding-right: 30px;">
                              <Button size="small" type="text" onClick={this.cancelPop.bind(this, 'single')}>取消</Button>
                              <Button size="small" type="primary" onClick={this.confirmPop.bind(this, row.order_id, this.nodeValue, 'single')}>确认</Button>
                            </div>
                          </div>
                        </Poptip>
                        : <span></span>}
                    </div>
                  }
                }
              }} disabled-hover>
              </Table>
              {
                this.rowData.admin_remark.trim() ?
                  <div class="note">
                    <p>客服备注（操作人{this.rowData.adminUser}）：{this.rowData.admin_remark}</p>
                  </div>
                  : <div></div>
              }
            </div>
            :
            <div class="big-order-details">
              {
                this.rowData.order_message.map((item, orderIndex) => {
                  return (
                    <div class="child-order">
                      <div class="order-header">
                        <span class="header-item">子订单号: {item.order_sn}</span>
                        {/* <span class="header-item">所属店铺: {item.store_name}</span>
                        <span class="header-item">所属店员：{item.staff_name}</span>
                        <span class="header-item">所属分销员：{item.orderDistributor}</span> */}
                      </div>
                      <Table columns={this.tableColums} data={this.tableData} show-header={this.isShowHeader} {...{
                        scopedSlots: {
                          orderInfo: ({ row }) => {
                            return <div class="info_wrap">
                              {
                                item.get_order_goods.map((goodsItem, index) => {
                                  return (
                                    <div class="goods_wrapper">
                                      <div class="img_list_wrap img_list_wrap_add">
                                        <div style="display: flex;">
                                          <div class="img_fixed img_fixed_add">
                                            <img src={goodsItem.goods_thumb} class="goods_thumb" />
                                          </div>
                                          <div class="goods_item_limit">
                                            <p class="goods_item clamp2">{goodsItem.goods_name}</p>
                                            <p class="goods_item clamp2">{goodsItem.goods_attr}</p>
                                            <p class="goods_item clamp2">款号:{goodsItem.goods_sn}</p>
                                            <p class="goods_item clamp2">{goodsItem.saleKind}</p>
                                            <p class="goods_item clamp2">{item.refund_reason}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <p class="goods_item clamp2">x{goodsItem.goods_number}</p>
                                          <p class="goods_item clamp2">{goodsItem.saleKind}</p>
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
                              <Tooltip placement="right" transfer>
                                <a>收货人:{row.consignee}</a>
                                <div class="user_info" slot="content">
                                  <p>{row.consignee}</p>
                                  <p>地址:{row.address}</p>
                                  <p>联系电话:{row.mobile}</p>
                                </div>
                              </Tooltip>
                            </div>
                          },
                          money: () => {
                            return <div>
                              <p>总额:￥{item.goods_amount}</p>
                              <p>实付:￥{item.money_paid}</p>
                              <p>{item.pay_name}</p>
                              <p>{item.pay_type}</p>
                            </div>
                          },
                          createTime: () => {
                            return <div>
                              <p>{item.create_time_format.split(' ')[0]}</p>
                              <p>{item.create_time_format.split(' ')[1]}</p>
                            </div>
                          },
                          payStatus: () => {
                            return <p>{item.pay_status_name}</p>
                          },
                          orderStatus: () => {
                            return <div class="order_status">
                              <p>{item.order_status_name}</p>
                              <p>{item.cancel_reason}</p>
                            </div>
                          },
                          handle: () => {
                            return <div class="handle_content">
                              {item.handle.edit ? <a class="edit_item" onClick={this.view.bind(this, item.order_id)}>查看</a> : <span></span>}
                              {item.handle.message ?
                                <Poptip placement="left" width="250" v-model={item.isVisible} transfer>
                                  <a class="edit_item">备注</a>
                                  <div slot="title">备注</div>
                                  <div slot="content">
                                    <Input style="width: 200px;" type="textarea" placeholder="备注原因" v-model={item.nodeValue} />
                                    <div style="margin-top: 10px;text-align: right;padding-right: 30px;">
                                      <Button size="small" type="text" onClick={this.cancelPop.bind(this, 'apartOrder', orderIndex)}>取消</Button>
                                      <Button size="small" type="primary" onClick={this.confirmPop.bind(this, item.order_id, item.nodeValue, 'apartOrder', orderIndex)}>确认</Button>
                                    </div>
                                  </div>
                                </Poptip>
                                : <span></span>}
                            </div>
                          }
                        }
                      }} disabled-hover>
                      </Table>
                      {
                        item.admin_remark.trim() ?
                          <div class="note">
                            <p>客服备注（操作人{item.adminUser}）：{item.admin_remark}</p>
                          </div> : <div></div>
                      }
                    </div>
                  )
                })
              }
            </div>
        }
        <Spin size="large" fix v-show={this.spinShow}></Spin>
      </div>
    )
  }
}
