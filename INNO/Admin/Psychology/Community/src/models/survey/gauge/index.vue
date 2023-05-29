<template>
  <hold-layout :isFull="true">
    <searchForm :searchForm="searchForm" @search="loadData()"></searchForm>
    <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
      <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" v-hasAction="'inventory_management_view'">查看</a>
          </div>
      </template>
    </Table>
    <rewrite-page
    slot="footer"
    :total="total"
    :current="page"
    :page-size="pageSize"
    :page-size-opts="pageSizeOpts"
    @on-change="e=>loadData(e)"
    @on-page-size-change="handlePageSizeChange"
    show-sizer
    show-elevator
    show-total
    transfer
    ></rewrite-page>
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm },
  data(){
    return {
      searchForm: {
        searchq: ""
      }
    }
  },
  methods:{
    onLoadData(page, extraData) {
      return this.$MainApi.inventoryList({
          data: {
              ...this.searchForm,
              ...extraData,
          },
          other: {
            isErrorMsg: true
          }
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
    },
  },
  mounted() {
      this.loadData();
  },
}
</script>

<style>

</style>