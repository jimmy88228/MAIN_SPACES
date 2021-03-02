// pages/micro_mall/seeding/index_page/index_page.js
const LEFT_LENGTH = 124;
const ROTATE = 360 * 16;
const app = getApp();
Page(app.BP({
    data: {
        nav_box: [{
            id: 0,
            name: "全部",
            sort: 0,
            show_style: 1,
            loaded:false,
            data:[],
            data2:[],
            data3:[]
        }],
        userShowStyle: 1,
        filter: false,
        leftWidth: LEFT_LENGTH,
        currentNav: 0,
        currentNavShow: 0,
        currentClassify: 0,
        currentFiltrate: 0,
        current_focus: false,
        goLeft: 0,
        search_value: '',
        moveY: 0,
        showLoadImg: false,
        moveRoAction: 0,
        
        filterData:[
            {id: 1, txt: "点赞量"},
            {id: 2,txt: "评论量"},
            {id: 3,txt: "浏览量"}
        ]
    },
    page: 1,
    hasMore: true,
    isLoading: false,
    pageNav: 1,
    hasMoreNav: true,
    isLoadingNav: false,
    can_check_reset: true,
    // check_reset: false,
    start: false,
    tempAbs: 0,
    button_loading: false,
    onLoad: function(options) {
        this.options = options||{};
        let grass_publish = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_publish.png";
        let grass_search = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_search.png";
        let search_gray = this.data.brand_info.icon_url + "micro_mall/search_gray.png";
        let grass_like = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_like.png";
        let grass_like_active = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_like_active.png";
        let resetImg = this.data.brand_info.icon_url + "micro_mall/comment_edit/remove_btn_icon.png";
        let videoImg = this.data.brand_info.icon_url + "micro_mall/seed_grass/video.png";
        let loadImg = this.data.brand_info.icon_url + "micro_mall/staff/staff_return.png";
        this.setData({
            grass_publish: grass_publish,
            grass_search: grass_search,
            search_gray: search_gray,
            grass_like: grass_like,
            grass_like_active: grass_like_active,
            videoImg: videoImg,
            resetImg: resetImg,
            loadImg: loadImg
        })
        init.call(this);
        loadNav.call(this)
        loadData.call(this);
    },
    onShow() {
        listen.call(this);
    },
    onUnload(){
        unListen.call(this);
    },
    onHide() {
        let timer = setTimeout(() => {
            this.button_loading = false
            clearTimeout(timer);
        }, 300)
        unListen.call(this);
    },
    refresh(e){
        this.handle_nav(e,'refresh');
    },
    swiperChange(e){
        let num =  e.detail.current || 0;
        this.setData({
            currentNavShow:num
        });
        this.handle_nav(e);
    },
    handle_nav(e,fromtype) {
        let nav_box = this.data.nav_box;
        let dataset = e.currentTarget.dataset || {};
        let type = e.type || "";
        let num = type == 'tap' ? dataset.num || 0 : this.data.currentNavShow || 0;
        let id = type == 'tap' ? dataset.id || 0 : nav_box[num].id;
        let that = this;
        let setD = {};
        let showLoad = true; 
        if (id == this.data.currentClassify) {
            setD = {...setD, currentClassify: id};
            showLoad = false;
            app.SMH.showLoading({
                title: '加载中...',
                mask: true
            });
            this.list = this.list || this.selectComponent("#list");
            this.list.refreshShow();
            loadDataCheck.call(this, true, showLoad,'refresh');
        } else if(type != 'tap'){
            setD = {...setD, currentClassify: id}; 
            this.bottomLock = true;
            this.endId = setTimeout(() => {
                clearTimeout(this.endId); 
                loadDataCheck.call(this, true, false,fromtype);
                setTimeout(()=>{
                    this.bottomLock = false;
                },500)
                delete this.endId;
            }, 50)
        }else if(type == 'tap'){
            setD = {...setD,currentNav:num,currentNavShow:num};
        }
        this.setData({
            ...setD,
        });
        console.log('当前index、分类、筛选:',num,this.data.currentClassify, this.data.currentFiltrate)
    },
    handle_filtrate(e) {
        let dataset = e.currentTarget.dataset || {};
        let currentFiltrate = dataset.filtrate || 0;
        let index = dataset.index;
        let filterData = this.data.filterData;
        this.setData({
            currentFiltrate: currentFiltrate,
            filter: !this.data.filter
        })
        app.SMH.showLoading({
            title: '加载中...',
            mask: true
        });
        loadDataCheck.call(this, true, false);
        this.pageHeader = this.pageHeader || this.selectComponent("#pageHeader");
        this.pageHeader && this.pageHeader.changeSortTip(filterData[index]);
    },
    handle_scroll_nav(e) {
        loadNav.call(this);
    },

    handle_scroll(e) {
        if(this.bottomLock)return
        this.can_check_reset = false;
        loadDataCheck.call(this);
    },
    
    jump(e) {
        if (this.button_loading) {
            return
        }
        this.loadingCheck();
        let dataset = null;
        if (e.type == "clickcallback"){
          dataset = e.detail || {};
        }else{
          dataset = e.currentTarget.dataset || {};
        }
        let url = dataset.url;
        if (dataset.type == 'article_detail') {
            url = url + `?id=${dataset.id||0}`;
            postClickLog.call(this, dataset.id || 0);
        }
        if (url) {
            wx.navigateTo({
                url: url,
            })
        }
    },
    filtrate(e) {
        this.setData({
            filter: !this.data.filter
        })
    },
    // handle_focus() {
    //     this.setData({
    //         current_focus: true
    //     })
    //     this.isReseting = false;
    // },
    // handle_blur(e) {
    //     let dataset = e.currentTarget.dataset || {};
    //     this.setData({
    //         current_focus: false,
    //     })
    //     if (dataset.type == 'cancel') {
    //         if (this.button_loading) {
    //             return
    //         }
    //         loadingCheck.call(this);
    //         app.SMH.showLoading({
    //             title: '加载中...',
    //             mask: true
    //         });
    //         this.current_value = '';
    //         this.setData({
    //             search_value: '',
    //             currentNav: 0,
    //             currentNavShow: 0,
    //             currentClassify: 0,
    //             currentFiltrate: 0,
    //             goLeft: 0,
    //             current_focus: false,
    //         })
    //         this.isReseting = true;
    //         loadDataCheck.call(this, true, false)
    //     }

    // },
    // handle_confirm(e) {
    //     let dataset = e.currentTarget.dataset || {};
    //     let type = dataset.valueType || "search_value";
    //     this.setData({
    //         [type]: e.detail.value || this.data.search_value || '',
    //         currentNav: 0,
    //         currentNavShow:0,
    //         currentClassify: 0,
    //         currentFiltrate: 0,
    //         goLeft: 0
    //     });
    //     loadDataCheck.call(this, true)
    // },
    // handle_input(e) {
    //     if (this.isReseting) return;
    //     let dataset = e.currentTarget.dataset || {};
    //     let type = dataset.valueType || "search_value";
    //     this.setData({
    //         [type]: e.detail.value || ''
    //     })
    // },
    loadingCheck(time = 1) {
        if (!this.button_loading) {
            this.button_loading = true;
            this.buttonLoadId = setTimeout(() => {
                this.button_loading = false;
            }, 500 * time)
        }
    },
    activeSearch(e){
        console.log("search call", e)
        let detail = e.detail || {};
        loadDataCheck.call(this, detail.resetValue, detail.showLoad);
    },
    _noFn() {}
}))

function loadData(showLoad = true,type) {
    if (!this.hasMore && this.page > 1) {
        app.SMH.showToast({
            title: '已经到底啦！',
            duration: 1200
        })
    }
    if (this.hasMore && !this.isLoading) {
        this.isLoading = true;
        return app.GrassApi.getGrassHomepage({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                catId: this.data.currentClassify || 0, //分类
                strWhere: this.data.search_value || '',
                orderBy: this.data.currentFiltrate || 0 //筛选
            },
            other: {
                isShowLoad: showLoad
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let listTemp = data.data || [];
                let nav_box = this.data.nav_box;
                let currentNav = this.data.currentNavShow ||0;
                let nav_item = nav_box[currentNav];
                nav_item.data = nav_item.data || [];
                nav_item.data2 = nav_item.data2 || [];
                nav_item.data3 = nav_item.data3 || [];
                nav_item.loaded = true;
                let showStyle = getUserShowStyle.call(this);
                // nav_box[currentNav].show_style == 0 || 
                if(showStyle == 2){ //一行一个
                    nav_item.data3 = [...nav_item.data3,...listTemp];
                }else{ //一行两个
                    listTemp.forEach((item, index) => {
                        if (index % 2 == 0) {
                            nav_item.data.push(item);
                        } else {
                            nav_item.data2.push(item);
                        }
                    }) 
                }              
                this.setData({
                    [`nav_box[${currentNav}]`]:nav_item,
                    // nav_box,
                    detailInfo:data,
                    none: data.records == 0 ? true : false
                });
                console.log('nav_box',nav_box)
                this.hasMore = this.page * app.Conf.PAGE_SIZE < data.records;
                this.page += 1; 
                return Promise.resolve(res);
            }
            return Promise.reject(res);
        }).finally(() => {
            if (this.data.showLoadImg) {
                if (this.rotateTimeOutId) {
                    clearTimeout(this.rotateTimeOutId)
                    delete this.rotateTimeOutId
                }
                this.setData({
                    showLoadImg: false,
                    moveRoAction: 0
                })
            }
            // this.setData({
            //     currentNav:this.data.currentNavShow
            // })
            this.isLoading = false;
            app.SMH.hideLoading();
            if(type == 'refresh'){
                this.list = this.list || this.selectComponent("#list");
                this.list.refreshEnd();
            }
        }).catch(e => {
            if (this.data.showLoadImg) {
                if (this.rotateTimeOutId) {
                    clearTimeout(this.rotateTimeOutId)
                    delete this.rotateTimeOutId
                }
                this.setData({
                    showLoadImg: false,
                    moveRoAction: 0
                })
            }
            this.isLoading = false;
            app.SMH.hideLoading();
        })
    }
}

function loadNav() {
    if (this.hasMoreNav && !this.isLoadingNav) {
        this.isLoadingNav = true;
        return app.GrassApi.get_Grass_CategoryList({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                brandCode: app.Conf.BRAND_CODE,
                strWhere: ''
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let nav_box = data.data || [];
                this.setData({
                    nav_box: [...this.data.nav_box, ...nav_box],
                    // noneNav: data.records == 0,
                });
                this.hasMoreNav = this.pageNav * app.Conf.PAGE_SIZE < data.records;
                this.pageNav += 1;
            }
        }).finally(() => {
            this.isLoadingNav = false;
        })
    }
}

function reset() {
    this.page = 1;
    this.isLoading = false;
    this.hasMore = true;
    let nav_box = this.data.nav_box;
    nav_box[this.data.currentNavShow].data = [];
    nav_box[this.data.currentNavShow].data2 = [];
    nav_box[this.data.currentNavShow].data3 = [];
    nav_box[this.data.currentNavShow].loaded = false;
    this.setData({
        none: false,
    })
}

function init() { //初始化发布流程数据
    app.globalData.select_title = '';
    app.globalData.select_content = '';
    app.globalData.select_classify = [];
    app.globalData.select_label = [];
    app.globalData.select_recommend = [];
    app.globalData.select_relative = [];
    app.globalData.select_pictures = [];
    app.globalData.select_video = [];
    console.log('全局:', app.globalData);
}

function postClickLog(pub_id = 0) {
    return app.GrassApi.postClickLog({
        data: {
            pubId: pub_id,
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
        }
    })
}


function loadDataCheck(resetValue = false, showLoad = true,type) {
    let that = this;
    clearLoadingHideLock.call(this);
    this.LoadingHideLock = setTimeout(() => {
        clearTimeout(this.LoadingHideLock);
        if (resetValue) {
            reset.call(that);
        }
        loadData.call(that, showLoad,type);
    }, 500)
}

function clearLoadingHideLock() {
    this.LoadingHideLock && clearTimeout(this.LoadingHideLock);
    delete this.LoadingHideLock;
}
function getUserShowStyle(){
    let userShowStyle = app.StorageH.get("userShowStyle") || 1;
    this.setData({
        userShowStyle: userShowStyle
    })
    this.pageHeader = this.pageHeader || this.selectComponent("#pageHeader");
    this.pageHeader && this.pageHeader.setShowStyle(userShowStyle);
    return userShowStyle;
}

// function loadingCheck(time = 1) {
//     if (!this.button_loading) {
//         this.button_loading = true;
//         this.buttonLoadId = setTimeout(() => {
//             this.button_loading = false;
//         }, 500 * time)
//     }
// }

function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: app.LM.isLogin
    })
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    console.log("登录状态触发");
    if (app.LM.isLogin) {
      this.setData({
        isLogin: true
      })
    }
  });
}
function unListen() {
  if (this.listenLoginStatuId) {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
}