<template>
	<div class="optional-item-area">
		<div class="optional-item-cont">
			<slot></slot>
		</div>
		<div class="optional-item-detail" v-if="isShowDetail">
			<div class="strong_tips optional-item-title">详细规则设置</div>
			<div class="optional-detail-cont">
				<slot name="detail"></slot>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'optional',
		props: {
			isShowDetail: {
				type: Boolean,
				default(){
					return false
				}
			}
		},
		data(){
			return {}
		}
	}
</script>
<style lang="less">
	.optional-item-area{
		padding: 5px;
		.optional-item-cont{
			display: flex;
			.optional-item{
				flex:1;
			}
		}
		.optional-item-detail{
			margin: 0px 20px;
			border: 1px solid #dcdee2;
			padding: 10px;
			padding-bottom:0px;
			border-radius: 10px;
			margin-bottom: 10px;
			.optional-item-title{
				margin-bottom: 10px;
				font-size: 12px;
			}
			.optional-detail-cont{
				transform: scale(0.90);
				transform-origin: left center;
				.ivu-form-item-label{
					color: #333;
					font-weight: bold;
				}
			}
		}
	}
</style>