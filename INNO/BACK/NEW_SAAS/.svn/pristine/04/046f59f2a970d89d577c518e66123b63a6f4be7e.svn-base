<template>
  <div class="order_details">
    <Form ref="form" :label-width="100" label-colon>
      <Row>
        <Col span="12" class="order_details_item">
          <span class="title">订单信息</span>
          <FormItem label="拼团活动"><p>{{data.activity_name}}</p></FormItem>
          <FormItem label="订单状态"><p>{{data.status_str}}</p></FormItem>
          <FormItem label="下单用户"><p>{{user.real_name || '--'}}</p></FormItem>
          <FormItem label="用户卡号"><p>{{user.card_num || '--'}}</p></FormItem>
          <FormItem label="手机号码"><p>{{user.mobile_phone || '--'}}</p></FormItem>
          <FormItem label="下单时间"><p>{{data.create_time}}</p></FormItem>
          <FormItem label="订单号"><p>{{data.order_sn}}</p></FormItem>
          <FormItem label="支付单号"><p>{{data.payment_sn}}</p></FormItem>
        </Col>
        <Col span="12" class="order_details_item">
          <span class="title">收货和物流信息</span>
          <FormItem label="收货人"><p>{{consignee.consignee || '--'}}</p></FormItem>
          <FormItem label="收货地址"><p>{{consignee.address || '--'}}</p></FormItem>
          <FormItem label="手机"><p>{{consignee.mobile_phone || '--'}}</p></FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: {},
      consignee: {}
    }
  },
  methods: {
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  watch: {
    data({place_user, consignee_user}) {
      this.user = place_user;
      this.consignee = consignee_user;
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
