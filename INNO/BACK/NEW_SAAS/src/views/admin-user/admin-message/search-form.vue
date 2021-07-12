<style lang="less">
.admin-message-search{

}
</style>

<template>
	<div class="admin-message-search">

    	<Form ref="formSearch" :model="formSearch" inline>
    		<FormItem>
    			消息分类：
    			<Select v-model="formSearch.type" style="width:100px" placeholder="消息分类" clearable>
    				<Option value="all">全部分类</Option>
	                <Option v-for="(cat,key) in catList" :name="key" :key="key" :value="key">{{cat}}</Option>
	            </Select>
    		</FormItem>
    		<FormItem>
    			状态：
    			<Select v-model="formSearch.status" style="width:100px" placeholder="消息分类" clearable>
    				<Option value="-1">全部状态</Option>
	                <Option value="0">未发送</Option>
	                <Option value="1">已发送</Option>
	            </Select>
    		</FormItem>
    		<FormItem>
	            <Input v-model="formSearch.searchq" placeholder="消息标题 模糊查询" clearable search enter-button
	            	@on-search="searchPage"
	            	@on-clear="searchPage"
			@keydown.native.enter.prevent ="searchPage"></Input>
	        </FormItem>
    	</Form>

	</div>
</template>

<script>
export default {
  name: 'searchForm',
  components: {
  },
  data () {
    	return {
    		// 搜索表单
        	formSearch: {
        		searchq: '',
        		type: '',
        		status: ''
        	},

        	catList: []
    	}
  },
  methods: {
    	// 初始化方法
    init () {
    },
    // 父组件初始化使用
    initData (catList) {
        	this.catList = catList;
    },
    // 搜索
    searchPage () {
        	this.$emit('on-search', this.formSearch);
    }
  },
  mounted () {
    this.init();
  }
}
</script>
