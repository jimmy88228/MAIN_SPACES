<style lang="less">
.article-cat-table-expand{
	thead{
		display: none;
	}
	.ivu-table td{
		border-top: 1px solid #efefef;
		height:auto;
	}
	&.level3{
		.ivu-table td{
			padding:5px 0;
		}
	}
}
</style>

<template>
	<div :class="'article-cat-table-expand'+( level == 3 ? ' level3' : '' )" >
		<Table :columns="columns" :data="data"  no-data-text="暂无分类"></Table>
	</div>
</template>

<script>
/**
 * 列表，table 扩展信息
 */

export default {
  name: 'table-expand',
  components: {
  },
  props: {
    dataList: {
        	type: Array,
        	default: []
    },
    columns: {
        	type: Array,
        	default: []
    },
    // 层级
    level: {
        	type: Number,
        	default: 2
    }
   	},
  data () {
    	return {
    		data: []
    	}
  },
  methods: {
    	// 初始化
    	init () {
    		this.data = this.dataList;
    	}
  },
  mounted () {
    	this.init();
  }
}
</script>
