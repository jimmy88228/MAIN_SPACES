<template>
  <div class="brand-list">
    <Card>
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4" class="btn-group">
          <Button type="primary" @click="createActivity">创建活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="activity">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.img_url" v-if="row.img_url" :alt="row.activity_title" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.activity_title" v-viewer v-else></img>
            </div>
            <span class="name">{{row.activity_title}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="from_time">
          <p>{{row.from_time | initDate}}</p>
          <p>{{row.from_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="to_time">
          <p>{{row.to_time | initDate}}</p>
          <p>{{row.to_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '启用' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.goodedit" @click="handleEdit(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.goodexport"/>
          <span v-show="row.handle.goodexport" @click="exportData(row.id)"><a>导出统计</a></span>
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
    <Modal
      class="brand-form"
      v-model="modalShow"
      title="导出统计">
      <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
      <div slot="footer">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="confirm">确认</Button>
      </div>
    </Modal>
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    SearchForm,
    DateSelect,
    notice
  },
  data () {
    return {
      canCreate: {},
      condition: {
        start_time: '',
        end_time: '',
        searchq: ''
      },
      modalShow: false,
      exportSearch: {
        start_time: '',
        end_time: ''
      },
      currentId: 0,
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.distributionActivityGoodList, params)
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
    exportData (id) {
      this.currentId = id;
      this.modalShow = true;
    },
    handleStart (date) {
      this.exportSearch.start_time = date;
    },
    handleEnd (date) {
      this.exportSearch.end_time = date;
    },
    resetData () {
      this.exportSearch = {
        start_time: '',
        end_time: ''
      };
      this.currentId = 0;
      this.modalShow = false;
    },
    confirm () {
      if (!this.exportSearch.start_time || !this.exportSearch.end_time) {
        this.$Message.error('请完善时间');
        this.modalShow = true;
        return;
      }
      this.handleExport();
    },
    cancel () {
      this.resetData();
    },
    createActivity () {
      this.$router.push({
        name: 'distribution-goods-add'
      })
    },
    handleEdit (row) {
      this.$router.push({
        name: 'distribution-goods-edit',
        params: {
          id: row.id
        }
      })
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.distributionActivityGoodExport, {
            id: this.currentId,
            ...this.exportData
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
                this.resetData();
							} else {
								this.$Message.error(res.message);
							}
					});
				}
			});
    },
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
