<style lang="less">
	.lottery-type{
		padding: 50px 0px;
		background-color:#fff;
		min-height: calc(100vh - 100px);
		.type-items{
			display:inline-block;
			margin:0px 15px;
			margin-bottom: 10px;
			.type-item{
				width:200px;
				height: 140px;
				background-size: 100% auto;
				background-position:center center;
				background-repeat: no-repeat;
				cursor: pointer;
			}
		}
	}
</style>
<template>
	<div class="lottery-type">
		<div class="type-items" v-for="(item, index) in lotteryTypeList" :key="index" >
			<div class="" @click="getLotteryList(item.type_code)">
				<Card class="type-item" :style="{'background-image': 'url(' + item.logo + ')'}"></Card>
			</div>
		</div>
	</div>
</template>
<script>
	import { typeCode } from '@/views/matrix/plugins/lottery/typeMap.js';
	export default{
		data(){
			return {
				lotteryTypeList: []
			}
		},
		mounted(){
			this.getLotteryType();
		},
		methods:{
			getLotteryType(){
				return this.$ajax.post(this.$api.MatrixLotteryActivityType).then(response => {
					const res = response.data;
					if (res.code) {
						let data = res.data || {};
						this.lotteryTypeList = data.items || [];
					} else {
						this.$Message.error(res.message);
					}
				})
			},
			getLotteryList(type_code){
				if(!type_code) return;
				let act = typeCode[type_code];
				if(act){
					this.$router.push({
						name: `matrix-${act}-details-add`,
						query: {}
					})
				} else {
					this.$Message.error("无效模板类型")
				}
			}
		}
	}
</script>