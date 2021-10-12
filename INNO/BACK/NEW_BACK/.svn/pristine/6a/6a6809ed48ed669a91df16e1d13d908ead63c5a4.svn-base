<template>
  <div class="order_details">
    <Form ref="form" :label-width="72" label-colon>
      <Row>
        <Col span="6" class="order_details_item">
          <span class="title">收货人信息</span>
          <Poptip placement="right" width="400" v-model="editUser" title="收货人信息">
            <a>修改</a>
            <div slot="content">
              <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" label-colon>
                <FormItem label="收 货 人" prop="consignee" class="form_name">
                  <Input type="text" v-model="formItem.consignee" class="basic_input"/>
                </FormItem>
                <FormItem label="联系电话" prop="mobile">
                  <Input type="text" v-model="formItem.mobile" class="basic_input"/>
                </FormItem>
                <FormItem label="所在的区" prop="district">
                  <Select v-model="formItem.district.province" transfer class="baisc_select" @on-change="handleProvince">
                    <Option v-for="item in provinceList" :key="item.value" :value="item.value">{{item.label}}</Option>
                  </Select>
                  <Select v-model="formItem.district.city" transfer class="baisc_select">
                    <Option v-for="item in cityList" :key="item.value" :value="item.value">{{item.label}}</Option>
                  </Select>
                  <Select v-model="formItem.district.street" transfer class="baisc_select">
                    <Option v-for="item in districtList" :key="item.value" :value="item.value">{{item.label}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                  <Input type="textarea" v-model="formItem.address" :rows="3"/>
                </FormItem>
              </Form>
              <div style="margin-top: 10px;text-align: right;">
                <Button size="small" type="text" @click="cancelEdit">取消</Button>
                <Button size="small" type="primary" @click="confirmEdit">确认</Button>
              </div>
            </div>
          </Poptip>
          <FormItem label="收货人"><p>{{addressInfo.consignee}}</p></FormItem>
          <FormItem label="手机"><p>{{addressInfo.mobile}}</p></FormItem>
          <FormItem label="收货地址"><p>{{addressInfo.district}}</p></FormItem>
          <FormItem label="详细地址"><p>{{addressInfo.address}}</p></FormItem>
        </Col>
        <Col span="6" class="order_details_item">
          <span class="title">配送信息</span>
          <FormItem label="配送方式">
            <p>{{addressInfo.delivery_way}}</p>
          </FormItem>
          <FormItem  v-if="addressInfo.pickup_code" label="提货码">
            <p>{{addressInfo.pickup_code}}</p>
          </FormItem>
          <FormItem label="物流单号">
            <template v-if="addressInfo.logistics_sn && addressInfo.logistics_sn.length > 0">
              <span v-for="item in addressInfo.logistics_sn" :key="item">
                <a @click="viewLogistics(item)">{{item}}</a>
              </span>
            </template>
            <template v-if="addressInfo.logistics_sn && addressInfo.logistics_sn.length === 0">
              <span>--</span>
            </template>
          </FormItem>
          <!--<FormItem label="配送时间"><p>{{addressInfo.delivery_time}}</p></FormItem>-->
          <FormItem label="发货单号">
            <p>
              <router-link
                tag="a"
                :to="{name: 'delivery-order-info', params: { sn: addressInfo.delivery_id }}"
                target="_blank"
                v-if="addressInfo.deliver_sn">
                {{addressInfo.deliver_sn}}
              </router-link>
              <span v-else>未发货</span>
            </p>
          </FormItem>
          <FormItem label="发货时间"><p>{{addressInfo.deliver_sn_time || '未发货'}}</p></FormItem>
          <FormItem label="退货单号">
            <p style="font-size:12px;" v-for="(item, index) in ordreMessage.return_data" :key="index">
              <a @click="handleGoReturnInfo(item.return_id)" v-if="item.return_sn">{{item.return_sn}}</a>
            </p>
            <span v-if="ordreMessage.return_data==''">--</span>
          </FormItem>
        </Col>
        <Col span="6" class="order_details_item">
          <span class="title">付款信息</span>
          <FormItem label="实付金额"><p>{{orderMoney.goods_total}}</p></FormItem>
          <FormItem label="支付方式">
            <p>{{ordreMessage.pay_name}}
              <Poptip placement="right" width="320" v-model="isShowPayNote">
                <a>支付备注: {{payNoteText ? payNoteText : '--'}}</a>
                <div slot="title">备注信息</div>
                <div slot="content">
                  <div>
                    <label>备注：</label>
                    <Input style="width: 200px;" type="textarea" placeholder="备注原因" v-model="payNoteInput"/>
                  </div>
                  <div style="margin-top: 10px;text-align: right;padding-right: 30px;">
                    <Button size="small" type="text" @click="cancelNote">取消</Button>
                    <Button size="small" type="primary" @click="confirmNote">确认</Button>
                  </div>
                </div>
              </Poptip>
            </p>
          </FormItem>
          <FormItem label="支付单号"><p>{{ordreMessage.alipay_sn ? ordreMessage.alipay_sn : '--'}}</p></FormItem>
          <FormItem label="支付时间"><p>{{ordreMessage.pay_time}}</p></FormItem>
          <FormItem label="所属店铺">
            <p>
              <Tooltip placement="left" transfer>
                <a>{{ordreMessage.store_name}}</a>
                <div slot="content" class="order_store_details">
                  <Form ref="form" :label-width="100" label-colon>
                    <FormItem label="所属店铺"><p>{{goodsBelonging.store_name}}</p></FormItem>
                    <FormItem label="所属店员"><p>{{goodsBelonging.staff_name}}</p></FormItem>
                    <FormItem label="订单来源"><p>{{goodsBelonging.platform_src_str}}</p></FormItem>
                    <FormItem label="所属分销员">
                      <div v-if="goodsBelonging.orderDistributorOne || goodsBelonging.orderDistributorTwo">
                        <p>{{goodsBelonging.orderDistributorOne}}</p>
                        <p>{{goodsBelonging.orderDistributorTwo}}</p>
                      </div>
                      <span v-else>无</span>
                    </FormItem>
                  </Form>
                </div>
              </Tooltip>
            </p>
          </FormItem>
          <FormItem label="分配店铺" v-if="ordreMessage.assign_store_name"><p>{{ordreMessage.assign_store_name}}</p></FormItem>
          <FormItem label="退款单号">
            <p style="font-size:12px;" v-for="(item, index) in ordreMessage.refund_data" :key="index">
              <a @click="handleGoRefundInfo(item.id)" v-if="item.refund_sn">{{item.refund_sn+'【'+item.refund_status_str+'】'}}</a>
							<span v-else>--</span>
            </p>
          </FormItem>
        </Col>
        <Col span="6" class="order_details_item">
          <span class="title">买家信息</span>
          <FormItem label="会员卡号">
            <p>
              <Tooltip placement="left" transfer>
                <a>{{ordreMessage.user_name ? ordreMessage.user_name : '匿名用户'}}</a>
                <div slot="content" class="order_user_details">
                  <Form ref="form" :label-width="100" label-colon>
                    <p class="title">购货人信息 <a @click="view(buyUser.user_id)">查看</a></p>
                    <FormItem label="电子邮件" v-if="buyUser.email"><p>{{buyUser.email}}</p></FormItem>
                    <FormItem label="账户余额"><p>￥{{buyUser.account_balance}}</p></FormItem>
                    <FormItem label="消费积分"><p>{{buyUser.pay_points}}</p></FormItem>
                    <!-- <FormItem label="等级积分"><p>{{buyUser.rank_points}}</p></FormItem> -->
                    <FormItem label="会员等级"><p>{{buyUser.rank_name}}</p></FormItem>
                    <FormItem label="优惠券数量"><p>{{buyUser.bonusNum}}</p></FormItem>
                    <div v-for="item in consigneeMessage" :key="item.id">
                      <p class="title">收货人 {{item.consignee}}</p>
                      <FormItem label="电子邮件" v-if="item.email"><p>{{item.email}}</p></FormItem>
                      <FormItem label="地址"><p>{{item.address}}</p></FormItem>
                      <FormItem label="邮编" v-if="item.zipcode"><p>{{item.zipcode}}</p></FormItem>
                      <FormItem label="电话"><p>{{item.mobile}}</p></FormItem>
                      <!-- <FormItem label="备用电话"><p>{{item.tel || item.mobile}}</p></FormItem> -->
                    </div>
                  </Form>
                </div>
              </Tooltip>
            </p>
          </FormItem>
          <FormItem label="姓名" v-if="orderAddress.idetntiy_name"><p>{{orderAddress.idetntiy_name}}</p></FormItem>
          <FormItem label="身份证" v-if="!!orderAddress.hasCross"><p>{{orderAddress.identity_no}}</p></FormItem>
        </Col>
      </Row>
    </Form>
    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
    <order-logistics ref="orderLogistics"/>
  </div>
</template>

<script>
import orderLogistics from './order-logistics';

export default {
  props: {
    orderAddress: {
      type: Object,
      required: true
    },
    ordreMessage: {
      type: Object,
      required: true
    },
    orderMoney: {
      type: Object,
      required: true
    },
    provinceList: {
      type: Array,
      required: true
    },
    sn: {
      required: true
    },
    payNote: {
      required: true
    },
    buyUser: {
      type: Object,
      required: true
    },
    consigneeMessage: {
      type: Array,
      required: true
    },
    goodsBelonging: {
      type: Object,
      required: true
    }
  },
  components: {
    orderLogistics
  },
  data() {
    const checkMobile = (rule, value, callback) => {
      let regex = /\d{11}|\d{7,8}/;
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    const checkDistrict = (rule, district, callback) => {
      let {
        province,
        city,
        street
      } = district;
      if (!parseInt(province) || !parseInt(city) || !parseInt(street)) {
        callback(new Error('请选择正确的地址'));
      } else {
        callback();
      }
    }
    return {
      editUser: false,
      formItem: {
        consignee: '',
        mobile: '',
        district: {
          province: "",
          city: "",
          street: ""
        },
        address: ''
      },
      ruleValidate: {
        consignee: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        district: [{ required: true, validator: checkDistrict, trigger: 'change' }],
        address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }]
      },
      spinShow: false,
      addressInfo: {},
      payNoteInput: '',
      isShowPayNote: false,
      payNoteText: ''
    }
  },
  computed: {
    cityList() {
      let cityList = [];
      if (this.provinceList.length > 0) {
        for (let item of this.provinceList) {
          if (item.value === this.formItem.district.province) {
            cityList = item.children;
          }
        }
      }
      return cityList;
    },
    districtList() {
      let districtList = [];
      if (this.cityList.length > 0) {
        for (let item of this.cityList) {
          if (item.value === this.formItem.district.city) {
            districtList = item.children;
          }
        }
      }
      return districtList;
    }
  },
  methods: {
    cancelEdit() {
      this.editUser = false;
    },
    confirmEdit() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.spinShow = true;
          return this.$ajax.post(this.$api.orderAddressChange, {
            order_id: this.sn,
            remark: '',
            remark_type: 'order_address', // order_address(修改订单地址)
            consignee: this.formItem.consignee,
            mobile: this.formItem.mobile,
            province: this.formItem.district.province,
            city: this.formItem.district.city,
            district: this.formItem.district.street, // 字段没对应
            address: this.formItem.address
          }).then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.addressInfo.consignee = res.data.consignee;
              this.addressInfo.mobile = res.data.mobile;
              this.addressInfo.district = res.data.district;
              this.addressInfo.address = res.data.address;
            } else {
              this.$Message.error(res.message);
            }
            this.spinShow = false;
            this.editUser = false;
          })
        } else {
          this.editUser = true;
        }
      })
    },
    handleProvince() {
      this.formItem.district.city = '';
      this.formItem.district.street = '';
    },
    cancelNote() {
      this.isShowPayNote = false;
    },
    viewLogistics (item) {
      this.$refs.orderLogistics.setData({
        invoice_no: item,
        order_id: this.sn
      }).show();
    },
    confirmNote() {
      if (!this.payNoteInput.trim()) {
        this.isShowPayNote = true;
        this.$Message.error('请输入备注');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.orderAdminRemark, {
        order_id: this.sn,
        remark: this.payNoteInput,
        remark_type: 'pay_note' // admin_remark订单备注 pay_note支付备注（用于订单详情）
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.payNoteText = res.data.remark;
        } else {
          this.$Message.error(res.message);
        }
        this.spinShow = false;
        this.isShowPayNote = false;
      })
    },
    view (userId) {
      this.$router.push({
        name: 'user-view',
        params: {
          id: userId
        }
      })
    },
    viewDelivery(deliveryId) {
      this.$router.push({
        name: 'delivery-order-info',
        params: {
          sn: deliveryId
        }
      })
    },
    handleGoReturnInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'return-order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    handleGoRefundInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'refund-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  watch: {
    orderAddress: {
      handler(newVal) {
        if (Object.keys(newVal).length === 0) return false;
        this.addressInfo = newVal;
        this.formItem = {
          consignee: newVal.consignee,
          mobile: newVal.mobile,
          district: {
            province: newVal.district_code.province,
            city: newVal.district_code.city,
            street: newVal.district_code.street
          },
          address: newVal.address
        };
      },
      immediate: true
    },
    payNote(newVal) {
      if (newVal) {
        this.payNoteInput = newVal;
        this.payNoteText = newVal;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order_details{
  margin: 10px 0;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  .order_details_item{
    .title{
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }
  .basic_input{
    width: 260px;
  }
}
</style>
<style lang="less">
.ivu-tooltip-inner{
  max-width: 100%;
}
.order_details{
  .ivu-form-item{
    margin-bottom: 4px;
  }
  .form_name{
    .ivu-form-item-label{
      padding: 10px 18px 10px 0;
    }
  }
  .baisc_select{
    width: 80px;
  }
}
.order_user_details, .order_store_details{
  padding-right: 20px;
  .ivu-form-item{
    margin-bottom: 0;
  }
  .ivu-form-item-content{
    p{
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
  .ivu-form-item-label{
    color: #fff;
  }
  .title{
    text-align: center;
    font-weight: 600;
    margin: 20px 0 5px 0;
  }
}
</style>
