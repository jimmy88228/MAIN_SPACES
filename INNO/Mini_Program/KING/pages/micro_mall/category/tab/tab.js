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
        text: "推荐",
        type: 'goods_id',
        active: true,
        list_sort: 0
      },
      {
        order:"two",
        text: "销量",
        type: 'salesVolume',
        active: null,
        list_sort: 1
      },
      {
        order:"two",
        text: "价格",
        type: 'Price',
        active: null,
        list_sort: 2
      }
    ],
    filter_active: false,
    tabList: [],
  },
  ready() {
    this.filter = this.selectComponent("#filter");
    this.resetFnc();
    // this.sort = 0;
    // if (this.data.list){
    //   this.reset = JSON.parse(JSON.stringify(this.data.list));
    // }else{
    //   this.reset = {}
    // }
    
  },
  methods: {
    checkChange() {
      console.log(this.data.theList)
      this.setData({
        tabList: this.data.theList
      });
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
              sortBy: item.active ? sort == 2 || item.list_sort == 1 ? "asc" : "desc" : "desc"
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
      let _this = this;
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
    resetFnc(){
      // let temp = null;
      // if (this.reset){
      //   temp = JSON.parse(JSON.stringify(this.reset));
      // }
      // console.log(this.reset,"reset");
      // console.log(temp, "temp");
      // this.sort = 0;
      // this.setData({
      //   list: temp || []
      // })
      this.sort = 0;
      let list = this.data.list || [];
      for (let i in list){
        if(i == 0){
          list[i].active = true;
        }else if(i == 2){
          list[i].active = null;
        }else{
          list[i].active = false;
        }
      }
    },
  }
})