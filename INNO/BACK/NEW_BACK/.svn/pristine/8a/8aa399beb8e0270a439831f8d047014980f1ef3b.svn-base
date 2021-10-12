<style lang="less">
.table-topbar{
    .ivu-form-item{
        margin-bottom: 10px;
    }
    .ivu-input-icon-clear{
		right:50px;
	    }
}
.article-list-noshow-footer .ivu-modal-footer{
    display: none;
}
.article-form{
	.ivu-select-dropdown{
		z-index: 1000;
	}
}
</style>

<template>
	<div class="article-page">
		<div class="table-topbar">
	    	<Row>
		        <Col span="20">
		        	<Form ref="formSearch" :model="formSearch" inline>
		        		<FormItem>
				            <Input v-model="formSearch.searchq" placeholder="文章标题 模糊查询" clearable search enter-button
					    @on-search="searchPage"
					    @on-clear="searchPage"
					    @keydown.native.enter.prevent ="searchPage"></Input>
				        </FormItem>
		        	</Form>
		        </Col>
		        <Col span="4">
		        	<Button type="info" icon="md-add" @click="openModal" style="float:right" v-if="canCreate">添加文章</Button>
		        </Col>
		    </Row>
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
	        :styles="{top:'20px'}"
	        :class="modalClass"
	        :width="700"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80" class="article-form">

		        <FormItem label="文章标题" prop="articleTitle">
		            <Input v-model="formItem.articleTitle" placeholder="请输入文章标题"></Input>
		        </FormItem>
		        <FormItem label="文章分类" prop="catId">
		            <Select v-model="formItem.catId" placeholder="请选择文章分类" :clearable="true" ref="formCatId">
		                <Option v-for="(cat,key) in catList" :name="key" :key="key" :value="key">{{cat.title}}</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="是否发布">
		            <i-switch v-model="formItem.articleStatus" size="large">
		                <span slot="open">发布</span>
		                <span slot="close">编辑中</span>
		            </i-switch>
		        </FormItem>

		        <UEditor ref="ueditor"></UEditor>
	        </Form>
	    </Modal>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import UEditor from '../../my-components/ueditor/ueditor.vue';

export default {
  components: {
    UEditor
  },
  data () {
        	return {
        		columns: [],
            	data: [],
            	tableHeight: 500,
            	tableLoading: false,
            	pageTotal: 0,
            	pageSize: 20,
            	canCreate: true,
            	catList: [],

            	// 搜索表单
            	formSearch: {
            		searchq: ''
            	},

            	// ueditor 配置
            	ueditorConfig: {
            		initialFrameWidth: 670,
          			initialFrameHeight: 320,
          			// 图片上传接口(必须初始会的)
          			serverUrl: ''
            	},

            	// 模态框
            	modalShow: false,
            	modalTitle: '',
            	modalLoading: true,
            	modalEditIndex: '',
            	modalClass: '',

            	// 表单内容
            	formItem: {
            		articleId: 0,
            		articleTitle: '',
            		articleContent: '',
            		articleCat: 1,
            		articleStatus: true,
            		catId: 0
            	},

            	// 表单数据规则
            	ruleValidate: {
        articleTitle: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
        catId: [{ required: true, message: '文章分类不能为空', trigger: 'blur' }]
            	}
        	}
  },
  methods: {
        	// 初始化方法
    init () {
            	// 动态计算表高度
            	this.tableHeight = document.body.clientHeight - 210;

      this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
            	util.ajax.post(util.apiUrl.articleList, {
            		isInit: 1
            	})
	    		.then((response) => {
          this.tableLoading = false;
	    			var res = response.data;

	    			if (res.code) {
	    				this.columns = res.data.columns;

	    				// 状态标识
	    				this.columns[(this.columns.length - 2)].render = (h, params) => {
              const row = params.row;
              const color = row.article_status == 1 ? 'green' : row.article_status == 0 ? 'red' : 'red';
              const text = row.article_status == 0 ? '编辑中' : row.article_status == 1 ? '发布' : '未知';

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
              if (params.row.handle.edit) {
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
                      this.editArticle(params.index, params.row, true)
                    }
                  }
                }, '编辑'));
              }
              if (params.row.handle.view) {
                // 查看按钮
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
                      this.viewArticle(params.index, params.row)
                    }
                  }
                }, '查看'));
              }
              if (params.row.handle.remove) {
                // 删除
                buttons.push(h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeArticle(params.index, params.row)
                    }
                  }
                }, '删除'));
              }
              return h('div', buttons);
            }

	    				// 初始化表数据
	    				this.data = res.data.items;
	    				this.pageTotal = Number(res.data.total);
	    				this.pageSize = Number(res.data.pageSize);
	    				this.canCreate = res.data.canCreate;
	    				this.catList = res.data.catList;
	    				this.ueditorConfig.serverUrl = res.data.uploadServer;

	    				// 配置加载完毕，才初始化 ueditor
            this.$refs.ueditor.init(this.ueditorConfig);
	    			}
        });
    },
    // 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
            	util.ajax.post(util.apiUrl.articleList, {
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
    // 搜索
    searchPage () {
            	this.tableLoading = true;
            	// ajax 请求获取数据，然后动态更新下面数据源
            	util.ajax.post(util.apiUrl.articleList, {
            		searchq: this.formSearch.searchq
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
    // 编辑按钮
    editArticle (index, row, showFooter) {
            	this.modalEditIndex = index;
            	// 打开编辑模态框
      this.openModal(row);

      if (showFooter == true) {
                	this.modalClass = '';
                	this.modalTitle = '修改文章';
      } else {
                	// 屏蔽 确定按钮
                	this.modalClass = 'article-list-noshow-footer';
                	this.modalTitle = '查看文章';
      }
    },
    // 查看按钮处理
    viewArticle (index, row) {
      this.editArticle(index, row, false);
    },
    // 删除文章
    removeArticle (index, row) {
            	this.$Modal.confirm({
        title: '删除文章',
        content: '确定删除文章吗？删除后不能恢复！确定吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
                    	this.tableLoading = true;
		            	// ajax 请求获取数据，然后动态更新下面数据源
		            	util.ajax.post(util.apiUrl.articleRemove, {
		            		articleId: row.id
		            	})
			    		.then((response) => {
			    			var res = response.data;
			    			if (res.code) {
			    				// 修改表数据
			    				this.pageTotal--;
			    				this.$delete(this.data, index);
			    				this.$Message.success(res.message);
			    			} else {
			    				this.$Message.error(res.message);
			    			}
			    			this.tableLoading = false;
            });
        }
      });
    },
    // 打开模态框
    openModal (row) {
            	this.modalShow = true;
        		// 重置表单
            	this.$refs.formValidate.resetFields();

        		// 初始化表单数据
            	// 如果是新增 roleId = 0;否则就是大于0
            	this.formItem.articleId = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
            	if (this.formItem.articleId == 0) {
            		this.modalTitle = '添加文章';
        			this.modalClass = '';

            		// 新建时候的初始化数据
            		this.formItem.articleTitle = '';
            		this.formItem.articleContent = '';
            		this.formItem.articleStatus = false;
            		this.formItem.catId = 0;

            		// 重设select 控件
            		window.setTimeout(() => {
            			this.$refs.formCatId.clearSingleSelect();
            		}, 500);
            	} else {
            		this.modalTitle = '修改文章';

            		// 编辑时候的初始化数据
            		this.formItem.articleTitle = row.article_title;
            		this.formItem.articleContent = row.article_content;
            		this.formItem.articleStatus = row.article_status == 1;
            		this.formItem.catId = row.cat_id;
            	}

        		// 让ueditor 加入编辑的内容
    			var ue = this.$refs.ueditor.getUE();
    			ue.setContent(this.formItem.articleContent);
    },
    // 模态框确认事件
    modalOk () {
            	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                    	// 获取组件的信息
          this.formItem.articleContent = this.$refs.ueditor.getUEContent();

                    	util.ajax.post((this.formItem.articleId == 0 ? util.apiUrl.articleAdd : util.apiUrl.articleEdit), {
                    		articleId: this.formItem.articleId,
                    		articleTitle: this.formItem.articleTitle,
                    		articleContent: this.formItem.articleContent,
                    		catId: this.formItem.catId,
                    		articleStatus: this.formItem.articleStatus
                    	})
                    	.then((response) => {
			    			var res = response.data;
			    			if (res.code) {
			    				// 初始化表数据
			    				this.pageTotal = Number(res.data.total);
			    				this.modalShow = false;

			    				this.$Message.success(res.message);

			    				if (this.formItem.articleId == 0) {
			                        // 新增： 给列表数组加入新数据
			                        this.data.unshift(res.data);
		                        } else {
		                        	// 修改：更新data 数据即可,更新数据用 this.$set()
		                        	this.$set(this.data, this.modalEditIndex, res.data);
		                        }
			    			} else {
			    				this.$Message.error(res.message);
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
}
</script>
