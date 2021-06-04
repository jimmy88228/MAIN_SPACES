// pages/component/custom/alert.js
const app = getApp();
Component(app.BTAB({
  properties: {
    isLogin: {
      type: Boolean,
      value: false
    }
  },
  data: {
    styles: {
      1: {
        type: "1",
        txt: "小图"
      },
      2: {
        type: "2",
        txt: "大图"
      }
    },
    sortData: {
      id: 0,
      txt: "排序"
    },
    styleType: 1,
    search_value: "",
    current_focus: false,
    publishData:{
      type:"publish",
      url:"/pages/micro_mall/seeding_grass/publish/publish_op/publish_next"
    },
  },
  ready(){
    let dIconUrl = this.data.brand_info.default_icon_url;
    let iconUrl = this.data.brand_info.icon_url;
    let bT = dIconUrl + 'grass/bT.png';
    let sT = dIconUrl + 'grass/sT.png';
    let edit = dIconUrl + 'grass/edit.png';
    let sort = dIconUrl + 'grass/sort_desc.png';
    let search_gray = iconUrl + "micro_mall/search_gray.png";
    let grass_publish = iconUrl + "micro_mall/seed_grass/grass_publish.png";
    let styles = this.data.styles;
    styles["1"].url = sT;
    styles["2"].url = bT;
    this.setData({
      styles: styles,
      edit: edit,
      sort: sort,
      search_gray: search_gray,
      grass_publish: grass_publish
    })
  },
  methods: {
    getThisPage(){
      this._page = this._page || getCurrentPages().slice(-1)[0];
      return this._page;
    },
    handle_focus() {
        this.setData({
            current_focus: true
        })
        this.isReseting = false;
    },
    handle_blur(e) {
        let dataset = e.currentTarget.dataset || {};
        this.setData({
            current_focus: false,
            search_value: ""
        })
        if (dataset.type == 'cancel') {
            let _page = this.getThisPage();
            console.log("_page.button_loading", _page.button_loading)
            if (_page.button_loading) {
                return;
            }
            _page.loadingCheck();
            app.SMH.showLoading({
                title: '加载中...',
                mask: true
            });
            _page.setData({
                search_value: '',
                currentNav: 0,
                currentNavShow: 0,
                currentClassify: 0,
                currentFiltrate: 0,
                goLeft: 0
            })
            this.isReseting = true;
            this.triggerEvent("searchCall", { 
              resetValue: true,
              showLoad: false
             });
            // loadDataCheck.call(this, true, false)
        }

    },
    handle_confirm(e) {
        // let dataset = e.currentTarget.dataset || {};
        // let type = dataset.valueType || "search_value";
        let _page = this.getThisPage();
        _page.setData({
            search_value: this.data.search_value,//e.detail.value || this.data.search_value || '',
            currentNav: 0,
            currentNavShow:0,
            currentClassify: 0,
            currentFiltrate: 0,
            goLeft: 0
        });
        this.triggerEvent("searchCall", { 
          resetValue: true,
          showLoad: false
         });
        // loadDataCheck.call(this, true)
    },
    handle_input(e) {
        if (this.isReseting) return;
        let dataset = e.currentTarget.dataset || {};
        let type = dataset.valueType || "search_value";
        this.setData({
            [type]: e.detail.value || ''
        })
    },
    jump(e){
      let _page = this.getThisPage();
      _page.jump(e);
    },
    filtrate() {
        let _page = this.getThisPage();
        _page.setData({
            filter: !this.data.filter
        })
    },
    changeSortTip(data) {
      if(data) {
        this.setData({
          sortData: data
        })
      }
    },
    setShowStyle(data){
      this.setData({
        styleType: data
      })
    },
    changeStyle() {
      let styleType = parseInt(this.data.styleType);
      let styles = this.data.styles;
      if(styles[styleType + 1]){
        styleType = styleType + 1
      } else if(styles[styleType - 1]) {
        styleType = styleType - 1
      }
      this.setData({
        styleType: styleType
      })
      app.StorageH.set("userShowStyle", styleType, 60 * 24 * 30);
      this.triggerEvent("searchCall", { 
        resetValue: true,
        showLoad: true
       });
    }
  }
}))