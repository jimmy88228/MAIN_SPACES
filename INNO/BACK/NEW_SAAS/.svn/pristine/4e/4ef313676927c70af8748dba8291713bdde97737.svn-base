<template>
  <div class="order_details">
    <Form ref="form" :label-width="100" label-colon>
      <Row>
        <Col span="12" class="order_details_item">
          <span class="title">退款信息</span>
          <FormItem label="退款单号"><p>{{orderMessage.refund_sn}}</p></FormItem>
          <FormItem label="关联订单号"><p><a @click="handleGoOrderInfo(orderMessage.order_id)">{{orderMessage.order_sn ? orderMessage.order_sn : '--'}}</a></p></FormItem>
          <FormItem label="退单时间"><p>{{orderMessage.create_time}}</p></FormItem>
          <FormItem label="退单类型"><p>{{orderMessage.refund_type_str}}</p></FormItem>
        </Col>
        <Col span="12" class="order_details_item">
          <span class="title title_slot">退款信息</span>
          <FormItem label="退款状态"><p>{{orderMessage.refund_status_str}}</p></FormItem>
          <FormItem label="原支付方式"><p>{{orderMessage.pay_name}}</p></FormItem>
          <FormItem label="原支付单号"><p>{{orderMessage.alipay_sn || '--'}}</p></FormItem>
          <FormItem label="退款原因"><p>{{orderMessage.refund_reason || '--'}}</p></FormItem>
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
      spinShow: false
    }
  },
  methods: {
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'shop-order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
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
