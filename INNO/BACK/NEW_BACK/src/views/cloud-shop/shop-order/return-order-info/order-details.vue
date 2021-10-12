<template>
  <div class="order_details">
    <Form ref="form" :label-width="100" label-colon>
      <Row>
        <Col span="8" class="order_details_item">
          <span class="title">退货单信息</span>
          <FormItem label="退单编号"><p>{{orderMessage.return_sn}}</p></FormItem>
          <FormItem label="关联订单号"><p><a @click="handleGoOrderInfo(orderMessage.related_order_id)">{{orderMessage.related_order_sn ? orderMessage.related_order_sn : '--'}}</a></p></FormItem>
          <FormItem label="制单时间"><p>{{orderMessage.add_time}}</p></FormItem>
          <FormItem label="确认收货时间"><p>{{orderMessage.rec_time || '--'}}</p></FormItem>
        </Col>
        <Col span="8" class="order_details_item">
          <span class="title title_slot">退货单信息</span>
          <FormItem label="退单类型"><p>{{orderMessage.refund_type_str}}</p></FormItem>
          <FormItem label="退单状态"><p>{{orderMessage.return_status_str}},{{orderMessage.shipping_status_str}},{{orderMessage.clear_status_str}}</p></FormItem>
          <FormItem label="原支付方式"><p>{{orderMessage.pay_name}}</p></FormItem>
          <FormItem label="原支付单号"><p>{{orderMessage.alipay_sn || '--'}}</p></FormItem>
        </Col>
        <Col span="8" class="order_details_item">
          <span class="title title_slot">退货单信息</span>
          <FormItem label="退货原因"><p>{{orderMessage.return_reason}}</p></FormItem>
          <FormItem label="退货物流单号">
          <span>{{orderMessage.ex_return_no ? orderMessage.ex_return_no : '--'}}</span>
            <a v-show="!editLogistics" @click="editLogistics = true">编辑</a>
            <div class="edit_logi" v-show="editLogistics">
              <Input type="textarea" placeholder="请输入物流单号,多个物流单号用“#”隔开" v-model="invoiceNo" class="input"/>
              <div class="btn_group">
                <a @click="cancelEdit" class="handle">取消</a>
                <a @click="confirmEdit" class="handle">保存</a>
              </div>
            </div>
            <p>（多个物流单号用“#”隔开）</p>
          </FormItem>
          <FormItem label="发货店铺"><p>{{orderMessage.store_name}}</p></FormItem>
        </Col>
      </Row>
    </Form>
    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>

export default {
  props: {
    orderMessage: {
      type: Object,
      required: true
    },
    sn: {
      required: true
    }
  },
  data() {
    return {
      spinShow: false,
      shippingList: [],
      shippingId: 0,
      shippingName: '',
      editLogistics: false,
      invoiceNo: '',
      showSelectShipping: false
    }
  },
  methods: {
    cancelEdit() {
      this.editLogistics = false;
    },
    // 物流单号编辑
    confirmEdit() {
      if (!this.invoiceNo) {
        this.$Message.error('请填写物流单号');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.ShopInvoiceNoUpdate, {
        return_id: this.sn,
        invoice_no: this.invoiceNo,
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.orderMessage.ex_return_no = this.invoiceNo;
          this.$Message.success(res.message);
        } else {
          this.$Message.error(res.message);
        }
        this.spinShow = false;
        this.editLogistics = false;
      })
    },
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'shop-order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  mounted () {
  },
  watch: {
    orderMessage: {
      handler(nV) {
        this.invoiceNo = nV && nV.invoice_no;
      },
      immediate: true
    },
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
      margin-bottom: 10px;
      &.title_slot{
        visibility: hidden;
      }
    }
  }
  .basic_input, .basic_textarea{
    width: 260px;
  }
  .logistics_edit{
    white-space: normal;
    word-break: break-all;
  }
  .edit_logi{
    display: flex;
    margin-top: 10px;
    .btn_group{
      display: flex;
      align-items: center;
      .handle{
        display: inline-block;
        width: 40px;
        text-align: center;
      }
    }
  }
}
.user_details, .store_details{
  white-space: normal;
  word-break: break-all;
  .title{
    text-align: center;
    font-weight: 600;
  }
}
</style>
<style lang="less">
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
</style>
