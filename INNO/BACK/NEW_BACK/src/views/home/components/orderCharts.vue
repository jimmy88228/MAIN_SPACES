<template>
    <div style="width:100%;height:100%;" :id="id"></div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'serviceRequests',
	props: ['id', 'data', 'total'],
  mounted () {},
	methods:{
		installData(chartData){
			let xData = chartData.xData;
			for(let i = 0; i < xData.length; i++){
				let _data = xData[i] || "";
				_data = _data + "";
				let l = _data.indexOf("-");
				if(l != -1){
					xData[i] = _data.substring(parseInt(l + 1));
				}
			}
			let yData = chartData.yData || [];
			let legendData = [];
			let colors = ['#EC53C0', '#4293E5'];
			let dataL = 0, dataMax = 0;
			for(let i = 0; i < yData.length; i++){
				legendData.push(yData[i].name);
				yData[i].color = colors[i];
				let listData = yData[i].data || [];
				if(yData[i].name == "成交金额"){
					dataL = listData.length;
				}
				for(let j = 0; j < listData.length; j++){
					 dataMax = listData[j] > dataMax ? listData[j] : dataMax;
				}
			}
			let maxData = []
			for(let i = 0; i < dataL; i++){
				maxData.push(dataMax)
			}
			return {
				maxData,
				yData,
				xData,
				legendData
			}
		},
		initChart(chartData){
				let option = {
					title: {},
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
					    left: '20px',
					    right: '20px',
					    bottom: '1%',
					    containLabel: true
					},
			    legend: {
			      data: chartData.legendData
			    },
			    xAxis:{
						data: chartData.xData
			    },
			    yAxis: [
			        {
			            type: 'value',
			            scale: true,
			            name: chartData.yData[0].name,
			            //max: this.total.all_users,
			            min: 0,
			            position:'left',
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
			        },
			        {
			            type: 'value',
			            scale: true,
			            name: chartData.yData[1].name,
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
			            data: chartData.maxData,
			            animation: false
			        },
			        ...chartData.yData
			    ]
			};
			const serviceRequestCharts = echarts.init(document.getElementById(this.id));
			serviceRequestCharts.setOption(option);
			window.addEventListener('resize', function () {
			  serviceRequestCharts.resize();
			});
		}
	},
	watch: {
	  data (val) {
			if(!this.id) return;
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
