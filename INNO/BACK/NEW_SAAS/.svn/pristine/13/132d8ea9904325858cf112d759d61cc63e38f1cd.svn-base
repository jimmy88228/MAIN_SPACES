<style lang="less">
body{
    font-family: '微软雅黑';
    overflow: hidden auto;
}	
.article-info{
	margin:0 auto;
	width: 820px;
}	
</style>

<template>
	<div class="article-info">
		<docInfoContent ref="doc-info-content"></docInfoContent>
	</div>
</template>	

<script>
import docInfoContent from './doc-info-content.vue';

/**
 * 用于新开页面，显示文档详情
 */
export default {
	name: 'docInfo',
    components: {
		docInfoContent,
    },
    data () {
        return {
        	code: '',
        }
    },
    methods: {
    	// 初始化方法
        init () {
        	this.code = this.$route.params.code != null && this.$route.params.code != '' ? this.$route.params.code : '';
        	this.$refs['doc-info-content'].initData( this.code );
        },
    },
    mounted () {
        this.init();
    },
}
</script>
