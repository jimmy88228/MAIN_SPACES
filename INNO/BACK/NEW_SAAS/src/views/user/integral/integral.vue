<style lang="less">
.integral-manage{

}
</style>

<template>
	<div class="integral-manage">
		<Alert show-icon closable>
	        <span style="font-weight: bold;">积分说明</span>
	        <template slot="desc">积分可以作为奖励赠送给用户，用户可以通过积分兑换来消耗积分。积分不能提现，不能充值。</template>
	    </Alert>

		<titleBar>积分赠送策略</titleBar>
		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

		<titleBar>全站通用设置</titleBar>
		<Table :loading="tableLoading" :columns="columns1" :data="data1"></Table>

		<!--表单组件-->
	    <integralForm ref="integral-form" @on-save="saveOk"></integralForm>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import titleBar from '@/views/my-components/title-bar/title-bar';
import integralForm from './integral-form';

export default {
  components: {
    	titleBar,
    	integralForm
  },
  data () {
    return {
        	// 列表
        	columns: [],
        	data: [],
        	tableHeight: '',
        	tableLoading: false,

        	// 列表1
        	columns1: [],
        	data1: []
    }
  },
  methods: {
    	// 初始化方法
    init () {
        	this.tableLoading = true;
      // ajax 请求获取初始化数据
        	util.ajax.post(util.apiUrl.integralManage, {
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
    				this.data1 = res.data.items1;
    			}
        });
    },
    // 初始化表
    initTable (res) {
        	this.columns = res.data.columns;
        	this.columns1 = res.data.columns1;

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

      // 操作按钮1
      this.columns1[(this.columns.length - 1)].render = (h, params) => {
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
      this.$refs['integral-form'].openModal(row);
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
