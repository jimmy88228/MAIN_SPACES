<template>
	<div class="order-info">
		<Card>
			<Button type="default" @click="Callback" class="m-bottom-10">返回</Button>
			<div class="order_header">
				<Row class="order_header_inner">
					<Col span="8" class="order_intro">
					<div class="order_status">
						<Form ref="form" :label-width="72" label-colon>
							<FormItem label="订单号">
								<p>{{ordreMessage.order_sn}}</p>
							</FormItem>
							<FormItem label="下单时间">
								<p>{{ordreMessage.create_time}}</p>
							</FormItem>
							<FormItem label="订单状态">
								<p>{{currentStatus}}</p>
							</FormItem>
						</Form>
					</div>
					<div class="order_handle">
						<Button v-for="item in statusList" :key="item.key" size="small" type="primary" class="btn">{{item.value}}</Button>
					</div>
					<Divider class="hor_divider" />
					<p>备注: {{remark}}
						<Poptip placement="right" width="320" v-model="isVisible">
							<a>修改</a>
							<div slot="title">备注信息</div>
							<div slot="content">
								<div>
									<label>备注：</label>
									<Input style="width: 200px;" type="textarea" placeholder="备注原因" v-model="orderNote" />
								</div>
								<div style="margin-top: 10px;text-align: right;padding-right: 30px;">
									<Button size="small" type="text" @click="cancelNote">取消</Button>
									<Button size="small" type="primary" @click="confirmPop">确认</Button>
								</div>
							</div>
						</Poptip>
					</p>
					</Col>
					<Col span="16">
					<div class="order_steps">
						<Steps :current="currentOrderType">
							<Step title="买家下单" :content="firstStep"></Step>
							<Step title="买家付款" :content="secondStep"></Step>
							<Step title="卖家发货" :content="thirdStep"></Step>
							<Step title="确认收货" :content="FourthStep"></Step>
						</Steps>
					</div>
					</Col>
				</Row>
			</div>
			<order-details :order-address="orderAddress" :ordre-message="ordreMessage" :order-money="orderMoney" :province-list="address"
			 :sn="sn" :pay-note="payNote" :buy-user="buyUser" :consignee-message="consigneeMessage" :goods-belonging="goodsBelonging"></order-details>
			<goods-details :order-goods="orderGoods" :goods-columns="goodsColumns" :order-money="orderMoney"></goods-details>
			<action-details :action-list="actionList" :apply-goods-data="applyGoodsData" :order-button="orderButton" :refund-message="refundMessage" :sn="sn"
			 :deliver-sn="orderAddress.deliver_sn" :todo-refund="todoRefund" :handle="handle" @reload="loadData"></action-details>
			<div class="order_footer">
			 	<Button type="default" @click="Callback">返回</Button>
			</div>
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Card>
	</div>
</template>

<script>
	import OrderDetails from './order-details';
	import GoodsDetails from './goods-details';
	import ActionDetails from './action-details'

	export default {
		props: ['sn'],
		data() {
			return {
				spinShow: false,
				isVisible: false,
				orderNote: '',
				ordreMessage: {},
				orderAddress: {},
				orderMoney: {},
				applyGoodsData: [],
				// 省份联动
				address: [],
				remark: '',
				orderGoods: [],
				goodsColumns: [],
				orderType: {},
				currentOrderType: 1,
				currentStatus: '',
				// 这里的columns前端自定义，不取接口
				actionList: [],
				payNote: '',
				statusList: [],
				// 收货人详细详细
				buyUser: {},
				consigneeMessage: [],
				// 所属店铺
				goodsBelonging: {},
				orderButton: {},
				// 确定退款
				refundMessage: {},
				todoRefund: 0,
				// 订单操作权限
				handle: {}
			}
		},
		computed: {
			// 不规范写法，有空再和接口讨论
			firstStep() {
				return this.orderType["0"];
			},
			secondStep() {
				return this.orderType["1"];
			},
			thirdStep() {
				return this.orderType["2"];
			},
			FourthStep() {
				return this.orderType["3"];
			}
		},
		components: {
			OrderDetails,
			GoodsDetails,
			ActionDetails
		},
		mounted() {
			this.loadData();
		},
		methods: {
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.orderInfo, {
					order_id: this.sn,
					orderTypeValue: ''
				}).then(response => {
					const res = response.data;
					if (res.code) {
						this.spinShow = false;
						let {
							ordreMessage,
							orderAddress,
							orderMoney,
							address,
							orderGoods,
							goodsColumns,
							orderType,
							orderTypeValue,
							orderOperation,
							adminRemark,
							orderButtom,
							buyerInformation,
							goodsBelonging,
							order_message,
							orderButton,
							refundMessage,
							apply_goods_return,
							todo_refund,
							handle
						} = res.data;
						this.ordreMessage = ordreMessage;
						this.orderAddress = orderAddress;
						this.orderMoney = orderMoney;
						this.address = address;
						// 操作备注
						this.remark = adminRemark;
						this.orderNote = this.remark;
						// 支付备注
						this.payNote = ordreMessage.pay_note;
						this.orderGoods = orderGoods;
						this.goodsColumns = goodsColumns;
						this.orderType = orderType;
						this.buyUser = buyerInformation.buyUser;
						this.consigneeMessage = buyerInformation.consigneeMessage;
						this.goodsBelonging = goodsBelonging;
						// 当前所处的订单状态
						this.currentOrderType = Number(orderTypeValue);
						this.currentStatus = order_message;
						this.actionList = orderOperation.action_list;
						this.orderButton = orderButton;
						this.refundMessage = refundMessage;
						this.applyGoodsData	= apply_goods_return;
						// 判断当前是否有待退款单 0 代表没有， 非0代表还有
						this.todoRefund = todo_refund;
						this.handle = handle;
					}
				})
			},
			cancelNote() {
				this.isVisible = false;
			},
			Callback(){
				this.$router.push({
					name: 'order-list'
				});
			},
			confirmPop() {
				if (!this.orderNote.trim()) {
					this.isVisible = true;
					this.$Message.error('请输入备注');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.orderAdminRemark, {
					order_id: this.sn,
					remark: this.orderNote,
					remark_type: 'admin_remark' // admin_remark订单备注 pay_note支付备注（用于订单详情）
				}).then(response => {
					const res = response.data;
					if (res.code) {
						this.$Message.success(res.message);
						this.remark = res.data.remark;
					} else {
						this.$Message.error(res.message);
					}
					this.spinShow = false;
					this.isVisible = false;
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.order-info {
		.order_title {
			display: flex;
			align-items: center;

			.order-form_back {
				margin-right: 20px;
			}
		}

		.order_header {
			border: 1px solid #ddd;
			padding: 5px;
			border-radius: 5px;
			margin-top:5px;

			.order_header_inner {
				display: flex;
				align-items: center;

				.order_intro {
					border-right: 1px solid #ddd;
					padding-right: 5px;

					.order_status {
						font-size: 14px;
					}

					.order_handle {
						margin-top: 10px;

						.btn {
							margin-right: 4px;
						}
					}

					.hor_divider {
						margin: 10px 0;
					}
				}

				.order_steps {
					padding-left: 5px;
				}
			}
		}
	}
</style>
<style lang="less">
	.order-info {
		.ivu-form-item {
			margin-bottom: 0;
		}
		.order_footer {
			text-align:center;
			margin-top:10px;
		}
		
	}
</style>
