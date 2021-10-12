<template>
	<div class="action_details">
		<titleBar>操作信息</titleBar>
		<div class="note">
			<label>操作备注</label>
			<Input v-model="actionNote" type="textarea" placeholder="请输入操作备注" style="width: 300px" :rows="4" />
			<Divider />
			<template v-if="todoRefund === 0 && handle.edit_order">
				<span v-for="(isShow, key) in orderButton" :key="key">
					<Button v-if="isShow" type="primary" :loading="loading" class="btn" @click="handleAction(key)">
						{{orderStatus[key].name}}
					</Button>
				</span>
			</template>
			<template v-if="todoRefund !== 0">
				<span class="alert">有退款单待处理</span>
			</template>
		</div>
		<Table :columns="columns" :data="tableData" ref="myTable"></Table>
		<Modal v-model="showRefundShipping" title="退运费金额" :mask-closable="isClose" @on-ok="confrimRefundShipping">
			<div style="text-align: center;">
				<Input v-model="shippingFree" type="number" placeholder="请输入退运费金额" class="basic_input" />
			</div>
		</Modal>
		<Modal v-model="showRefundment" title="确定退款" :mask-closable="isClose" @on-ok="confrimRefundment">
			<div>
				<!-- 普通订单 -->
				<template v-if="refundMessage.order_type !== 2">
					<div style="margin-bottom: 20px;">
						<label style="margin-right: 20px;">退款金额:</label>
						<Input v-model="returnMoney" type="number" placeholder="请输入金额" class="basic_input" />
					</div>
				</template>
				<!-- 预售订单 -->
				<template v-if="refundMessage.order_type == 2">
					<div style="margin-bottom: 20px;">
						<label style="margin-right: 20px;">定金金额:</label>
						<Input v-model="returnMoneyDeposit" type="number" placeholder="请输入金额" class="basic_input" :disabled="refundMessage.isallow_return_deposit === 0" />
					</div>
					<div style="margin-bottom: 20px;">
						<label style="margin-right: 20px;">尾款金额:</label>
						<Input v-model="returnMoneyTail" type="number" placeholder="请输入金额" class="basic_input" />
					</div>
				</template>
				<div style="margin-bottom: 20px;">
					<label style="margin-right: 20px;">退款方式:</label>
					<RadioGroup v-model="refundWay">
						<Radio label="3">微信原路退回</Radio>
						<Radio label="2">线下操作退款</Radio>
					</RadioGroup>
				</div>
				<div style="display: flex;">
					<label style="margin-right: 20px;">退款备注:</label>
					<div>
						<Input v-model="returnMoneyNote" type="textarea" placeholder="请输入备注" :row="3" style="width: 260px;" />
					</div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import Mixin from './action-mixin';
	import orderStatus from './order-status';

	export default {
		props: {
			actionList: {
				type: Array,
				required: true
			},
			orderButton: {
				type: Object,
				required: true
			},
			refundMessage: {
				type: Object,
				required: true
			},
			sn: {
				required: true
			},
			handle: {
				type: Object,
				default: () => {},
			},
			deliverSn: String | Array,
			todoRefund: Number
		},
		data() {
			return {
				actionNote: '',
				orderStatus: orderStatus,
				loading: false,
				showRefundShipping: false,
				shippingFree: 0,
				showRefundment: false,
				returnMoney: 0,
				returnMoneyDeposit: 0,
				returnMoneyTail: 0,
				refundWay: "3",
				// 缓存数据
				temp: {
					returnMoney: 0,
					returnMoneyDeposit: 0,
					returnMoneyTail: 0
				},
				// 退款单独的备注
				returnMoneyNote: '',
				isClose: false
			}
		},
		mixins: [Mixin],
		components: {
			titleBar
		},
		watch: {
			actionList: {
				handler(newVal) {
					this.tableData = newVal;
				}
			},
			refundMessage(nV) {
				this.returnMoney = nV.return_money;
				this.returnMoneyDeposit = nV.deposit_money_paid;
				this.returnMoneyTail = nV.tail_money_paid;
				this.temp = {
					returnMoney: nV.return_money,
					returnMoneyDeposit: nV.deposit_money_paid,
					returnMoneyTail: nV.tail_money_paid
				};
			}
		},
		methods: {
			confrimRefundShipping() {
				this.handleConfirm('refund_shipping', {
					shipping_free: this.shippingFree
				});
			},
			confrimRefundment() {
				if (this.refundMessage.order_type !== 2) {
					if (this.returnMoney > this.temp.returnMoney) {
						this.$Message.error('不能大于应退金额!');
						return false;
					}
				} else {
					if (this.returnMoneyDeposit > this.temp.returnMoneyDeposit) {
						this.$Message.error('不能大于定金金额!');
						return false;
					}
					if (this.returnMoneyTail > this.temp.returnMoneyTail) {
						this.$Message.error('不能大于尾款金额!');
						return false;
					}
				}
				this.handleConfirm('refundment', {
					return_type: this.refundWay,
					return_money: this.returnMoney,
					return_money_deposit: this.returnMoneyDeposit,
					return_money_tail: this.returnMoneyTail,
					action_note: this.returnMoneyNote
				});
			},
			handleAction(key) {
				this.orderStatus[key].cb.call(this);
			},
			handleConfirm(key, params = {}) {
				if (this.orderStatus[key].tip) {
					this.$Modal.confirm({
						title: '操作提示',
						content: this.orderStatus[key].tip,
						onOk: () => {
							this.handleForBack(key, params);
						}
					})
				} else {
					this.handleForBack(key, params);
				}
			},
			handleForBack(key, params = {}) {
				this.loading = true;
				return this.$ajax.post(this.$api.MatrixOrderInfoUpdate, {
						order_id: this.sn,
						button_type: key,
						action_note: this.actionNote,
						...params
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.$emit('reload');
						}
						this.loading = false;
					});
			}
		}
	}
</script>

<style lang="less" scoped>
	.action_details {
		border: 1px solid #ddd;
		padding: 5px;
		border-radius: 5px;
		margin-top: 10px;

		.note {
			margin: 10px;

			label {
				display: inline-block;
				margin-right: 10px;
			}

			.alert {
				font-size: 18px;
				font-weight: 600;
				color: red;
			}
		}

		.btn {
			margin-right: 10px;
		}
	}
</style>
