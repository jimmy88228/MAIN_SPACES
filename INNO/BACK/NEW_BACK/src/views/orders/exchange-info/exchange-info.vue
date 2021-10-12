<template>
  <div class="return-order-info">
    <Card>
      <order-details
        :order-message="orderMessage"
        :sn="sn"
        :new-order-id="newOrderId"></order-details>
      <goods-details
        :order-goods="orderGoods"
        :new-order-goods="newOrderGoods"></goods-details>
      <action-details
        :sn="sn"
        :action-list="actionList"
        :order-button="orderButton"
        :new-order-id="newOrderId"
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
      orderGoods: [],
      newOrderGoods: [],
      // 这里的columns前端自定义，不取接口
      actionList: [],
      orderButton: {},
      newOrderId: '0'
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
      return this.$ajax.post(this.$api.changeOrderMessage, {
        return_id: this.sn
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.spinShow = false;
          let {
            ordreMessage,
            orderGoods,
            newOrderGoods,
            orderOperation,
            handle
          } = res.data;
          // 。。。。。注意下接口的字段,写错了就
          this.orderMessage = ordreMessage;
          this.orderGoods = orderGoods;
          this.newOrderGoods = newOrderGoods;
          this.orderButton = handle;
          this.actionList = orderOperation.act_list;
          this.newOrderId = ordreMessage.new_order_id;
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
