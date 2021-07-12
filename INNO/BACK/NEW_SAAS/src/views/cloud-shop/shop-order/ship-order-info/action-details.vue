<template>
  <div class="action_details">
    <titleBar>操作信息</titleBar>
    <div class="note">
      <label>操作备注</label>
      <Input v-model="actionNote" type="textarea" placeholder="请输入操作备注" style="width: 300px" :rows="4"/>
      <Divider />
      <Button type="primary" :loading="confirmLoading" class="btn" @click="confirm">确认生成发货单</Button>
      <Button type="primary" :loading="cancelLoading" class="btn" @click="cancel">取消</Button>
    </div>
    <!-- <Table :columns="columns" :data="tableData" ref="myTable"></Table> -->
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
    shippingId: String,
    goodsEdit: {
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
      confirmLoading: false,
      cancelLoading: false
    }
  },
  methods: {
    confirm () {
      this.handleForBack('confirmShip', this.goodsEdit);
    },
    cancel () {
      this.$router.go(-1);
    },
    handleForBack (key, params = {}) {
      this[`${key}Loading`] = true;
      return this.$ajax.post(this.$api.ShopOrderInfoUpdate, {
        order_id: this.sn,
        button_type: key,
        action_note: this.actionNote,
        ...params
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$router.go(-1);
        }
        this[`${key}Loading`] = false;
      });
    }
  },
  mounted () {
    this.actionNote = sessionStorage.getItem("note");
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
  .btn:not(:last-child){
    margin-right: 10px;
  }
}
</style>
