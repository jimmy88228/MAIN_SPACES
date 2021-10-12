<template>
	<div class="reward-row-area flex f-align-center ">
		<Card>
			<Icon type="ios-close-circle" size="20" color="#2F8CEE" class="remove-icon" @click="removeReward"/>
			<div slot="title">完成邀请&nbsp;<InputNumber v-model="rewardItem.user_count"/>&nbsp;人及以上,每邀请1人奖励</div>
			<div class="reward-rows">
				<div class="reward-row flex" v-for="(item, index) in rewardList" :key="item.key" v-if="(item.key =='point_multiple' && type == 'order') || item.key !='point_multiple'">
					<Checkbox v-model="item.select">{{item.name}}</Checkbox>
					<div>
						<div v-if="item.key == 'point'"><InputNumber v-model="rewardItem.point"/>&nbsp;积分</div>
						<div v-if="item.key == 'point_multiple'"><InputNumber v-model="rewardItem.point_multiple"/>&nbsp;倍积分 （按订单实付金额的倍数赠送）</div>
						<div v-if="item.key == 'redpack_activity_ids'">
							<selectView :data="rewardItem.redpack_data" type="checkbox" @del-tag="handleBonusClose">
								<Button type="primary" @click="chooseRedpackage">选择红包</Button>
							</selectView>
						</div>
						<div v-if="item.key == 'coupon_ids'">
							<selectView :data="rewardItem.bonus_data" type="checkbox" @del-tag="handleRedPackClose">
								<Button type="primary" @click="chooseCoupon">选择优惠券</Button>
							</selectView>
						</div>
					</div>
				</div>
			</div>
		</Card>
	</div>
</template>
<script>
	import selectView from '@/views/my-components/list-component/index-edit'
	export default{
		components:{
			selectView
		},
		props: {
			rewardItem: {
				type: Object,
				default(){
					return {}
				}
			},
			type: {
				type: String,
				default(){
					return "";
				}
			}
		},
		data(){
			return {
				rewardList: [
					{
						key: 'point',
						name: '赠送积分',
						select: false,
					},
					{
						key: 'point_multiple',
						name: '订单赠送X倍积分',
						select: false,
					},
					{
						key: 'redpack_activity_ids',
						name: '红包',
						select: false,
					},
					{
						key: 'coupon_ids',
						name: '优惠券',
						select: false,
					}
				]
			}
		},
		methods:{
			handleBonusClose(data){
				this.rewardItem.bonus_data = data || [];
			},
			handleRedPackClose(data){
				this.rewardItem.redpack_data = data || [];
			},
			chooseRedpackage(){
				this.$selectModule({
					mode: "redPacket",
					data: this.rewardItem.redpack_data,
					getList:(data)=>{
						this.rewardItem.redpack_data = data || [];
						let ids = ""
						for(let i = 0; i < data.length; i++){
							let id = data[i].id || 0;
							if(id){
								ids = ids ? ids + ',' + id : id;
							}
						}
						this.rewardItem.redpack_activity_ids = ids || '';
					}
				})
			},
			chooseCoupon(){
				this.$selectContent({
					mode: "coupon",
					data: this.rewardItem.bonus_data,
					getList:(data)=>{
						this.rewardItem.bonus_data = data || [];
						let ids = ""
						for(let i = 0; i < data.length; i++){
							let id = data[i].id || 0;
							if(id){
								ids = ids ? ids + ',' + id : id;
							}
						}
						this.rewardItem.coupon_ids = ids || '';
					}
				})
			},
			removeReward(){
				this.$emit("removeReward");
			}
		},
		watch:{
			rewardItem:{
				handler(nV, oV){
					let rewardList = this.rewardList || [];
					for(let i = 0; i < rewardList.length; i++){
						let key = rewardList[i].key;
						rewardList[i].select = nV[key] && nV[key] != 0 ? true : false;
					}
					this.rewardList = rewardList;
				},
				deep: true,
				immediate: true
			}
		}
	}
</script>
<style lang="less">
	.reward-row-area{
		// border-bottom:1px solid #efefef;
		width: 100%;
		position:relative;
		padding: 10px;
		.ivu-card{
			width:100%;
		}
		.remove-icon{
			opacity: 0;
			position: absolute;
			top:0px;
			right:0px;
			transform: translate(40%, -40%);
			cursor: pointer;
		}
		.reward-rows{
			padding-left:20px;
			.reward-row{
				margin: 10px 0px;
				.ivu-checkbox-wrapper{
					width: 150px;
					flex-shrink: 0;
				}
			}
		}
	}
	.reward-row-area:hover{
		.remove-icon{
			opacity: 1;
		}
	}
</style>