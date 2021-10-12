<template>
  <div class="seckill-activity-list">
    <Card>
      <Row type="flex" style="margin-bottom: 10px;">
        <Col style="flex:1 1 0%;">
          <Input
            class="basic_input"
            v-model="condition.searchq"
            placeholder="请输入活动名称"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent/>
        </Col>
        <Col style="text-align: right;width:180px;">
            <Button type="info" icon="md-add" v-if="canCreate.add" @click="createActivity">添加活动</Button>
			<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
        </Col>
      </Row>
	  
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" 
      @on-selection-change="getSelectAct" @on-select-all="handleSelectAll">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.picture" v-if="row.picture" :alt="row.name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.name" v-viewer v-else/>
            </div>
            <span class="name">{{row.name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="ready_time">
          <p>{{row.ready_time | initDate}}</p>
          <p>{{row.ready_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="start_time">
          <p>{{row.start_time | initDate}}</p>
          <p>{{row.start_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="end_time">
          <p>{{row.end_time | initDate}}</p>
          <p>{{row.end_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="enable">
          <Tag type="dot" :color="row.enable == 1 ? 'success' : 'error'">{{row.enable === '1' ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="handleGoodsEdit(row)"><a>绑定数据</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.data"/>
          <span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.data"/>
          <span v-show="row.handle.data" @click="handleData(row)"><a>数据统计</a></span>
          <Divider type="vertical" v-show="row.handle.data && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该活动吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.data && row.handle.copy"/>
          <span v-show="row.handle.copy" @click="handleCopy(row)"><a>复制</a></span>
          <Divider type="vertical" v-show="row.handle.data && row.handle.goods_export"/>
          <span v-show="row.handle.goods_export" :loading="exportLoading"  @click="confirmExport(row)"><a>导出商品</a></span>
          <Divider type="vertical" v-show="row.handle.data && row.handle.goods_import"/>
          <span v-show="row.handle.goods_import"   @click="handleImport(row)"><a>导入商品</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page list_page_fixed">
        <div class="btn_group"  v-if="canCreate.edit_status">
          <Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
          <ButtonGroup>
            <Button @click="handleBatchStatus(1)">批量启用</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button @click="handleBatchStatus(0)">批量关闭</Button>
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
        searchq: ''
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
      return this.$ajax.post(this.$api.seckillActivityList, params)
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
    onDelItem (row) {
      return this.$ajax.post(this.$api.seckillActivityRemove, {
        id: row.id
      });
    },
    createActivity () {
      this.$router.push({
        name: 'seckill-activity-add'
      })
    },
    handleEdit (row) {
      this.$router.push({
        name: 'seckill-activity-edit',
        params: {
          id: row.id,
          showgoods:0
        }
      })
    },
    handleGoodsEdit (row) {
      this.$router.push({
        name: 'seckill-activity-edit',
        params: {
          id: row.id,
          showgoods:1
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
        this.$store.commit('setLoading', true);
        return this.$ajax.post(this.$api.seckillActivityCopy, {
          id: row.id
        }).then(() => {
          return this.loadData();
        }).finally(()=>{
          this.$store.commit('setLoading', false);
        })
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
