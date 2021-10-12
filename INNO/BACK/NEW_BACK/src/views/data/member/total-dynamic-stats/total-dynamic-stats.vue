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
			<page-form
			:formSearch="formSearch"
			@on-search="searchData" 
			@on-handleExport="handleExport"
			></page-form>
			<div class="model-area">
			  <Row type="flex" justify="center" >
			      <div class="total-item" v-for="(item, index) in totalData" :key="index">
			        <p class="total-name">{{ item.name }}</p>
			        <p class="total-val">{{ item.data }}</p>
			      </div>
			  </Row>
			</div>
			<Divider orientation="left">会员总数</Divider>
			<div class="flex chart-boxs f-just-between">
				<div class="chart-box">
					<div class="chart-cont" id="dynamic-chart">
						
					</div>
				</div>
			</div>
			<Divider orientation="left">店铺会员统计</Divider></div>
			<Table :max-height="500" :columns="columns" :data="tableData"></Table>
			<div v-show="pageTotal" class="list_page">
				<!-- <Page
				:total="pageTotal"
				:page-size="pageSize"
				:current="currentPage"
				:page-size-opts="pageSizeOpts"
				@on-change="e => changePage(e)"
				@on-page-size-change="ps => handlePageSize(ps)"
				show-elevator
				show-total
				show-sizer></Page> -->
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
import dynamicMixin from './dynamicMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import storeMixin from '@/views/cloud-shop/data/storeMixin';
import PageHelper from '@/libs/page-helper.js';
import pageForm from './searchForm';
export default {
	name: 'totalDynamicStats',
	mixins: [ PageHelper, dynamicMixin, storeMixin],
	components: { pageForm, notice },
	data () {
		return {
			formSearch: {
				start_time: "",
				end_time: "",
				agentId: [],
				storeId: "0"
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
			jobIdCol:[],
			showSpin: false
		}
	},
	computed: {
		agentId(){
			let formSearch = this.formSearch || {};
			return formSearch.agentId.slice(-1)[0] || 0;
		}
	},
	mounted(){
		 this.loadData();
	},
	methods: {
		
		onLoadData(page, data){
      this.showSpin = true;
			return util.ajax.post(util.apiUrl.userDynamicStatsView, {
				...this.formSearch,
				agentId: this.agentId,
				...data
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sumary = data.sumary || {};
					let totalData = this.totalData || [];
					for(let i = 0; i < totalData.length; i++){
						let key = totalData[i].key;
						if(key){
							totalData[i].data = sumary[key]
						}
					}
          this.data = {
						items: data.items,
						total: data.items.length
					}
					this.initChart(data.items);	
				}
			}).finally(()=>{
				this.showSpin = false
			})
		},
		searchData(){
			this.loadData();
		},
		getFilterX(){
			let formSearch = this.formSearch;
			let start_time = formSearch.start_time || new Date();
			let end_time = formSearch.end_time || new Date();
			let XData = [];
			let startDate = Date.parse(start_time);
			let endDate = Date.parse(end_time);
			let _date = startDate;
			let limitTime = 24 * 60 * 60 * 1000;
			while(_date < endDate || _date == endDate){
				XData.push(vueUtils.format(new Date(_date), "MM-dd"));
				_date = _date + limitTime;
			}
			return XData;
		},
		initChart(data){
			let reg_member = [], total_member = [];
			for(let i = 0; i < data.length; i++){
				reg_member.push(data[i].today_reg_user);
				total_member.push(data[i].today_total_user);
			}
			let XData = this.getFilterX();
			let dynamic_chart = this.dynamic_chart || echarts.init(document.getElementById('dynamic-chart'));
			this.dynamic_chart = dynamic_chart;
			let options = {
					tooltip : { trigger: 'axis'},
					legend: {
							data:['新增会员数','会员总数']
					},
					color:['#359B19','#F59295'],
					barWidth:'35px',
					grid: {
							left: '3%',
							right: '3%',
							bottom: '1%',
							containLabel: true
					},
					xAxis : [
							{
									type : 'category',
									data : XData,
									axisLine:{
										lineStyle:{
											color:"#d2d2d2"
										}
									},
									axisLabel:{
										textStyle:{
											color:'#333'
										}
									},
									splitArea:{
										show:true,
										areaStyle:{
											color:['#fbfbfb','#fff'],
											opacity:0.5
										}
									}
							}
					],
					yAxis : [
							{
									type : 'value',
									name:'新增会员数',
									axisLine:{
										lineStyle:{
											color:"#d2d2d2"
										}
									},
									axisLabel:{
										textStyle:{
											color:'#333'
										}
									},
									minInterval:1 ,
							},
							{
									type : 'value',
									name:'会员总数',
									axisLine:{
										lineStyle:{
											color:"#d2d2d2"
										}
									},
									axisLabel:{
										textStyle:{
											color:'#333'
										}
									},
									minInterval:1 ,
							}
					],
					series : [
						{
							name: '新增会员数',
							type: 'bar',
							data: reg_member
						},
						{
							name: '会员总数',
							type: 'line',
							data: total_member
						}
					]
			};
			dynamic_chart.setOption(options);
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
					return this.$ajax.post(this.$api.userDynamicStatsExport,{
						...formSearch,
						agentId: this.agentId,
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

