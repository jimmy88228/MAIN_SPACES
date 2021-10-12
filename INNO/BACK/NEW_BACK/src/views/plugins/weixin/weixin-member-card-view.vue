<style lang="less">
.member-card-view{
	padding:10px;
	border:1px solid #ddd;
	border-radius: 5px;
	position: relative;
	background: #eee;
	
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
	.card-face-box{
		margin-top:15px;
		position: relative;
		padding:10px;
		
		.card-face{
			height:210px;
			border-radius: 10px;
			border:1px solid transparent;
			background: center center no-repeat;
			background-size:100% auto;
		}
		.logo-name-box{
			position: absolute;
			top:20px;
			left:20px;
			color:#fff;
			
			.logo{
				border-radius: 100%;
				width:45px;
				height:45px;
				border:1px solid #fff;
			}
			.brand-name{
				font-size:15px;
			}
			.title{
				font-size:12px;
				margin-top:5px;
			}
		}
		
		.code-icon{
			position: absolute;
			top:30px;
			right:20px;
			font-size: 25px;
			background: #fff;
			border-radius: 3px;
		}
		.code-text{
			position: absolute;
			bottom:20px;
			left:20px;
			font-size:16px;
			color:#fff;
		}
	}
	
	// 中部菜单
	.center-box{
		margin-top:10px;
		padding:10px;
		text-align: center;
		
		.c-title{
			font-size:12px;
		}
		.c-value{
			font-size:16px;
		}
		
		.center-button{
			margin-top:20px;
			
			.btn{
				font-size:15px !important;
				padding: 5px 25px;
				height: auto;
			}
			.sub_title{
				margin-top:5px;
				font-size:12px;
				color:#999;
			}
		}
	}
	
	// 底部菜单
	.bottom-box{
		margin-top:20px;
		border-top:1px solid #ddd;
		
		.ivu-cell{
			border-bottom:1px solid #ddd;
		}
		.ivu-cell-extra{
			color:#999;
			font-size:12px;
		}
	}
	
}	
</style>

<template>
	<div class="member-card-view">
	
		<div class="header">
			<Icon type="ios-arrow-back" class="icon"></Icon>
			<span>会员卡</span>
		</div>
		<div class="card-face-box" :style="{'background':(currCollapse=='box1'?'#fff':'none') }">
			<div class="card-face" :style="{'background-image':'url('+formItem.background_pic_url+')','background-color': ( formItem.background_pic_url == '' ? currColor : ''),}">
				<div class="logo-name-box">
					<Row :gutter="8" type="flex">
						<Col style="width:55px;">
							<img class="logo" v-if="formItem.logo_url != ''" :src="formItem.logo_url" />
						</Col>	
						<Col style="flex: 1 1 0%;">
							<div class="brand-name">{{formItem.brand_name}}</div>
							<div class="title">{{formItem.title}}</div>
						</Col>	
					</Row>
				</div>
				
				<Icon v-if="formItem.code_type =='CODE_TYPE_BARCODE' || formItem.code_type =='CODE_TYPE_QRCODE' || formItem.code_type =='CODE_TYPE_ONLY_QRCODE' || formItem.code_type =='CODE_TYPE_ONLY_BARCODE' " type="" class="code-icon ionmy ion-my-qrcode"></Icon>
				<div v-if="formItem.code_type == 'CODE_TYPE_TEXT' || formItem.code_type == 'CODE_TYPE_BARCODE' || formItem.code_type == 'CODE_TYPE_QRCODE' "  class="code-text">8888 8888 8888</div>
			</div>
		</div>
		<div class="center-box" :style="{background:(currCollapse=='box2'?'#fff':'none') }">
			<Row :gutter="8" type="flex">
				<Col :span="8">
					<div class="c-title">积分</div>
					<div class="c-value" :style="{color:currColor}">0</div>
				</Col>	
				<Col :span="8" style="border-left:1px solid #ddd;border-right:1px solid #ddd;">
					<div class="c-title">积分</div>
					<div class="c-value" :style="{color:currColor}">0</div>
				</Col>	
				<Col :span="8">
					<div class="c-title">积分</div>
					<div class="c-value" :style="{color:currColor}">0</div>
				</Col>	
			</Row>
			
			<div v-if="formItem.center_title !='' " class="center-button">
				<Button type="success" class="btn" :style="{color:currColor,border:'1px solid '+currColor,}" ghost>{{formItem.center_title}}</Button>
				<div class="sub_title">{{formItem.center_sub_title}}</div>
			</div>
		</div>
		
		<div class="bottom-box" :style="{background:(currCollapse=='box3'?'#fff':'none') }">
			<CellGroup>
				<Cell v-if="formItem.custom_url_name != ''" :title="formItem.custom_url_name" :extra="formItem.custom_url_sub_title" />
				<Cell v-if="formItem.custom_cell1_name != ''" :title="formItem.custom_cell1_name" :extra="formItem.custom_cell1_tips" />
				<Cell v-if="formItem.promotion_url_name != ''" :title="formItem.promotion_url_name" :extra="formItem.promotion_url_sub_title" />
				<Cell title="会员卡详情" extra="" />
				<Cell title="公众号" extra="" />
			</CellGroup>
		</div>
	</div>
	
</template>	

<script>
/**
 * 会员卡的预览界面 - 组件
 */
export default {
	name: 'weixinMemberCardView',
    components: {
	},
	props:{

	},
	data() {
		return {
			currColor: '',
			currCollapse: '',
			formItem:{}
		}
	},	
	methods: {
		// 提供给父组件使用
		initData( data ){
			this.formItem = data;
		}
	},
	watch:{
		'$store.state.app.wxCardCurrColor'(to){
			this.currColor = to;
		},
		'$store.state.app.wxCardCurrCollapse'(to){
			this.currCollapse = to;
		},
	}
}	
</script>	