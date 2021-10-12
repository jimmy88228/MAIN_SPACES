import Conf from '../config/index';

export default {
  data () {
    return {
      currentPage: Conf.PAGE_START,
      pageSizeDef: Conf.PAGE_SIZE_DEF,
      //pageSize:  Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      tableLoading: false,
      tableHeight: 500,
      columns: [], // 初始化后的数据
      data: {},
      // 允许切换分页标志位
      changeSizeSign: false,
			isSetHeight: false,
    }
  },
  computed: {
    pageTotal () {
			let data = this.data || {};
      if (data.isShowPage == false) return 0;
      return Number(data.total) || (data.items && Number(data.items.length)) || 0;
    },
    tableData () {
      return (this.data && this.data.items) || [];
    },
    // 接收接口返回的数据
    defaultColums () {
      return (this.data && this.data.columns) || [];
    },
		pageSize:{
			get(){
				return (this.$store && this.$store.state && this.$store.state.app.pageSize) || Conf.PAGE_SIZE_DEF;
			},
			set(){}
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
      }).finally(()=>{
				this.setTableH();
			})
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
      this.$store.commit('setPageSize', pageSize);
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
    },
		setTableH(){
			// 设置tableHeight, 只适用于设置简单页面table的高度；
			if(this.isSetHeight) return;
			this.$nextTick(() => {
				let timer = setTimeout(()=>{
					let pageH = document.body.offsetHeight;
					let tableWrapper = this.getDom('ivu-table-wrapper');
					let tableClient = (tableWrapper && tableWrapper.getBoundingClientRect()) || {};
					let footerPage = this.getDom('list_page');
					let footerClient = (footerPage && footerPage.getBoundingClientRect()) || {};
					let singlePage = this.getDom('single-page');
					let singlePageMargin = this.getDomProperty(singlePage, 'marginTop') || 0;
					let cardBodyPadding = this.getDomProperty(this.getDom('ivu-card-body'), 'paddingTop') || 0;
					this.tableHeight = pageH - (tableClient.top || 0) - (footerClient.height || 0) - (singlePageMargin * 2) - cardBodyPadding;
					if(timer) {
						clearTimeout(timer);
						timer = null;
					} 
				});
			});
		}
  },
	mounted(){
	},
  watch: {
    pageTotal (nV) {
			this.isSetHeight = false;
    },
  }
}
