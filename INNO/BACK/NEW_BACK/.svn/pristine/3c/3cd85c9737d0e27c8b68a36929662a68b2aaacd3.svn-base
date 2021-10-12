<style lang="less">
.webapi-docs{
	.ivu-card-body{
		padding: 3px 3px 0 3px;
	}
}
</style>
	
<template>
	<div class="webapi-docs">
		<Card>
			<iframe :src="src" :style="{width:'100%',height:cardHeight+'px'}" frameborder="0"></iframe>
		</Card>
	</div>
</template>	

<script>
export default {
	data() {
	    return {
			src: '',
			cardHeight: 500,
		}
	},
	methods: {
		init(){
			this.src = this.$util.apiHost + '/../docs/index.html';
			this.cardHeight = document.body.clientHeight - 85;
		}
	},
	mounted () {
	    this.init();
	}
}	
</script>	