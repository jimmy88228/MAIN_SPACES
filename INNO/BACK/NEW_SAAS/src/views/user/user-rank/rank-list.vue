<style lang="less">
.rank-list{
    .ivu-icon-md-images{
        font-size: 40px;
        line-height: 80px;
    }
}
</style>

<template>
	<div class="rank-list">
		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

	    <!--等级表单组件-->
	    <rankForm ref="rank-form" @on-save="saveOk"></rankForm>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import rankForm from './rank-form';

export default {
  components: {
    rankForm
  },
  data () {
    return {
        	// 列表
        	columns: [],
        	data: [],
        	tableHeight: 500,
        	tableLoading: false
    };
  },
  methods: {
    	// 初始化方法
    init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 80;

      this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.userRankList, {
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

      // 背景图片
      this.columns[(this.columns.length - 2)].render = (h, params) => {
        if (typeof (params.row.rank_image_format) !== 'undefined' && params.row.rank_image_format != '') {
	                return h('div', [
	                    h('Avatar', {
	                        props: {
	                            src: '',
	                            icon: (params.row.rank_image_format == '' ? 'md-images' : '')
	                        },
	                        style: {
	                        	margin: '5px 0',
	                        	width: '40px',
	                        	height: '40px',
	                        	border: '1px solid #eee',
	                        	borderRadius: 0,
	                        	background: (params.row.rank_image_format != '' ? 'url(' + params.row.rank_image_format + ') center center no-repeat #fff' : '#eee'),
                backgroundSize: '100% auto'
	                        }
	                    }),
	                    h('strong', {
	                    	style: {
	                    		overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
	                    	}
	                    }, params.row.user_name)
	                ]);
        }
      };

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

        if (typeof (params.row.handle) !== 'undefined' && params.row.handle.canSet) {
                	// 设置按钮
          buttons.push(h('Button', {
            props: {
              type: 'info',
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
          }, '待配置'));
        }

        return h('div', buttons);
      }
       	},
    // 编辑按钮
    editItem (index, row) {
        	this.modalEditIndex = index;
        	// 打开编辑模态框
      this.$refs['rank-form'].openModal(row);
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
