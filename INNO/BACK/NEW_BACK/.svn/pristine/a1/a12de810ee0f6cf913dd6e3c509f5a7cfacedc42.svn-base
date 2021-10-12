<template>
  <div class="order-info">
    <Card>
      <div class="order_header">
        <Row class="order_header_inner">
          <Col span="8" class="order_intro">
            <div class="order_status">
              <Form ref="form" :label-width="72" label-colon>
                <FormItem label="订单号"><p><a @click="handleGoOrderInfo">{{ordreMessage.order_sn}}</a></p></FormItem>
                <FormItem label="发货单号"><p>{{ordreMessage.delivery_sn}}</p></FormItem>
                <FormItem label="发货时间"><p>{{orderAddress.deliver_sn_time ? orderAddress.deliver_sn_time : '--'}}</p></FormItem>
                <FormItem label="订单状态"><p>{{currentOrderType ? '已发货' : '待发货'}}</p></FormItem>
              </Form>
            </div>
          </Col>
          <Col span="16">
            <div class="order_steps">
              <Steps :current="currentOrderType">
                <Step title="待发货" :content="firstStep"></Step>
                <Step title="已发货" :content="secondStep"></Step>
              </Steps>
            </div>
          </Col>
        </Row>
      </div>
      <order-details
        :order-address="orderAddress"
        :ordre-message="ordreMessage"
        :sn="sn"
        @reload="loadData"></order-details>
      <goods-details
        :order-goods="orderGoods"
        :goods-columns="goodsColumns"></goods-details>
      <action-details
        :sn="sn"
        :action-list="actionList"
        :order-button="orderButton"
        :invoice-no="orderAddress.invoice_no"
        :shipping-id="ordreMessage.shipping_id"
        @reload="loadData"></action-details>
      <!--加载提示-->
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
import OrderDetails from './order-details';
import GoodsDetails from './goods-details';
import ActionDetails from './action-details';

export default {
  props: ['sn'],
  data () {
    return {
      spinShow: false,
      orderNote: '',
      ordreMessage: {},
      orderAddress: {},
      remark: '',
      orderGoods: [],
      goodsColumns: [],
      orderType: {},
      currentOrderType: 1,
      // 这里的columns前端自定义，不取接口
      actionList: [],
      // 发货按钮
      orderButton: {}
    }
  },
  computed: {
    // 不规范写法，有空再和接口讨论
    firstStep () {
      return this.orderType["0"];
    },
    secondStep () {
      return this.orderType["1"];
    }
  },
  components: {
    OrderDetails,
    GoodsDetails,
    ActionDetails
  },
  mounted () {
    this.loadData();
  },
  methods: {
    loadData() {
      this.spinShow = true;
      return this.$ajax.post(this.$api.MatrixOrderShipmentInfo, {
        delivery_id: this.sn
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.spinShow = false;
          let {
            ordreMessage,
            orderAddress,
            orderGoods,
            goodsColumns,
            orderType,
            orderTypeValue,
            orderOperation,
            orderButton
          } = res.data;
          this.ordreMessage = ordreMessage;
          this.orderAddress = orderAddress;
          this.orderNote = this.remark;
          this.orderGoods = orderGoods;
          this.goodsColumns = goodsColumns;
          this.orderButton = orderButton;
          this.orderType = orderType;
          // 当前所处的订单状态
          this.currentOrderType = Number(orderTypeValue);
          this.actionList = orderOperation.action_list;
        }
      })
    },
    handleGoOrderInfo () {
      let routeUrl = this.$router.resolve({
        name: 'matrix-order-info',
        params: {
          sn: this.ordreMessage.order_id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
}
</script>

<style lang="less" scoped>
.order-info{
  .order_title{
    display: flex;
    align-items: center;
    .order-form_back{
      margin-right: 20px;
    }
  }
  .order_header{
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 5px;
    .order_header_inner{
      display: flex;
      align-items: center;
      .order_intro{
        border-right: 1px solid #ddd;
        padding-right: 5px;
        .order_status{
          font-size: 14px;
        }
        .order_handle{
          margin-top: 10px;
          .btn{
            margin-right: 4px;
          }
        }
        .hor_divider{
          margin: 10px 0;
        }
      }
      .order_steps{
        padding-left: 5px;
      }
    }
  }
}
</style>
<style lang="less">
.order-info{
  .ivu-form-item{
    margin-bottom: 0;
  }
}
</style>
