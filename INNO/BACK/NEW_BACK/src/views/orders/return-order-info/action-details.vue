<template>
  <div class="action_details">
    <titleBar>操作信息</titleBar>
    <div class="note">
      <label>操作备注</label>
      <Input v-model="actionNote" type="textarea" placeholder="请输入操作备注" style="width: 300px" :rows="4"/>
      <Divider />
      <span v-for="(isShow, key) in handle" :key="key">
        <template v-if="isShow">
          <Button type="primary" :loading="loading" class="btn" @click="handleAction(key)">{{orderStatus[key].name}}</Button>
        </template>
      </span>
    </div>
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
    <Modal
        v-model="showRefundment"
        title="确定退款"
        :mask-closable="isClose"
        @on-ok="confrimRefundment">
        <div>
          <!-- 普通订单 -->
          <template v-if="orderGoodsTotal.order_type !== 2">
            <div style="margin-bottom: 20px;">
              <label style="margin-right: 20px;">退款金额:</label>
              <Input v-model="returnMoney" type="number" placeholder="请输入金额" class="basic_input"/>
            </div>
          </template>
          <!-- 预售订单 -->
          <template v-if="orderGoodsTotal.order_type == 2">
            <div style="margin-bottom: 20px;">
              <label style="margin-right: 20px;">定金金额:</label>
              <Input v-model="returnMoneyDeposit" type="number" placeholder="请输入金额" class="basic_input" :disabled="orderGoodsTotal.isallow_return_deposit === 0"/>
            </div>
            <div style="margin-bottom: 20px;">
              <label style="margin-right: 20px;">尾款金额:</label>
              <Input v-model="returnMoneyTail" type="number" placeholder="请输入金额" class="basic_input"/>
            </div>
          </template>
          <div style="margin-bottom: 20px;">
            <label style="margin-right: 20px;">退款方式:</label>
            <RadioGroup v-model="refundWay">
              <Radio label="3">微信原路退回</Radio>
              <Radio label="2">线下操作退款</Radio>
            </RadioGroup>
          </div>
          <div style="display: flex;">
            <label style="margin-right: 20px;">退款备注:</label>
            <div>
              <Input v-model="returnMoneyNote" type="textarea" placeholder="请输入备注" :row="3" style="width: 260px;"/>
            </div>
          </div>
        </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import titleBar from '@/views/my-components/title-bar/title-bar';
import Mixin from './action-mixin';
import orderStatus from './order-status';

export default {
  props: {
    actionList: {
      type: Array,
      required: true
    },
    orderGoodsTotal: {
      type: Object,
      required: true
    },
    sn: String,
    handle: {
      type: Object,
      required: true
    }
  },
  mixins: [Mixin],
  components: {
    titleBar
  },
  data () {
    return {
      actionNote: '',
      spinShow: false,
      orderStatus: orderStatus,
      loading: false,
      showRefundment: false,
      returnMoney: 0,
      returnMoneyDeposit: 0,
      returnMoneyTail: 0,
      refundWay: "3",
      // 退款单独的备注
      returnMoneyNote: '',
      isClose: false
    }
  },
  methods: {
    confrimRefundment () {
      this.handleConfirm('finish', {
        return_money_type: this.refundWay,
        return_totalamount: this.returnMoney,
        pay_deposit_amount: this.returnMoneyDeposit,
        pay_tail_amount: this.returnMoneyTail,
        action_note: this.returnMoneyNote
      });
    },
    handleAction (key) {
      this.orderStatus[key].cb.call(this);
    },
    handleConfirm (key, params = {}) {
      const cbPromise = new Promise((resolve, reject) => {
        if (this.orderStatus[key].tip) {
          this.$Modal.confirm({
            title: '操作提示',
            content: this.orderStatus[key].tip,
            onOk: () => {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
      return cbPromise.then(() => {
        this.handleForBack(key, params);
      });
    },
    handleForBack (key, params) {
      this.loading = true;
      return this.$ajax.post(this.$api.returnOrderUpdate, {
        return_id: this.sn,
        button_type: key,
        action_note: this.actionNote,
        ...params
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('reload');
        }
        this.loading = false;
      });
    }
  },
  watch: {
    actionList: {
      handler(newVal) {
        this.tableData = newVal;
      }
    },
    orderGoodsTotal (nV) {
      this.returnMoney = nV.return_totalamount;
      this.returnMoneyDeposit = nV.pay_deposit_amount;
      this.returnMoneyTail = nV.pay_tail_amount;
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
  .btn{
    margin-right: 10px;
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
