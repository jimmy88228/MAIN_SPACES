<template>
  <div class="activity-list">
    <Card>
      <Row>
        <Col span="18">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="6" class="btn-group">
          <Button type="primary" icon="md-add" @click="handleBatch(1)">批量审核通过</Button>
          <Button type="primary" icon="md-add" @click="handleBatch(0)">批量审核不通过</Button>
          <Button type="primary" @click="handleExport">导出</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" @on-sort-change="sortPage" @on-selection-change="getSelectGoods">
        <template slot-scope="{ row }" slot="is_show">
          <i-switch v-model="row.is_show" size="large" true-value="1" false-value="0" :before-change="handleChange.bind(this, row)" :disabled="row.status !== '1'">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>查看</a></span>
          <Divider type="vertical" v-show="row.status === '0' || row.status === '2'"/>
          <span v-show="row.status === '0' || row.status === '2'" @click="handleStatus(row, 1)"><a>审核通过</a></span>
          <Divider type="vertical" v-show="row.status === '0'"/>
          <span v-show="row.status === '0'" @click="handleStatus(row, 0)"><a>审核不通过</a></span>
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
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></notice>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    SearchForm,
    notice
  },
  data () {
    return {
      canCreate: {},
      condition: {
        public_start_time: '',
        public_end_time: '',
        status: '-1',
        modify_start_time: '',
        modify_end_time: '',
        orderStatus: '-1',
        store_id: '0',
        type: '-1',
        is_show: '-1',
        cat_id: 0,
        label_id: 0,
        searchq: '',
        searchq_type: ''
      },
      spinShow: false,
      sortColumn: 'create_time',
      sortVal: 'ASC',
      jobIdCol: [],
      selectData: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        sortfield: this.sortColumn,
        sortby: this.sortVal
      });
      return this.$ajax.post(this.$api.communityContentList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = {
            ...res.data,
            items: res.data.items.map(item => {
              if (item.status === '1') item._disabled = true;
              return item;
            })
          };
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    getSelectGoods (data) {
      this.selectData = data.map(item => item.id);
    },
    sortPage( {key, order} ){
      this.sortColumn = key;
      this.sortVal = order;
      this.loadData();
    },
    handleToggle (row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.communityContentStatus, {
        id: row.id,
        is_show: +row.is_show ? 0 : 1
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleChange (row) {
      return new Promise((resolve, reject) => {
        this.handleToggle(row);
        reject();
      })
    },
    handleBatch(type) {
      if (this.selectData.length === 0) {
        this.$Message.error('请选择内容!')
        return;
      }
      let url = type ? this.$api.communityContentBatchGo : this.$api.communityContentBatchNotGo;
      return this.$ajax.post(url, {
        ids: this.selectData
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success('操作成功!')
          this.loadData();
        }
      });
    },
    handleStatus (row, type) {
      let url = !type ? this.$api.communityContentNotGo : this.$api.communityContentGo;
      return this.$ajax.post(url, {
        id: row.id
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success('操作成功!')
          this.loadData();
        }
      });
    },
    editItem(row) {
      this.$router.push({
        name: 'communities-form',
        params: {
          id: row.id
        }
      })
    },
    editStatus(row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.popupAdvertStatus, {
        id: row.id
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.communityContentExport, {
            ...this.condition
          }).then((response) => {
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
  },
  created() {
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.activity-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
