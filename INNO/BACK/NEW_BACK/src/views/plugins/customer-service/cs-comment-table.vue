<style lang="less">
.cs-comment-table{
	.table-topbar{
	    .ivu-input-icon-clear{
			right:50px;
		}
	}
}
</style>

<template>
	<div class="cs-comment-table">
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

			<Tabs v-model="tabName" :animated="false" type="card" @on-click="onTabsClick">
				<TabPane name="charts" label="图表">
					<!--echart 图表-->
					<div id="cs-comment-charts" :style="{width: '100%', height: (tableHeight+45) +'px'}"></div>

          <!--总率图表-->
          <div id="cs-comment-charts2" :style="{width: '100%', height:'400px'}"></div>
					<Divider />

					<div style="text-align:right;width:100%;margin-bottom:10px;">
						<Button v-if="canExport" type="warning" icon="md-arrow-round-down" @click="exportExcel('table')">导出</Button>
					</div>
					<!--列表-->
					<Table :loading="tableLoading0" :columns="columns0" :data="data0"></Table>
					<div v-show="pageTotal0>0" class="table-pager-footer">
						<div style="float: right;">
							<Page :total="pageTotal0" :page-size="pageSize" :current="1" @on-change="changePage0" show-total></Page>
						</div>
					</div>

				</TabPane>

				<TabPane name="table-list" label="明细记录">
					<div style="text-align:right;width:100%;margin-bottom:10px;">
						<Button v-if="canExport" type="warning" icon="md-arrow-round-down" @click="exportExcel('list')">导出</Button>
					</div>
					<!--列表-->
					<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
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
		<Spin size="large" fix v-if="tableLoading0 || tableLoading"></Spin>
	</div>
</template>

<script>
import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
import mqNotice from '@/views/my-components/mq-notice/mq-notice';
import DateSelect from '@/views/my-components/date-select/index.vue';
import echarts from 'echarts';

/**
 * 客服评价，统计图表
 */
export default {
    components: {
		csWorkerSelect,
		mqNotice,
		DateSelect,
    },
    data () {
        return {
			columns0:[],
			data0:[],
			addData0: [],
			tableLoading0: false,
			pageTotal0: 0,

			columns:[],
			data:[],
			tableHeight: 500,
			tableLoading: false,
			pageTotal: 0,
			pageSize: 30,
			canExport: false,
			commentLevel: 3,
			tabName: 'charts',
      totalCharts:{},

			adminUserList: [],
			formSearch:{
				searchq:'',
				searchTime:[],
				workerSearchId: '',
				workerSearchName:'',
			},
		}
	},
	methods:{
		init(){
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 305;
			this.tableHeight = this.tableHeight < 550 ? 550 : this.tableHeight;

			// 默认是选中一个月
			this.$refs['dateSelect'].handleOrderDay('month');

			this.initData0();
			this.initData();
		},
		initData0(){
			this.tableLoading0 = true;
			// ajax 请求获取初始化数据，
			this.$ajax.post( this.$api.csCommentSumaryTable, {
				isInit: 1,
				searchTime: this.formSearch.searchTime,
			})
			.then( (response) => {
				this.tableLoading0 = false;
				var res = response.data;

				if( res.code ){
					// 初始化表头
			        this.initColumn0( res );

					// 初始化表数据
					this.allData0 = res.data.items;
					this.canExport = res.data.canExport;
					this.commentLevel = res.data.commentLevel;
					this.pageTotal0 = res.data.total;
          this.totalCharts = res.data.totalCharts;
					this.getCurrPageData(1);

					// 更新echart
					this.initCharts();
				}

			});
		},
		// 初始化表头
		initColumn0( res ){
			this.columns0 = res.data.columns;

			// 操作按钮
			this.columns0[ (this.columns0.length-1) ]['render'] = (h, params) => {
			    var buttons = [];
				buttons.push(
					h('span',
						{
							attrs:{
								title:'查看'
							}
						},
				        [ h('span', {
				            class:'table-handle-button',
				            on: {
				                click: () => {
				                    this.viewDateTable(params.index, params.row)
				                }
				            }
				        }, '查看') ]
					)
				);

				return h('div',buttons);
			};
		},
		initData(){

			this.tableLoading = true;
			// ajax 请求获取初始化数据，
			this.$ajax.post( this.$api.csCommentSumaryList, {
				isInit: 1,
				searchTime: this.formSearch.searchTime,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){
					// 初始化表头
			        this.initColumn( res );

					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
					this.canExport = res.data.canExport;
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
								lineHeight: 1.5
				        	}
				        }, params.row.get_worker_info.nick_name ),
                h('div', {
                	style:{
                		display: '-webkit-box',
                		'-webkit-line-clamp': 1,
                		'-webkit-box-orient': 'vertical',
                		wordBreak: 'break-all',
                		overflow: 'hidden',
                		textOverflow:'ellipsis',
                		whiteSpace: 'nowrap',
                		lineHeight: 1.5
                	}
                }, params.row.get_worker_info.get_admin_info != null ? params.row.get_worker_info.get_admin_info.user_name : ' - ' ),
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
								title:'查看'
							}
						},
				        [ h('span', {
				            class:'table-handle-button',
				            on: {
				                click: () => {
				                    this.viewWorkerTable(params.index, params.row)
				                }
				            }
				        }, '查看') ]
					)
				);

				return h('div',buttons);
			};
		},
		onTabsClick( name ){
			if( name == 'charts' ){
				// 初始化图表
				this.initCharts();
			}
		},
		// 选择日期的回调
		handleStart( date ){
			this.$set( this.formSearch.searchTime, 0, date);
		},
		handleEnd( date ){
			this.$set( this.formSearch.searchTime, 1, date);
		},
		// 初始化图表
		initCharts(){
			// 初始化数据
			var legendData = [];
			var dataSet = {};
			var pieRate = [];

			switch( this.commentLevel ){
				case '3':
					dataSet = {
						source: [
							['日期'],['1星'],['2星'],['3星']
						],
					};
					legendData = [ '1星', '2星', '3星'];
					break;

				case '4':
					dataSet = {
						source: [
							['日期'],['1星'],['2星'],['3星'],['4星']
						],
					};
					legendData = [ '1星', '2星', '3星', '4星'];
					break;

				case '5':
					dataSet = {
						source: [
							['日期'],['1星'],['2星'],['3星'],['4星'],['5星']
						],
					};
					legendData = [ '1星', '2星', '3星', '4星', '5星' ];
					break;
			}

			// 遍历写入数据
			for(var i in this.data0 ){
				pieRate.push([
					{name:'发出评价',value: this.data0[i].sum_req_comment_count },
					{name:'收到评价',value: this.data0[i].sum_get_comment_count }
				]);

				dataSet.source[0].splice( 1, 0, this.data0[i].op_date );
				dataSet.source[1].splice( 1, 0, this.data0[i].sum_score_one_count );
				dataSet.source[2].splice( 1, 0, this.data0[i].sum_score_two_count );
				dataSet.source[3].splice( 1, 0, this.data0[i].sum_score_three_count );
				if( this.commentLevel == 4 ){
					dataSet.source[4].splice( 1, 0, this.data0[i].sum_score_four_count );
				}
				if( this.commentLevel == 5 ){
					dataSet.source[5].splice( 1, 0, this.data0[i].sum_score_five_count );
				}
			}

			this.$nextTick( ()=> {
				const myChart = echarts.init( document.getElementById('cs-comment-charts') );
        const myChart2 = echarts.init( document.getElementById('cs-comment-charts2') );

			    const option = {
					// 指示条
			        legend: [],
					toolbox:{
						feature:{
							// 下载按钮
							saveAsImage:{}
						}
					},
					title:{
						text: ( this.formSearch.workerSearchName != '' ? this.formSearch.workerSearchName+'-' : '全部客服-')
							+ this.formSearch.searchTime[0] + '~'+ this.formSearch.searchTime[1] + '-统计图表',
						x:'center',
						y:'top',
					},
			        tooltip: {
			            trigger: 'axis',
			            showContent: false,
			        },
					dataset: dataSet,
					/*这里保留配置demo
			        dataset: {
			            source: [
							// 第一行是x轴
			                ['日期', '2012', '2013', '2014', '2015', '2016', '2017'],

							// 第二行开始是维度数据
			                ['1星', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
			                ['2星', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
			                ['3星', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
			            ]
			        },*/
					// x 轴
			        xAxis: {type: 'category', gridIndex: 0},
					// y 轴
			        yAxis: {gridIndex: 0},
			        grid: {top: '55%'},
			        series: [
			            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
			            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
			            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
			            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
						{type: 'line', smooth: true, seriesLayoutBy: 'row'},

						// 发出数 和 收到数
						{
						    type: 'pie',
						    id: 'pie0',
						    radius: ['20%', '30%'],
						    center: ['25%', '25%'],
						    label: {
						        formatter: '{b}: {@0} ({d}%)'
						    },
							data: pieRate[0],
						},

						// 1-5星比率
			            {
			                type: 'pie',
			                id: 'pie',
			                radius: '30%',
			                center: ['75%', '25%'],
			                label: {
			                    formatter: '{b}: {@0} ({d}%)'
			                },
			                encode: {
			                    itemName: '日期',
			                    value: dataSet.source[0][1],
			                    tooltip: dataSet.source[0][1],
			                },
			            }
			        ]
			    };

				// 事件
			    myChart.on('updateAxisPointer', (event) => {
			        var xAxisInfo = event.axesInfo[0];
			        if (xAxisInfo) {
			            var dimension = xAxisInfo.value + 1;

						// 动态修改 图表的数据
			            myChart.setOption({
			                series: [{
			                    id: 'pie',
			                    label: {
			                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
			                    },
			                    encode: {
			                        value: dimension,
			                        tooltip: dimension
			                    }
			                },
							{
							    id: 'pie0',
								data: pieRate[ (dimension-1) ],
							}]
			            });
			        }
			    });

			    myChart.setOption( option );
          myChart2.setOption( this.totalCharts );

			});
		},
		// 获取数组分页的数据(作为数组分页，可以作为案例)
		getCurrPageData( page ){
			this.data0 = [];
			for(var i=0; i< this.pageSize; i++){
				if( typeof( this.allData0[ this.pageSize * (page-1) + i ] ) != 'undefined' ){
					this.$set( this.data0, i , this.allData0[ this.pageSize * (page-1) + i ] );
				}
			}
		},
		// 分页
		changePage0 ( page ){
			this.getCurrPageData( page );
		},
		// 切换分页
		changePage ( page ) {

			this.tableLoading = true;
		    // ajax 请求获取数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.csCommentSumaryList, {
				searchq: this.formSearch.searchq,
				searchWorkerId: (this.formSearch.workerSearchId !='' ? this.formSearch.workerSearchId : ''),
				searchTime: this.formSearch.searchTime,
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
		// 搜索日志
		searchPage(){

			this.tableLoading = true;
			// ajax 请求获取数据，
			this.$ajax.post( this.$api.csCommentSumaryList, {
				searchq: this.formSearch.searchq,
				searchWorkerId: (this.formSearch.workerSearchId !=''  ? this.formSearch.workerSearchId : ''),
				searchTime: this.formSearch.searchTime,
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

			this.tableLoading0 = true;
			// ajax 请求获取数据，
			this.$ajax.post( this.$api.csCommentSumaryTable, {
				searchq: this.formSearch.searchq,
				searchWorkerId: (this.formSearch.workerSearchId !=''  ? this.formSearch.workerSearchId : ''),
				searchTime: this.formSearch.searchTime,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.data0 = res.data.items;

					// 更新 echarts
					this.initCharts();
				}

				this.tableLoading0 = false;
			});
		},
		// 查看详情
		viewInfo(index, row ){
			this.$route.push('/plugins/cs-comment-table-info');
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
			this.$ajax.post( this.$api.csCommentSumaryExport, {
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
		// 查看客服的表单
		viewWorkerTable(index, row){
			this.formSearch.workerSearchId = row.get_worker_info.id;
			this.formSearch.workerSearchName = row.get_worker_info.nick_name;

			this.tabName = 'charts';
			this.searchPage();
		},
		// 查看日期下的表单
		viewDateTable(index, row){
			this.$refs['dateSelect'].handleOrderDay('custom', [row.op_date+' 00:00:00', row.op_date+' 23:59:59'] );

			this.searchPage();
		}
	},
	mounted () {
	    this.init();
	},
}
</script>
