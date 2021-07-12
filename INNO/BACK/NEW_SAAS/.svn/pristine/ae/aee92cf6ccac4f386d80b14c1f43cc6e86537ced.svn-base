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
				分类：
        		<Select v-model="formSearch.cat_id" style="width:180px;" placeholder="分类" clearable transfer>
        			<Option value="0">全部分类</Option>
        			<Option v-for="(item,index) in catTree" :value="item.id" :key="index" :label="item.name">
        				<span v-if="item.level==1">&nbsp;&nbsp;</span>
        				<span v-else-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        				<span>{{item.name}}</span>
        			</Option>
        		</Select>
		    </FormItem>
    		<FormItem>
	            <Input v-model="formSearch.searchq" style="width:240px;" placeholder="按文章标题搜索" clearable search enter-button 
				    @on-search="searchPage"
				    @on-clear="searchPage"
				    @keydown.native.enter.prevent ="searchPage"></Input>
	        </FormItem>
    	</Form>
	</div>
</template>	

<script>
/**
 * 文档列表 搜索框
 */
export default {
	name:'searchForm',
	components: {

	},
	props:['catTree'],
	data () {
    	return {
			// 搜索表单
        	formSearch:{
        		searchq:'',
        		cat_id:'0',
        	},
    	}
   	},
   	methods: {
    	// 初始化
    	init(){
			
    	},
    	initData( catTree ){
    		this.catTree = catTree;
    	},
    	// 搜索按钮触发
    	searchPage(){
    		this.$emit('on-search', this.formSearch);
    	}
    },
    watch: {

    },
    mounted () {
    	this.init();
    },
}
</script>