const app = getApp();
Component({
  properties: {
    theList: {
      type: Object,
      value: {},
      observer(newVal) {
        console.log(newVal)
      }
    },
    brandInfo: {
      type: Object,
      value: {}
    }
  },
  data: {
    list: [{
        order:"one",
        text: "默认",
        type: 'GOODS_ID',
        // active: true,
        list_sort: 0
      },
      {
        order:"two",
        text: "销量",
        type: 'SALESVOLUME',
        // active: null,
        list_sort: 1
      },
      {
        order:"two",
        text: "价格",
        type: 'PRICE',
        // active: null,
        list_sort: 2
      }
    ],
    filter_active: false,
    tabList: [],
  },
  ready() {
    this.filter = this.selectComponent("#filter"); 
  },
  methods: {
    checkChange() {
      return new Promise(resolve => {
        const theList = this.data.theList
        this.setData({
          tabList: theList
        });
        resolve(theList)
      })
    },
    autoSelectSort(options = {}) { // 自动选择分类，目前只选择"筛选-品牌"
      console.log('tab->autoSelectSort: options', options)
      const {brand_ids} = options;
      brand_ids && this.filter && this.filter.autoSelectSort({brand_ids})
    },
    handleInfo(e) {
      console.log(e.detail)
      this.triggerEvent("detail", e.detail);
    },
    handleSearch(e) {
      this.resetFnc();
      this.triggerEvent("search", e.detail);
    }, 
    click: function(e) {
      let sort = e.currentTarget.dataset.indexSort;
      if (sort != this.sort || sort == 2 || sort == 1) {
        this.data.list.forEach(item => {
          if (item.list_sort != sort) {
            item.active = item.list_sort == 2 || item.list_sort == 1 ? null : false;
          } else {
            item.active = item.active != null ? !item.active : true;
            this.triggerEvent('sortSend', {
              sortField: item.type,
              sortBy: item.active ? sort == 2 || item.list_sort == 1 ? "ASC" : "DESC" : "DESC"
            }); 
          }
        });
        this.sort = sort;
        this.setData({
          list: this.data.list
        });
      }
    },
    toFilter() {
      console.log('点击筛选');
      this.setData({
        filter_active: !this.data.filter_active
      })
      this.filter.initStatus();
    },
    hidePanel() {
      this.setData({
        filter_active: false
      })
    },
    resetFnc(label = 0,bool = true){
      this.sort = label;
      let list = this.data.list || [];
      for (let i in list){
        if(i == label){
          list[i].active = bool;
        }else {
          if(list[i].sort == 'one'){
            list[i].active = false;
          }else{
            list[i].active = null;
          }
        } 
      }
      this.setData({
        list
      })
    }, 
  }
})