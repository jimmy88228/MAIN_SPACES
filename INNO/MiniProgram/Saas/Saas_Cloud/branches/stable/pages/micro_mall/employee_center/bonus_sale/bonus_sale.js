const app = getApp();

const INDEXPARAMS = {
    0: "dateType=0",
    1: "dateType=1",
    2: "dateType=2"
}

Component(app.BTAB({
    properties: {
        tabs:{
            type: Array,
            value:[]
        },
        commission: {
            type: Boolean,
            value: false
        },
        can_visit:{
          type: Number,
          value: 0
        }
    },
    data: {
        setVal:[]
    },
    methods: {
        init(value=[]) {
            this.setData({
                initVal:value
            })
            return 
        }, 
        jump(e) {
            let index = e.currentTarget.dataset.index;
            wx.navigateTo({
                url: `/pages/micro_mall/employee_center/distribution_service/bonusOrderList/bonusOrderList?${INDEXPARAMS[index]}`
            })
        },
    }
}))