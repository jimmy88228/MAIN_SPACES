<template>
  <div class="weixin-group-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" @click="handleExport">导出</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="storeName">
          <p>{{row.get_store.name}}</p>
        </template>
        <template slot-scope="{ row }" slot="storeCode">
          <p>{{row.get_store.code}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span @click="editBrand(index, row)"><a>编辑</a></span>
          <Divider type="vertical"/>
          <span @click="delItem(row, '删除提示', '确定删除该微信群吗？')"><a>删除</a></span>
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
    <weixin-group-form ref="brandForm" @on-success="loadData"></weixin-group-form>
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import WeixinGroupForm from './weixin-group-form';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    SearchForm,
    WeixinGroupForm,
    notice
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        store_id: 0
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.weiXinGroupList, params)
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
    openModal (row) {
      this.$refs.brandForm.setData(row).show();
    },
    editBrand (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.weiXinGroupRemove, {
        id: row.id
      });
    },
    handleExport (type) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '确定导出数据吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          return this.$ajax.post(this.$api.weiXinGroupExport, this.condition)
            .then((response) => {
              var res = response.data;
              if (res.code) {
                var jobId = res.data;
                // 打开异步提示组件
                this.jobIdCol.push(jobId);
                this.$nextTick(() => {
                  this.$refs[`notice${jobId}`][0].showNotice(jobId);
                });
                this.$Message.success(res.message);
              } else {
                this.$Message.error(res.message);
              }
            });
        }
      });
    },
    handleFinish () {
      // 异步下载结束后刷新
      this.loadData();
      this.currentPage = 1;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.weixin-group-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
