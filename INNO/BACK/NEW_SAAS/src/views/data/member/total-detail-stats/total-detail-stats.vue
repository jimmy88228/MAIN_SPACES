<style lang="less" scoped>
	.chart-boxs{
		.chart-box{
			width:50%;
			border-radius: 10px;
			border:1px solid #efefef;
			padding:10px;
		}
		.chart-cont{
			width:100%;
			height:300px;
		}
	}
</style> 
<template>
  <Card class="member-total-detail statistics-page">
			<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
			<Divider orientation="left">会员总数</Divider>
			<div class="flex chart-boxs f-just-between">
				<div class="chart-box">
					<div class="chart-cont" id="register-chart">
						
					</div>
				</div>
				&nbsp;&nbsp;
				<div class="chart-box">
					<div class="chart-cont" id="level-chart"></div>
				</div>
			</div>
			<div class="flex f-just-between f-align-center">
				<div style="width:90%;"><Divider orientation="left">店铺会员统计</Divider></div>
				<Button type="primary" @click="handleExport">导出</Button>
			</div>
			<Table :max-height="500" :columns="columns" :data="tableData"></Table>
			<!-- <div v-show="pageTotal" class="list_page">
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
			</div> -->
			<Spin :fix="true" v-if="showSpin"></Spin>
			<!--异步处理导出excel组件-->
			<div class="col">
				<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
			</div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import detailMixin from './detailMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import statsBack from '@/views/data/components/stats-back';
import PageHelper from '@/libs/page-helper.js';
export default {
	name: 'totalDetailStats',
	mixins: [ PageHelper, detailMixin],
	components: { statsBack, notice },
	data () {
		return {
			formSearch: {},
			platformView: [{
				key: "wechat_reg_user",
				val: 0,
				name: "微信注册",
				color: "#FE2167"
			},
			{
				key: "store_reg_user",
				val: 0,
				name: "门店注册",
				color: "#549CF1"
			}],
			jobIdCol:[],
			showSpin: false,
			brandId: 0,
			brandName: "",
			registerChart: null,
			levelChart: null,
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.loadData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId || 0;
			this.brandName = query.brandName || "";
			window.addEventListener('resize', () => {
				this.registerChart && this.registerChart.resize();
				this.levelChart && this.levelChart.resize();
			}, false)
		},
		onLoadData(page, data){
      this.showSpan = true;
			return util.ajax.post(util.apiUrl.userTotalStatsView, {
				storeIds: this.storeIds,
				...data
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let platform = data.platform || [];
					let rank = data.rank || [];
					this.initRegisterChart(platform);
					this.initlevelChart(rank);
          this.data = {
						items: data.items,
						total: data.total
					}
				}
			}).finally(()=>{
				this.showSpan = false
			})
		},
		searchData(){
			this.loadData();
		},
		initRegisterChart(data){
			this.registerChart = this.registerChart || echarts.init(document.getElementById('register-chart')) || null;
			let legendList = [], vData = [];
			let platformView = this.platformView || []; 
			for(let i = 0; i < platformView.length; i++){
				let key = platformView[i].key;
				legendList.push(platformView[i].name);
				vData.push({
					name: platformView[i].name,
					value: data[key]
				});
			}
			var page_pie =  {
			    tooltip: {
			        trigger: 'item',
			        formatter:function(params,ticket,callback){
			        	var html='<div>\
				        			<div> '+params.name+' </div>\
				        			<div> 人数 : '+params.value+' </div>\
				        			<div> 占比 : '+params.percent+' % </div>\
			        			</div>';
			        	return html;
			        }
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        data: legendList
			    },
			    color: ['#539CF3', '#FF2168', '#4C2E95', '#007713', '#34A905', '#EB8336', '#89CFFD'],
			    series: [
			        {
			            name:'店铺主页',
			            type:'pie',
			            radius: ['40%', '70%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '20',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data: vData
			        }
			    ]
			};
			this.registerChart.setOption(page_pie);
		},
		initlevelChart(data){
			this.levelChart = this.levelChart || echarts.init(document.getElementById('level-chart')) || null;
			let legendList = [], vData = []; 
			for(let i = 0; i < data.length; i++){
				legendList.push(data[i].rank_name);
				vData.push({
					name: data[i].rank_name,
					value: data[i].total_count
				});
			}
			var page_pie =  {
			    tooltip: {
			        trigger: 'item',
			        formatter:function(params,ticket,callback){
			        	var html='<div>\
				        			<div> '+params.name+' </div>\
				        			<div> 人数 : '+params.value+' </div>\
				        			<div> 占比 : '+params.percent+' % </div>\
			        			</div>';
			        	return html;
			        }
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        data: legendList
			    },
					color: ['#FF2168', '#EB8336', '#4C2E95', '#539CF3', '#34A905', '#89CFFD','#007713'],
			    series: [
			        {
			            name:'店铺主页',
			            type:'pie',
			            radius: ['40%', '70%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '20',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data: vData
			        }
			    ]
			};
			this.levelChart.setOption(page_pie);
		},
		handleFinish () {
			this.loadData();
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.formSearch;
					return this.$ajax.post(this.$api.userTotalStatsExport,{
						storeIds: this.storeIds,
						page: 1,
						pageSize: 20
					}).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
								this.jobIdCol.push(jobId);
								this.$nextTick(() => {
									this.$refs[`notice${jobId}`][0].showNotice(jobId);
								});
								this.$Message.success(res.message);
							} else {
								this.$Message.error(res.message);
							}
					});
				}
			});
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
		}
	}
}
</script>

