<template>
  <div class="action_details">
    <titleBar>发货操作信息</titleBar>
    <div class="note">
      <label>操作备注</label>
      <Input v-model="actionNote" type="textarea" placeholder="请输入操作备注" style="width: 300px" :rows="4"/>
      <Divider />
      <Button v-if="deliverGoodsBtn" type="primary" @click="handleDelivery">发货</Button>
    </div>
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import titleBar from '@/views/my-components/title-bar/title-bar';
import Mixin from './action-mixin';

export default {
  props: {
    actionList: {
      type: Array,
      required: true
    },
    orderButton: Object,
    sn: String,
    invoiceNo: String,
    shippingId: String
  },
  mixins: [Mixin],
  components: {
    titleBar
  },
  data () {
    return {
      actionNote: '',
      spinShow: false
    }
  },
  computed: {
    deliverGoodsBtn() {
      return this.orderButton.deliverGoods;
    }
  },
  methods: {
    handleDelivery() {
      if (!this.invoiceNo) {
        this.$Message.error('请填写快递单号!');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.MatrixOrderDeliverGoods, {
        delivery_id: this.sn,
        invoice_no: this.invoiceNo,
        shipping_id: this.shippingId,
        action_note: this.actionNote
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('reload');
        }
        this.spinShow = false;
      })
    }
  },
  watch: {
    actionList: {
      handler(newVal) {
        this.tableData = newVal;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.action_details{
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  .note{
    margin: 10px;
    label{
      display: inline-block;
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.action_details{
  .ivu-divider-default{
    margin: 10px 0;
  }
}
</style>
