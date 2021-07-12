<template>
	<div class="spec-list">
		<!--列表搜索框-->
		<div class="table-topbar">
      <Row>
        <Col span="12">
          <Form ref="formSearch" :model="formSearch" inline>
            <FormItem>
                <Input
                v-model="formSearch.searchq"
                style="width:280px;"
                placeholder="规格名称 模糊查询"
                clearable
                search
                enter-button
                @on-search="searchPage"
                @on-clear="searchPage"
                @keydown.native.enter.prevent ="searchPage"></Input>
            </FormItem>
          </Form>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary"  class="spec-list_import" :loading="exportLoading"  @click="confirmExport">导出</Button>
          <Button type="primary" icon="md-add" class="spec-list_import" @click="handleImport">批量导入</Button>
          <Button v-if="canCreate" type="primary" icon="md-add" @click="openModal({},true)" style="float:right">添加规格项</Button>
        </Col>
      </Row>
		</div>
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="" v-for="item in jobIdCol" :key="item"></notice>
    </div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal" class="list_page">
      <Page
        :total="pageTotal"
        :page-size="pageSize"
        :current="curPage"
        :page-size-opts="pageSizeOpts"
        @on-change="changePage"
        @on-page-size-change="handlePageSize"
        show-elevator
        show-total
        show-sizer></Page>
    </div>

	  <!--管理员编辑表单-->
		<specForm ref="spec-form" @on-success="onSpecSuccess"></specForm>
		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
	</div>
</template>

<script>
/**
 * 商品规格列表
 */
import util from '@/libs/util.js';
import specForm from './spec-form';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import SpecSort from '../spec-sort.vue';
import Conf from '@/config';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    specForm,
    BatchImport,
    SpecSort,
    notice
  },
  data () {
    return {
      // 列表
      columns: [],
      data: [],
      tableHeight: 500,
      tableLoading: false,
      pageTotal: 0,
      pageSize: Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      canCreate: false,
      // 搜索表单
      formSearch: {
        searchq: ''
      },
      modalEditIndex: '',
      curPage: 1,
      changeSizeSign: false,
      exportLoading: false,
			jobIdCol: [],
    }
  },
  methods: {
    // 初始化
    init () {
      // 动态计算表高度
      this.tableHeight = document.body.clientHeight - 280;

      this.tableLoading = true;
    // ajax 请求获取初始化数据，然后动态更新下面数据源
      util.ajax.post(util.apiUrl.goodsSizeList, {
        isInit: 1,
        page: this.curPage,
        pageSize: this.pageSize,
        searchq: this.formSearch.searchq
      })
      .then((response) => {
        this.tableLoading = false;
        var res = response.data;

        if (res.code) {
          // 初始化表
          this.initTable(res);

          // 初始化表数据
          this.data = res.data.items;
          this.pageTotal = Number(res.data.total);
          this.canCreate = res.data.canCreate;
          this.$emit('get-size-name', (res.data && res.data.size_unit_name) || '');
        }
      });
    },
  	// 初始化表
    initTable (res) {
      const _this = this;
      this.columns = res.data.columns;

      this.columns[1].align = 'left';
      this.columns[1].minWidth = 100;
      this.columns[2].align = 'left';
      this.columns[2].minWidth = 100;
      this.columns[(this.columns.length - 2)].render = (h, params) => {
        return h(SpecSort, {
          props: {
            type: 'sizecat_sort',
            value: params.row.sizecat_sort,
            id: params.row.sizecat_id
          },
          on: {
            'edit-success' () {
              _this.init();
            }
          }
        })
      };
      // 操作按钮
      this.columns[(this.columns.length - 1)].render = (h, params) => {
        var buttons = [];
        buttons.push(
          h('span', [
            h('a', {
              on: {
                click: () => {
                  this.$router.push({
                    name: 'size-spec-list',
                    params: {
                      id: params.row.sizecat_id
                    }
                  });
                }
              }
            }, '尺码列表'),
            h('Divider', {
              style: {
                display: 'inline-block'
              },
              props: {
                type: "vertical"
              }
            })
          ])
        );

        if (params.row.handle.edit) {
          // 编辑按钮
          buttons.push(
            h('span', [
              h('a', {
                on: {
                  click: () => {
                    this.editSpec(params.index, params.row, true);
                  }
                }
              }, '编辑'),
              h('Divider', {
                style: {
                  display: 'inline-block'
                },
                props: {
                  type: "vertical"
                }
              })
            ])
          );
        }

        if (params.row.handle.remove) {
          // 删除
          buttons.push(
            h('a', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  this.removeSpec(params.index, params.row)
                }
              }
            }, '删除')
          );
        }
        return h('div', buttons);
      }
    },
    // 切换分页
    changePage (page) {
      if (this.changeSizeSign) {
        this.changeSizeSign = false;
        return false;
      }
      this.curPage = page;
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
      util.ajax.post(util.apiUrl.goodsSizeList, {
        page: page,
        pageSize: this.pageSize,
        searchq: this.formSearch.searchq
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          // 初始化表数据
          this.data = res.data.items;
          this.pageTotal = Number(res.data.total);
        }
        this.tableLoading = false;
      });
    },
    // 搜索
    searchPage () {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
      util.ajax.post(util.apiUrl.goodsSizeList, {
        page: 1,
        pageSize: this.pageSize,
        searchq: this.formSearch.searchq
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          // 初始化表数据
          this.data = res.data.items;
          this.pageTotal = Number(res.data.total);
          this.curPage = 1;
        }
        this.tableLoading = false;
      });
    },
    handlePageSize (pageSize) {
      this.curPage !== 1 && (this.changeSizeSign = true);
      this.pageSize = pageSize;
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
      util.ajax.post(util.apiUrl.goodsSizeList, {
        page: 1,
        pageSize: this.pageSize,
        searchq: this.formSearch.searchq
      })
    .then((response) => {
      var res = response.data;
      if (res.code) {
        // 初始化表数据
        this.data = res.data.items;
        this.pageTotal = Number(res.data.total);
        this.curPage = 1;
      }
      this.tableLoading = false;
    });
    },
    // 删除规格
    removeSpec (index, row) {
      this.$Modal.confirm({
        title: '删除规格',
        content: '确定删除规格吗？只有无关联商品 和 无规格值，才能删除成功。',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
              this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
            util.ajax.post(util.apiUrl.goodsSizeRemove, {
              sizecat_id: row.sizecat_id
            })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
                this.$Message.success(res.message);
                this.init();
		    			}
		    			this.tableLoading = false;
            });
        }
      });
    },
    // 编辑
    editSpec (index, row, showFooter) {
      this.modalEditIndex = index;
      this.openModal(row, showFooter);
    },
    // 打开模态框
    openModal (row, showFooter) {
      this.$refs['spec-form'].openModal(row, showFooter);
    },
    // 添加成功的回调
    onSpecSuccess ({ type }) {
      if (type === 'add') {
        this.formSearch = {
          searchq: ''
        };
        this.curPage = 1;
      }
      this.init();
    },
    handleImport () {
      this.$refs.batchImport.openModal(this.canCreate, this.$api.goodsSizeUpload, this.$api.goodsSizeDownload);
    },
    onImportSuccess () {
      this.init();
    },
    confirmExport(){
				return this.$ajax.post(this.$api.goodsSizeList,{
					is_export: 1
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
  },
  mounted () {
    this.init();
  }
}
</script>

<style lang="less">
.spec-list{
	.table-topbar{
    .ivu-form-item{
        margin-bottom: 10px;
    }
		.ivu-input-icon-clear{
			right:50px;
		}
		.btn-group{
			display: flex;
      justify-content: flex-end;
			.spec-list_import{
				margin-right: 10px;
			}
		}
  }
}
</style>
