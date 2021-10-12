<template>
		<Card class="card_item">
			<p slot="title">{{cardItem.group_name}}</p>
			<p class="t_c"><span class="group-point" @click="gotomessage(cardItem.id)">{{cardItem.num}}</span>人</p>
		</Card>
</template>
<script>
	export default{
		props: {
			cardItem: {
				type: Object,
				default:{}
			}
		},
		data(){
			return {
				
			}
		}
	}
</script>
<style lang="less">
	.card_item{
		width:200px;
		margin: 20px;
		.card_style {
			margin: 20px;
		}
		.card_son {
			width: 200px;
			float: left;
			margin: 10px;
		}
		.ivu-card.ivu-card-bordered {
			height: 150px;
		}
		.group-point{
			color:#57d5f3;
			font-size:30px;
			cursor:pointer;
		}
	}
</style>