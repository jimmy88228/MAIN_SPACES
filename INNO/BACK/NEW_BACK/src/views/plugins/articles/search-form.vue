<style lang="less">
.articles-search-form{
	.ivu-form-item{
        margin-bottom: 10px;
    }
	.ivu-input-icon-clear{
		right:50px;
    }
}
</style>

<template>
	<div class="articles-search-form">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				文章分类：
        		<Select v-model="formSearch.cat_id" style="width:200px;" placeholder="文章分类" clearable>
        			<Option value="-1">全部分类</Option>
        			<Option v-for="(item,index) in catTree" :value="item.cat_id" :key="index" :label="item.cat_name">
        				<span v-if="item.level==1">&nbsp;&nbsp;</span>
        				<span v-else-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        				<span>{{item.cat_name}}</span>
        			</Option>
        		</Select>
		    </FormItem>
    		<FormItem>
	            <Input v-model="formSearch.searchq" style="width:200px;" placeholder="文章标题 模糊查询" clearable search enter-button
				    @on-search="searchPage"
				    @on-clear="searchPage"
				    @keydown.native.enter.prevent ="searchPage"></Input>
	        </FormItem>
    	</Form>
	</div>
</template>

<script>
/**
 * 文章列表 搜索框
 */

export default {
  name: 'searchForm',
  components: {

  },
  props: {
  },
  data () {
    	return {
      // 搜索表单
        	formSearch: {
        		searchq: '',
        		cat_id: 0
        	},

        	catTree: []
    	}
   	},
   	methods: {
    	// 初始化
    	init () {

    	},
    	initData (catTree) {
    		this.catTree = catTree;
    	},
    	// 搜索按钮触发
    	searchPage () {
    		this.$emit('on-search', this.formSearch);
    	}
  },
  watch: {

  },
  mounted () {
    	this.init();
  }
}
</script>
