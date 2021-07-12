<style lang="less">
.credis-manage{

}
</style>

<template>
	<div class="credis-manage">
		<Alert show-icon closable>
	        <span style="font-weight: bold;">成长值说明</span>
	        <template slot="desc">成长值是作为用户活跃度和忠诚度的量化数值，用作会员等级升级的依据。成长值只增不减，不可兑换。</template>
	    </Alert>

		<titleBar>成长值获得策略</titleBar>
		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

		<!--表单组件-->
	    <creditsForm ref="credits-form" @on-save="saveOk"></creditsForm>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import titleBar from '@/views/my-components/title-bar/title-bar';
import creditsForm from './credits-form';

export default {
  components: {
    	titleBar,
    	creditsForm
  },
  data () {
    return {
        	// 列表
        	columns: [],
        	data: [],
        	tableHeight: '',
        	tableLoading: false
    }
  },
  methods: {
    	// 初始化方法
    init () {
        	this.tableLoading = true;
      // ajax 请求获取初始化数据
        	util.ajax.post(util.apiUrl.creditsManage, {
        		isInit: 1
        	})
    		.then((response) => {
          this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				// 初始化表
    				this.initTable(res);

    				// 初始化表数据
    				this.data = res.data.items;
    			}
        });
    },
    // 初始化表
    initTable (res) {
        	this.columns = res.data.columns;

      // 操作按钮
      this.columns[(this.columns.length - 1)].render = (h, params) => {
        var buttons = [];
        if (typeof (params.row.handle) !== 'undefined' && params.row.handle.edit) {
                	// 设置按钮
          buttons.push(h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.editItem(params.index, params.row)
              }
            }
          }, '设置'));
        }

        return h('div', buttons);
      }
    },
    // 编辑按钮
    editItem (index, row) {
        	// 打开编辑模态框
      this.$refs['credits-form'].openModal(row);
    },
    // 表单保存成功的回调
    saveOk (obj) {
        	// 直接重新加载一次数据
        	this.init();
    }
  },
  mounted () {
    this.init();
  }
}
</script>
