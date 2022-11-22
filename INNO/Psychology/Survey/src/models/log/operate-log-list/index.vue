<template>
    <hold-layout class="resource-page-layout" :isFull="true">
      <searchForm :searchForm="searchForm" @search="loadData()" ></searchForm>
      <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" >
        <template slot="admin_user" slot-scope="{ row }">
          <div class="admin-user">
            {{(row.get_admin_user && row.get_admin_user.user_name) || '--'}}
          </div>
        </template>
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";

export default {
  name: "resourceManageIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm },
  data() {
    return {
      searchForm: { searchq: "",start_time: "", end_time: "", time: [] },
    };
  },
  computed: {
  },
  methods: {
    onLoadData(page, extraData) {
      return this.$MainApi
        .operationLogList({
          data: {
            ...this.searchForm,
            start_time: this.searchForm.time[0] || '',
            end_time: this.searchForm.time[1] || '',
            ...extraData,
          },
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.data = {
              total: data.total,
              list: data.items,
            };
          }
        });
    }
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.resource-page-layout {
  .admin-user {
    display: flex;
    align-items: center;
    padding: 10px 0px;
  }
}
</style>