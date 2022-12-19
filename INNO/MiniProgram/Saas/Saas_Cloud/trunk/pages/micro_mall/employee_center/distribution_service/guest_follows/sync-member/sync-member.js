// pages/micro_mall/employee_center/distribution_service/guest_follows/sync-member/sync-member.js
const app = getApp();
import Utils from '../../../../../../common/support/utils/utils'
Page(app.BP({
    data: {
        storeList:[],
        selectItem:{},
    },
    hasMore:true,
    page:1,
    isLoading:false,
    onReady(){
        this.idMember = this.selectComponent('#idMember');
        this.idStore = this.selectComponent('#idStore');
    },
    checkInput(){
        let menberInput = this.idMember.getInput();
        if(!menberInput){
            app.SMH.showToast({title:"请输入手机号"});
            throw Error("请输入手机号");
        }
    },
    sync(e) {
        this.checkInput();
        if(this.poolLoading)return;
        this.poolLoading = true;
        this.idMember || (this.idMember = this.selectComponent('#idMember'));
        this.idStore || (this.idStore = this.selectComponent('#idStore'));
        let selectItem = this.selectItem || {};
        let menberInput = this.idMember.getInput();
        // let storeInput = this.idStore.getInput();
        let storeId = selectItem.storeId || 0;
        console.log(menberInput,storeId,this.data.selectItem);
        poolByStaff.call(this,menberInput,storeId);
    },
    resetList(){
        this.page = 1;
        this.hasMore = true;
        this.isLoading = false;
        this.data.storeList = [];
    },
    handleInput(e) {
        let id = e.currentTarget.id || "";
        // console.log(id, e);
        if (id == 'idStore') {
            this.searchText = e.detail && e.detail.detail;
            this.setData({searchText:this.searchText})
            this.resetList();
            searchFnc.call(this, () => {
                getStoreList.call(this);
            })
        }
    },
    scrollToLower(e) {
        if (this.hasMore) {
            getStoreList.call(this);
        }
    },
    selectStore(e){
        this.idStore || (this.idStore = this.selectComponent('#idStore'));
        let data = this.getDataset(e.detail,'data') || {};
        let storeName = data.storeName||"";
        this.selectItem = data;
        this.searchText = storeName;
        this.idStore.setFocus(false);
        this.setData({
          // focus:false,
          selectItem:this.selectItem,
          searchText:this.searchText,
        })
        this.idStore.setInput(storeName);
        this.resetList();
        getStoreList.call(this);
    },
}))

function getStoreList() {
    if (this.isLoading) return Promise.reject();
    this.isLoading = true;
    if(this.searchText == ''){
        this.selectItem = {};
        this.setData({
            selectItem:{}
        })
    }
    return app.UserApi.get_UserDockStoreList({
        params: {
            searchStr: this.searchText,
            pageIndex: this.page || 1,
            pageSize: 10,
            brandCode: app.Conf.BRAND_CODE,
        }
    }).then(res => {
        if (res.code == '1') {
            let data = res.data || {};
            let storeList = data.list || [];
            this.setData({
                storeList: [...this.data.storeList, ...storeList]
            });
            console.log('storeList',this.data.storeList)
            let totalCount = data.totalCount || 0;
            this.hasMore = (this.page * 10) < totalCount;
            this.page += 1;
        }
        return res
    }).finally(() => {
        this.isLoading = false;
    })
}

let searchFnc = Utils.throttleTwice(fn => {
    fn();
}, 800);

function poolByStaff(phone,storeId){
    return app.IM.checkIfStore().then(res=>{
        let storeInfo = app.LM.storeInfo||{};
        console.log('storeInfo',storeInfo);
        return app.UserApi.create_UserDockPoolByStaff({
            data:{
                staffId:storeInfo.staff_id||0,
                mobilePhone:phone,
                storeId:storeId||storeInfo.store_id||0,
                brandCode:app.Conf.BRAND_CODE
            }
        }).then(res=>{
            let msg = res && res.code == 1?'同步任务已执行':'同步异常'
            app.SMH.showToast({
                title:res&&res.msg||msg
            })
            return res;
        }).finally(()=>{
            setTimeout(() => {
                this.poolLoading = false;
            }, 350);
        })
    })
}