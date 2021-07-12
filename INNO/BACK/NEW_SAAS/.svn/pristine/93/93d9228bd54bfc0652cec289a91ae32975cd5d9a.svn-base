<template>
  <div class="pin-group-list">
    <Card>
      <Row>
        <Col span="14">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="10" class="btn-group">
          <Button type="info" @click="handleImportActivity()" v-if="canCreate.activity_upload">导入活动</Button>
          <Button type="info" @click="confirmExportActivity()" v-if="canCreate.activity_export">导出活动</Button>
          <Button type="info" @click="handleImportActivityGoods()" v-if="canCreate.activity_goods_upload">导入商品</Button>
          <Button type="info" @click="confirmExportActivityGoods()" v-if="canCreate.activity_goods_export">导出商品</Button>
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">添加拼团活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"
      @on-selection-change="getSelectAct" @on-select-all="handleSelectAll">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.active_image" v-if="row.active_image" :alt="row.activity_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.activity_name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.activity_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="time">
          <p>{{row.from_date}}-{{row.to_date}}</p>
        </template>
        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="row.is_enabled == 0  ? 'error' : row.is_enabled == 1 ? 'success' : 'warning'">{{row.is_enabled == 0  ? '关闭' : row.is_enabled == 1 ? '开启' : '过期'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page list_page_fixed">
        <div class="btn_group"  v-if="canCreate.update_status">
          <Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
          <ButtonGroup>
            <Button @click="handleBatchStatus(1)">开启</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button @click="handleBatchStatus(0)">关闭</Button>
          </ButtonGroup>
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
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  components: {
    SearchForm,
    notice,
    BatchImport
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        status: -1,
        start_time: '',
        end_time: ''
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
      return this.$ajax.post(this.$api.GroupActivityList, params)
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
    createActivity () {
      this.$router.push({
        name: 'group-activity-add'
      })
    },
    editItem (row) {
      this.$router.push({
        name: 'group-activity-edit',
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
				return this.$ajax.post(this.$api.GroupActivityEditStatus, {
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
      confirmExportActivity(){
				return this.$ajax.post(this.$api.GroupActivityExport,{

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
      handleImportActivity (row) {
        this.uploadUrl = this.$api.GroupActivityUpload;
        console.log(this.uploadUrl)
        this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.GroupActivityDownload);
      },
      confirmExportActivityGoods(){
				return this.$ajax.post(this.$api.GroupActivityGoodsExport,{

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
      handleImportActivityGoods (row) {
        this.uploadUrl = this.$api.GroupActivityGoodsUpload;
        console.log(this.uploadUrl)
        this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.GroupActivityGoodsDownload);
      },
      onImportSuccess () {
        this.loadData();
      },
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.pin-group-list{
  .btn-group{
    text-align: right;
  }
  .list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
}
</style>
