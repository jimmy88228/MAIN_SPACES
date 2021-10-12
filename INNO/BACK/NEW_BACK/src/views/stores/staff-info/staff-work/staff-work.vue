<template>
  <div class="staff-work">
    <Card>
      <div class="handle_btn">
        <Button type="primary" icon="md-add" @click="openModal">添加岗位</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editStaff(row)"><a>编辑</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
    </Card>
    <WorkForm ref="workForm" @success="loadData"></WorkForm>
  </div>
</template>
<script>
import Mixin from './mixin.js';
import WorkForm from './work-form';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    WorkForm
  },
  data () {
    return {
      canCreate: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.staffStationList, data)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    // 打开模态框
    openModal () {
      this.$refs.workForm.openModal({});
    },
    editStaff (row) {
     this.$refs.workForm.openModal(row);
    }
  }
}
</script>
<style lang="less" scoped>
.staff-work{
  .staff-work_page{
    margin: 10px 10px 0 10px;
    overflow: hidden;
    text-align: right;
  }
  .handle_btn{
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
