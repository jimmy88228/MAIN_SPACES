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
		<Modal v-model="showApplyReturn"  :width="1000" :mask-closable="isClose" :closable="false" >
			<div>
				<Table  border ref="selection" :columns="applyColumns" :data="applyData" @on-select="handleSelectData">
					<template slot-scope="{ row }" slot="goods_thumb">
						<div>
							<img :src="row.goods_thumb" width="60" height="60" />
						</div>
					</template>
						<template slot-scope="{ row,index }" slot="return_num">
						<div>
							<span v-if="Number(row.return_num)==0" style="color:red;">已全退货</span>
							<InputNumber v-else :max="row.return_num" :min="0" v-model="row.return_number" @on-change="(val)=>changeReturnNum(val,row,index)"></InputNumber>
						</div>
					</template>
					<template slot-scope="{ row,index }" slot="return_type" >
						<div>
						<Select v-model="row.return_value" transfer @on-change="(val)=>changeReturnValue(val,row,index)">
							<Option v-for="(item, index) in row.return_type" :value="index" :key="index">{{ item }}</Option>
						</Select>
						</div>
					</template>
					<template slot-scope="{ row,index }" slot="reason">
						<div>
						<Select v-model="row.reason_value" transfer @on-change="(val)=>changeReasonValue(val,row,index)">
							<Option v-for="(item, index) in row.reason" :value="index" :key="index">{{ item }}</Option>
						</Select>
						</div>
					</template>
					<template slot-scope="{ row,index }" slot="return_remark">
						<div>
							<Input v-model="row.return_remark" type="textarea" @on-focus="fourReturnRemark(index)" @on-blur="changeReturnRemark(row.return_remark,row,index)" :autosize="{minRows: 2,maxRows: 5}" placeholder="" />
						</div>
					</template>
					
				</Table>
				<!-- <Button @click="handleSelectAll(true)">Set all selected</Button>
				<Button @click="handleSelectAll(false)">Cancel all selected</Button> -->
				
			</div>
			<div slot="footer">
				<Button type="default" @click="showApplyReturn = false">取消</Button>
				<Button type="primary" @click="confrimApplyReturn">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import Mixin from './action-mixin';
	import orderStatus from './order-status';
	import applyGoodsColumns from './apply-goods-columns';

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
			applyGoodsData:  {
				type: Array,
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
			deliverSn: String,
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
				showApplyReturn:false,
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
				isClose: false,
				selectApplyIds: []
			}
		},
		mixins: [Mixin,applyGoodsColumns],
		components: {
			titleBar
		},
		watch: {
			actionList: {
				handler(newVal) {
					this.tableData = newVal;
				}
			},
			applyGoodsData:{
				handler(newVal) {
					// console.log("newVal",newVal);
					//拼接存放的
					if(newVal.length>0){
						this.applyData = JSON.parse(JSON.stringify(newVal)) || [];
						for(var i=0;i<newVal.length;i++){
							if(Number(newVal[i].return_num)==0){
								// newVal[i]._disabled=true;
								this.$set(this.applyData[i], "_disabled", true);
							}
							if(!newVal[i].return_value){
								// newVal[i].return_value="1";
								this.$set(this.applyData[i], "return_value", "1");
							}
							if(!newVal[i].reason_value){
								// newVal[i].reason_value="0";
								this.$set(this.applyData[i], "reason_value", "0");
							}
							this.$set(this.applyData[i], "_checked", false);
							// newVal[i].return_number = newVal[i].return_num;
							this.$set(this.applyData[i], "return_number", newVal[i].return_num);
						}
					}
				},
				deep: true
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
			changeReturnNum(val, row,index){
				if(Number(val)==0){
					this.$set(this.applyData[index], "_disabled", true);
				}else{
					this.$set(this.applyData[index], "_disabled", false);
				}
				this.$set(this.applyData[index], "return_number", val);
			},
			changeReturnValue(val, row,index){
				this.$set(this.applyData[index], "return_value", val);
			},
			fourReturnRemark(index){

			},
			changeReasonValue(val,row,index){
				this.$set(this.applyData[index], "reason_value", val);
			},
			changeReturnRemark(val,row,index){
				this.$set(this.applyData[index], "return_remark", val);
			},
			handleSelectData(selection, row){
				let rowId = row.goods_id;
				let isSelect = false, selectApplyIds = [];
				for(let i = 0; i < selection.length; i++){
					if(rowId == selection[i].goods_id){
						isSelect = true;
					}
					selectApplyIds.push(selection[i].goods_id);
				}
				this.selectApplyIds = selectApplyIds || [];
				for(let i = 0; i < this.applyData.length; i++){
					if(this.applyData[i]['goods_id'] == rowId){
						this.$set(this.applyData[i], "_checked", isSelect);
						break;
					}
				}
			},
			confrimApplyReturn(){
				if(this.selectApplyIds.length == 0){
					this.$Message.error("请选择申请退货的商品！");
					return;
				}
				let rule=[];
				//验证数据有没填
				let goodsApplyData=[];
				for(var i = 0; i < this.applyData.length; i++){
					let _data = this.applyData[i] || {};
					if(this.selectApplyIds.indexOf(Number(_data.goods_id))){
						if(Number(_data.reason_value)==0){
							rule.push("请选择"+_data.goods_name+"的退货原因！");
						}
						if(!_data.return_remark){
							rule.push("请输入"+_data.goods_name+"的退货具体原因！");
						}
						goodsApplyData.push(_data );
					}
				}
				if(rule.length>0){
					this.$Message.error(rule.join('<br/>'));
				}else{
					this.showApplyReturn = false;
					this.handleConfirm('apply_return', {
						goodsApplyData:goodsApplyData
					});
				}
			},
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
				return this.$ajax.post(this.$api.OrderInfoUpdate, {
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
		},
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
