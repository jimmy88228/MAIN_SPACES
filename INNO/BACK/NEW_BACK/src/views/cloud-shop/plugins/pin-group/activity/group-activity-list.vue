<template>
  <div class="pin-group-list">
    <Card v-show="showList">
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="info" @click="handleImportActivity()" v-if="canCreate.activity_upload">导入活动</Button>
          <Button type="info" @click="confirmExportActivity()" v-if="canCreate.activity_export">导出活动</Button>
          <Button type="info" @click="handleImportActivityGoods()" v-if="canCreate.activity_goods_upload">按货号导入商品</Button>
           <Button type="info" @click="handleImportActivityGoodsByProductSn()" v-if="canCreate.activity_goods_upload">按条码导入商品</Button>
          <Button type="info" @click="confirmExportActivityGoods()" v-if="canCreate.activity_goods_export">导出商品</Button>
          <Button type="info" @click="handleImportBatchActivity()" v-if="canCreate.activity_batch_upload">批量修改活动</Button>
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">添加拼团活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"
      @on-selection-change="getSelectAct" @on-select-all="handleSelectAll">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.active_image" v-if="row.active_image" :alt="row.activity_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.activity_name" v-viewer v-else/>
            </div>
            <span class="name">{{row.activity_name}}</span>
          </div>
        </template>
        <!--<template slot-scope="{ row }" slot="time">
          <p>{{row.from_date}}-{{row.to_date}}</p>
        </template>-->

        <template slot-scope="{ row }" slot="from_date">
          <p>{{row.from_date | initDate}}</p>
          <p>{{row.from_date | initTime}}</p>
        </template>

        <template slot-scope="{ row }" slot="to_date">
          <p>{{row.to_date | initDate}}</p>
          <p>{{row.to_date | initTime}}</p>
        </template>

        <template slot-scope="{ row }" slot="sort">
          <pin-sort :id="row.id" :value="row.sort" @edit-success="handleSort"></pin-sort>
        </template>
        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="row.is_enabled == 0  ? 'error' : row.is_enabled == 1 ? 'success' : 'warning'">{{row.is_enabled == 0  ? '关闭' : row.is_enabled == 1 ? '开启' : '过期'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <span v-show="row.handle.edit" @click="bindingStore(row)"><a>关联店铺</a></span>
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
        <notice :ref="'notice' + item"  v-for="item in jobIdCol" :key="item"></notice>
      </div>
      <!--导入组件-->
      <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>

    <!--绑定门店组件-->
    <BindingStore ref="binding-store" @on-back="onBack"></BindingStore>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import BindingStore from './binding/binding-store.vue';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import PinSort from './pin-sort';

export default {
  components: {
    SearchForm,
    notice,
    BindingStore,
    BatchImport,
    PinSort
  },
  data () {
    return {
      showList: true,
      canCreate: {},
      condition: {
        searchq: '',
        status: -1,
        start_time: '',
        searchq_type:1,
        end_time: ''
      },
      selectedAct: [],
      isCheckAll: false,
      exportLoading: false,
			jobIdCol: [],
      spinShow:false,
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      this.spinShow=true;
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.cloudGroupActivityList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      }).finally(()=>{
          this.spinShow=false;
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    createActivity () {
      this.$router.push({
        name: 'shop-group-activity-add'
      })
    },
    handleSort () {
      this.loadData();
    },
    editItem (row) {
      this.$router.push({
        name: 'shop-group-activity-edit',
        params: {
          id: row.id
        }
      })
    },
    // 绑定门店
    bindingStore(row){
        this.showList = false;console.log('打印：', row.id);
        this.$refs['binding-store'].openModal( row.id );
    },
    onBack(){
        this.showList = true;
        this.loadData();
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
				return this.$ajax.post(this.$api.cloudGroupActivityEditStatus, {
						ids: this.selectedAct.map(item => item.id),
            status: val
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						}
            this.isCheckAll = false;
            this.selectedAct = [];
            return this.loadData();
					}).finally(()=>{
            this.spinShow = false;
          })
    },
    confirmExportActivity(data){
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.cloudGroupActivityExport,params).then((response) => {
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
      this.uploadUrl = this.$api.cloudGroupActivityUpload;
      console.log(this.uploadUrl)
      this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.cloudGroupActivityDownload);
    },
    handleImportBatchActivity (row) {
      //批量修改活动
      this.uploadUrl = this.$api.cloudGroupActivityBatchUpload;
      this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.cloudGroupActivityBatchDownload);
    },
    confirmExportActivityGoods(data){
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.cloudGroupActivityGoodsExport,params).then((response) => {
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
      this.uploadUrl = this.$api.cloudGroupActivityGoodsUpload;
      console.log(this.uploadUrl)
      this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.cloudGroupActivityGoodsDownload);
    },
    handleImportActivityGoodsByProductSn (row) {
      this.uploadUrl = this.$api.cloudGroupActivityGoodsUploadByProductSn;
      console.log(this.uploadUrl)
      this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.cloudGroupActivityGoodsDownloadByProductSn);
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
