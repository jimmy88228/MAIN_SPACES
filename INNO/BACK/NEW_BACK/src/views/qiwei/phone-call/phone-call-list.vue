<template>
  <div class="phone-call-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="addItem()" v-if="canCreate.add">新增任务</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.on"/>
          <span v-show="row.handle.on" @click="editStatus(row,1)"><a>启动</a></span>
          <Divider type="vertical" v-show="row.handle.execute"/>
          <span v-show="row.handle.execute" @click="editStatus(row,2)"><a>执行</a></span>
          <Divider type="vertical" v-show="row.handle.off"/>
          <span v-show="row.handle.off" @click="editStatus(row,3)"><a>停止</a></span>
          <Divider type="vertical" v-show="row.handle.import"/>
          <span v-show="row.handle.import" @click="handleImport(row)"><a>导入</a></span>
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
    <Spin size="large" fix v-show="spinShow"></Spin>
    <!--导入组件-->
    <BatchImport ref="batchImport" @on-success="onImportSuccess" :upLoadPayLoad="upLoadPayLoad"></BatchImport>
  </div>
</template>
<script>

import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  components: {
    SearchForm,
    BatchImport
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      },
      spinShow: false,
      upLoadPayLoad: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition = {
        searchq: ''
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.phoneCallList, params)
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
    handleImport (row) {
      let params={
        id:row.id
      }
      this.upLoadPayLoad = params;
      let handle={
        upload:true,
        download:true
      }
      this.$refs.batchImport.openModal(handle,this.$api.phoneCallImport, this.$api.phoneCallTpl);
    },
    onImportSuccess(){
      this.loadData();
    },
    editStatus (row,index) {
      this.spinShow=true;
      return this.$ajax.post(this.$api.phoneCallStatus, {
          id: row.id,
          status:index
        }).then(response => {
          const res = response.data;
          if (res.code) {
            this.$Message.success(res.message);
            this.spinShow=false;
            return this.loadData();
          }
        }).finally(()=>{
              this.spinShow = false;
        })
    },
    addItem () {
      this.$router.push({
        name: 'phone-call-form',
        query: {
          id:0
        }
      });
    },
    editItem (row) {
      this.$router.push({
        name: 'phone-call-form',
        query: {
          id: row.id
        }
      });
    },
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.phone-call-list{
  .btn-group{
    text-align: right;
  }
}
</style>
