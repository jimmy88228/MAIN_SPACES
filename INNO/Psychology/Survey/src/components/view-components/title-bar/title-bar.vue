<style lang="less" scoped>
.title-bar{
	position: relative;
    padding: 10px;
    line-height: 20px;
    background: #f8f8f8;
    margin: 10px 0;

	.title{
		display: inline-block;
	    margin: 0 12px 0 0;
	    padding: 0 0 0 5px;
	    font-size: 14px;
	    font-weight: 700;
	    line-height: 20px;
      border-left: 4px solid #2d8cf0;
	}
}
</style>
<template>
	<div class="title-bar" :style="titleBarStyle">
		<h3 class="title" :style="titleStyle">
			<slot></slot>
		</h3>
	</div>
</template>

<script>
export default {
  name: 'titleBar',
  components: {},
  props: {
    titleBarStyle:{
      type:String,
      default:""
    },
    titleStyle:{
      type:String,
      default:""
    },
  },
  data () {
    return {

    }
  },
}
</script>
