let app = getApp();
Component(app.BTAB({
    properties: {
        parentList: {
            type: Object,
            value: {},
            observer(newVal) {
                let cloneArr = { ...newVal
                };
                let initArr = {};
                let result = [];
                for (let key in cloneArr) {
                    if (cloneArr[key]) {
                        if (key == 'CurGoodsBrandPropertyListArray') {
                            let commonPanel = {
                                id: 0,
                                PropertyName: "品牌",
                                CurGoodsBrandPropertyArray: cloneArr[key]
                            };
                            initArr[key] = [commonPanel];
                        } else {
                            initArr[key] = cloneArr[key];
                        }
                        initArr[key].forEach(key => {
                            let item = key['GoodPropertyArray'] || key['ColorPropertyArray'] || key['CurGoodsBrandPropertyArray'];
                            key['hasMore'] = false;
                            key['isFixed'] = false;
                            if (item) {
                                item.forEach(res => {
                                    res['isActive'] = false;
                                })
                            }
                        })
                    }
                }
                for (let item in initArr) {
                    result.push(...initArr[item]);
                }
                console.log("数组")
                console.log(result)
                this.setData({
                    filterList: result
                });
                if (Object.keys(this.data.filterList).length > 1) {
                   let timer = setTimeout(() => {
                        clearTimeout(timer);
                        loadData.call(this);
                    }, 0)
                }
            }
        },
        brandInfo: {
            type: Object,
            value: {}
        }
    },
    data: {
        isIphoneX: app.SIH.isIphoneX,
        hidePanel: false,
        filterList: [],
        arrow_show: "",
        arrow_hide: "",
        showImg: false,
        show_search: false,
        search_value: ''
    },
    ready() {
        let arrow_show = this.data.brandInfo.icon_url + "micro_mall/arrow_show.png";
        let arrow_hide = this.data.brandInfo.icon_url + "micro_mall/arrow_hide.png";
        let search_icon = this.data.brandInfo.icon_url + "micro_mall/search_icon.png";
        let resetImg = this.data.brand_info.icon_url + "micro_mall/comment_edit/remove_btn_icon.png";
        this.setData({
            arrow_show: arrow_show,
            arrow_hide: arrow_hide,
            search_icon: search_icon,
            resetImg: resetImg,
            showImg: false
        });
        this.idArr = {
            strAttrId: [],
            strAttrValue: [],
            startPrice: -1,
            endPrice: -1,
            colorCatId: "",
            goods_brand_ids: []
        }
        this.currentPage = getCurrentPages().pop();
    },
    detached() {
        this.reset();
    },
    methods: {
        showMore(e) {
            let dataset = e.currentTarget.dataset;
            let select = dataset.index;
            this.setData({
                [`filterList[${select}].isFixed`]: !this.data.filterList[select].isFixed
            });
        },
        selectSort(e) {
            console.log(this.data.filterList);
            let _this = this;
            let dataset = e.currentTarget.dataset;
            let [select, sort, type, id, attrValue, attrId, brandId] = [dataset.index, dataset.sort, dataset.type, dataset.id, dataset.attrValue, dataset.attrId, dataset.brandId];
            if (id) {
                this.idArr['colorCatId'] = id;
            }
            if (brandId && !this.idArr['goods_brand_ids'].includes(brandId)) {
                this.idArr['goods_brand_ids'].push(brandId);
            } else if (brandId && this.data.filterList[sort]['CurGoodsBrandPropertyArray'][select].isActive) {
                this.idArr['goods_brand_ids'].splice(this.idArr['goods_brand_ids'].indexOf(brandId), 1);
            } else {}
            if (attrId && attrValue) {
                let isPrice = new RegExp(/(\d+)\-(\d+)/);
                if (isPrice.test(attrValue)) {
                    this.idArr['startPrice'] = RegExp.$1;
                    this.idArr['endPrice'] = RegExp.$2;
                } else {
                    let isAttr = this.idArr['strAttrId'].findIndex((res, index) => {
                        this.index = index;
                        return res == attrId;
                    });
                    if (isAttr > -1) {
                        this.idArr['strAttrId'].splice(this.index, 1);
                        this.idArr['strAttrValue'].splice(this.index, 1);
                        this.idArr['strAttrId'].push(attrId);
                        this.idArr['strAttrValue'].push(attrValue);
                    } else {
                        this.idArr['strAttrId'].push(attrId);
                        this.idArr['strAttrValue'].push(attrValue);
                    }
                }
            }
            console.log("筛选的条件")
            console.log(this.idArr);
            for (let item in type) {
                if (type[item] instanceof Array) {
                    if (!(item == 'CurGoodsBrandPropertyArray')) {
                        let len = this.data.filterList[sort][item].length;
                        for (let i = 0; i < len; i++) {
                            this.data.filterList[sort][item][i].isActive = false;
                        }
                    }
                    this.data.filterList[sort][item][select].isActive =  !this.data.filterList[sort][item][select].isActive; 
                    this.setData({
                        filterList: this.data.filterList
                    });
                }
            }
        },
        resetValue() {
            this.search_value = '';
            this.setData({
                search_value: ''
            })
        },
        closePanel() {
            let page = this.currentPage || getCurrentPages().pop();
            page.setData({
                noScroll: false
            });
            let _this = this;
            this.setData({
                hidePanel: false,
            });
            this.triggerEvent('hidePanel')
            app.globalData.panel = this.data.filterList;
        },
        initStatus() { 
            let _this = this;
            let page = this.currentPage || getCurrentPages().pop();
            page.setData({
                noScroll: !this.currentPage.data.noScroll
            });
            // if (_this.data.anim_search){
            //     this.setData({
            //         anim_search_style: 'opacity:0;',
            //         anim_bg_style: "opacity:0",
            //         setIndex: setIndex? true : true
            //     });
            // } 
            this.setData({
                // show_search: false,
                // anim_search: false,
                hidePanel: !_this.data.hidePanel,
            })
            if (!this.data.hidePanel) {
                this.save();
            }else{
                console.log(this.data.filterList); 
            }
        },
        save() {
            app.globalData.panel = this.data.filterList;
        },
        stopClose() {},

        get_value(e) {
            let value = e.detail && e.detail.value || ''
            this.search_value = value;
            this.setData({
                search_value: value
            })
        },
        cancelClick() {
            // let _this = this;
            // this.setData({
            //     anim_search_style: 'opacity:0;',
            //     anim_bg_style: "opacity:0;"
            // })
            // setTimeout(() => {
            //     _this.setData({
            //         show_search: false,
            //         anim_search: false
            //     })
            // }, 250)
        },

        handle_click() { //右上角
            // let _this = this;
            // this.setData({
            //     show_search: !this.data.show_search,
            // })
            // wx.nextTick(() => {
            //     _this.setData({
            //         anim_search: !_this.data.anim_search,
            //         anim_search_style: 'opacity:1;',
            //         anim_bg_style: "opacity:0.5;"
            //     })
            // })
        },
        handle_search() { //浮框的确定
            let _this = this;
            this.setData({
                search_value: this.search_value
            })
            // this.triggerEvent("search", this.data.search_value || '');
            // _this.setData({
            //     anim_search: !_this.data.anim_search,
            //     anim_search_style: 'opacity:0;',
            //     anim_bg_style: "opacity:0;"
            // })
            this.reset(true);
            // setTimeout(() => {
            //     _this.setData({
            //         show_search: false,
            //     })
            // }, 250)
        },
        reset(noSearch = false) { //重置
            let reset = [...this.data.filterList];
            reset.forEach(res => {
                let item = res['GoodPropertyArray'] || res['ColorPropertyArray'] || res['CurGoodsBrandPropertyArray'];
                if (item) {
                    item.forEach(content => {
                        content['isActive'] = false;
                    })
                }
            });
            this.idArr = {
                strAttrId: [],
                strAttrValue: [],
                startPrice: -1,
                endPrice: -1,
                colorCatId: "",
                goods_brand_ids: []
            }
            this.setData({
                filterList: reset,
            });
            console.log('noSearch', noSearch)
            // this.triggerEvent("search", this.search_value);
            // this.triggerEvent("Info", this.idArr); 
            if (noSearch != true) {
                this.search_value = '';
                this.setData({
                    search_value: ''
                });
                let obj = {
                    _value: this.search_value,
                    _search: false
                }
                this.triggerEvent("search", obj);
            } else {
                let obj = {
                    _value: this.search_value,
                    _search: true
                }
                this.triggerEvent("search", obj);
            }
        },
        submit() { //右下角确定
            // let checkClick = false;
            // if (this.idArr.colorCatId != '' || this.idArr.endPrice != -1 || this.idArr.startPrice != -1 || this.idArr.goods_brand_ids.length > 0 || this.idArr.strAttrId.length > 0 || this.idArr.strAttrValue.length > 0){
            //     checkClick = true;
            // }
            // if (!checkClick){
            //     this.closePanel();
            //     return
            // } 
            this.triggerEvent("Info", this.idArr);
            this.closePanel();
        },
        _noFn() {},
    }
}))

function loadData() {
    let that = this;
    const query = wx.createSelectorQuery().in(this);
    wx.getSystemInfo({
        success(res) {
            let scale = (750 / res.windowWidth).toFixed(2);
            let distance = (15 / scale).toFixed(2);
            let promsie = new Promise((resolve, reject) => {
                query.select('.item').boundingClientRect(function(res) {
                    resolve({
                        height: res.height,
                        distance: distance,
                        scale: scale
                    })
                }).exec();
            });
            promsie.then(res => {
                query.selectAll('.content').boundingClientRect(function(res2) {
                    res2.forEach((val, index) => {
                        let standard = Math.ceil(2 * res.height + 2 * res.distance);
                        let real = Math.ceil(val.height);
                        if (real > standard) {
                            that.setData({
                                [`filterList[${index}].hasMore`]: true,
                                [`filterList[${index}].isFixed`]: true
                            });
                        }
                    })
                }).exec()
            });
        }
    });
}