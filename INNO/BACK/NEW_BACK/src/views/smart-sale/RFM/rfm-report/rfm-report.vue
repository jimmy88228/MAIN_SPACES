<template>
	<Card class="rfm-report-area">
		<div class="flex f-just-between">
			<div class="page-divider ">
				<div>RFM报表</div>
			</div>
			<div><Button type="primary">导出</Button></div>
		</div>
		<div class="list-div" id="listDiv">
			<div class="view chart">
				<div class="report_type_item">
					<div class="type_item_title">最近消费（Recency）</div>
					<div class="recency_ring ring_report flex">
						<div class="chart_item">
							<div id="recency_bar" class="report_chart"></div>
						</div>
						<div class="chart_item">
							<div id="recency_list" class="report_table list">
								<Table :height="350" :columns="rColumns" :data="recency.tableData">
									<template slot-scope="{ row, index }" slot="user_sum">
										<a >{{row.user_sum}}</a>
									</template>
									<template slot-scope="{ row, index }" slot="user_rate">
										{{row.user_rate}}%
									</template>
									<template slot-scope="{ row, index }" slot="avg_user_amount">
										¥{{row.avg_user_amount}}
									</template>
									<template slot-scope="{ row, index }" slot="amount_sum">
										¥{{row.amount_sum}}
									</template>
								</Table>
							</div>
						</div>
					</div>
				</div>
				<div class="report_type_item">
					<div class="type_item_title">消费频次（Frequency）</div>
					<div class="frequency_ring ring_report flex">
						<div id="frequency_data" class="btn_file" data="<?php echo $frequency; ?>"></div>
						<div class="chart_item">
							<div id="frequency_pie" class="report_chart"></div>
						</div>
						<div class="chart_item">
							<div id="frequency_list" class="report_table list">
								<Table :height="350" :columns="rColumns" :data="frequency.tableData">
									<template slot-scope="{ row, index }" slot="user_sum">
										<a >{{row.user_sum}}</a>
									</template>
									<template slot-scope="{ row, index }" slot="user_rate">
										{{row.user_rate}}%
									</template>
									<template slot-scope="{ row, index }" slot="avg_user_amount">
										¥{{row.avg_user_amount}}
									</template>
									<template slot-scope="{ row, index }" slot="amount_sum">
										¥{{row.amount_sum}}
									</template>
								</Table>
							</div>
						</div>
					</div>
				</div>
				<div class="report_type_item">
					<div class="type_item_title">消费金额（Monetary）</div>
					<div class="monetary_ring ring_report flex">
						<div class="chart_item">
							<div id="monetary_bar" class="report_chart"></div>
						</div>
						<div class="chart_item">
							<div id="monetary_list" class="report_table list">
								<Table :height="350" :columns="rColumns" :data="monetary.tableData">
									<template slot-scope="{ row, index }" slot="user_sum">
										<a >{{row.user_sum}}</a>
									</template>
									<template slot-scope="{ row, index }" slot="user_rate">
										{{row.user_rate}}%
									</template>
									<template slot-scope="{ row, index }" slot="avg_user_amount">
										¥{{row.avg_user_amount}}
									</template>
									<template slot-scope="{ row, index }" slot="amount_sum">
										¥{{row.amount_sum}}
									</template>
								</Table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>
<script>
	import echarts from 'echarts';
	export default {
		data() {
			const columns = [{
					title: "会员人数",
					key: "user_sum",
					slot: "user_sum",
					minWidth: 110
				},
				{
					title: "人数占比",
					key: "user_rate",
					slot: "user_rate",
					minWidth: 110
				},
				{
					title: "平均客单价",
					key: "avg_user_amount",
					slot: "avg_user_amount",
					minWidth: 110
				},
				{
					title: "消费金额",
					key: "amount_sum",
					slot: "amount_sum",
					minWidth: 110
				}
			]
			return {
				rColumns: [{
						title: "最近消费时间（R）",
						key: "rfm_type_name",
						minWidth: 150
					},
					...columns
				],
				fColumns: [{
						title: "累计消费次数（F）",
						key: "rfm_type_name",
						minWidth: 150
					},
					...columns
				],
				mColumns: [{
						title: "累计消费金额（M）",
						key: "rfm_type_name",
						minWidth: 150
					},
					...columns
				],
				recency: {},
				frequency: {},
				monetary: {},
				recencyChart: null,
				frequencyChart: null,
				monetaryChart: null
			}
		},
		methods: {
			getData() {
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.RfmReportList, {}).then((response) => {
					console.log("response", response);
					let res = response.data || {};
					if (res.code) {
						let data = res.data || {};
						let list = data.list || {};
						this.frequency = data.frequency || {};
						this.monetary = data.monetary || {};
						this.recency = data.recency || {};
						this.frequency.legend = (this.frequency.legend && JSON.parse(this.frequency.legend)) || [];
						this.frequency.series = (this.frequency.series && JSON.parse(this.frequency.series)) || [];
						this.monetary.xAxis = (this.monetary.xAxis && JSON.parse(this.monetary.xAxis)) || [];
						this.monetary.yAxis = (this.monetary.yAxis && JSON.parse(this.monetary.yAxis)) || [];
						this.recency.xAxis = (this.recency.xAxis && JSON.parse(this.recency.xAxis)) || [];
						this.recency.yAxis = (this.recency.yAxis && JSON.parse(this.recency.yAxis)) || [];
						this.frequency.tableData = [{
								rfm_type_name: '消费频次汇总',
								...this.frequency.total
							},
							...this.frequency.list
						]
						this.monetary.tableData = [{
								rfm_type_name: '消费金额汇总',
								...this.monetary.total
							},
							...this.monetary.list
						]
						this.recency.tableData = [{
								rfm_type_name: '最近消费时间汇总',
								...this.recency.total
							},
							...this.recency.list
						]
					}
				}).finally(() => {
					this.$store.commit("setLoading", false);
				})
			},
			initChart() {
				this.recencyChart = echarts.init(document.getElementById('recency_bar'));
				this.frequencyChart = echarts.init(document.getElementById('frequency_pie'));
				this.monetaryChart = echarts.init(document.getElementById('monetary_bar'));
				this.chartsetOption();
			},
			chartsetOption() {
				//最近消费
				let recency_option = {
					color: ['#29A6FF'],
					tooltip: {
						trigger: 'item',
						formatter: '{b0}<br/>会员数: {c0}'
					},
					grid: {
						left: '4%',
						right: '4%',
						bottom: '4%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: this.recency.xAxis,
						axisLabel: {
							color: '#666',
							show: true
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#e6e6e6'
							}
						}

					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							color: '#666',
							show: true
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#e6e6e6'
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#e6e6e6',
								type: 'dotted'
							}
						}
					}],
					series: [{
						name: '最近消费人数',
						type: 'bar',
						barWidth: '40%',
						data: this.recency.yAxis
					}]
				};
				//消费频次
				let frequency_data = this.frequency.series;
				let frequency_name = [];
				for (let i = 0; i < frequency_data.length; i++) {
					frequency_name.push({
						"name": frequency_data[i].name,
						"icon": "circle"
					})
				}
				let frequency_option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} ({d}%)"
					},
					legend: {
						type: "scroll",
						orient: 'vertical',
						top: 10,
						left: 10,
						itemWidth: 15,
						itemHeight: 15,
						data: frequency_name,
					},
					grid: {
						left: '4%',
						right: '4%',
						bottom: '4%',
						containLabel: true
					},
					color: ['#29A6FF', '#F15755', '#34A805', '#F07225', '#6F53B7'],
					series: [{
						name: '消费频次',
						type: 'pie',
						radius: ['40%', '70%'],
						center: ['60%', '50%'],
						data: this.frequency.series,
						label: {
							show: false,
						}
					}]
				};
				//消费金额
				var monetary_y_data = this.monetary.yAxis;
				var monetary_x_data = this.monetary.xAxis;
				var monetary_name = [];
				var monetary_data = []
				for (let i = 0; i < monetary_x_data.length; i++) {
					monetary_name.push({
						"name": monetary_x_data[i],
						"icon": "circle"
					});
					monetary_data.push({
						"name": monetary_x_data[i],
						"value": monetary_y_data[i]
					})

				}
				var monetary_option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} ({d}%)"
					},
					legend: {
						type: "scroll",
						orient: 'vertical',
						top: 10,
						left: 10,
						itemWidth: 15,
						itemHeight: 15,
						data: monetary_name,
					},
					grid: {
						left: '4%',
						right: '4%',
						bottom: '4%',
						containLabel: true
					},
					color: ['#29A6FF', '#F15755', '#34A805', '#F07225', '#6F53B7'],
					series: [{
						name: '消费金额',
						type: 'pie',
						radius: ['0%', '70%'],
						center: ['60%', '50%'],
						data: monetary_data,
						label: {
							show: false,
						}
					}]
				};
				//
				this.recencyChart.setOption(recency_option);
				this.monetaryChart.setOption(monetary_option);
				this.frequencyChart.setOption(frequency_option);
			},
			initChartSize(){
				this.recencyChart && this.recencyChart.resize();
				this.monetaryChart && this.monetaryChart.resize();
				this.frequencyChart && this.frequencyChart.resize();
			},
		},
		mounted() {
			this.getData().then(() => {
				this.initChart();
			})
		},
		watch:{
			'$store.state.app.winResize':{
				handler(n, o){
					if(this.timer){
						clearTimeout(this.timer);
						this.timer = null;
					}
					this.timer = setTimeout(()=>{
						this.initChartSize();
						clearTimeout(this.timer);
						this.timer = null;
					}, 500);
				}
			}
		}
	}
</script>
<style lang="less">
	.rfm-report-area {
		.report_type_item {
			border: 1px solid #e6e6e6;
			-moz-border-bottom-left-radius: 8px;
			-webkit-border-bottom-left-radius: 8px;
			border-bottom-left-radius: 8px;
			-moz-border-bottom-right-radius: 8px;
			-webkit-border-bottom-right-radius: 8px;
			border-bottom-right-radius: 8px;
			margin: 20px 0px;

			.type_item_title {
				padding: 20px;
				background: #F9F9F9;
				border-bottom: 1px solid #e6e6e6;
			}

			.ring_report {
				align-items: stretch;

				.chart_item {
					width: 50%;
					padding: 10px;
					box-sizing: border-box;
					flex-shrink: 0;

					.report_chart {
						border: 1px solid #efefef;
						border-radius: 10px;
						height: 100%;
					}

					.report_table {
						border: 1px solid #efefef;
						border-radius: 10px;
					}
				}
			}
		}

	}
</style>
