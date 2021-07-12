import '../common-order-details.less';
import Mixin from './mixin.js';

export default {
  props: ['rowData', 'tableData'],
  data() {
    return {
      isShowHeader: false,
      isVisible: false,
      nodeValue: ''
    }
  },
  mixins: [Mixin],
  methods: {
    cancelPop() {
      this.isVisible = false;
    },
    confirmPop(id, admin_remark) {
      if (!admin_remark.trim()) {
        this.$Message.error('请输入备注');
        this.isVisible = true;
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.ShopRecycleBinRemark, {
        id,
        admin_remark
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('reload');
        }
        this.spinShow = false;
        this.nodeValue = '';
        this.isVisible = false;
      })
    }
  },
  mounted () {
    this.tableColums.unshift({
      title: '占位符',
      key: 'isSlot',
      width: 5
    });
  },
  render() {
    const Divider = 'Divider';
    const Poptip = 'Poptip';
    const Input = 'Input';
    const Button = 'Button';
    const Table = 'Table';
    return (
      <div>
        <div class="return-order-details">
          <Table columns={this.tableColums} data={this.tableData} show-header={this.isShowHeader}  {...{
            scopedSlots: {
              orderInfo: ({ row }) => {
                return <div class="info_wrap">
                  {
                    row.return_info.map((item, index) => {
                      return (
                        <div class="goods_wrapper">
                          <div class="img_list_wrap img_list_wrap_add">
                            <div style="display: flex;">
                              <div class="img_fixed img_fixed_add">
                                <img src={item.goods_img ? item.goods_img : require('@rs/images/default-img.jpg')} class="goods_thumb" />
                              </div>
                              <div class="goods_item_limit">
                                <p class="goods_item clamp2">{item.goods_name}</p>
                                <p class="goods_item clamp2">{item.goods_attr}</p>
                                <p class="goods_item clamp2">款号：{item.goods_sn}</p>
                              </div>
                            </div>
                            <div>
                              <p class="goods_item clamp2">x{item.goods_number}</p>
                            </div>
                          </div>
                          <div class="refund">
                            <p class="detail">退/换货原因: <span>{this.rowData.return_reason_str}</span></p>
                          </div>
                          {row.return_info.length - 1 == index ? <span></span> : <Divider class="common_divider" />}
                        </div>
                      )
                    })
                  }
                </div>
              },
              returnTime: () => {
                return <div>
                  <p>{this.rowData.add_time.split(' ')[0]}</p>
                  <p>{this.rowData.add_time.split(' ')[1]}</p>
                </div>
              },
              user: () => {
                return <p>{this.rowData.user_name}</p>
              },
              returnType: () => {
                return <div>
                  <p>{this.rowData.return_type_str}</p>
                </div>
              },
              status: () => {
                return <div>
                  <p>{this.rowData.return_status_str}</p>
                  <p>{this.rowData.shipping_status_str}</p>
                  <p>{this.rowData.clear_status_str}</p>
                </div>
              },
              actionUser: () => {
                return <p>{this.rowData.action_user ? this.rowData.action_user : '--'}</p>
              },
              handle: ({ row }) => {
                return <div class="handle_content">
                  {this.rowData.handle.edit ? <router-link tag="a" to={{ name: 'recycle-info', params: { sn: this.rowData.id } }} target="_blank" class="edit_item">查看</router-link> : <span></span>}
                  {row.handle.remarks ?
                    <Poptip placement="left" width="250" v-model={this.isVisible} transfer>
                      <a class="edit_item">备注</a>
                      <div slot="title">备注</div>
                      <div slot="content">
                        <Input type="textarea" placeholder="备注原因" v-model={this.nodeValue} />
                        <div style="margin-top: 10px;text-align: right;">
                          <Button size="small" type="text" onClick={this.cancelPop.bind(this)}>取消</Button>
                          <Button size="small" type="primary" onClick={this.confirmPop.bind(this, row.id, this.nodeValue)}>确认</Button>
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
            this.rowData.admin_remark && this.rowData.admin_remark.trim() ?
              <div class="note">
                <p>客服备注（操作人{this.rowData.admin_remark_user}）：{this.rowData.admin_remark}</p>
              </div>
              : <div></div>
          }
        </div>
      </div>
    )
  }
}
