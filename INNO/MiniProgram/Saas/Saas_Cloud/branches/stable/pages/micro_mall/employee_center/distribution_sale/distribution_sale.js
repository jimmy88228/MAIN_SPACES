const app = getApp();
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
            let key = e.currentTarget.dataset.key;
            if(key == 'invite'){
              wx.navigateTo({
                url: '/pages/micro_mall/employee_center/invitat_award/invitat_award',
              })
            } 
        },
    }
}))