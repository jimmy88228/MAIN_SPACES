<style lang="less">
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :styles="{top: '20px'}"
	        :width="740"
	        :title="modalTitle"
	        :mask-closable="false"
	        :footer-hide="true"
	        @on-cancel="onCancel">

	        <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data" @on-select="onSelect"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>

	    </Modal>
	</div>
</template>

<script>
/**
 * 活动页：链接到选择源ID，公共组件
 */
import util from '@/libs/util.js';

export default {
  name: 'selectSourceId',
  components: {
  },
  props: {
  },
  data () {
    return {
      modalShow: false,
	    	modalTitle: '选择组件项',

	    	columns: [],
        	data: [],
        	tableHeight: 400,
        	tableLoading: false,
	    	pageTotal: 0,
      pageSize: 20,

      // 双向绑定的id
      sourceId: 0,
      sourceCode: ''
	    }
  },
  methods: {
    	// 初始化
    	init () {
    	},
    	// 打开模态框
    	openBox (code, id) {
    		this.modalShow = true;
    		this.sourceId = id;
    		this.sourceCode = code;

    		this.tableLoading = true;
        	// ajax 获取源列表
        	util.ajax.post(util.apiUrl.sourceList, {
        		isInit: 1,
        		code: this.sourceCode,
				is_cloud: ( this.$route.fullPath.indexOf('cloud-shop') != -1 ? 1 : ''),
        	})
    		.then((response) => {
          this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				this.columns = res.data.columns;

    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}
        });
    	},
    	// 选中某项
    	onSelect (selection, row) {
    		this.modalShow = false;
    		// 回调父组件
    		this.$emit('on-ok', this.sourceCode, row);
    	},
    	onCancel () {
    		// 回调父组件
    		this.$emit('on-cancel', {});
    	},
    	// 分页事件
    	changePage (page) {
    		this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.sourceList, {
        		page: page,
        		code: this.sourceCode
        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}

    			this.tableLoading = false;
        });
    	}
   	},
  mounted () {
    	this.init();
  }
}
</script>
