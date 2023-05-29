const app = getApp();
const MAX = 5;
Page(app.BP({
    data: {
        data_list: [],
        selectedNum: 0,
        maxNum: MAX,
        search_type: ''
    },
    page: 1,
    hasMore: true,
    isLoading: false,
    none: false,
    selected_arr: [],
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '添加商品'
        })
        this.options = options;
        this.type = options.type;
        let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
        let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        this.setData({
            search_type: options.type || '',
            ls_icon1: ls_icon1,
            ls_icon2: ls_icon2
        })
        console.log('分类:', options.type)
        if (options.type == 'recommend') {
            app.globalData.select_recommend = app.globalData.select_recommend || [];
            this.selected_arr = JSON.parse(JSON.stringify(app.globalData.select_recommend));
        } else if (options.type == 'relative') {
            app.globalData.select_relative = app.globalData.select_relative || [];
            this.selected_arr = JSON.parse(JSON.stringify(app.globalData.select_relative));
        }
        loadData.call(this)
    },
    handle_scroll(e) {
        loadData.call(this);
    },
    handle_select(e) {
        let dataset = e.currentTarget.dataset;
        let num = dataset.num;
        let name = dataset.name || '';
        let src = dataset.src || '';
        let id = dataset.id || 0;
        let obj = {};
        let first = this.data.data_list[num].isSelect;
        this.data.data_list[num].isSelect = !this.data.data_list[num].isSelect;
        obj = {
            "id": id,
            "name": name,
            "src": src,
            "isSelect": true
        }
        let check = true;
        if (first == true && !this.data.data_list[num].isSelect) {
            // console.log('取消了');
            check = selected_map.call(this, id);
        } else if (first == false && this.data.data_list[num].isSelect) {
            // console.log('添加了');
            check = selected_map.call(this, id, true, obj);

        }
        if (!check) {
            this.data.data_list[num].isSelect = !this.data.data_list[num].isSelect;
            app.SMH.showToast({
                title: `最多选择${MAX}个`
            })
        }
        this.setData({
            [`data_list[${num}].isSelect`]: this.data.data_list[num].isSelect
        });
        console.log(this.data.data_list);
    },
    handle_confirm(e) {
        console.log(e.detail.value);
        let dataset = e.currentTarget.dataset;
        let datail = e.detail.value;
        // let type = dataset && dataset.type;
        // this.setData({
        //     [type]: datail
        // })
        this.search_value = datail;
        reset.call(this)
    },
    button_confirm(e) {
        let list = this.selected_arr || [];
        if (this.type == 'recommend') {
            app.globalData.select_recommend = list;
        } else if (this.type == 'relative') {
            app.globalData.select_relative = list;
        }

        wx.navigateBack({
            delta: 1
        })
    },
    // searchCallback(e) {
    //     console.log('search', e);
    //     reset.call(this);
    //     e.detail = e.detail || {};
    //     data_deal.call(this, e.detail.data || {});
    // },

    searchCallback(e) {
        console.log('search', e);
        reset.call(this);
        this.search_value = e.detail || ""
        loadData.call(this)
    },
}))


function loadData() {
    let type = this.type == 'recommend' ? 'get_Goods_List' : (this.type == 'relative' ? 'get_Goods_List' : '')
    if (type && this.hasMore && !this.isLoading) {
        this.isLoading = true;
        return app.GrassApi[type]({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                brandCode: app.Conf.BRAND_CODE,
                strWhere: this.search_value || ''
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                console.log('res:', res);
                const data = res.data || {};
                data_deal.call(this,data)
            }
        }).finally(() => {
            this.isLoading = false;
        })
    }
}

function sortFn(arr) {
    return arr.sort((a, b) => {
        if (a.color_Id > b.color_Id) {
            return 1
        } else if (a.color_Id < b.color_Id) {
            return -1
        } else if (a.color_Id == b.color_Id) {
            return 0
        }
    })
}

function checkSelectNum() {
    let data_list = this.data.data_list;
    let num = 0;
    data_list.forEach(item => {
        if (item.isSelect) {
            num += 1;
        }
    })
    // if (num > MAX) {
    //     console.log('大于5个');
    //     return false
    // }
    this.setData({
        selectedNum: num
    })
    return true
}

function reset() {
    this.page = 1;
    this.isLoading = false;
    this.hasMore = true;
    this.setData({
        data_list: [],
        none: false
    });
    // loadData.call(this)
}


function selected_map(id = '', add = false, obj = {}, ) {
    let delete_suc = false;
    if (!add) {
        this.selected_arr.forEach((item, index) => {
            if (item.id == id) {
                delete_suc = true;
                this.selected_arr.splice(index, 1)
                // console.log('删除了',id)
            }
        })
    } else {
        if (this.selected_arr.length < MAX) {
            // console.log('添加了')
            this.selected_arr.push(obj);
        } else {
            console.log('超MAX:', MAX);
            return false
        }
    }
    // console.log(this.selected_arr, '==================');
    let num = this.selected_arr.length;
    this.setData({
        selectedNum: num
    })
    return true
}

function data_deal(data = {}) {
    let list = data.data || [];
    // let listTemp = data.data || [];  
    // let list = sortFn.call(this, this.data.temp) //排序
    list.forEach(item => {
        let select = false;
        this.selected_arr.forEach(itemCheck => {
            if (itemCheck.id == item.goods_Id) {
                select = true;
            }
        })
        item.isSelect = select;
    })
    // console.log('排序后:', list)
    this.setData({
        data_list: [...this.data.data_list, ...list],
        none: data && data.records == 0  ,
        selectedNum: this.selected_arr.length,
    })
    console.log('none:', this.data.none)
    this.hasMore = this.page * app.Conf.PAGE_SIZE < data.records;
    this.page += 1;
}