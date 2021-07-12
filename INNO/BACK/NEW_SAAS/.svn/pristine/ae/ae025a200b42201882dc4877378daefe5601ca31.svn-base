<style lang="less">
.tips-off{
	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
			right:50px;
		}
	}
}
</style>

<template>
	<div class="tips-off">
		<div class="table-topbar">
        	<Form ref="formSearch" :model="formSearch" inline>
		        <FormItem>
		        	<DatePicker v-model="formSearch.searchTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择日志时间" style="width:245px"></DatePicker>
		        </FormItem>
		        <FormItem>
		        	<Input v-model="formSearch.searchq" placeholder="日志内容" style="width:200px" clearable search enter-button
				@on-search="searchPage"
				@on-clear="searchPage"
				@keydown.native.enter.prevent ="searchPage"></Input>
		        </FormItem>
        	</Form>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

	    <Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :footer-hide="modalFooterHide"
	        :width="700"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

		        <FormItem label="处理状态" prop="status">
		            <i-switch v-model="formItem.status" size="large">
		                <span slot="open">已处理</span>
		                <span slot="close">未处理</span>
		            </i-switch>
		        </FormItem>
		        <FormItem label="备注信息" prop="adminRemark">
		            <Input type="textarea" :rows="4" v-model="formItem.adminRemark" placeholder="请填写备注信息"></Input>
		        </FormItem>
	        </Form>
	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  components: {

  },
  data () {
    return {
        	columns: [],
        	data: [],
        	tableHeight: 500,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 20,

        	formSearch: {
        		searchq: '',
        		searchTime: ''
        	},

        	// 模态框
        	modalShow: false,
        	modalTitle: '',
        	modalLoading: true,
        	modalEditIndex: '',
        	modalFooterHide: false,

        	// 表单内容
        	formItem: {
        		status: false,
        		adminRemark: ''
        	},

        	// 表单数据规则
      ruleValidate: {
        adminRemark: [{ required: true, message: '备注信息不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    	init () {
    		// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 170;

      this.tableLoading = true;
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.tipsOffList, {
        		isInit: 1
        	})
    		.then((response) => {
          this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				this.columns = res.data.columns;

            // 头像
    				this.columns[0].render = (h, params) => {
              return h('div', [
                h('Avatar', {
                  props: {
                    src: params.row.get_user.wx_avatar,
                    icon: 'md-person'
                  },
                  style: {
                                	marginRight: '5px'
                  }
                }),
                h('strong', {
                            	style: {
                            		overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                            	}
                }, params.row.get_user.wx_nick_name)
              ]);
            };

            // 举报内容
    				this.columns[1].render = (h, params) => {
              return h('div', [
                        	h('div', {
                        		style: {
                        			fontWeight: 'bold',
                        			marginTop: '5px'
                        		}
                        	},
                        	'标题：' + params.row.get_pages.name),
                        	h('div', {}, params.row.tips_options),
                        	h('div', {}, params.row.tips_content)
              ]);
            };

            // 被举报头像
    				this.columns[2].render = (h, params) => {
              return h('div', [
                h('Avatar', {
                  props: {
                    src: params.row.get_pages.page_creater.wx_avatar,
                    icon: 'md-person'
                  },
                  style: {
                                	marginRight: '5px'
                  }
                }),
                h('strong', {
                            	style: {
                            		overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                            	}
                }, params.row.get_pages.page_creater.wx_nick_name)
              ]);
            };

            // 举报状态
    				this.columns[(this.columns.length - 2)].render = (h, params) => {
    					const row = params.row;
              const color = row.status == 1 ? 'success' : 'error';
              const text = row.status == 1 ? '已处理' : '未处理';

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
    				};

            // 操作按钮
    				this.columns[(this.columns.length - 1)].render = (h, params) => {
              var buttons = [];

              if (params.row.handle.edit && params.row.status == 0) {
                        	// 编辑按钮
                buttons.push(h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editTipsOff(params.index, params.row, true);
                    }
                  }
                }, '审核'));
              } else if (params.row.handle.edit && params.row.status == 1) {
                        	buttons.push(h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editTipsOff(params.index, params.row, false);
                    }
                  }
                }, '查看'));
              }

              return h('div', { style: { textAlign: 'center' } }, buttons);
            };

    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}
        });
    },
    // 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.tipsOffList, {
        		searchq: this.formSearch.searchq,
        		searchAdminId: (this.formSearch.adminSearchId != '' && this.formSearch.adminSearch != '' ? this.formSearch.adminSearchId : ''),
        		searchType: this.formSearch.logType,
        		searchTime: this.formSearch.searchTime,

        		page: page
        	})
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}

    			this.tableLoading = false;
        });
    },
    // 搜索日志
    searchPage () {
        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.tipsOffList, {
        		searchq: this.formSearch.searchq,
        		searchAdminId: (this.formSearch.adminSearchId != '' && this.formSearch.adminSearch != '' ? this.formSearch.adminSearchId : ''),
        		searchType: this.formSearch.logType,
        		searchTime: this.formSearch.searchTime
        	})
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}

    			this.tableLoading = false;
        });
    },
    // 选中autocomplete
    selectAdminUser (val) {
        	this.formSearch.adminSearchId = this.formSearch.adminSearchIndex[val];
    },
    // 编辑按钮
    editTipsOff (index, row, showFooter) {
        	this.modalEditIndex = index;
        	// 打开编辑模态框
      this.openModal(row);
      this.showBatch = false;

      if (showFooter == true) {
            	this.modalFooterHide = false;
            	this.modalTitle = '审核';
      } else {
            	// 屏蔽 确定按钮
            	this.modalFooterHide = true;
            	this.modalTitle = '查看';
      }
    },
    // 打开模态框
    openModal (row) {
        	this.modalShow = true;

    		// 重置表单
        	this.$refs.formValidate.resetFields();

        	this.modalTitle = '审核举报';

    		// 初始化表单数据
        	this.formItem.id = Number(row.id);
    		this.formItem.status = (row.status == 1);
    		this.formItem.adminRemark = row.admin_remark;
    },
    // 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	util.ajax.post(util.apiUrl.tipsOffUpdate, {
                		id: this.formItem.id,
                		status: (this.formItem.status == true ? 1 : 0),
            adminRemark: this.formItem.adminRemark
                	})
                	.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				// 初始化表数据
		    				this.pageTotal = Number(res.data.total);
		    				this.modalShow = false;

		    				this.$Message.success(res.message);
		    				this.$Notice.success({
			                    title: '操作成功',
			                    desc: res.message
			                });

                        	// 修改：更新data 数据即可,更新数据用 this.$set()
                        	this.$set(this.data[this.modalEditIndex], 'status', (this.formItem.status == true ? 1 : 0));
                        	this.$set(this.data[this.modalEditIndex], 'admin_remark', this.formItem.adminRemark);
		    			} else {
		    				this.modalShow = true;
                    		this.$Message.error(res.message);
                    		this.modalLoading = false;

	                        setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
		    			this.tableLoading = false;
            });
        } else {
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
          this.$Message.error('必填项不能为空！');
                	this.modalLoading = false;

          setTimeout(() => {
	                    this.modalLoading = true;
	                }, 50);
        }
          	});
    }
  },
  mounted () {
    this.init();
  }
};
</script>
