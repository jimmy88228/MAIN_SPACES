const app = getApp();
Component(app.BTAB({
  properties: {
    theList: {
      type: Object,
      value: {},
      observer(newVal) {
        console.log(newVal); 
      }
    },  
    fromType:{
      type:String,
      value:"default"
    },
    func_type:String
  },
  data: {
    list: [{
        order:"one",
        text: "默认",
        type: 'GOODS_ID',
        active:true,
        list_sort: 0
      },
      {
        order:"two",
        text: "销量",
        type: 'SALESVOLUME',
        list_sort: 1
      },
      {
        order:"two",
        text: "价格",
        type: 'PRICE',
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
      this.setData({
        tabList: this.data.theList
      });
    },
    onConfirm(e) { 
      this.triggerEvent("confirm", e.detail);
    },
    handleReset(e) {
      this.resetFnc();
      this.triggerEvent("reset", e.detail);
    }, 
    click: function(e) {
      let sort = e.currentTarget.dataset.indexSort;
      if (sort != this.sort || sort == 2 || sort == 1) {
        this.data.list.forEach(item => {
          if (item.list_sort != sort) {
            item.active = item.list_sort == 2 || item.list_sort == 1 ? null : false;
          } else {
            item.active = item.active != null ? !item.active : true;
            this.triggerEvent('sort', {
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
      this.getList().then(()=>{
        this.setData({
          filter_active: !this.data.filter_active
        })
        this.filter.initStatus();
      })
    },
    getList(){
      if(this.properties.fromType == 'default' || this.initProperty){
        return Promise.resolve([]);
      }else if (this.properties.fromType == 'custom'){
        return loadProperty.call(this);
      }
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
}))


function loadProperty() { //筛选信息
  return app.CL_GoodsApi.getGoodsPropertyList({
      params: {
          functype: this.properties.func_type||"SE",
          strWhere: "",
          catId: 0,
      },
      other: {
          isShowLoad: true
      }
  }).then(e => {
      if (e.code == 1) {
          this.initProperty = true;
          let data = e.data;
          this.setData({
            tabList: data
          });
          this.resetFnc();
          return Promise.resolve(e);
      }
      return Promise.reject(e);
  })
}