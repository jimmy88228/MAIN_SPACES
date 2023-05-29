const app = getApp();
import MyDate from "../../../../../common/support/utils/date-util.js"
import stringUtil from '../../../../../common/support/utils/string-util';

Page(app.BP({
    data: {
        filter: false,
        leftWidth:0,
        list: [],
        current: 0,
        infoTabs:[
            {name:"团队总数",showTip:false},
            {name:"A类粉丝",showTip:false},
            {name:"B类粉丝",showTip:false},
            {name:"间接粉丝",showTip:false},
        ],
        // label:["无分销身份的粉丝","带有分销身份的粉丝","团队中b类粉丝所发展的下属粉丝"],
        label:["普通粉丝","下级推广员","B类发展的粉丝"],
        tabs: ['A类粉丝', 'B类粉丝'],
        none: [],
        cur_index:0,
    },
    hasMore: true,
    isLoading: false,
    page: 1,
    onLoad: function(options) {
        let staff_right = this.data.brand_info.icon_url + "micro_mall/staff/staff_right.png";
        let team_search = this.data.brand_info.icon_url + "micro_mall/staff/team_search.png";
        this.leftWidth = (750 / this.data.tabs.length).toFixed(2);
        let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 50, 132, 105, 1)
        this.setData({
            staff_right: staff_right,
            team_search: team_search,
            l_bg_color: 'background:#efefef;'
        })
        reset.call(this);
        loadDataList.call(this, 0);
        loadDataBase.call(this);
    },
    handleScroll() {
        this.reflash[this.data.current] = true;
        loadDataList.call(this, this.data.current);
    },
    showDetail: function(e) {
        let dataset = e.currentTarget.dataset || {};
        let empty = true;
        for (let item in dataset) {
            empty = false;
            break
        }
        // var arr = Object.keys(data); //和上面的for in同样能解决判空
        this.setData({
            filter: !this.data.filter,
        })
        if (!empty) {
            let phone = dataset.phone || '';
            phone =  stringUtil.getPrivacyPhone(phone) || "";
            this.setData({
                name: dataset.name || '',
                commAmount: dataset.commAmount || 0,
                rank: dataset.rank || '',
                last: dataset.last || '',
                joinTime: dataset.joinTime || '',
                mobilePhone: phone || '',
            })
        }
    },
    orderJump(e){
      let dataset = e.currentTarget.dataset || {};
      let fromUserId = dataset.userId || 0;
      wx.navigateTo({
        url: `/pages/micro_mall/employee_center/distribution_orders_lists/distribution_orders_lists?currentIndex=0&type=commission&fromUserId=${fromUserId}`,
      })
    },
    handleTab(e) {
        let type = e.currentTarget.dataset.type || 0;
        this.setData({
            current: type,
            leftWidth: this.leftWidth * type + 'rpx'
        })
        loadDataList.call(this, this.data.current);
    },
    handleConfirm(e) {
        this.value = this.valueTemp;
        reset.call(this);
        loadDataList.call(this, this.data.current);
    },
    handleInput(e) {
        this.valueTemp = e.detail.value;
    },
    handleTap(e){
        console.log(e)
        let type = e.type || "";
        if(type=="blur"){
            if(!this.valueTemp && this.data.showInput){
                this.setData({
                    showInput:false
                })
            }
        }
    },
    onTap(e){
        let dataset = e.currentTarget.dataset||{};
        let type = dataset.type||"";
        if(type == 'amount'){
            if(this.isLoading[this.data.current])return
            let index = this.data.cur_index;
            index += 1;
            index = index % 3;
            this.setData({
                cur_index:index
            });
            reset.call(this);
            loadDataList.call(this, this.data.current);
        }else if(type=='tips'){
            let index = dataset.index||0; 
            setTipAnim.call(this,index);
        }else if(type=="i_click"){
            this.setData({
                showInput:true
            })
        }
    }
}))

function loadDataList(type = 0) {
    // console.log(this.page, this.hasMore, this.reflash, this.isLoading, this.data.list)
    // console.log('page', 'hasmore', 'reflash', 'isloading', 'list')
    let paramType = type == 1 ? 2 : 1; 
    let sortField = this.data.cur_index == 0 ? "JOIN_TIME" : "COMM_AMOUNT"
    let sortBy = this.data.cur_index == 1 ? "ASC" : "DESC"
    if (this.hasMore[type] && !this.isLoading[type] && this.reflash[type]) {
        this.isLoading[type] = true;
        return app.DistrApi.getMyTeamList({
            params: {
              userToken: app.LM.userToken, // 'd5bd7d517c2e207f' ||
                brandCode: app.Conf.BRAND_CODE,
                pageIndex: this.page[type] || 1,
                pageSize: app.Conf.PAGE_SIZE,
                type: paramType || 1,
                searchStr: this.value || '',
                sortField,
                sortBy,
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let list = data && data.dataList || [];
                list.map((item, index) => {
                    item.lastClickTime = item.lastClickTime && item.lastClickTime.replace(/\//g,'-') || '';
                    item.joinTime = item.joinTime && MyDate.format(MyDate.parse(item.joinTime),'yyyy-MM-dd HH:mm') ||"";
                    let protectMinutes = item.protectMinutes || 0; //分钟
                    let timeStr = ""
                    if(protectMinutes > 0 && protectMinutes < 30 * 24 * 60){//0 ~ 30天时间
                        if(protectMinutes < 60){
                            timeStr = protectMinutes + "分钟后脱保"
                        }else if(protectMinutes < (24 * 60)){
                            timeStr = ( protectMinutes / 60 ).toFixed() + "小时后脱保"
                        }else if(protectMinutes < (30 * 24 * 60)){
                            timeStr = ( protectMinutes / (24 * 60) ).toFixed() + "天后脱保"
                        }
                    }
                    item.timeStr = timeStr;
                    // item.leftDate = item.protectMinutes > 0 ? (item.protectMinutes/1440) : 0;
                    // item.leftHour = (item.leftDate < 1 && item.leftDate > 0) ? (item.protectMinutes/60) : 0;
                    // item.leftHour = (item.leftHour).toFixed();
                    // item.leftDate = item.leftDate > 1 ? parseInt(item.leftDate) : item.leftDate;\
                    let dateTemp = item.joinTime && item.joinTime.split(' ') || [];
                    item.date1 = dateTemp[0] || '';
                    item.date2 = dateTemp[1] || '';
                    // list[index].date1 = dateTemp[0] || '';
                    // list[index].date2 = dateTemp[1] || '';
                })
                this.setData({
                    [`list[${type}]`]: [...this.data.list[type], ...list],
                    [`none[${type}]`]: data.totalCount == 0 ? true : false
                })
                this.hasMore[type] = this.page[type] * app.Conf.PAGE_SIZE < (data && data.totalCount || 0);
                this.page[type] += 1;
            }
            return res
        }).finally(() => { 
            this.isLoading[type] = false; 
            this.reflash[type] = false
        })
    }else{
        this.reflash[type] = false;
    }
}

function loadDataBase() {
    return app.DistrApi.getMyTeamInfo({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            const data = res.data || {};
            this.setData({
                detail_info: data
            })
        }
        return res
    })
}

function reset(single = false) {
    let arrLen = this.data.tabs.length;
    this.isLoading = [];
    this.hasMore = [];
     this.page = [];
    this.dataList = [];
    this.none = [];
    this.reflash = [];
    for (let i = 0, len = arrLen; i < len; i++) {
        this.isLoading.push(false);
        this.hasMore.push(true);
        this.reflash.push(true);
        this.page.push(1);
        this.dataList.push([]);
        this.none.push(false)
    }
    this.data.list = this.dataList;
    this.setData({
        // list: this.dataList,
        none: this.none
    })
    // console.log(this.page, this.hasMore, this.reflash, this.isLoading,)
}
function setTipAnim(index){
    // if(this.throttle)return
    // throttle.call(this);
    index = index || 0;
    let infoTabs = this.data.infoTabs;
    let showTip = !infoTabs[index].showTip;
    if(showTip){
        let len = infoTabs.length;
        for(let i = 0;i<len;i++){
            infoTabs[i].showTip=index == i ? true:false
        }
        this.setData({
            infoTabs,
            showAnim:false
        });
        setTimeout(()=>{
            this.setData({
                showAnim:true
            });
        },100)
    }else{
        this.setData({
            showAnim:false
        }); 
        setTimeout(()=>{
            this.setData({
                [`infoTabs[${index}].showTip`] : false
            });
        },150) 
    }
}

function throttle(time){
    time = time || 200;
    this.throttle = true;
    this.throId = setTimeout(()=>{
        this.throttle = false
    },time)
}