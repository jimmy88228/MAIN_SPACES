<template>
  <div class="seckill-activity-list">
    <Card>
      <Row type="flex" style="margin-bottom: 10px;">
        <Col style="flex:1 1 0%;">
          <div style="display: inline-block;">
            <div class="">记录创建时间</div>
            <DatePicker v-model="condition.datetime" type="daterange" placeholder="请选择记录创建时间"
                        style="width:220px;"></DatePicker>
          </div>

          <div class="" style="display: inline-block;">
            <div class="">查询条件</div>
            <Input v-model="condition.search_str" placeholder="活动名称/邀请助力用户会员号或手机号/帮助助力用户会员号或手机号"
                   clearable
                   style="width:450px;"></Input>
          </div>

          <div style="display: inline-block; width: 150px;">
            <div class="">状态</div>
            <Select v-model="condition.status" style="width:150px">
              <Option value="-1">全部</Option>
              <Option value="1">已获得资格</Option>
              <Option value="0">邀请中</Option>
            </Select>
          </div>

          <div style="display: inline-block; width: 100px;">
            <div class="colorshow">&nbsp;&nbsp;</div>
            <Button type="primary" icon="ios-search" @click="searchPage">搜索</Button>
          </div>

          <div style="display: inline-block; width: 100px;">
            <div class="colorshow">&nbsp;&nbsp;</div>
            <Button type="primary" @click="explode">导出</Button>
          </div>
        </Col>
        <Col style="text-align: right;width:180px;">
			<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
        </Col>
      </Row>
	  
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" 
      @on-selection-change="getSelectAct" @on-select-all="handleSelectAll">
        <template slot-scope="{ row }" slot="finish_time">
          <p>{{row.finish_time | initDate}}</p>
          <p>{{row.finish_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="friend_help_time">
          <p>{{row.friend_help_time | initDate}}</p>
          <p>{{row.friend_help_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="create_time">
          <p>{{row.create_time | initDate}}</p>
          <p>{{row.create_time | initTime}}</p>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page list_page_fixed">
        <div class="btn_group"  v-if="canCreate.edit_status">
        </div>
        <div v-else></div>
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
      <!--异步处理导出excel组件-->
      <div class="col">
        <notice :ref="'notice' + item" @finish="" v-for="item in jobIdCol" :key="item"></notice>
      </div>
      <!--管理员编辑表单-->
      <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
    </Card>
  </div>
</template>
<script>
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  components: {
    notice,
    BatchImport
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        datetime: [],
        key: '',
        page: 1,
        init: 1,
        status: '-1',
        search_str: '',
        operType: '',
        query_type: ''
      },
      selectedAct: [],
      isCheckAll: false,
      exportLoading: false,
			jobIdCol: [],
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.cloudSeckillActivityReportList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage () {
      this.loadData();
    },


    explode () {
        this.condition.operType = 'export';
        this.$Modal.confirm({
            title: '操作提示',
            content: `确定导出秒杀活动报表?`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.exportLoading = true;
                // tips: 如果搜索所有的数据，不能带参数
                return this.$ajax.post(this.$api.cloudSeckillActivityReportList, this.condition)
                    .then((response) => {
                        const res = response.data;
                        this.$refs.myTable.exportCsv({
                            filename: '秒杀活动报表',
                            columns: res.data.columns,
                            data: res.data.items
                        });
                        this.exportLoading = false;
                    });
            }
        });
    },

    handleEdit (row) {
      this.$router.push({
        name: 'seckill-activity-edit',
        params: {
          id: row.id
        }
      })
    },
    handleData (row) {
      this.$router.push({
        name: 'seckill-activity-statistics',
        params: {
          id: row.id
        }
      })
    },
    handleCheck() {
				this.tableData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.tableData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectedAct = [...this.tableData].filter(item => item._checked);
			},
    getSelectAct(selection) {
      this.selectedAct = selection;
      let allLen = this.tableData.length;
      this.isCheckAll = allLen > 0 && allLen === selection.length;
      const hasSelected = this.selectedAct.map(item => item.id);
      this.tableData.forEach((item, index) => {
        this.$set(this.tableData[index], '_checked', hasSelected.includes(item.id));
      });
    },
    handleSelectAll() {
      this.isCheckAll = true;
    },
    handleBatchStatus(val) {
				if (this.selectedAct.length === 0) {
					this.$Message.error('请勾选活动');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.seckillActivityEditStatus, {
						ids: this.selectedAct.map(item => item.id),
            status: val
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.loadData();
						}
            this.isCheckAll = false;
            this.selectedAct = [];
						this.spinShow = false;
					});
			},
      handleCopy (row) {
        return this.$ajax.post(this.$api.seckillActivityCopy, {
          id: row.id
        }).then(() => {
          this.loadData();
        });
      },
      confirmExport(row){
				return this.$ajax.post(this.$api.seckillActivityGoodsExport,{
					activityId: row.id
				}).then((response) => {
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
				}).finally(()=>{
					this.isExportTime = false;
				})
			},
      handleImport (row) {
        this.uploadUrl = this.$api.seckillActivityGoodsUpload+'/'+row.id;
        console.log(this.uploadUrl)
        this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.seckillActivityGoodsDownload);
      },
      onImportSuccess () {
        this.loadData();
      },
      // 添加成功的回调
      onSpecSuccess ({ type }) {
        // if (type === 'add') {
        //   this.formSearch = {
        //     searchq: ''
        //   };
        //   this.curPage = 1;
        // }
        this.loadData();
      },
  },
  mounted () {
      let nowDate = new Date();
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let day = nowDate.getDate();

      let befDate = new Date(nowDate.getTime() - 30 * 24 * 3600 * 1000);
      let byear = befDate.getFullYear();
      let bmonth = befDate.getMonth() + 1;
      let bday = befDate.getDate();

      this.condition.datetime = [new Date(byear + ', ' + bmonth + ', ' + bday), new Date(year + ', ' + month + ', ' + day)];
    this.loadData();
  }
}
</script>

<style lang="less">
.seckill-activity-list{
  .btn-group{
    text-align: right;
    margin-bottom: 24px;
  }
  .ivu-input-icon{
    right: 50px;
  }
  .list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
}
</style>
