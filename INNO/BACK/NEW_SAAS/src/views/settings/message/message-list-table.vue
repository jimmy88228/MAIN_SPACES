<style lang="less">
.message-list-table{
	.table-bg-image{
    	background-size:100% auto !important;
    }
}
</style>

<template>
	<div class="message-list-table">
		<div v-show="showList">
			<!--搜索表单-->
			<searchForm @on-search="searchPage"></searchForm>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin:10px 10px 0 10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		   	</div>
	   	</div>

	   	<!--消息查看组件-->
	   	<messageView ref="message-view" @on-close="closeMessageView"></messageView>
	</div>
</template>

<script>
/**
 * 设备列表
 */
import util from '@/libs/util.js';
import searchForm from './search-form';
import messageView from './message-view';

export default {
  name: 'messageListTable',
  components: {
    searchForm,
    messageView
  },
  props: {
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

        	showList: true,

        	// 列表类型
        	listType: '',
        	currIndex: 0
    	}
   	},
   	methods: {
    	// 初始化
    	init () {
      // 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 245;
    	},
    	// 初始化 加载数据，（不会自动加载，而是父组件触发加载）
    	initData (type) {
    		this.listType = type;

    		this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.userMessageList, {
        		isInit: 1,
        		type: this.listType
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
    			}
        });
    	},
    	// 表头初始化
    	initTable (res) {
    		// 通知能否创建商品
    		this.columns = res.data.columns;

    		// 是否已读状态标识
      this.columns[2].render = (h, params) => {
        const row = params.row;
        const color = row.is_read == 1 ? '' : 'success';
        const text = row.is_read == 1 ? '已读' : '未读';

        return h('Tag', {
          props: {
            type: 'dot',
            color: color
          }
        }, text);
      };

           	// 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
                var buttons = [];
                
            	// 查看按钮
            	buttons.push( 
                	h('Tooltip', {	
                			props:{
                				placement:'top',
                				content:'查看'
                			}
                		},
	                    [ h('Icon', {
	                        props: {
	                            type: 'ios-eye-outline',
	                            size: '28'
	                        },
	                        style: {
	                            marginRight: '5px',
	                            cursor: 'pointer',
	                        },
	                        on: {
	                            click: () => {
	                                this.messageView(params.index, params.row)
	                            }
	                        }
	                    }) ]
                	) 
               	);

        return h('div', buttons);
      };
    	},
    	// 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.userMessageList, {
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
    // 搜索 - 回调函数
    searchPage (searchForm) {
        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.userMessageList, searchForm)
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
    // 查看消息
    messageView (index, row) {
        	this.currIndex = index;
        	this.showList = false;
        	this.$refs['message-view'].openModal( row, this.listType );
        },
		// 关闭消息预览
		closeMessageView( isRead, isUpdate ){
			this.showList = true;
			this.$set( this.data[ this.currIndex ], 'is_read', isRead);
			
			if( isRead == 1 && isUpdate ){
				var itemCount = this.$store.state.app.messageItemCount;
				var allCount = itemCount.all -1;
				
				var newIitemCount = {
					all: allCount,
					notifications: ( this.listType == 'notifications' ? itemCount.notifications -1 : itemCount.notifications ),
					notices: ( this.listType == 'system_notices' ? itemCount.notices -1 : itemCount.notices ),
					messages: ( this.listType == 'private_messages' ? itemCount.messages -1 : itemCount.messages ) ,
				};
				this.$store.commit('setMessageCount', allCount );
				this.$store.commit('setMessageItemCount', newIitemCount );
			}
			document.querySelector('.message-list .ivu-tabs-bar').style.display = 'block';
		},
    },
    watch: {

  },
  mounted () {
    	this.init();
  }
}
</script>
