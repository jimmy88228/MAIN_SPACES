<template>
  <div class="return-order-info">
    <Card>
      <order-details
        :order-message="orderMessage"
        :sn="sn"></order-details>
      <goods-details
        :order-goods="orderGoods"
        :goods-columns="goodsColumns"></goods-details>
      <action-details
        :sn="sn"
        :action-list="actionList"
        :order-button="orderButton"
        :invoice-no="orderAddress.invoice_no"
        :shipping-id="orderMessage.shipping_id"
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
      orderMessage: {},
      orderAddress: {},
      remark: '',
      orderGoods: [],
      goodsColumns: [],
      orderType: {},
      // 这里的columns前端自定义，不取接口
      actionList: [],
      // 发货按钮
      orderButton: {}
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
      return this.$ajax.post(this.$api.ShopOrderRefundInfo, {
        id: this.sn
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.spinShow = false;
          let {
            order_message,
            goods_message,
            goodsColumns,
            action_list,
            handle
          } = res.data;
          this.orderMessage = order_message;
          this.orderGoods = goods_message;
          this.goodsColumns = goodsColumns;
          this.actionList = action_list.act_list;
          this.orderButton = handle;
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.return-order-info{
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
