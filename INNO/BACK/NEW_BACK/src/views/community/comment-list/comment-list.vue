<style lang="less">
.comment-list{
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
	<div class="comment-list">
		<div class="table-topbar">
	    	<Row>
		        <Col span="20">
		        	<Form ref="formSearch" :model="formSearch" inline>
		        		<FormItem v-show="sourceId>0">
						<Tooltip content="返回">
						<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
					</Tooltip>
		        		</FormItem>
		        		<FormItem>
		        			<Select v-model="formSearch.status" placeholder="评论状态" style="width:130px" clearable>
		        				<Option value="-1">不限状态</Option>
						        <Option v-for="(item, key) in typeList" :value="key" :key="key">{{ item }}</Option>
						    </Select>
				        </FormItem>
				        <FormItem>
				        	<DatePicker v-model="formSearch.searchTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="评论时间" style="width:255px"></DatePicker>
				        </FormItem>
						<FormItem>
							<Input v-model="formSearch.searchq" placeholder="模糊搜索 关键词" style="width:180px" clearable search enter-button
							@on-search="searchPage"
							@on-clear="searchPage"
							@keydown.native.enter.prevent ="searchPage"></Input>
						</FormItem>
		        	</Form>
		        </Col>
		        <Col span="4"></Col>
		    </Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

	    <!--审核表单组件-->
	    <commentForm ref="comment-form" @on-success="onFormSuccess"></commentForm>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import commentForm from './comment-form.vue';

export default {
  components: {
    	commentForm
  },
  data () {
    return {
        	// 列表
        	columns: [],
        	data: [],
        	tableHeight: 500,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 20,

        	typeList: [],

        	// 搜索表单
        	formSearch: {
        		searchq: ''
        	},

        	editIndex: 0,

        	sourceId: 0,
        	sourceType: ''
    }
  },
  methods: {
    	// 初始化方法
    init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 170;

        	this.tableLoading = true;

        	// 获取传递过来的参数
      this.sourceId = this.$route.params.id;
      this.sourceType = this.$route.params.type;

      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.commentList, {
        		isInit: 1,
        		sourceId: this.sourceId,
        		sourceType: this.sourceType
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
    				this.pageSize = Number(res.data.pageSize);

    				this.typeList = res.data.typeList;
    			}
        });
    },
    // 初始化表
    initTable (res) {
        	this.columns = res.data.columns;

        	// 头像
      this.columns[1].render = (h, params) => {
        return h('div', [
          h('Avatar', {
            props: {
              src: params.row.wx_avatar,
              icon: 'md-person',
              size: 'large'
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
          }, params.row.name + (params.row.wx_nick_name != null ? (' / ' + params.row.wx_nick_name) : ''))
        ]);
      };

      // 评论内容
      this.columns[2].render = (h, params) => {
        return	h('div', {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, params.row.content);
      };

      // 状态标识
      this.columns[(this.columns.length - 2)].render = (h, params) => {
        const row = params.row;
        const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : (row.status == 3 ? 'warning' : 'error');
        const text = row.status_format;

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
        if (params.row.handle.edit && (params.row.status == 0 || params.row.status == 3)) {
                	// 审核按钮
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
                this.editComment(params.index, params.row)
              }
            }
          }, '审核'));
        }
        if (params.row.handle.remove && params.row.status != 2) {
          // 删除
          buttons.push(h('Button', {
            props: {
              type: 'error',
              size: 'small'
            },
            style: {
                        	marginRight: '5px'
            },
            on: {
              click: () => {
                this.removeComment(params.index, params.row)
              }
            }
          }, '删除'));
        }
        return h('div', buttons);
      }
    },
    // 编辑评论
    editComment (index, row) {
        	this.editIndex = index;
        	this.$refs['comment-form'].openModel(row);
    },
    // 删除评论
    removeComment (index, row) {
        	this.$Modal.confirm({
        title: '删除评论',
        content: '确定删除评论吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
	        	this.tableLoading = true;

	            // ajax 请求获取数据，然后动态更新下面数据源
	        	util.ajax.post(util.apiUrl.commentRemove, {
	        		id: row.id
	        	})
	    		.then((response) => {
	    			var res = response.data;
	    			this.tableLoading = false;

	    			if (res.code) {
	    				// 初始化表数据
	    				this.$set(this.data[index], 'status', 2);
	    				this.$set(this.data[index], 'status_format', '已删除');
	    				this.$Message.success(res.message);
	    			} else {
	    				this.$Message.error(res.message);
	    			}
            });
        }
      });
    },
    // 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.commentList, {
        		page: page,
        		sourceId: this.sourceId,
        		sourceType: this.sourceType
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
        	util.ajax.post(util.apiUrl.commentList, {
        		searchq: this.formSearch.searchq,
        		status: this.formSearch.status,
        		sourceId: this.sourceId,
        		sourceType: this.sourceType
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
    // 表单的回调
    onFormSuccess (obj) {
        	for (var k in obj) {
        		this.$set(this.data[this.editIndex], k, obj[k]);
        	}
    },
    // 返回列表
    goBack () {
        	this.$router.back();
    }
  },
  mounted () {
    this.init();
  }
}
</script>
