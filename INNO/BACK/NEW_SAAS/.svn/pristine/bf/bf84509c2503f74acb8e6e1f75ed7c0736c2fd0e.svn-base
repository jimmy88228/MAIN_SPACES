<template>
  <div class="action_details">
    <titleBar>操作信息</titleBar>
    <div class="note">
      <label>操作备注</label>
      <Input v-model="actionNote" type="textarea" placeholder="请输入操作备注" style="width: 300px" :rows="4"/>
      <Divider />
      <span v-for="(isShow, key) in orderButton" :key="key">
        <Button v-if="isShow" type="primary" :loading="loading" class="btn" @click="handleAction(key)">
          {{orderStatus[key].name}}
        </Button>
      </span>
    </div>
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
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
    orderButton: Object,
    sn: String,
    newOrderId: String
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
      loading: false
    }
  },
  methods: {
    handleAction (key) {
      this.orderStatus[key].cb.call(this);
    },
    handleConfirm(key) {
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
        this.handleForBack(key);
      });
    },
    handleForBack(key) {
      this.loading = true;
      return this.$ajax.post(this.$api.ShopChangeOrderUpdate, {
        return_id: this.sn,
        action_note: this.actionNote,
        operatioMode: key
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('reload');
        }
        this.loading = false;
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
