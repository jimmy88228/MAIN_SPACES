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
    handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 2];
      } else if (columnIndex === 2) {
        return [0, 0];
      } else {
        return [1, 1];
      }
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
		console.log("触发渲染");
    return (
      // 1.普通订单(未拆单的) + 2.拆单的(order_status == 10)
      <div>
        {
          this.rowData.order_status != '10' ?
            <div class="order-details">
              <Table columns={this.tableColums} data={this.tableData} span-method={this.handleSpan} show-header={this.isShowHeader}  {...{
                scopedSlots: {
                  orderInfo: ({ row }) => {
                    return <div class="info_wrap">
                      {
                        row.order_message.map((item, index) => {
                          return (
                            <div class="goods_wrapper">
                              <div class="img_list_wrap img_list_wrap_add" style="align-items:center;">
                                <div class="flex">
                                  {/*<div class="img_fixed img_fixed_add">
                                    <img src={item.goods_thumb ? item.goods_thumb : require('@rs/images/default-img.jpg')} class="goods_thumb" />
                                  </div>*/}
                                  <div class="goods_item_limit">
                                    <p class="goods_item clamp2">商品名称:&nbsp;{item.goods_name}</p>
                                    <p class="goods_item clamp2">商品类型:&nbsp;{item.goods_type}</p>
                                    <p class="goods_item clamp2">商品编号:&nbsp;{item.goods_sn}</p>
                                    {/*<p class="goods_item clamp2 goods_item_strong">{item.refund_reason}</p>
                                     <p class="goods_item clamp2">{row.pay_status_name}</p> */}
                                  </div>
                                </div>
                                <div style="text-align: right;">
																	<p>x{item.goods_number}</p>
                                  {/*<p class="goods_item clamp2">￥{item.goods_price}</p>
                                  <p class="goods_item clamp2 goods_item_strong">{item.saleKind}</p>*/}
                                </div>
                              </div>
                              {row.order_message.length - 1 == index ? <span></span> : <Divider class="common_divider" />}
                            </div>
                          )
                        })
                      }
                    </div>
                  },
                  money: ({ row }) => {
                    return <div>
                      <p>{row.pay_name}({row.pay_type})</p>
                      <p>￥{row.money_paid}</p>
                    </div>
                  },
                  card: ({ row }) => {
                    return <div>
                      <p>{row.real_name}</p>
                      <p>({row.user_name})</p>
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
                  userInfo: ({ row }) => {
                    return <div>
                      <p>姓名:&nbsp;{row.consignee}</p>
                      <p>手机:&nbsp;{row.mobile}</p>
                      <p>地址:&nbsp;{row.address}</p>
                    </div>
                  },
                  handle: ({ row }) => {
                    return <div class="handle_content">
                      {row.handle.edit ? <p><router-link tag="a" to={{name: 'matrix-order-info', params: {sn: row.order_id}}} target="_blank" class="edit_item">查看</router-link></p> : <span></span>}
                      {row.handle.message ?
                        <Poptip placement="left" width="250" v-model={this.isVisible} transfer>
                          <a class="edit_item">备注</a>
                          <div slot="title">备注</div>
                          <div slot="content">
                            <Input type="textarea" placeholder="备注原因" v-model={this.nodeValue} />
                            <div style="margin-top: 10px;text-align: right;">
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
                (this.rowData.admin_remark && this.rowData.admin_remark.trim()) ?
                  <div class="note">
                    <p>客服备注（操作人{this.rowData.adminUser}）：{this.rowData.admin_remark}</p>
                  </div>
                  : <div></div>
              }
            </div>
            :
            <div class="order-details">
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
                      <Table columns={this.tableColums} data={this.tableData} span-method={this.handleSpan} show-header={this.isShowHeader} {...{
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
                                            <p class="goods_item clamp2 goods_item_strong">{item.refund_reason}</p>
                                            {/* <p class="goods_item clamp2">{row.pay_status_name}</p> */}
                                          </div>
                                        </div>
                                        <div style="text-align: right;">
                                          <p class="goods_item clamp2">￥{goodsItem.goods_price}</p>
                                          <p class="goods_item clamp2">x{goodsItem.goods_number}</p>
                                          <p class="goods_item clamp2 goods_item_strong">{goodsItem.saleKind}</p>
                                        </div>
                                      </div>
                                      {item.get_order_goods.length - 1 == index ? <span></span> : <Divider class="common_divider" />}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          },
                          money: ({ row }) => {
                            return <div>
                              <p>{row.pay_name}({row.pay_type})</p>
                              <p>￥{row.money_paid}</p>
                            </div>
                          },
                          card: ({ row }) => {
                            return <div>
                              <p>{row.real_name}</p>
                              <p>({row.user_name})</p>
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
                          userInfo: ({ row }) => {
                            return <div>
                              <p>姓名:{row.consignee}</p>
                              <p>手机:{row.mobile}</p>
                              <p>地址:{row.address}</p>
                            </div>
                          },
                          handle: () => {
                            return <div class="handle_content">
                              {item.handle.edit ? <p><router-link tag="a" to={{ name: 'order-info', params: { sn: item.order_id } }} target="_blank" class="edit_item">查看</router-link></p> : <span></span>}
                              {item.handle.message ?
                                <Poptip placement="left" width="250" v-model={item.isVisible} transfer>
                                  <a class="edit_item">备注</a>
                                  <div slot="title">备注</div>
                                  <div slot="content">
                                    <Input type="textarea" placeholder="备注原因" v-model={item.nodeValue} />
                                    <div style="margin-top: 10px;text-align: right;">
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
                        (item.admin_remark && item.admin_remark.trim()) ?
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
