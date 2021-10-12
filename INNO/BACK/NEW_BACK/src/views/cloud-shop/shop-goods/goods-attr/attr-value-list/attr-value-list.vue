<template>
	<div class="attr-list">
		<PageTopBase>
      <template v-if="showList">
        <div class="table-topbar">
          <Button v-if="canCreate" type="primary" icon="md-add" @click="openModal({})">添加属性项</Button>
        </div>

        <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
        <div v-show="pageTotal" class="list_page">
          <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="changePage"
            @on-page-size-change="handlePageSize"
            show-elevator
            show-total
            show-sizer></Page>
        </div>
      </template>
      <attrForm ref="attr-form" @on-success="onAttrSuccess"></attrForm>
    </PageTopBase>
	</div>
</template>

<script>
import attrForm from './attr-form';
import AttrSort from './attr-sort';
import Conf from '@/config/index.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    attrForm,
    AttrSort,
    PageTopBase
  },
  data () {
    return {
      // 列表
      columns: [],
      data: [],
      tableHeight: 500,
      tableLoading: false,
      pageTotal: 0,
      canCreate: false,
      modalEditIndex: '',
      showList: true,
      showAttrGroup: false,
      catId: 0,
      currentPage: Conf.PAGE_START,
      pageSize: Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      changeSizeSign: false
    }
   	},
   	methods: {
    	// 初始化
    	init () {
    		// 动态计算表高度
        this.tableHeight = document.body.clientHeight - 280;

        this.tableLoading = true;
          // ajax 请求获取初始化数据，然后动态更新下面数据源
        this.$ajax.post(this.$api.ShopGoodsAttrList, {
          page: this.currentPage,
          pageSize: this.pageSize,
          isInit: 1,
          cat_id: this.id
        })
    		.then((response) => {
    			this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				// 初始化表
    				this.initTable(res);
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
            this.canCreate = res.data.canCreate;
            this.catId = res.data.cat_id;
    			}
        });
    	},
    // 初始化表
    initTable (res) {
      const _this = this;
      this.columns = res.data.columns;
      this.columns[0].align = 'left';
      this.columns[0].minWidth = 120;
      this.columns[1].align = 'left';
      this.columns[1].minWidth = 120;
      this.columns[1].render = (h, params) => {
        return h('p', params.row.attr_values.split(/[\r\n]+/).join(','))
      }
      // 过滤属性
      this.columns[(this.columns.length - 4)].render = (h, params) => {
        const text = params.row.attr_input_type == 1 ? '是' : '否';
        const color = params.row.attr_input_type == 1 ? 'green' : 'auto';
        return h('span', {
          style: {
            color: color,
            fontWeight: 'bold'
          }
        }, text);
      };

      // 过滤属性
      this.columns[(this.columns.length - 3)].render = (h, params) => {
        return h('i-switch', {
          props: {
            value: params.row.is_join_filter,
            size: 'large',
            'true-value': '1',
            'false-value': '0',
            'before-change'() {
              return new Promise((resolve, reject) => {
                _this.updateEnabled(params.row, params.row.attr_id).then(() => {
                  resolve();
                });
              });
            }
          }
        }, [
          h('span', {
            slot: 'open'
          }, '开启'),
          h('span', {
            slot: 'close'
          }, '关闭')
        ])
      };
      this.columns[(this.columns.length - 2)].align = 'left';
      this.columns[(this.columns.length - 2)].width = '100';
      this.columns[(this.columns.length - 2)].render = (h, params) => {
        return h(AttrSort, {
          props: {
            type: 'sort_order',
            value: params.row.sort_order,
            id: params.row.attr_id
          },
          on: {
            'edit-success' () {
              _this.init();
            }
          }
        })
      }
      // 操作按钮
      this.columns[(this.columns.length - 1)].render = (h, params) => {
        var buttons = [];

        if (params.row.handle.edit) {
          // 编辑按钮
          buttons.push(
            h('span', [
              h('a', {
                on: {
                  click: () => {
                    this.editAttr(params.index, params.row);
                  }
                }
              }, '编辑'),
              h('Divider', {
                style: {
                  display: 'inline-block'
                },
                props: {
                  type: "vertical"
                }
              })
            ])
          );
        }

        if (params.row.handle.remove) {
          // 删除
          buttons.push(
            h('a', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  this.removeAttr(params.index, params.row);
                }
              }
            }, '删除')
          );
        }
        return h('div', buttons);
      }
    },
    // 切换分页
    changePage (page) {
      if (this.changeSizeSign) {
        this.changeSizeSign = false;
        return false;
      }
      this.currentPage = page;
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
      this.$ajax.post(this.$api.ShopGoodsAttrList, {
        page: this.currentPage,
        pageSize: this.pageSize,
        page: page,
        cat_id: this.id
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
    },
    handlePageSize (pageSize) {
      this.currentPage !== 1 && (this.changeSizeSign = true);
      this.pageSize = pageSize;
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
      this.$ajax.post(this.$api.ShopGoodsAttrList, {
        page: this.currentPage,
        pageSize: this.pageSize,
        page: 1,
        cat_id: this.id
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
    },
    // 删除属性
    removeAttr (index, row) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定删除属性吗？只有无关联商品 和 无属性值，才能删除成功。',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
            this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
            this.$ajax.post(this.$api.ShopGoodsAttrRemove, {
              attr_id: row.attr_id
            })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
                this.$Message.success(res.message);
                this.init();
		    			}
		    			this.tableLoading = false;
            });
        }
      });
    },
    updateEnabled (row, id) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.ShopGoodsAttrEditOther, {
        type: 'is_join_filter',
        // 有条件去统一写法吧，乱七八糟的，布尔值传参。数字传参，开关字段enabled, is_enabled, value......
        value: !Number(row.is_join_filter) ? 1 : 0,
        attr_id: id
      })
      .then( (response) => {
        this.spinShow = false;
        var res = response.data;

        if( res.code ){
          this.tableLoading = false;
          this.$Message.success( res.message );
          this.init();
        }
      });
    },
    // 编辑
    editAttr (index, row) {
      this.modalEditIndex = index;
      this.openModal(row);
    },
    openModal (row) {
      this.$refs['attr-form'].openModal(row, this.catId);
    },
    // 添加成功的回调
    onAttrSuccess ({type}) {
      console.log(type)
      if (type === 'add') {
        this.currentPage = 1;
      }
      this.init();
    },
    // 分组管理
    onEditGroup () {
      this.showList = false;
      this.showAttrGroup = true;
    },
    handleClose () {
      this.init();
      this.showList = true;
      this.showAttrGroup = false;
    },
    handleSuccess () {
      this.init();
      this.showList = true;
      this.showAttrGroup = false;
    }
  },
  mounted () {
    this.init();
  }
}
</script>

<style lang="less">
.attr-list{
	.table-topbar{
    text-align: right;
    margin-bottom: 10px;
	}
	.ivu-select-dropdown{
		max-height: 200px;
	}
}
</style>
