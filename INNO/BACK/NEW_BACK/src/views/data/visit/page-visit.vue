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
  <Card class="visit-page statistics-page">
		<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
		<pages-form
		:formSearch="searchForm"
		@on-search="searchData" 
		@on-handleExport="handleExport"
		></pages-form>
		<div class="flex chart-boxs f-just-between">
			<div class="chart-box">
				<Divider orientation="left">页面类型</Divider>
				<div class="chart-cont" id="page-chart">
					
				</div>
			</div>
			&nbsp;&nbsp;
			<div class="chart-box">
				<Divider orientation="left">访问深度</Divider>
				<div class="chart-cont" id="visit-chart"></div>
			</div>
		</div>
		<Divider orientation="left">详细数据</Divider>
		<Table :max-height="500" :columns="columns" :data="tableData"></Table>
		<div v-show="pageTotal" class="list_page">
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
		<Spin :fix="true" v-if="showSpin"></Spin>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import pageMixin from './mixins/pageMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import pagesForm from './search-form/pages-form';
import statsBack from '@/views/data/components/stats-back';
import PageHelper from '@/libs/page-helper.js';
export default {
	name: 'pageVisit',
	mixins: [PageHelper, pageMixin],
  components: {
		pagesForm,
		notice,
		statsBack
  },
  data () {
    return {
			searchForm: {
				start_time: "",
				end_time: "",
			},
			jobIdCol:[],
			showSpin: false,
			initpageData: [
				{page_type_name: "会员主页", color: "#4C2E95"},
				{page_type_name: "微页面", color: "#007713"},
				{page_type_name: "商品页", color: "#539CF3"},
				{page_type_name: "商品类目页", color: "#FF2168"},
				{page_type_name: "标准分类列表页", color: "#34A905"},
				{page_type_name: "搜索商品页", color: "#EB8336"},
				{page_type_name: "积分兑换页", color: "#89CFFD"},
			],
			brandId: 0,
			brandName: ""
    }
  },
	mounted(){
		this.initParams();
		this.loadData();
	},
  methods: {
		initParams(){
				let query = this.$route.query || {};
				this.brandId = query.brandId || 0;
				this.brandName = query.brandName || ""
		},
		onLoadData(page, extData){
			this.showSpin = true;
			return util.ajax.post(util.apiUrl.pageVisitView, {
				...this.searchForm,
				...extData
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					this.data = {
						total: data.total,
						items: data.items
					}
					this.initPgaeChart(data.pageTypeVisitEntities);
					this.initDepthChart(data.pageVisitDepthEntites);
					return Promise.resolve();
				}
				return Promise.reject();
			}).finally(()=>{
				this.showSpin = false
			})
		},
		initPgaeChart(data){
			data = data.length > 0 ? data : this.initpageData;
			console.log("data", data);
			let visitData = [], XData = [], colors = [];
			for(let i = 0; i < data.length; i++){
				console.log("data", data[i])
				let page_type_name = data[i].page_type_name || "";
				if(page_type_name){
					XData.push(page_type_name);
				}
				let totalCount = data[i].totalCount || 0;
				visitData.push({
					name: page_type_name,
					value: totalCount 
				});
				let color = (this.initpageData[i] && this.initpageData[i].color) || '#' + Math.random().toString(16).substr(2, 6).toUpperCase();
				colors.push(color);
			}
			var page_chart = echarts.init(document.getElementById('page-chart'));
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
			        data: XData
			    },
			    color: colors,
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
			            data: visitData
			        }
			    ]
			};
			page_chart.setOption(page_pie);
		},
		initDepthChart(data){
			data = data || [];
			let depthData = [], XData = [];
			for(let i = 0; i < data.length; i++){
				let visit_pages = data[i].visit_pages || 0;
				depthData.push(visit_pages);
			}
			var myChart = echarts.init(document.getElementById('visit-chart'));
			var option = {
					title: {
					},
					tooltip: {},
					color:['#529cf5'],
					legend: {
							data:['访客数']
					},
					barWidth:'35px',
					xAxis: {
							data: ["1页", "2页", "3页", "4页", "5页", "6-10页", "11-20页", "20+页"]//page_depth.name
					},
					yAxis: {
						minInterval:1
					},
					series: [{
							name: '访客数',
							type: 'bar',
							data: depthData
					}]
			};
			myChart.setOption(option);
		},
		searchData(){
			this.loadData();
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.pageVisitExport,{
						...this.searchForm,
						pageSize: this.pageSize,
						page: 1,
						storeIds: this.storeIds
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
  },
}
</script>
