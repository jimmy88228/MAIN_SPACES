<style lang="less">
.message-search-form{
	.ivu-form-item{
        margin-bottom: 10px;
    }
	.ivu-input-icon-clear{
		right:50px;
    }
}
</style>

<template>
	<div class="message-search-form">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				是否已读：
				<Select v-model="formSearch.is_read" style="width:80px;" clearable>
        			<Option value="-1">全部</Option>
        			<Option value="0">未读</Option>
        			<Option value="1">已读</Option>
        		</Select>
			</FormItem>
    		<FormItem>
	            <Input v-model="formSearch.searchq" style="width:220px;" placeholder="消息名称 模糊查询" clearable search enter-button
				    @on-search="searchPage"
				    @on-clear="searchPage"
				    @keydown.native.enter.prevent ="searchPage"></Input>
	        </FormItem>
    	</Form>
	</div>
</template>

<script>
/**
 * 商品列表 搜索框
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
        		type: '',
        		is_read: -1
        	}
    	}
   	},
   	methods: {
    	// 初始化
    	init () {

    	},
    	// 搜索按钮触发
    	searchPage () {
    		var tname = this.$route.hash.replace('#', '');
        	this.formSearch.type = tname;

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
