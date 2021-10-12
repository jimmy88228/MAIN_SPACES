<template>
    <div class="brand-list">
      <Card>
      <SearchForm ref="search" @on-search="searchPage"></SearchForm>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" @on-selection-change="handleSelect">
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="list">
          <List>
              <ListItem v-for="item in row.activity_info" :key="item.id">{{item.name}}</ListItem>
          </List>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <Button type="primary" size="small" @click="exportData">导出统计</Button>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <div style="float: left;margin-bottom: 24px;">
          <Button type="primary" style="margin-right: 10px;">开启</Button>
          <Button type="primary">关闭</Button>
        </div>
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
      <Modal
      class="brand-form"
      v-model="modalShow"
      title="导出统计"
      @on-ok="confirm">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
      </Modal>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  components: {
    SearchForm,
    PageTopBase,
    DateSelect
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      },
      selectData: [],
      modalShow: false,
      exportSearch: {
        start_time: '',
        end_time: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.CloudDistributionCouponsActivityList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleSelect (selection) {
      console.log(selection)
      this.selectData = selection;
    },
    handleView (row) {
      this.$router.push({
          name: 'distribution-coupons-edit',
          params: {
            id: row.id
          }
        })
    },
    handleWater (row) {
      this.$router.push({
          name: 'pai-water-form',
          params: {
            id: row.id
          }
        })
    },
    exportData () {
      this.modalShow = true;
    },
    handleStart (date) {
      this.exportSearch.start_time = date;
    },
    handleEnd (date) {
      this.exportSearch.end_time = date;
    },
    confirm () {

    }
  }
}
</script>

<style lang="less" scoped>
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
