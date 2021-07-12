<style lang="less">
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        class="brand-plugins"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="800"
	        :footer-hide="true">

	        <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

/**
 * 品牌编辑 授权表单组件
 */
export default {
  name: 'brandPluginsLog',
  components: {
  },
  data () {
    return {
        	// 模态框
        	modalShow: false,
        	modalTitle: '品牌组件授权日志',
        	modalLoading: true,

        	// 列表
        	columns: [],
        	data: [],
        	tableHeight: 420,
        	tableLoading: false
    }
  },
  methods: {
    	// 初始化方法
    init () {
    },
    // 提供给父组件调用
    openModal (code, brandId) {
        	this.modalShow = true;

        	// 加载数据
        	this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.getPluginsLogList, {
        		code: code,
        		brand_id: brandId
        	})
    		.then((response) => {
          this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				this.columns = res.data.columns;
    				this.data = res.data.items == null ? [] : res.data.items.get_plugins_log;
    			} else {
    				this.$Message.error(res.message);
    			}
    		});
    }
  },
  mounted () {
    this.init();
  }
}
</script>
