const App = getApp();
Page(App.BP({ 
    data: {
        summaryList:[{
            title:"累计销售",
            key:"total_sales",
        },{
            title:"月销售",
            key:"month_sales",
        },{
            title:"周销售",
            key:"week_sales",
        },{
            title:"日销售",
            key:"day_sales",
        }],
        baseInfo:{},
    },
    onLoad() {
        console.log('initinit')
        this.init();
    },
    init() {
        let userInfo = App.LM.userInfo || {};
        this.setData({userInfo})
        this.loadData();
    },
    loadData() {
        this.get_StaffDstbInfo().then(res=>{
            if(res.code==1){
                let baseInfo = res.data||{};
                this.setData({baseInfo});
            }
        })
    },
    get_StaffDstbInfo(){
        return App.Http.QT_DstbApi.get_StaffDstbInfo({
            data:{}
        })
    }
}))