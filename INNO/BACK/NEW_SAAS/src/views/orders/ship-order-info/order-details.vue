<template>
  <div class="order_details">
    <Form ref="form" :label-width="80" label-colon>
      <Row>
        <Col span="12" class="order_details_item">
          <span class="title">基本信息</span>
          <FormItem label="订单号"><p>{{ordreMessage.order_sn}}</p></FormItem>
          <FormItem label="购货人"><p>{{ordreMessage.user_name}}</p></FormItem>
          <FormItem label="配送方式"><p>{{ordreMessage.delivery_way}}</p></FormItem>
          <FormItem label="下单时间"><p>{{ordreMessage.create_time}}</p></FormItem>
          <FormItem label="配送费用"><p>{{ordreMessage.shipping_fee}}</p></FormItem>
        </Col>
        <Col span="12" class="order_details_item">
          <span class="title">收货人信息</span>
          <FormItem label="收货人"><p>{{orderAddress.consignee ? orderAddress.consignee : '匿名用户'}}</p></FormItem>
          <FormItem label="电话"><p>{{orderAddress.mobile}}</p></FormItem>
          <FormItem label="地址"><p>{{orderAddress.address}}</p></FormItem>
          <FormItem label="手机"><p>{{orderAddress.mobile}}</p></FormItem>
          <FormItem label="客户留言"><p>{{orderAddress.admin_remark || '--'}}</p></FormItem>
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
    orderAddress: {
      type: Object,
      required: true
    },
    ordreMessage: {
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
    // 快递公司
    loadshippingList () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.shippingSimpleList, {
        delivery_id: this.sn
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.shippingList = res.data;
        }
        this.spinShow = false;
      })
    },
    cancelEdit() {
      this.editLogistics = false;
    },
    // 物流单号编辑
    confirmEdit() {
      if (!this.invoiceNo) {
        this.$Message.error('请填写物流单号');
        return false;
      } else if (!this.shippingId) {
        this.$Message.error('请填写快递公司');
        return false;
      }
      this.shippingList.forEach(item => {
        if (item.shipping_id === this.shippingId) {
          this.shippingName = item.shipping_name;
        }
      });
      this.spinShow = true;
      return this.$ajax.post(this.$api.changeDelivery, {
        delivery_id: this.sn,
        invoice_no: this.invoiceNo,
        shipping_id: this.shippingId,
        shipping_name: this.shippingName
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.orderAddress.invoice_no = this.invoiceNo;
          this.orderAddress.shipping_name = this.shippingName;
          this.$Message.success(res.message);
        } else {
          this.$Message.error(res.message);
        }
        this.spinShow = false;
        this.editLogistics = false;
      })
    },
  },
  mounted () {
    this.loadshippingList();
  },
  watch: {
    orderAddress: {
      handler(nV) {
        this.invoiceNo = nV && nV.invoice_no;
      },
      immediate: true
    },
    ordreMessage: {
      handler(nV) {
        this.shippingId = nV && Number(nV.shipping_id);
      },
      immediate: true
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
      margin-bottom: 10px;
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
