<template>
	<div class="order_data_view">
			<Row :gutter="5" class="m-top-15">
					<Col :xs="24" :sm="12" :md="8" :style="{marginBottom: '10px'}">
							<infor-card
									id-name="order_sales"
									:end-val="0"
									iconType="logo-usd"
									color="#2d8cf0"
									intro-text=""
							>
								<div slot="custom-cont" class="custom_data flex f-align-center f-just-center">
									<Tooltip :content="totalOrderEntity.total_sales" placement="top">
										<div>
											<div>实时成交金额&nbsp;&nbsp;<span class="custom_point" style="color: #2d8cf0;">{{totalOrderEntity.total_sales}}</span></div>
											<div>昨日成交金额&nbsp;&nbsp;{{totalOrderEntity.yesterday_total_sales}}</div>
										</div>
									</Tooltip>
								</div>
							</infor-card>
					</Col>
					<Col :xs="24" :sm="12" :md="8" :style="{marginBottom: '10px'}">
							<infor-card
									id-name="order_count"
									:end-val="0"
									iconType="md-document"
									color="#64d572"
									:iconSize="50"
									intro-text=""
							>
							<div slot="custom-cont" class="custom_data flex f-align-center f-just-center">
								<Tooltip :content="totalOrderEntity.today_orders" placement="top">
									<div>
										<div>实时订单总数&nbsp;&nbsp;<span class="custom_point" style="color: #64d572;">{{totalOrderEntity.today_orders}}</span></div>
										<div>昨日订单总数&nbsp;&nbsp;{{totalOrderEntity.yesterday_orders}}</div>
									</div>
								</Tooltip>
							</div>
							</infor-card>
					</Col>
					<Col :xs="24" :sm="12" :md="8" :style="{marginBottom: '10px'}">
							<infor-card
									id-name="payment_order_count"
									:end-val="0"
									iconType="logo-bitcoin"
									color="#ffd572"
									intro-text=""
							>
							<div slot="custom-cont" class="custom_data flex f-align-center f-just-center">
								<Tooltip :content="totalOrderEntity.today_pays" placement="top">
									<div>
										<div>实时支付订单&nbsp;&nbsp;<span class="custom_point" style="color: #ffd572;">{{totalOrderEntity.today_pays}}</span></div>
										<div>昨日支付订单&nbsp;&nbsp;{{totalOrderEntity.yesterday_pay_orders}}</div>
									</div>
								</Tooltip>
							</div>
							</infor-card>
					</Col>
			</Row>
			<div class="flex total_area f-just-between">
				<div v-for="(item, index) in totalData" :key="index" class="total_item flex1">
					<Card class="total_item_cont flex f-align-center f-just-center text-c">
							<div class="total_name">{{item.name}}</div>
							<p class="total_val">{{item.data}}</p>
					</Card>
				</div>
			</div>
			<Row class="m-bottom-20">
				<Col style="width:100%">
					<Card>
					    <p slot="title" class="card-title">
					        <Icon type="ios-shuffle-strong"></Icon>
					        过去30天数据分析
					    </p>
					    <div class="line-chart-con" style="height:300px;">
					        <orderCharts id="monthOrderChart" :data="monthData" :total="totalOrderEntity"></orderCharts>
					    </div>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col style="width:100%">
					<Card>
					    <p slot="title" class="card-title">
					        <Icon type="ios-shuffle-strong"></Icon>
					        过去24小时数据分析
					    </p>
					    <div class="line-chart-con" style="height:300px;">
					        <orderCharts id="todayOrderChart" :data="todayData" :total="totalOrderEntity"></orderCharts>
					    </div>
					</Card>
				</Col>
			</Row>
	</div>
</template>
<script>
	import inforCard from './inforCard.vue';
	import orderCharts from './orderCharts.vue';
	export default{
		props: ['data'],
		components:{
			inforCard,
			orderCharts
		},
		data(){
			return {
				orderInfo: {
					order_sales: 21308,					yes_order_sales: 17308,					order_count: 503,					yes_order_count: 480,					payment_order_count: 480,					yes_payment_money: 456
				},
				totalData: [
					{
						key: "today_stay_pays",
						name: "待支付",
						data: 0,
					},
					{
						key: "today_stay_shipping",
						name: "待发货",
						data: 0,
					},
					{
						key: "today_stay_refund_orders",
						name: "待退款",
						data: 0,
					},
					{
						key: "today_stay_cancel_orders",
						name: "待确认取消",
						data: 0,
					},
					{
						key: "today_stay_return_orders",
						name: "待确认退款",
						data: 0,
					},
				]
			}
		},
		computed:{
			totalOrderEntity(){
				let data = this.data || {};
				let totalData = this.totalData || [];
				let totalOrderEntity = data.totalOrderEntity || {};
				for(let i = 0; i < totalData.length; i++){
					let key = totalData[i].key;
					if(key){
						totalData[i].data = totalOrderEntity[key] || 0
					}
				}
				this.totalData = totalData;
				return totalOrderEntity;
			},
			monthData(){
				let data = this.data || {};
				return {
					xData: data.last_x,
					yData: data.last
				};
			},
			todayData(){
				let data = this.data || {};
				return {
					xData: data.today_x,
					yData: data.today
				};
			}
		},
		methods:{
		}
	}
</script>
<style lang="less">
	.order_data_view{
		.custom_data{
			height:100%;
			font-size:16px;
			.custom_point{
				color:#4293E5;
				font-size:25px;
				font-weight:bold;
			}
		}
		.total_area{
			width:100%;
			margin: 20px 0px;
			.total_item{
				margin: 0px 5px;
				.total_item_cont{
					display:flex;
					border:1px solid #dcdee2;
					border-radius:5px;
					height:100px;
					font-size: 16px;
					.total_val{
						font-size: 24px;
						font-weight:bold;
						color:#4293E5;
					}
				}
			}
		}
	}
	
</style>