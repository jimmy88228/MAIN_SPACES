import '../common-order-details.less';
import Mixin from './mixin.js';

export default {
  props: ['rowData', 'tableData'],
  data() {
    return {
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
    cancelPop(orderIndex) {
      this.rowData.get_collage_group_user_order[orderIndex].isVisible = false;
    },
    confirmPop(order_id, remark, orderIndex) {
      if (!remark.trim()) {
        this.$Message.error('请输入备注');
        this.rowData.get_collage_group_user_order[orderIndex].isVisible = true;
        return false;
      } else {
        this.cancelPop(orderIndex);
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudGroupOrderRemark, {
        order_id,
        remark
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('reload');
        }
        this.spinShow = false;
      })
    }
  },
  render() {
    const Poptip = 'Poptip';
    const Input = 'Input';
    const Button = 'Button';
    const Spin = 'Spin';
    const Table = 'Table';
    return (
      <div>
        {
          <div class="order-details">
            {
              this.rowData.get_collage_group_user_order.map((item, index) => {
                return (
                  <div>
                    <Table columns={this.tableColums} data={this.tableData} show-header={this.isShowHeader}  {...{
                      scopedSlots: {
                        orderInfo: () => {
                          return <div class="info_wrap">
                            <div class="goods_wrapper">
                              <div class="img_list_wrap img_list_wrap_add">
                                <div style="display: flex;">
                                  <div class="img_fixed img_fixed_add">
                                    <img src={item.thumb_url ? item.thumb_url : require('@rs/images/default-img.jpg')} class="goods_thumb" />
                                  </div>
                                  <div class="goods_item_limit">
                                    <p class="goods_item clamp2">{item.get_goods.goods_name}</p>
                                    <p class="goods_item clamp2">{item.goods_attr}</p>
                                  </div>
                                </div>
                                <div style="text-align: right;">
                                  <p>x{item.goods_number}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        },
                        userInfo: () => {
                          return <div>
                            <p>下单会员: {item.consignee}{item.create_man ? '(团长)' : ''}</p>
                          </div>
                        },
                        orderTime: () => {
                          return <div>
                            <p>下单时间: {item.create_time}</p>
                          </div>
                        },
                        order: () => {
                          return <div>
                            <p>订单号: {item.order_sn}</p>
                            <p>订单金额: {item.order_amount}元</p>
                          </div>
                        },
                        orderStatus: () => {
                          return <div>
                            <p>{item.order_status_name}</p>
                            <p>{item.cancel_reason}</p>
                          </div>
                        },
                        payStatus: () => {
                          return <div>
                            <p>{item.status_str}</p>
                          </div>
                        },
                        handle: () => {
                          return <div>
                            <div class="handle_content">
                              {item.handle.view ? <span><router-link tag="a" to={{ name: 'group-order-info', params: { sn: item.id } }} target="_blank" class="edit_item">查看明细</router-link></span> : <span></span>}
                              {item.handle.remark ?
                                <Poptip placement="left" width="250" v-model={item.isVisible} transfer>
                                  <a class="edit_item">备注</a>
                                  <div slot="title">备注</div>
                                  <div slot="content">
                                    <Input type="textarea" placeholder="备注原因" v-model={item.nodeValue} />
                                    <div style="margin-top: 10px;text-align: right;">
                                      <Button size="small" type="text" onClick={this.cancelPop.bind(this, index)}>取消</Button>
                                      <Button size="small" type="primary" onClick={this.confirmPop.bind(this, item.related_order_id, item.nodeValue, index)}>确认</Button>
                                    </div>
                                  </div>
                                </Poptip>
                                : <span></span>}
                              {item.handle.order_view ? <span><router-link tag="a" to={{ name: 'order-info', params: { sn: item.related_order_id } }} target="_blank" class="edit_item">查看正式订单</router-link></span> : <span></span>}
                            </div>
                          </div>
                        }
                      }
                    }} disabled-hover>
                    </Table>
                    {
                      item.get_order_info && item.get_order_info.admin_remark && item.get_order_info.admin_remark.trim() ?
                        <div class="note">
                          <p>备注: {item.get_order_info.admin_remark}</p>
                        </div>
                        : <div></div>
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
