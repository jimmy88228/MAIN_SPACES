<style lang="less">
	
</style>

<template>
	<div>
		<userFeedback :contentType="[5]"></userFeedback>
	</div>
</template>

<script>
import userFeedback from '@/views/plugins/user-feedback/user-feedback';

/**
 * 客服工单 列表
 */
export default {
    components: {
		userFeedback,
    },
    data () {
    	return {
		}
	},
	methods: {
		
	},
}
</script>