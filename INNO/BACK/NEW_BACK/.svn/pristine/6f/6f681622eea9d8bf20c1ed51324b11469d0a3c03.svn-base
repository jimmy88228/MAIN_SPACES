<style lang="less">
.cs-blackbook-list{
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
	<Card class="cs-blackbook-list">
		<div class="table-topbar">
      <Row style="display:flex;">
          <Col style="flex:1 1 0%;">
        	<Form ref="formSearch" :model="formSearch" inline>
		        <FormItem>
              用户：
              <Tag v-if="formSearch.userSearchName!='' " closable @on-close="userClose" size="large">{{formSearch.userSearchName}}</Tag>
              <Button v-else @click="onSelectUser">请选择用户...</Button>
		        </FormItem>
		        <FormItem>
              <Input v-model="formSearch.searchq" style="width:300px;" placeholder="" clearable search enter-button
              @on-search="searchPage"
              @on-clear="searchPage"
              @keydown.native.enter.prevent ="searchPage">
                	<Select v-model="formSearch.searchqType" slot="prepend" style="width:100px">
                    <Option value="nickName">用户昵称</Option>
                  </Select>
                </Input>
		        </FormItem>
        	</Form>
          </Col>
          <Col style="width:170px;text-align: right;">
            <Button v-if="canCreate" type="info" icon="md-add" @click="addBlackbook">添加黑名单</Button>
			<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
          </Col>
      </Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" class="table-pager-footer">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

	   	<!--选择用户-->
	   	<userSelect ref="user-select" :canSelectAll="true" @on-ok="onSelectOk"></userSelect>

      <!--添加黑名单表单-->
      <csBlackBookForm ref="cs-blackbook-form" @on-success="init"></csBlackBookForm>
	</Card>
</template>

<script>
import csBlackBookForm from './cs-blackbook-form.vue';
import userSelect from '@/views/my-components/user-select/user-select';

export default {
    components: {
        csBlackBookForm,
        userSelect,
    },
    data () {
        return {
        	columns:[],
        	data:[],
        	tableHeight: 500,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 20,
          canCreate: false,

        	adminUserList: [],
        	formSearch:{
        		searchq:'',
        		searchqType:'nickName',
        		// 搜索管理员关键词
        		userSearch:'',
        		userSearchId: '',
        		userSearchName:'',
        	}

        }
    },
    methods:{
    	init () {
    		// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 200;

			this.tableLoading = true;
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.csBlackBookList, {
        		isInit: 1,
        	})
    		.then( (response) => {
				this.tableLoading = false;
    			var res = response.data;

    			if( res.code ){
					// 初始化表头
                    this.initColumn( res );

    				// 初始化表数据
    				this.data = res.data.items;
            this.canCreate = res.data.canCreate;
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    			}

			});
        },
		// 初始化表头
		initColumn( res ){
			this.columns = res.data.columns;

			// 用户头像
			this.columns[ 0 ]['render']= (h, params) => {
			    return h('div', [
			        h('Avatar', {
			            props: {
			                src: params.row.avatar,
			                icon:'md-person',
			            },
			            style:{
			            	marginRight:'5px'
			            },
			        }),
			        h('strong', {
			        	style:{
			        		overflow: 'hidden',
							textOverflow:'ellipsis',
							whiteSpace: 'nowrap',
			        	}
			        },params.row.nick_name)
			    ]);
			};

			// 状态
			this.columns[ (this.columns.length-4) ]['render'] = (h, params) => {
			    const row = params.row;
			    const color = row.type == 0 ? 'error' : 'warning';
			    const text = row.type == 0 ? '永久' : row.hours;

				return h('Tag', {
				    props: {
				        color: color
				    },
				}, text);
			};

			// 操作按钮
			this.columns[ (this.columns.length-1) ]['render']= (h, params) => {
				var buttons = [];
				buttons.push(
					h('span',
						{
							attrs:{
								title:'从黑名单中移除'
							}
						},
						[ h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									this.removeBlackbook( params.index, params.row );
								}
							}
						}, '移除') ]
					)
				);
				return h('div',buttons);
			};
		},
        // 切换分页
        changePage ( page ) {

			this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.csCommentLogList, {
        		searchq: this.formSearch.searchq,
        		search_user_id: (this.formSearch.userSearchId !='' ? this.formSearch.userSearchId : ''),
        		page:page,
        	})
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ){
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    			}

    			this.tableLoading = false;
			});

        },
        // 搜索
        searchPage(){

        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.csBlackBookList, {
        		searchq: this.formSearch.searchq,
        		search_user_id: (this.formSearch.userSearchId !=''  ? this.formSearch.userSearchId : ''),
        	})
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ){
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    			}

    			this.tableLoading = false;
			});
        },
      // 添加黑名单
      addBlackbook(){
        this.$refs['cs-blackbook-form'].openModal({user_id:0});
      },
      // 移除黑名单
      removeBlackbook(index,row){
        this.$Modal.confirm({
            title: '操作提示',
            content: '确定把用户移出黑名单吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.tableLoading = true;
                // ajax 请求获取数据，然后动态更新下面数据源
                this.$ajax.post( this.$api.csBlackBookRemove, {
                  user_id: row.user_id,
                })
              .then( (response) => {
                var res = response.data;
                if( res.code ){
                  this.$delete( this.data, index );
                  this.pageTotal --;
                }

                this.tableLoading = false;
              });
            },
         });
      },
      // 清除选中的用户
      userClose(){
      	this.formSearch.userSearchName = '';
      	this.formSearch.userSearchId = 0;

        this.init();
      },
      // 打开用户选择器
      onSelectUser(){
      	this.$refs['user-select'].openModal( [], 'radio' );
      },
      // 选用户的组件的 回调
      onSelectOk( items ){
      	if( items.length > 0 ){console.log( items );
      		this.$set( this.formSearch, 'userSearchId', items[0]['id'] );
      		this.$set( this.formSearch, 'userSearchName', items[0]['wx_nick_name']+'/'+items[0]['real_name'] );
      	}
      },
    },
    mounted () {
        this.init();
    },
};
</script>
