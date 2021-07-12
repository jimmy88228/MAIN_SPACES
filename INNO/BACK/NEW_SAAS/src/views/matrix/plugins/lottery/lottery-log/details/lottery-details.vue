<template>
  <PageTopBase>
    <div class="lottery-details-list">
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4">
          <div class="btn-group">
            <Button type="primary" @click="handleExport">导出</Button>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="prize_img">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.prize_img" v-if="row.prize_img"  v-viewer/>
              <img src="@rs/images/default-img.jpg"  v-viewer v-else/>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="create_time">
          <p>{{row.create_time | initDate}}</p>
          <p>{{row.create_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="receive_time">
          <p>{{row.receive_time | initDate}}</p>
          <p>{{row.receive_time | initTime}}</p>
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
    </div>
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </PageTopBase>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  props: ['id'],
  components: {
    SearchForm,
    PageTopBase,
    notice
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        searchUserStr:'',
        // status: -1,
        start_time: '',
        end_time: ''
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        activity_id: this.id
      });
      return this.$ajax.post(this.$api.MatrixLotteryLogViewDetails, params)
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
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.MatrixLotteryLogViewDetailsExport, {
            ...this.condition,
            activity_id: this.id
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
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.lottery-details-list{
  .btn-group{
    text-align: right;
  }
}
</style>
