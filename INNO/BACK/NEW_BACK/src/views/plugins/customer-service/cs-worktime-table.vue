<style lang="less">
.cs-worktime-table{
}
</style>

<template>
	<div class="cs-worktime-table">
		<Card>
			<div class="table-topbar">
				<Form ref="formSearch" :model="formSearch" inline>
					<FormItem>
						<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
					</FormItem>
					<FormItem>
						客服人员：
						<Tag v-if="formSearch.workerSearchName!='' " closable @on-close="workerClose" size="large">{{formSearch.workerSearchName}}</Tag>
						<Button v-else @click="onSelectWorker">选择客服人员...</Button>
					</FormItem>
					<FormItem>
						<Button type="primary" icon="ios-search" @click="searchPage">搜索</Button>
					</FormItem>
				</Form>
			</div>

      <Tabs v-model="tabName" :animated="false" type="card">
      	<TabPane name="charts" label="图表">
          <!--echart 图表-->
          <div id="cs-h24time-charts" :style="{width: '100%', height: (tableHeight+45) +'px'}"></div>

          <!--echart 图表-->
          <div id="cs-workertime-charts" :style="{width: '100%', height: (tableHeight+45) +'px'}"></div>

        </TabPane>

        <TabPane name="tables" label="报表">
          <!--按时段的表报已经关闭-->
          <template v-if="0">
          <Row type="flex" style="margin-bottom: 10px;">
          	<Col style="flex:1 1 0%;">
          		按时段分-接待统计报表
          	</Col>
          	<Col style="width:200px;text-align: right;">
          		<Button v-if="canExport" type="warning" icon="md-arrow-round-down" @click="exportExcel('hour')">导出</Button>
          	</Col>
          </Row>
          <!--统计表报-->
          <Table :loading="tableLoading" :columns="columns3" :data="data3"></Table>

          <Divider />
          </template>

          <Row type="flex" style="margin-bottom: 10px;">
          	<Col style="flex:1 1 0%;">
          		按客服人员分-接待统计报表
          	</Col>
          	<Col style="width:200px;text-align: right;">
          		<Button v-if="canExport" type="warning" icon="md-arrow-round-down" @click="exportExcel('worker')">导出</Button>
          	</Col>
          </Row>

          <!--统计表报-->
          <Table :loading="tableLoading" row-key="name" :columns="columns2" :data="data2"></Table>

        </TabPane>
        <TabPane name="list" label="明细">
        	<Row type="flex" style="margin-bottom: 10px;">
        		<Col style="flex:1 1 0%;">
        			明细列表
        		</Col>
        		<Col style="width:200px;text-align: right;">
        			<Button v-if="canExport" type="warning" icon="md-arrow-round-down" @click="exportExcel('table')">导出</Button>
        		</Col>
        	</Row>

        	<!--列表-->
        	<Table :loading="tableLoading" :columns="columns" :data="data"></Table>
        	<div v-show="pageTotal>0" class="table-pager-footer">
        		<div style="float: right;">
        			<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
        		</div>
        	</div>
        </TabPane>
      </Tabs>
    </Card>

		<!--选择在线客服-->
		<csWorkerSelect ref="cs-worker-select" :canSelectAll="true" @on-ok="onSelectOk"></csWorkerSelect>

		<!--异步处理导出excel组件-->
		<mqNotice ref="mq-notice"></mqNotice>

		<!--加载提示-->
		<Spin size="large" fix v-if="tableLoading"></Spin>
	</div>
</template>

<script>
import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
import mqNotice from '@/views/my-components/mq-notice/mq-notice';
import DateSelect from '@/views/my-components/date-select/index.vue';
import echarts from 'echarts';

/**
 * 客服工作时间统计
 */
export default {
	name:"csWorktimeTable",
    components: {
		csWorkerSelect,
		mqNotice,
		DateSelect,
	},
	data () {
	    return {
			columns:[],
			data:[],
      columns2:[],
      data2:[],
      columns3:[],
      data3:[],

			tableHeight: 500,
			tableLoading: false,
			pageTotal: 0,
			pageSize: 30,
			canExport: false,
      tabName: 'charts',

			adminUserList: [],
			formSearch:{
				searchq:'',
				searchTime:[],
				workerSearchId: '',
				workerSearchName:'',
			},
		}
	},
	methods: {
		init(){
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 505;
			this.tableHeight = this.tableHeight < 450 ? 450 : this.tableHeight;

			// 默认是选中一个月
			this.$refs['dateSelect'].handleOrderDay('month');

			this.initData();
		},
		initData(){

			this.tableLoading = true;
			// ajax 请求获取初始化数据，
			this.$ajax.post( this.$api.csWorkTimeList, {
				isInit: 1,
				searchTime: this.formSearch.searchTime,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){
					// 初始化表头
			    this.initColumn( res );
					this.initColumn2( res );
          this.initColumn3( res );

					// 初始化表数据
					this.data = res.data.items;
          this.data2 = res.data.items2;
          this.data3 = res.data.items3;

					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
					this.canExport = res.data.canExport;

					// 更新 echarts
					this.initChartsH24( res.data.option24Hour );
					this.initChartsWorker( res.data.optionWorker );
				}
			});
		},
		// 初始化表头
		initColumn( res ){
			this.columns = res.data.columns;

			// 客服头像
			this.columns[ 0 ]['render']= (h, params) => {
				return h('Row', {
						props: {
							type:"flex",
							justify:"start",
						}
					},[
					h('Col', {
							style:{
								width: '40px',
							}
						},
						[h('Avatar', {
				            props: {
				                src: params.row.get_worker_info.avatar_format,
				                icon:'md-person',
				            },
				            style:{
				            	marginRight:'10px',
				            	marginTop:'10px',
				            	marginBottom:'10px',
				            },
				    	}),
				    ]),
				    h('Col', {
				    	style:{
				    		padding:'8px 5px 5px 0px',
				    		flex: '1 1 0%',
				    	}},
				    	[h('div', {
				        	style:{
				        		fontWeight: 'blod',
				        		overflow: 'hidden',
								display: '-webkit-box',
								'-webkit-line-clamp': 1,
								'-webkit-box-orient': 'vertical',
								wordBreak: 'break-all',
								overflow: 'hidden',
								textOverflow:'ellipsis',
								whiteSpace: 'nowrap',
								lineHeight: 3
				        	}
				        }, params.row.get_worker_info.nick_name ),
				    ]),
				]);
			};

			// 客户头像
			this.columns[ 2 ]['render']= (h, params) => {
				return h('Row', {
						props: {
							type:"flex",
							justify:"start",
						}
					},[
					h('Col', {
							style:{
								width: '40px',
							}
						},
						[h('Avatar', {
				            props: {
				                src: params.row.get_user_info.wx_avatar,
				                icon:'md-person',
				            },
				            style:{
				            	marginRight:'10px',
				            	marginTop:'10px',
				            	marginBottom:'10px',
				            },
				    	}),
				    ]),
				    h('Col', {
				    	style:{
				    		padding:'8px 5px 5px 0px',
				    		flex: '1 1 0%',
				    	}},
				    	[h('div', {
				        	style:{

				        	}
				        }, params.row.get_user_info.wx_nick_name ),
				    ]),
				]);
			};

			// 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
			    var buttons = [];
				buttons.push(
					h('span',
						{
							attrs:{
								title:'查看聊天记录'
							}
						},
						[ h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									this.$store.commit('setSelectedCsSession', {
										id: params.row.id,
										user_id: params.row.get_user_info.id,
										in_history: true,
										get_user_info: params.row.get_user_info,
										get_session_info:{
											id: params.row.id,
											worker_id: params.row.get_worker_info.id,
										}
									});

									this.$router.push('/plugins/cs-session');
								}
							}
						}, '查看聊天记录') ]
					)
				);

				return h('div',buttons);
			};
		},
    // 初始化表头（按客服人员分-接待统计报表）
    initColumn2( res ){
    	this.columns2 = res.data.columns2;

      this.columns2[ 0 ]['render']= (h, params) => {
        return h('span', {}, params.row.get_worker_info.nick_name
        + ( params.row.get_worker_info.get_admin_info != null ? "("+ params.row.get_worker_info.get_admin_info.user_name +")" : '' ) );
      };

    },
    // 初始化表头
    initColumn3( res ){
    	this.columns3 = res.data.columns3;
    },
		// 初始化图表
		initChartsH24( option ){
			this.$nextTick( ()=> {
				const myChart = echarts.init( document.getElementById('cs-h24time-charts') );
			    myChart.setOption( option );
			});
		},
		initChartsWorker( option ){
			this.$nextTick( ()=> {
				const myChart2 = echarts.init( document.getElementById('cs-workertime-charts') );
			    myChart2.setOption( option );
			});
		},
		// 选择日期的回调
		handleStart( date ){
			this.$set( this.formSearch.searchTime, 0, date);
		},
		handleEnd( date ){
			this.$set( this.formSearch.searchTime, 1, date);
		},
		// 切换分页
		changePage ( page ) {

			this.tableLoading = true;
		    // ajax 请求获取数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.csWorkTimeList, {
				searchq: this.formSearch.searchq,
				searchWorkerId: (this.formSearch.workerSearchId !='' ? this.formSearch.workerSearchId : ''),
				searchTime: this.formSearch.searchTime,
				page:page,
			})
			.then( (response) => {
				var res = response.data;
				this.tableLoading = false;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;

					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}
			});
		},
		// 搜索
		searchPage(){
			this.tableLoading = true;
			// ajax 请求获取数据，
			this.$ajax.post( this.$api.csWorkTimeList, {
				searchq: this.formSearch.searchq,
				searchWorkerId: (this.formSearch.workerSearchId !=''  ? this.formSearch.workerSearchId : ''),
				searchTime: this.formSearch.searchTime,
			})
			.then( (response) => {
				var res = response.data;
				this.tableLoading = false;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
          this.data2 = [];
          setTimeout(()=>{
            // 这里有个大坑，必须延迟赋值，否则会报错
            this.data2 = res.data.items2;
          }, 2000);
          this.data3 = res.data.items3;

					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );

					// 更新 echarts
					this.initChartsH24( res.data.option24Hour );
					this.initChartsWorker( res.data.optionWorker );
				}
			});
		},
		// 清除选中的客服人员
		workerClose(){
			this.formSearch.workerSearchName = '';
			this.formSearch.workerSearchId = 0;

			this.$nextTick(()=>{
				this.searchPage();
			});
		},
		// 打开客服选择器
		onSelectWorker(){
			this.$refs['cs-worker-select'].openModal( [], 'radio' );
		},
		// 选管客服的组件的 回调
		onSelectOk( items ){
			if( items.length > 0 ){
				this.$set( this.formSearch, 'workerSearchId', items[0]['id'] );
				this.$set( this.formSearch, 'workerSearchName', items[0]['nick_name'] );
			}
		},
		// 导出excel
		exportExcel( type ){
			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.csWorkTimeExport, {
				worker_id: (this.formSearch.workerSearchId !=''  ? this.formSearch.workerSearchId : ''),
				searchTime: this.formSearch.searchTime,
				type: type,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				if( res.code ){
					var jobId = res.data;
					// 打开异步提示组件
					this.$refs['mq-notice'].showNotice( jobId );
				}
			});
		},
	},
	mounted () {
	    this.init();
	},
}
</script>
