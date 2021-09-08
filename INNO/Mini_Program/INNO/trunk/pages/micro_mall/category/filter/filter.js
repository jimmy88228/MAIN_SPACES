let app = getApp();
const PropertyArray = ['GoodPropertyArray','ColorPropertyArray','SizePropertyArray','CurGoodsBrandPropertyArray'];
Component(app.BTAB({
    properties: {
        parentList: {
            type: Object,
            value: {},
            observer(newVal) {
                let cloneArr = { ...newVal };
                let obj = {};
                let result = [];
                for (let key in cloneArr) {
                    if (newVal[key]) {
                        if (key == 'CurGoodsBrandPropertyListArray') {
                            let diyObj = {
                                id: 0,
                                PropertyName: "品牌",
                                CurGoodsBrandPropertyArray: newVal[key]
                            };
                            obj[key] = [diyObj];
                        } else {
                            obj[key] = newVal[key];
                        }
                        obj[key].forEach(item => {
                            let keyIndex = getPropertyArrayKey(item);
                            let arr = item[PropertyArray[keyIndex]] || [];
                            item['hasMore'] = false;
                            item['isFixed'] = false;
                            arr.forEach(res => {
                                res.isActive = false;
                                res.arrKey = PropertyArray[keyIndex];
                            })
                        })
                    }
                }
                for (let item in obj) {
                    result.push(...obj[item]);
                }
                console.log("obj",obj)
                console.log("数组",result)
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
            colorIds: [],
            sizeIds: [],
            colorCatId: "",//可不用
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
            let dataset = e.currentTarget.dataset;
            let [select, sort, data,arrKey,colorId,sizeId,attrValue, attrId, brandId] = 
            [dataset.index,dataset.sort,dataset.data,dataset.arrKey,dataset.colorId,dataset.sizeId,dataset.attrValue,dataset.attrId,dataset.brandId];
            let bool = this.data.filterList[sort][arrKey][select].isActive;
            switch(arrKey){
                case "CurGoodsBrandPropertyArray" :
                    if (!bool) {
                        this.idArr['goods_brand_ids'].push(brandId);
                    } else {
                        this.idArr['goods_brand_ids'].splice(this.idArr['goods_brand_ids'].indexOf(brandId), 1);
                    }
                    break;
                case "ColorPropertyArray" :
                    if (!bool) {
                        this.idArr['colorIds'].push(colorId);
                    } else {
                        this.idArr['colorIds'].splice(this.idArr['colorIds'].indexOf(colorId), 1);
                    }
                    break;
                case "SizePropertyArray" :
                    if (!bool) {
                        this.idArr['sizeIds'].push(sizeId);
                    } else {
                        this.idArr['sizeIds'].splice(this.idArr['sizeIds'].indexOf(sizeId), 1);
                    }
                    break;
                case "GoodPropertyArray" :
                    let isPrice = new RegExp(/(\d+)\-(\d+)/);
                    if (isPrice.test(attrValue)) { //特殊判断价格范围
                        if(!bool){
                            this.idArr['startPrice'] = RegExp.$1;
                            this.idArr['endPrice'] = RegExp.$2;
                        }else{
                            this.idArr['startPrice'] = -1;
                            this.idArr['endPrice'] = -1;
                        }
                        this.idArr['startPrice'] = -1;
                        this.idArr['endPrice'] = -1;
                        let isAttr = this.idArr['strAttrId'].findIndex((res, index) => { //剔除相同strAttrId的属性
                            this.index = index;
                            return res == attrId;
                        });
                        if (isAttr > -1) {
                            this.idArr['strAttrId'].splice(this.index, 1);
                            this.idArr['strAttrValue'].splice(this.index, 1); 
                        }
                    } else {
                        this.idArr['startPrice'] = -1;
                        this.idArr['endPrice'] = -1;
                        let isAttr = this.idArr['strAttrId'].findIndex((res, index) => { //剔除相同strAttrId的属性
                            this.index = index;
                            return res == attrId;
                        });
                        if (isAttr > -1) {
                            this.idArr['strAttrId'].splice(this.index, 1);
                            this.idArr['strAttrValue'].splice(this.index, 1); 
                        }
                        if(!bool){
                            this.idArr['strAttrId'].push(attrId);
                            this.idArr['strAttrValue'].push(attrValue);
                        }
                    }
                    break;
                default:
                    break;
            } 
            console.log("筛选",this.idArr)
            for (let item in data) {
                if (data[item] instanceof Array) {
                    if(!bool){
                        if (item == 'GoodPropertyArray') {
                            let len = this.data.filterList[sort][item].length;
                            for (let i = 0; i < len; i++) {
                                this.data.filterList[sort][item][i].isActive = false;
                            }
                        }
                    }
                    this.data.filterList[sort][item][select].isActive =  !this.data.filterList[sort][item][select].isActive;
                }else{
                    continue
                }
            }
            this.setData({
                filterList: this.data.filterList
            });
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
            this.setData({
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
        reset(noSearch = false) { //重置按钮
            let reset = [...this.data.filterList];
            reset.forEach(res => {
                let keyIndex = getPropertyArrayKey(res);
                let item = res[PropertyArray[keyIndex]];
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
                colorIds:[],
                sizeIds:[],
                colorCatId: "", //可不用
                goods_brand_ids: []
            }
            this.setData({
                filterList: reset,
            });
            console.log('noSearch', noSearch)
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
        submit() { //确定按钮
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
            let distance = (30 / scale).toFixed(2);
            // let distance = (15 / scale).toFixed(2);
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

function getPropertyArrayKey(item){
    let index = PropertyArray.findIndex(key=>{
        return item[key];
    })
    return index;
    for(let i = 0,len=PropertyArray.length;i<len;i++){
        let key = PropertyArray[i];
        if(item[key]){
            index = i;
            break;
        };
    }
    return index
}