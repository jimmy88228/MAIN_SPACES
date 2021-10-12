<style lang="less" scoped>
	.chart-boxs{
		.chart-box{
			width:100%;
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
			<stats-back type="store" :isBack="false" :showHead="true" :data="storeList" @on-changeData="changeStore"></stats-back>
			<page-form
			:formSearch="formSearch"
			@on-search="searchData" 
			@on-handleExport="handleExport"
			></page-form>
			<!-- <Divider orientation="left">会员总数</Divider> -->
			<div class="flex chart-boxs f-just-between">
				<div class="chart-box">
					<div class="chart-cont" id="dynamic-chart">
						
					</div>
				</div>
			</div>
			<Divider orientation="left">店铺会员统计</Divider></div>
			<Table :height="500" :columns="columns" :data="tableData"></Table>
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
				<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
			</div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import sourceMixin from './sourceMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import storeMixin from '@/views/cloud-shop/data/storeMixin';
import PageHelper from '@/libs/page-helper.js';
import statsBack from '@/views/data/components/stats-back';
import pageForm from './searchForm';
export default {
	name: 'totalDynamicStats',
	mixins: [ PageHelper, sourceMixin, storeMixin],
	components: { pageForm, notice, statsBack },
	data () {
		return {
			formSearch: {
				start_time: "",
				end_time: ""
			},
			totalData: [
				{
					name: "新增会员数",
					data: "0",
					key:"total_reg_user"
				},
				{
					name: "会员总数",
					data: "0",
					key:"end_total_user"
				}
			],
			dynamicChart: null,
			jobIdCol:[],
			showSpin: false
		}
	},
	mounted(){
		 this.loadData();
	},
	methods: {
		
		onLoadData(page, data){
      this.showSpin = true;
			return util.ajax.post(util.apiUrl.CloudUserPlatformView, {
				...this.formSearch,
				...data,
				storeIds: this.storeIds
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sumary = data.sumary || {};
          this.data = {
						items: data.items,
						total: data.items.length
					}
					this.initChart(sumary);	
				}
			}).finally(()=>{
				this.showSpin = false
			})
		},
		searchData(){
			this.loadData();
		},
		initChart(data){
			let XData = [], yData = [];
			for(let i = 0; i < data.length; i++){
				let platform_src = data[i].platform_src;
				let platform_user = data[i].platform_user || 0;
				XData.push(platform_src);
				yData.push({
					name: platform_src,
					value: platform_user
				})
			}
			this.dynamic_chart = this.dynamic_chart || echarts.init(document.getElementById('dynamic-chart'));
			let formSearch = this.formSearch || {};
			let	options = {
					title : {
						text: "各平台会员来源比例",
						subtext: formSearch.start_time  + "~" + formSearch.end_time,
						x:'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					color: ['#FF2168','#EB8336', '#4C2E95', '#539CF3', '#34A905', '#89CFFD','#007713'],
					legend: {
						orient : 'vertical',
						x : 'left',
						data: XData
					},
					series : [
						{
							name:'所占比例',
							type:'pie',
							radius : '55%',
							center: ['50%', 155],
							data: yData
						}
					]
				};
			this.dynamic_chart.setOption(options);
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
					return this.$ajax.post(this.$api.CloudUserDynamicExport,{
						...formSearch,
						storeIds: this.storeIds,
						page: 1,
						pageSize: 20
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
					});
				}
			});
		}
	}
}
</script>

