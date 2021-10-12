<template>
	<Card class="general-area">
		<div class="page-divider i-flex m-bottom-20">RFM全景</div>
		<div>
			<Tabs name="rfmGeneralTab" v-model="tabVal" type="card">
				<TabPane label="客户数占比" name="user" tab="rfmGeneralTab">
					<div class="p-15">*功能描述：R(Recency)最近一次购买，F(Frequency)购买次数，M(monetary)购买金额</div>
					<Table border :max-height="420" :loading="tableLoading" :columns="userTable.columns" height="600"
						:data="userTable.data" ref="myTable1" @on-cell-click="getDetail">
						<template slot-scope="{ row, index }" slot="F1">
							<div class="cell-item" :index="index" :percent="row.F1.percent">
								<p>{{row.F1.num}}人</p>
								<p>占比{{row.F1.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F2">
							<div class="cell-item" :index="index" :percent="row.F2.percent">
								<p>{{row.F2.num}}人</p>
								<p>占比{{row.F2.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F3">
							<div class="cell-item" :index="index" :percent="row.F3.percent">
								<p>{{row.F3.num}}人</p>
								<p>占比{{row.F3.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F4">
							<div class="cell-item" :index="index" :percent="row.F4.percent">
								<p>{{row.F4.num}}人</p>
								<p>占比{{row.F4.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F5">
							<div class="cell-item" :index="index" :percent="row.F5.percent">
								<p>{{row.F5.num}}人</p>
								<p>占比{{row.F5.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row }" slot="SUM">
							<div class="cell-sum-item" type="sum">
								<p>{{row.SUM.num}}人</p>
								<p>占比{{row.SUM.percent}}%</p>
							</div>
						</template>
					</Table>
				</TabPane>
				<TabPane label="累计购买金额" name="purchase" tab="rfmGeneralTab">
					<div class="p-15">*功能描述：R(Recency)最近一次购买，F(Frequency)购买次数，M(monetary)购买金额</div>
					<Table border :max-height="420" :loading="tableLoading" :columns="purchaseTable.columns"
						height="600" :data="purchaseTable.data" ref="myTable2" @on-cell-click="getDetail">
						<template slot-scope="{ row, index }" slot="F1">
							<div class="cell-item" :index="index" :percent="row.F1.percent">
								<p>{{row.F1.num}}元</p>
								<p>占比{{row.F1.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F2">
							<div class="cell-item" :index="index" :percent="row.F2.percent">
								<p>{{row.F2.num}}元</p>
								<p>占比{{row.F2.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F3">
							<div class="cell-item" :index="index" :percent="row.F3.percent">
								<p>{{row.F3.num}}元</p>
								<p>占比{{row.F3.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F4">
							<div class="cell-item" :index="index" :percent="row.F4.percent">
								<p>{{row.F4.num}}元</p>
								<p>占比{{row.F4.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row, index }" slot="F5">
							<div class="cell-item" :index="index" :percent="row.F5.percent">
								<p>{{row.F5.num}}元</p>
								<p>占比{{row.F5.percent}}%</p>
							</div>
						</template>
						<template slot-scope="{ row }" slot="SUM">
							<div class="cell-sum-item">
								<p>{{row.SUM.num}}元</p>
								<p>占比{{row.SUM.percent}}%</p>
							</div>
						</template>
					</Table>
				</TabPane>
			</Tabs>
		</div>
		<Modal v-model="showChart" class-name="report-chart-modal" :closable="false" :width="700" @on-ok="">
			<div class="ring_report_cont">
				<div id="detail_title" class="detail_report_title">
					<span class="f_name">{{detailData.Frequency}}</span>
					<span class="r_name">{{detailData.Recency}}</span>
				</div>
				<span class="close_chart" @click="showChart = false">关闭</span>
				<div class="chart_title" id="general_chart_title">
					<span>{{tabVal == 'user' ? '人数' : '金额'}}</span>
				</div>
				<div id="detail_chart" class="detail_chart">点击RFM全景的单元格，查看相应的图表</div>
			</div>
			<div slot="footer"></div>
		</Modal>
	</Card>
</template>
<script>
	import echarts from 'echarts';
	import gradientColors from '@/views/smart-sale/components/setGradientBg.js';
	import mixins from "./mixins.js";
	export default {
		name: "rfmGeneral",
		mixins: [mixins],
		data() {
			return {
				tabVal: 'user',
				tableLoading: false,
				purchaseTable: {
					columns: [],
					data: []
				},
				userTable: {
					columns: [],
					data: []
				},
				gradientColor: gradientColors("#8dd4f5", "#0090ff", 100),
				showChart: false,
				detailChart: null,
				detailData: {},

			}
		},
		methods: {
			getData() {
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.RfmGeneralList, {}).then((response) => {
					console.log("response", response);
					let res = response.data || {};
					if (res.code) {
						let data = res.data || {};
						let purchase_list = data.purchase_list || [];
						let purchase_xAxis = data.purchase_xAxis || [];
						let purchase_xy = (data.purchase_xy && JSON.parse(data.purchase_xy)) || {};
						let user_list = data.user_list || [];
						let user_xAxis = data.user_xAxis || [];
						let user_xy = (data.user_xy && JSON.parse(data.user_xy)) || {};
						this.purchaseTable = this.setData(purchase_list, purchase_xAxis);
						this.userTable = this.setData(user_list, user_xAxis);
						this.setCellStyle();
					}
				}).finally(() => {
					this.$store.commit("setLoading", false);
				})
			},
			setData(list, Axis) {
				list = JSON.parse(JSON.stringify(list)) || [];
				Axis = JSON.parse(JSON.stringify(Axis)) || [];
				let columns = [{
						title: "RFM概述",
						align: 'center',
						key: "yAxis_rfm_name"
					}],
					data = [],
					maxVal = 0;
				for (let i = 0; i < Axis.length; i++) {
					columns.push({
						title: Axis[i].rfm_type_name,
						key: Axis[i].rfm_type,
						align: 'center',
						slot: Axis[i].rfm_type
					})
				}
				for (let i = 0; i < list.length; i++) {
					let _list = list[i].list || {};
					for (let j in _list) {
						maxVal = _list[j].num > maxVal ? _list[j].num : maxVal
					}
					delete list[i].list;
					data.push({
						..._list,
						...list[i]
					})
				}
				return {
					columns,
					data,
					maxVal
				};
			},
			setCellStyle() {
				this.$nextTick(() => {
					let items = this.$refs['myTable1'].$el.getElementsByClassName('cell-item');
					let userMaxVal = parseInt(this.userTable.maxVal) || 0;
					this.setBgLoop(items, userMaxVal);
					let items2 = this.$refs['myTable2'].$el.getElementsByClassName('cell-item');
					let purchaseMaxVal = parseInt(this.purchaseTable.maxVal) || 0;
					this.setBgLoop(items2, purchaseMaxVal);
				})
			},
			setBgLoop(items, maxVal) {
				for (let i = 0; i < items.length; i++) {
					let percent = parseFloat(items[i].getAttribute('percent'));
					let index = items[i].getAttribute('index');
					let ratio = Math.round((percent / (maxVal + 20)) * 100);
					if (ratio) ratio = ratio - 1;
					if (ratio > 99) ratio = 99;
					if (index < 5) {
						items[i].style.backgroundColor = this.gradientColor[ratio]
					}
				}
			},
			getDetail(row, column, data, event) {
				console.log("row", row);
				console.log("column", column);
				if(this.showDetailing) return;
				this.showDetailing = true;
				this.detailData.Frequency = column.title;
				this.detailData.Recency = row.yAxis_rfm_name;
				this.showChart = true;
				this.$nextTick(() => {
					this.detailChart = this.detailChart || echarts.init(document.getElementById('detail_chart'));
					this.getDetailReq({
						r: row.yAxis_rfm_type,
						f: column.key,
						type: this.tabVal
					});
				})
			},
			getDetailReq(params) {
				this.detailChart.showLoading({
					text: '',
					color: '#28A5FF',
					maskColor: 'rgba(255, 255, 255, 0.1)'
				})
				return this.$ajax.post(this.$api.RfmGeneralDetailReport, params).then((response) => {
					let res = response.data || {};
					if (res.code) {
						let data = res[0].data || {};
						let tooltipTxt = this.tabVal == "user" ? '会员数' : '金额';
						let rfm_option = {
							color: ['#3398DB'],
							title: {},
							tooltip: {
								trigger: 'item',
								formatter: '{b0}<br/>' + tooltipTxt + ': {c0}'
							},
							xAxis: [{
								type: 'category',
								data: data.x || [],
								axisLine: {
									show: true,
									lineStyle: {
										color: '#475f76'
									}
								},
								axisLabel: {
									color: '#fff'
								}
							}],
							yAxis: [{
								type: 'value',
								axisLine: {
									show: true,
									lineStyle: {
										color: '#475f76'
									}
								},
								axisLabel: {
									color: '#fff'
								},
								splitLine: {
									show: true,
									lineStyle: {
										color: '#475f76',
										width: 1,
										type: 'dotted'
									}
								},
							}],
							series: [{
								name: '消费金额',
								type: 'bar',
								barWidth: '40%',
								data: data.data || [],
								itemStyle: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
										[{
												offset: 0,
												color: '#2AA6FF'
											},
											{
												offset: 0.5,
												color: '#3ED578'
											},
											{
												offset: 1,
												color: '#3ED578'
											}
										]
									),
									barBorderRadius: 100,
								},
								barWidth: 12,
							}]
						};
						this.detailChart.setOption(rfm_option);
						this.detailChart.hideLoading();
					}
				}).finally(() => {
					this.detailChart.hideLoading();
					this.showDetailing = false;
				})
			}
		},
		mounted() {
			this.getData();
		},
	}
</script>
<style lang="less">
	.general-area {
		.ivu-table-cell {
			padding: 0px;
		}

		.cell-item {
			padding: 10px 0px;
			cursor: pointer;
		}
	}

	.report-chart-modal {
		.ivu-modal {
			width: 700px;
			padding: 10px;
			background-color: #1E2E3D;
			overflow: hidden;
			border-radius: 10px;

			.ivu-modal-content {
				background: none;

				.ivu-modal-body {
					padding: 0px;
				}
			}

		}

		.ivu-modal-footer {
			display: none;
		}

		.ring_report_cont {
			width: 100%;
			height: 400px;
			position: relative;

			.detail_report_title {
				color: #26A6FD;
				position: absolute;
				top: 20px;
				left: 20px;
			}

			.close_chart {
				position: absolute;
				top: 20px;
				right: 20px;
				display: block;
				color: #fff;
				z-index: 2;
				cursor: pointer;
			}

			.chart_title {
				position: absolute;
				top: 15px;
				right: 60px;
				color: #fff;
				padding: 5px;
				border: 1px solid #475f76;
				-moz-border-radius: 3px;
				-webkit-border-radius: 3px;
				border-radius: 3px;
			}

			.chart_title::before {
				content: '';
				width: 10px;
				height: 10px;
				display: inline-block;
				vertical-align: middle;
				background: #25A6FD;
				-moz-border-radius: 20px;
				-webkit-border-radius: 20px;
				border-radius: 20px;
				margin-right: 5px;
			}

			.detail_chart {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
