<style lang="less">
.member-card-actview{
	padding:10px;
	border:1px solid #ddd;
	border-radius: 5px;
	position: relative;
	
	.header{
		line-height: 40px;
		border-bottom: 1px solid #ddd;
		padding-left: 40px;
		
		.icon{
			position: absolute;
			font-size:28px;
			left: 10px;
			top: 15px;
		}
	}
	
	.act-body-box{
		margin-top:20px;
		margin-bottom: 30px;
		padding:10px;
		min-height:300px;
		border-radius: 20px;
		border:1px solid #ddd;
		
		.section-title{
			color:#ddd;
			line-height: 50px;
		}
		.ivu-cell{
			border-bottom:1px solid #eee;
		}
		
		.btn{
			text-align: center;
			margin: 20px 10px 10px 10px;
		}
	}
}
</style>

<template>
	<div class="member-card-actview">
		<div class="header">
			<Icon type="ios-arrow-back" class="icon"></Icon>
			<span>激活会员卡</span>
		</div>
		
		<div class="act-body-box">
			<div class="section-title">必须信息</div>
			<CellGroup>
				<Cell v-for="(item,index) in formItem.required_form" :key="index" 
					:title="getName( item )" extra="〉" />
			</CellGroup>
			
			<div class="section-title" style="margin-top:20px;">选填信息</div>
			<CellGroup>
				<Cell v-for="(item,index) in formItem.optional_form" :key="index"
					:title="getName( item )" extra="〉" />
			</CellGroup>
			
			<div class="btn">
				<Button type="success" long>激活</Button>
			</div>
		</div>
	</div>
</template>	

<script>
/**
 * 会员卡的激活预览界面 - 组件
 */
export default {
	name: 'weixinMemberCardActview',
    components: {
	},
	props:{

	},
	data() {
		return {
			formItem:{},
			
			commonFieldIdList:[],
		}
	},	
	methods: {
		// 提供给父组件使用
		initData( data, cardInfo ){
			this.formItem = data;
			
			this.commonFieldIdList = cardInfo.commonFieldIdList1;
		},
		getName( code ){
			for(var i in this.commonFieldIdList){
				if( code == this.commonFieldIdList[i].code ){
					return this.commonFieldIdList[i].name;
				}
			}
			return 'xxx';
		}
	},
}	
</script>