import '../common-order-details.less';
import Mixin from './mixin.js';

export default {
  props: ['rowData', 'tableData'],
  data() {
    return {
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
  render() {
    const Divider = 'Divider';
    const Tooltip = 'Tooltip';
    const Table = 'Table';
    return (
      <div>
        <div class="delivery-order-details">
          <Table columns={this.tableColums} data={this.tableData} show-header={this.isShowHeader}  {...{
            scopedSlots: {
              orderInfo: ({ row }) => {
                return <div class="info_wrap">
                  {
                    row.order_info.map((item, index) => {
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
                              </div>
                            </div>
                            <div>
                              <p class="goods_item clamp2">x{item.goods_number}</p>
                            </div>
                          </div>
                          {row.order_info.length - 1 == index ? <span></span> : <Divider class="common_divider" />}
                        </div>
                      )
                    })
                  }
                </div>
              },
              createTime: () => {
                return <div>
                  <p>{this.rowData.add_time.split(' ')[0]}</p>
                  <p>{this.rowData.add_time.split(' ')[1]}</p>
                </div>
              },
              user: () => {
                return <div>
                  <Tooltip placement="right" transfer>
                    <a>{this.rowData.consignee}</a>
                    <div class="user_info" slot="content">
                      <p>{this.rowData.consignee}</p>
                      <p>{this.rowData.region} {this.rowData.address}</p>
                      <p>{this.rowData.mobile}</p>
                    </div>
                  </Tooltip>
                </div>
              },
              updateTime: () => {
                return <div>
                  <p>{this.rowData.update_time.split(' ')[0]}</p>
                  <p>{this.rowData.update_time.split(' ')[1]}</p>
                </div>
              },
              status: () => {
                return <p>{this.rowData.status}</p>
              },
              actionUser: () => {
                return <p>{this.rowData.action_user ? this.rowData.action_user : '--'}</p>
              },
              handle: () => {
                return <div class="handle_content">
                  {this.rowData.handle.edit ? <router-link tag="a" to={{ name: 'shop-delivery-order-info', params: { sn: this.rowData.delivery_id } }} target="_blank" class="edit_item">查看</router-link> : <span></span>}
                  {/* {this.rowData.assign_brand_delivery ? <p>{this.rowData.assign_brand_delivery}</p> : <span></span>} */}
                </div>
              }
            }
          }} disabled-hover>
          </Table>
        </div>
      </div>
    )
  }
}
