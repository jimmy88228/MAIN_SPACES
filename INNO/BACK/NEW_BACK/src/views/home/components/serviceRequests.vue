<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'serviceRequests',
	props: ['data', 'total'],
  mounted () {},
	methods:{
		installData(chartData){
			let len = 30;
			let FinalPastData = []; 
			let h_total=0;
			let nowData = new Date();
			nowData.setDate(nowData.getDate()-1);
			//
			let history_totals = [];
			let reg_dates = [];
			let add_users = [];
			let xDates = [];
			let dataShadow = [];
			let newMax = 0;
			while(len--){
				let year = nowData.getFullYear();
				let mouth = parseInt(nowData.getMonth()) + 1;
				let date = parseInt(nowData.getDate());
				let xDate = mouth +'-'+ date;
				if(mouth < 10){
				  mouth = "0" + mouth;
				}
				if(date < 10){
				  date = "0" + date;
				}
				let xAllData = year +'-'+ mouth +'-'+ date;
				let Odata_item={
				  xDate: xDate,
				  history_total: h_total,
				  reg_date: xAllData,
				  users:0
				}
				//设置默认数据
				FinalPastData[len] = Odata_item;
				//循环寻找存在的数据，并赋值
				for(let i = 0; i < chartData.length; i++){
				  if(chartData[i].reg_date == xAllData){
				    FinalPastData[len]=chartData[i];
				    FinalPastData[len].xDate=xDate;
				    h_total=chartData[i].history_total;
				    break;
				  }
				}
				nowData.setDate(nowData.getDate()-1);
			}
			h_total = 0;
			for(let k = 0; k < FinalPastData.length; k++){
			    if(FinalPastData[k].history_total < h_total){
			      FinalPastData[k].history_total = h_total;
			    }else{
			      h_total=FinalPastData[k].history_total;
			    }
			    xDates.push(FinalPastData[k].xDate);
			    history_totals.push(FinalPastData[k].history_total);
			    reg_dates.push(FinalPastData[k].reg_date);
			    add_users.push(FinalPastData[k].users);
					newMax = FinalPastData[k].users > newMax ? FinalPastData[k].users : newMax;
			    dataShadow.push(this.total.all_users);
			}
			return {
				xDates,
				add_users,
				dataShadow,
				history_totals
			}
		},
		initChart(chartData){
				let option = {
					title: {
			    },
			    tooltip: {
			        show:true,
			        trigger: 'axis',
			        axisPointer: {},
			        padding:0,
			        backgroundColor:'#fff',
			        formatter : function(v) {
			          var html="<div class='analysis_tip_box'>";
								for(let i = 0; i < v.length; i++){
									if(i == 0) continue;
									html += "<div class='data_tip_item'>\
													<p>"+ v[i].seriesName+"</p>\
													<span>"+v[i].value+"</span>\
												</div>";
								}
								html += "</div>";
			          return html;
			        }
			
			    },
					grid: {
					    left: '1%',
					    right: '20px',
					    bottom: '1%',
					    containLabel: true
					},
			    legend: {
			        data:['会员总数','新增会员数']
			    },
			    xAxis:{
							data: chartData.xDates,
							splitLine:{
								show:false,
								lineStyle:{
									color:'#3a5065',
									width:1,
									type:'dotted'
								}
							}
			    },
			    yAxis: [
			        {
			            type: 'value',
			            scale: true,
			            name: '会员总数',
			            max: this.total.all_users,
			            min: 0,
			            position:'left',
			            splitLine:{
			              show:false,
			            },
									axisLabel: {
									    color:'#515a6e',
									},
									axisLine:{
										show:true,
										lineStyle:{
											color: '#515a6e'
										}
									},
			            minInterval:1,
									
			        },
			        {
			            type: 'value',
			            scale: true,
			            name: '新增会员数',
			            max: chartData.newMax,
			            min: 0,
			            position:'right',
			            splitLine:{
			              show:false
			            },
									axisLabel: {
									    color:'#515a6e',
									},
									axisLine:{
										show:true,
										lineStyle:{
											color: '#515a6e'
										}
									},
			            minInterval:1
			
			        }
			    ],
			    series: [
			        { 
			            type: 'bar',
			            itemStyle: {
			                normal: {color: 'rgba( 66 , 147 , 229 , 0.1)'}
			            },
			            barGap:'-100%',
			            barCategoryGap:'40%',
			            data: chartData.dataShadow,
			            animation: false
			        },
			        {
			            color:['#EC53C0'],
			            name:'会员总数',
			            type:'line',
			            yAxisIndex:0,
			            data: chartData.history_totals
			        },
			        {
			            color:['#4293E5'],
			            name:'新增会员数',
			            type:'bar',
			            yAxisIndex:1,
			            data: chartData.add_users
			        }
			    ]
			};
			const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
			serviceRequestCharts.setOption(option);
			
			window.addEventListener('resize', function () {
			  serviceRequestCharts.resize();
			});
		}
	},
	watch: {
	  data (val) {
	    let chartData = this.installData(val);
			this.initChart(chartData);
	  }
	}
};
</script>
<style lang="less">
	.analysis_tip_box{
		width:220px;
		display:table;
		background:#fff;
		color:#303030;
		text-align:center;
		border:none;
		border-radius:10px;
		box-shadow: 0px 0px 10px #666;
	}
	.data_tip_item{
		display:table-cell;
		vertical-align: middle;
		padding:20px 0px;
	}
	.data_tip_item span{
		color:#3F94E5;
		display:inline-block;
		margin-top:10px;
		font-size:20px;
	}
</style>
