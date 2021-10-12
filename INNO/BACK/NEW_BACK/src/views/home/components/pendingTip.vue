<template>
	<Modal class-name="pending-tip" :width="500" v-model="isShowModal" :mask="false" :footer-hide="true" @on-visible-change="changeModal">
			<div slot="title">待处理订单提醒</div>
			<div v-if="showCoupon">
				<div class="inline-b">
					<div class="flex f-align-center coupon-tip" @click="getDetail('coupons-list')">
						<Icon type="ios-notifications coupon-ring" color="#4190E2" size="20"/>&nbsp;&nbsp;<span>优惠券库存紧张</span>&nbsp;<Icon size="20" color="#4190E2" class="coupon-arrow" type="ios-arrow-forward" />
					</div>
				</div>
			</div>
			<div class="tip-items-tit">待处理订单提醒</div>
			<div class="flex tip-items">
					<div class="tip-item f-shrink0 text-c" v-for="(item, index) in viewData" :key="item.key" @click="getDetail(item.route, item.params)">
						<p>{{item.name}}</p>
						<p class="tip-t">{{totalOrderEntity[item.key] || 0}}</p>
					</div>
			</div>
			<div slot="footer">
					<Button type="primary" @click="isShowModal = false">确定</Button>
			</div>
	</Modal>
</template>
<script>
	export default{
		data(){
			return {
				isShowModal: false,
				totalOrderEntity: {},
				viewData: [
					{
						name: "新增支付订单",
						key: "last_24hour_pay_orders",
					},
					{
						name: "取消订单申请",
						key: "last_24hour_stay_cancel_orders",
						route: "order-list",
						params: {
							order_status: "11"
						}
					},
					{
						name: "退货申请",
						key: "last_24hour_stay_return_orders",
						route: "return-order-list",
						params: {
							act: "all"
						}
					}
				],
				showCoupon: false
			}
		},
		computed:{
			
		},
		methods:{
			showModal(totalOrderEntity){
				if(this.$store.state.setHidePendingTip) return;
				this.$nextTick(()=>{
					this.isShowModal = true;
					this.totalOrderEntity = totalOrderEntity;
					this.getBonusStock()
				})
			},
			getBonusStock(){
				this.$ajax.post(this.$api.getBonusStock).then((response)=>{
					let res = response.data || {};
					if(res.code){
						this.showCoupon = res.data;
					}
				})
			},
			changeModal(val){
				if(!val){
					this.$store.commit("setHidePendingTip", true);
				}
			},
			getDetail(name, params){
				if(name){
					this.$router.push({
					  name: name,
						query: params ? params : {} 
					});
				}
				
			}
		}
	}
</script>
<style lang="less">
	.pending-tip{
		overflow: hidden;
		.ivu-modal{
			position:absolute;
			right: 30px;
			bottom: 20px;
			top: auto;
			left: auto;
			.ivu-modal-content{
				border:1px solid #efefef;
			}
		}
		
		.coupon-tip{
			background-color:#F4F8FD;
			border:1px solid #E3E3E2;
			border-radius: 5px;
			padding: 10px;
			cursor: pointer;
		}
		.tip-items-tit{
			padding: 10px;
		}
		.tip-items{
			display:flex;
			justify-content: space-around;
			.tip-item{
				width: 120px;
				height: 80px;
				background-color:#F4F8FD;
				color:#4190E2;
				border-radius: 5px;
				border:1px solid #E5E5E5;
				font-size: 14px;
				padding: 5px;
				cursor: pointer;
				.tip-t{
					font-size: 36px;
					margin-top: 5px;
					word-wrap: break-word;
					line-height: 36px;
				}
			}
		}
	}
	// .pending-tip{
	// 	.isShow{
	// 			.ivu-modal{
	// 				// transform: translateX(-20px);
	// 			}
	// 		}
	// }
</style>