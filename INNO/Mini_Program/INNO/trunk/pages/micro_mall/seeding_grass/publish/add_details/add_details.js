const app = getApp();
const MAX = 5;
Page(app.BP({
    data: {
        data_list: [],
        selectedNum: 0,
        maxNum: MAX,
        search_type: ""
    },
    page: 1,
    hasMore: true,
    isLoading: false,
    none: false,
    selectArr: [],
    selected_arr: [],
    onLoad: function(options) {
        this.options = options;
        this.type = options.type || '';
        let returnImg = this.data.brand_info.icon_url + "micro_mall/return.png";
        let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        this.setData({
            search_type: options.type || '',
            ls_icon1: returnImg,
            ls_icon2: return_active,
        })
        if (options.type == 'classify') {
            wx.setNavigationBarTitle({
                title: '分类'
            })
            this.setData({
                showTitle:'分类'
            })
            app.globalData.select_classify = app.globalData.select_classify || [];
            this.selected_arr = JSON.parse(JSON.stringify(app.globalData.select_classify || []));
        } else if (options.type == 'label') {
            wx.setNavigationBarTitle({
                title: '标签'
            })
            this.setData({
                showTitle: '标签'
            })
            app.globalData.select_label = app.globalData.select_label || [];
            this.selected_arr = JSON.parse(JSON.stringify(app.globalData.select_label || []));
        }
        console.log('已选：', this.selected_arr);


        loadData.call(this)
    },
    handle_scroll(e) {
        console.log('scroll', e)
    },
    handle_select(e) {
        console.log('handle_select', e)
        let dataset = e.currentTarget.dataset;
        let num = dataset.num;
        let name = dataset.name || '';
        let id = dataset.id || 0;
        let obj = {};
        let first = this.data.data_list[num].isSelect;
        this.data.data_list[num].isSelect = !this.data.data_list[num].isSelect;
        obj = {
            "id": id,
            "name": name,
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
        reset.call(this);
    },
    button_confirm(e) {
        let list = this.selected_arr || [];
        let obj = {};
        let arr = [];
        if (this.type == 'classify') {
            app.globalData.select_classify = list;
        } else if (this.type == 'label') {
            app.globalData.select_label = list;
        }
        wx.navigateBack({
            delta: 1
        })
    },
    searchCallback(e) {
        console.log('search', e);
        reset.call(this);
        e.detail = e.detail || {};
        data_deal.call(this, e.detail.data || {});
    },
}))


function loadData() {
    let type = this.type == 'classify' ? 'get_Grass_CategoryList' : (this.type == 'label' ? 'get_Grass_LabelList' : '')
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
                const data = res.data || {};
                // let listTemp = data.data || [];
                // let list = sortFn.call(this, listTemp);
                data_deal.call(this, data);
            }
        }).finally(() => {
            this.isLoading = false;
        })
    }

}

function sortFn(arr) {
    return arr.sort((a, b) => {
        if (a.sort > b.sort) {
            return 1
        } else if (a.sort < b.sort) {
            return -1
        } else if (a.sort == b.sort) {
            return 0
        }
    })
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
    list.forEach(item => {
        let select = false;
        this.selected_arr.forEach(itemCheck => {
            if (itemCheck.id == item.id) {
                select = true;
            }
        })
        item.isSelect = select;
    })
    // console.log('排序后:', list)
    this.setData({
        data_list: [...this.data.data_list, ...list],
        none: data && data.records == 0,
        selectedNum: this.selected_arr.length,
    });
    // console.log('none:', this.data.none);
    this.hasMore = this.page * app.Conf.PAGE_SIZE < data.records;
    this.page += 1;
}