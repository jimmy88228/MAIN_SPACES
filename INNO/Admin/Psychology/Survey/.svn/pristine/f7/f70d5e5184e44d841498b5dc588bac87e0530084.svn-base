<template>
	<div class="optional-area" :style="{'border-color': color, 'maxWidth': maxWidth}">
		<div>
			<div class="optional-tip" :style="{'background-color': color}">
				<Icon type="ios-switch" size="16" color="#fff"/>&nbsp;{{title}}
			</div>
		</div>
		<div class="optional-content" :style="contentStyle">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	export default{
		name: "optionalArea",
		props: {
			maxWidth: {
				type: String | Number,
				default(){
					return '100%'
				}
			},
			color: {
				type: String,
				default(){
					return "#2F8CEE";
				}
			},
			title: {
				type: String,
				default(){
					return "可选项"
				}
			},
			contentStyle: {
				type: String,
				default:""
			}
		},
		data(){
			return {}
		},
		methods:{}
	}
</script>
<style lang="less">
	.optional-area{
		padding: 10px;
		border-radius: 10px;
		border: 1px solid #efefef;
		margin-bottom: 10px;
		margin-right: 10px;
		.optional-tip{
			border-radius: 100px;
			display: inline-block;
			padding: 3px 10px;
			color:#fff;
		}
		.optional-content{
			padding:18px 10px;
			padding-bottom: 0px;
			// display: flex;
			// flex-wrap: wrap;
			// align-items: flex-start;
		}
		.ivu-form-item{
			.ivu-form-item-content{
				line-height:25px;
			}
		}
		
	}
</style>