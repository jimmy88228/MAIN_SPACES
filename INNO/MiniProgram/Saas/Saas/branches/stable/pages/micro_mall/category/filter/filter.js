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
        autoSelectSort(options = {}) { // 自动帮用户选择, 目前只包括"品牌"
            const {brand_ids: goods_brand_id} = options;
            const filterList = this.data.filterList || []
            let chooseList = []; // [{sort: xx, arrKey: xx, select: xx}, ...]
            filterList.some((sort,sortIndex) => {
                let brandSort = sort.CurGoodsBrandPropertyArray
                if (brandSort && brandSort.length) { // 找到品牌分类
                    brandSort.some((select, selectIndex) => {
                        if (select.goods_brand_id == goods_brand_id) { // 找到这个品牌
                            chooseList.push({
                                sort: sortIndex,
                                arrKey: "CurGoodsBrandPropertyArray",
                                index: selectIndex,
                                brandId: goods_brand_id,
                                data: filterList[sortIndex]
                            })
                            return true
                        }
                    })
                    return true
                }
            })
            chooseList.forEach(item => {
                this.selectSort({currentTarget:{dataset: item}})
            })
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
                    let goodsPropertyRel = this.goodsPropertyRel = this.goodsPropertyRel || {}; // {{id: {_hadPrice: 0, value: true, value: false}}, ...{}}
                    let attrIdExisted = goodsPropertyRel[attrId];
                    let attrValueExisted = goodsPropertyRel[attrId] && goodsPropertyRel[attrId][attrValue];
                    if (isPrice.test(attrValue)) { //特殊判断价格范围 不支持多选
                        if(!bool){
                            if (this.alreadyChoosePrice) {
                              app.SMH.showToast({title: "只能选择一个价格范围哦"})
                              return 
                            }
                            this.idArr['startPrice'] = RegExp.$1;
                            this.idArr['endPrice'] = RegExp.$2;
                            this.alreadyChoosePrice = true;
                            goodsPropertyRel[attrId] = {_hadPrice: 1, [attrValue]: 'isPrice'}
                        }else{
                            this.idArr['startPrice'] = -1;
                            this.idArr['endPrice'] = -1;
                            this.alreadyChoosePrice = false;
                            goodsPropertyRel[attrId] = {}
                        }
                        // this.idArr['startPrice'] = -1; // 这两行会导致价格筛选失效，意义暂未明
                        // this.idArr['endPrice'] = -1;
                        // let isAttr = this.idArr['strAttrId'].findIndex((res, index) => { //剔除相同strAttrId的属性
                        //     this.index = index;
                        //     return res == attrId;
                        // });
                        // if (isAttr > -1) {
                        //     this.idArr['strAttrId'].splice(this.index, 1);
                        //     this.idArr['strAttrValue'].splice(this.index, 1); 
                        // }
                    } else {
                        if (data["Type"] != "1") { // 多选
                          if (attrIdExisted && goodsPropertyRel[attrId]._hadPrice) { // 已有选价格范围，要将价格范围的item先去掉
                            this.idArr['startPrice'] = -1;
                            this.idArr['endPrice'] = -1;
                            this.alreadyChoosePrice = false;
                            delete goodsPropertyRel[attrId];
                            attrIdExisted = false;
                          }
                          if (!attrValueExisted) { // 不存在，增加
                            attrIdExisted ? 
                            goodsPropertyRel[attrId][attrValue] = true : 
                            goodsPropertyRel[attrId] = {[attrValue]: true};
                          } else { // 已存在，删除
                            delete goodsPropertyRel[attrId][attrValue];
                          }
                        } else {
                          bool ? goodsPropertyRel[attrId] = {} : goodsPropertyRel[attrId] = {[attrValue]: true};
                        }
                        // let isAttr = this.idArr['strAttrId'].findIndex((res, index) => { //剔除相同strAttrId的属性
                        //     this.index = index;
                        //     return res == attrId;
                        // });
                        // if (isAttr > -1) {
                        //     this.idArr['strAttrId'].splice(this.index, 1);
                        //     this.idArr['strAttrValue'].splice(this.index, 1); 
                        // }
                        // if(!bool){
                        //     this.idArr['strAttrId'].push(attrId);
                        //     this.idArr['strAttrValue'].push(attrValue);
                        // }
                    }

                    let strAttrId = [], strAttrValue = [];
                    A: for (let _attrId of Object.keys(goodsPropertyRel)) {
                      let includeAttrValues = goodsPropertyRel[_attrId] || {};
                      B: for (let _attrValues of Object.keys(includeAttrValues)) {
                        if (includeAttrValues[_attrValues]){
                          if (includeAttrValues[_attrValues] === "isPrice" || _attrValues === "_hadPrice") continue B;
                          strAttrValue.push(_attrValues);
                          strAttrId.push(_attrId);
                        }
                      }
                    }
                    this.idArr['strAttrId'] = strAttrId;
                    this.idArr['strAttrValue'] = strAttrValue;
                    break;
                default:
                    break;
            } 
            console.log(this.goodsPropertyRel, "s", this.data.filterList)
            console.log("筛选",this.idArr)
            A: for (let item in data) {
                if (data[item] instanceof Array) {
                    if(!bool){
                        if (item == 'GoodPropertyArray') {
                            let propertyArray = this.data.filterList[sort][item] || [];
                            let len = propertyArray.length;
                            B:for (let i = 0; i < len; i++) {
                                let {attr_id, attr_value} = propertyArray[i] || {};
                                let propName = this.goodsPropertyRel[attr_id] && this.goodsPropertyRel[attr_id][attr_value];
                                propertyArray[i].isActive = !!(propName);
                            }
                            continue A;
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
            this.goodsPropertyRel = {};
            this.alreadyChoosePrice = false;
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