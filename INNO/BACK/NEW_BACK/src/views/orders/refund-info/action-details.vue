<template>
  <div class="action_details">
    <titleBar>操作信息</titleBar>
    <div class="note">
      <label>操作备注</label>
      <Input v-model="actionNote" type="textarea" placeholder="请输入操作备注" style="width: 300px" :rows="4"/>
      <Divider />
      <Button v-if="confirmCancel" type="primary" @click="handle('confirmCancel')">确认取消</Button>
      <Button v-if="refund" type="primary" @click="handle('refund')">退款</Button>
      <Button v-if="rejectCancel" type="primary" @click="handle('rejectCancel')">拒绝取消</Button>
      <Button v-if="refundCancelRollback" type="primary" @click="handle('refundCancelRollback')">反审核</Button>
      <Button v-if="deleteRefund" type="primary" @click="handle('deleteRefund')">删除</Button>
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
      spinShow: false,
      tipConfig: {
        confirmCancel: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
        refund: '确定要进行该操作吗？',
        rejectCancel: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
        deleteRefund: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
        refundCancelRollback: '确定要进行该操作吗？'
      }
    }
  },
  computed: {
    confirmCancel() {
      return this.orderButton.confirmCancel;
    },
    refund() {
      return this.orderButton.refund;
    },
    rejectCancel() {
      return this.orderButton.rejectCancel;
    },
    deleteRefund() {
      return this.orderButton.deleteRefund;
    },
    refundCancelRollback() {
      return this.orderButton.refundCancelRollback;
    }
  },
  methods: {
    handle(type) {
      this.$Modal.confirm({
        title: '操作提示',
        content: this.tipConfig[type],
        onOk: () => {
          this.spinShow = true;
          return this.$ajax.post(this.$api.orderRefundUpdate, {
            id: this.sn,
            remark: this.actionNote,
            operatioMode: type
          }).then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.$emit('reload');
            }
            this.spinShow = false;
          })
        }
      });
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
