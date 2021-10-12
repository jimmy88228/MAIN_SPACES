<template>
		<div class="card_style">
			<div class="card_item" v-for="(item, index) in groupList" :key="item.id" @click="getGroupEdit(item.id)">
				<Card>
					<p slot="title">{{item.group_name}}</p>
					<p class="t_c"><span class="group-point">{{item.num}}</span>人</p>
				</Card>
			</div>
			<div style="width:100%;padding:100px 0px;text-align:center;background:#efefef;" v-if="groupList.length == 0 || !groupList">暂无数据</div>
		</div>
</template>
<script>
	export default{
		props: {
			groupList: {
				type: Array,
				default:[]
			},
			type: {
				type: String,
				default:""
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			getGroupEdit(id){
				this.$router.push({
					name: "group-message-edit",
					query: {
						id: id || 0,
						type: this.type
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.card_style {
		display: flex;
		flex-wrap: wrap;
		.card_item{
			width:200px;
			margin: 20px;
			cursor:pointer;
			.card_style {
				margin: 20px;
			}
			.card_son {
				width: 200px;
				float: left;
				margin: 8px;
			}
			.ivu-card.ivu-card-bordered {
				height: 150px;
			}
			.group-point{
				color:#57d5f3;
				font-size:30px;
			}
		}
	}
	
</style>