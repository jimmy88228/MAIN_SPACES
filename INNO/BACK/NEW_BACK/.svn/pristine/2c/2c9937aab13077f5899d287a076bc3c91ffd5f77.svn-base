<template>
	<div class="optional-item">
		<div class="optional-item-cont">
			<slot></slot>
		</div>
		<div class="optional-item-detail" v-if="isShowDetail">
			<div class="s-notice optional-item-title">详细规则设置</div>
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
	.optional-item{
		.optional-item-cont{
			
		}
		.optional-item-detail{
			margin: 0px 20px;
			border: 1px solid #C5C5C5;
			padding: 10px;
			border-radius: 10px;
			margin-bottom: 10px;
			.optional-item-title{
				margin-bottom: 10px;
			}
			.optional-detail-cont{
				.ivu-form-item-label{
					color:#333;
					font-weight: bold;
				}
			}
		}
	}
</style>