<template>
  <div class="logistics">
    <Modal
      class="logistics-form"
      v-model="modalShow"
      :title="modalTitle"
      :mask-closable="maskClose"
      :footer-hide="hideFooter"
      width="600">
      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable" class="my_table"/>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      modalTitle: '快递单号查询',
      tableLoading: false,
      tableData: [],
      tableHeight: 400,
      hideFooter: true,
      columns: [
        {
          key: 'time',
          title: '时间'
        },
        {
          key: 'context',
          title: '物流状态'
        }
      ]
    }
  },
  methods: {
    // 打开模态框
    setData (data) {
      this.loadData(data);
      return this;
    },
    loadData (data) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.ShopOrderLogistics, data)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.tableData = res.data;
        }
        this.tableLoading = false;
      });
    }
  }
}
</script>

<style lang="less">
.logistics-form{
  .my_table{
    .ivu-table{
      font-size: 12px;
    }
  }
}
</style>
