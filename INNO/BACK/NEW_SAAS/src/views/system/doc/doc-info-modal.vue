<style lang="less">
.doc-modal{
	.ivu-modal-body{
		padding:0;
	}
}
</style>

<template>
	<Modal
		v-model="showModal"
		:loading="modalLoading"
		:title="modalTitle"
		:width="820"
		footer-hide
		:styles="{top:'20px'}"
		class="doc-modal">
		<div :style="{overflow:'auto',height:boxHeight+'px'}">
			<docInfoContent ref="doc-info-content"></docInfoContent>
		</div>
	</Modal>
</template>	

<script>
import docInfoContent from './doc-info-content.vue';

export default {
	name: 'docInfoModal',
	components: {
		docInfoContent,
	},
    data () {
    	return {
    		// 模态框
    		showModal:false, 
    		modalTitle:'',
    		modalLoading: true,
			
			boxHeight: 500,
		}
	},
	methods: {
		init(){
			this.boxHeight = document.body.clientHeight - 50;
		},
		openModal( code ){
			this.showModal = true;
			this.$refs['doc-info-content'].initData( code );
		}
	},
	mounted () {
	    this.init();
	},
}
</script>