import Conf from '../config/index';

export default {
  data () {
    return {
      currentPage: Conf.PAGE_START,
      pageSizeDef: Conf.PAGE_SIZE_DEF,
      pageSize: Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      tableLoading: false,
      tableHeight: 500,
      columns: [], // 初始化后的数据
      data: [],
      // 允许切换分页标志位
      changeSizeSign: false
    }
  },
  computed: {
    pageTotal () {
      return (this.data && Number(this.data.total)) || 0;
    },
    tableData () {
      return (this.data && this.data.items) || [];
    },
    // 接收接口返回的数据
    defaultColums () {
      return (this.data && this.data.columns) || [];
    }
  },
  methods: {
    // 加载数据
    loadData(page = Conf.PAGE_START) {
		if( typeof(page) != 'number' ){
			// 重要修复
			page = this.currentPage;
		}
      this.tableLoading = true;
      this.currentPage = page;
      return this.onLoadData && this.onLoadData(page, this.createParams(page)).then(() => {
        this.tableLoading = false;
      });
    },
    // 切换页码
    changePage (page) {
      if (this.changeSizeSign) {
        this.changeSizeSign = false;
        return false;
      }
      this.loadData(page);
    },
    handlePageSize (pageSize) {
      // 阻止页码的切换操作
      this.currentPage !== 1 && (this.changeSizeSign = true);
      this.pageSize = pageSize;
      this.loadData();
    },
    handleAdded () {
      // 存在搜索时候清除参数
      this.clearOptions && this.clearOptions();
      this.loadData();
    },
    handleUpdate () {
      this.loadData(this.currentPage);
    },
    // 添加,编辑成功的回调
    onFormSuccess({
      type
    }) {
      if (type === 'add') {
        this.handleAdded();
      } else {
        this.handleUpdate();
      }
    },
    // 删除
    delItem (row, title, content, ...args) {
      if (this.onDelItem) {
        this.$Modal.confirm({
          title: title || '提示',
          content: content || '确定进行该操作吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.tableLoading = true;
            this.onDelItem(row, args).then(response => {
              const res = response.data;
              if (res.code) {
                this.$Message.success(res.message);
                this.handleUpdate();
              }
              this.tableLoading = false;
            });
          }
        });
      }
    },
    createParams(page) {
      let data = {
        page: page,
        pageSize: this.pageSize || Conf.PAGE_SIZE_DEF
      };
      return data;
    },
    getDomProperty (dom, property) {
      if (!dom) return 0;
      const domHeight = Math.ceil(window.getComputedStyle(dom)[property].replace('px', ''));
      return domHeight;
    },
    getDom (className) {
      const dom = document.getElementsByClassName(className)[0];
      return dom;
    }
  },
  watch: {
    pageTotal () {
      // 设置tableHeight, 只适用于设置简单页面table的高度；
      this.$nextTick(() => {
        // // 必须在Card组件内使用Table组件
        // const tableClassName = 'ivu-table-wrapper';
        // const cardClassName = 'ivu-card-body';
        // const cardHeadClassName = 'ivu-card-head';
        // const cardExtraClassName = 'ivu-card-extra';
        // // 类似Tab组件，存在多个时，需要忽略不计
        // const ignoreList = ['ivu-tabs-tabpane'];
        // const border = 2;

        // const headerHeight = this.getDomProperty(this.getDom('main-header'), 'height');
        // const singlePageMargin = 2 * this.getDomProperty(this.getDom('single-page'), 'marginTop');
        // const cardBodyPadding = 2 * this.getDomProperty(this.getDom('ivu-card-body'), 'paddingTop');
        // // tab的切换栏
        // const exitTab = (this.getDomProperty(this.getDom('ivu-tabs-bar'), 'height') + this.getDomProperty(this.getDom('ivu-tabs-bar'), 'marginBottom'));
        // const tabsBar = exitTab || 0;
        // let parent = this.getDom(tableClassName).parentNode;
        // let currentNode = this.getDom(tableClassName);
        // const cardNode = this.getDom(cardClassName);
        // if (!currentNode || !cardNode) {
        //   throw new Error('必须在Card组件内使用Table组件');
        // };
        // let calcHeight = 0;
        // while (parent) {
        //   const childs = parent.childNodes;
        //   [...childs].forEach(item => {
        //     // 获取兄弟元素(本身出外)
        //     if (item != currentNode && item.nodeType == 1 && ignoreList.every(item => item.className != 'ivu-tabs-tabpane')) {
        //       const validHeight = isNaN(this.getDomProperty(item, 'height')) ? 0 : Math.ceil(this.getDomProperty(item, 'height'));
        //       calcHeight += validHeight + this.getDomProperty(item, 'marginTop') + this.getDomProperty(item, 'marginBottom') + this.getDomProperty(item, 'borderWidth');
        //     }
        //   });
        //   if (parent.className == cardClassName || !parent.parentNode || (parent.parentNode && parent.parentNode.className == cardClassName)) {
        //     parent = null;
        //   } else {
        //     currentNode = parent;
        //     parent = parent.parentNode;
        //   }
        // }
        // // iView新增的插槽 slot="title"/slot="extra"
        // const slotTitleHeight = this.getDomProperty(this.getDom(cardHeadClassName), 'height') || 0;
        // const slotExtraTitle = this.getDomProperty(this.getDom(cardExtraClassName), 'height') || 0;
        // const tableHeight = document.body.clientHeight - headerHeight - singlePageMargin - cardBodyPadding - calcHeight - border - slotTitleHeight - slotExtraTitle - tabsBar;
        // this.tableHeight = tableHeight;
        const singlePageMargin = this.getDomProperty(this.getDom('single-page'), 'marginTop') || 0;
        const cardBodyPadding = this.getDomProperty(this.getDom('ivu-card-body'), 'paddingTop') || 0;
        let tBody = document.getElementsByClassName("ivu-table-body")[0];
        let tBodyClient = (tBody && tBody.getBoundingClientRect()) || {};
        let footerPage = document.getElementsByClassName("list_page")[0];
        let fPClient = (footerPage && footerPage.getBoundingClientRect()) || {};
        let pageH = document.body.offsetHeight;
        this.tableHeight = pageH - (tBodyClient.top || 0) - (fPClient.height || 0) - singlePageMargin - cardBodyPadding + 25;

        //应用   优惠券有偏差
      });
    }
  }
}
