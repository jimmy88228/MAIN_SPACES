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
        },
        can_cashout:{
            type: Number,
            value: 1
        }
    },
    data: {
    },
    methods: {
        init(value) {
            this.setData({
                initVal:value
            })
            return
        }, 
        jump(e) {
            let num = e.currentTarget.dataset.num;
            if (num == 4) {
                wx.navigateTo({
                    url: `/pages/micro_mall/employee_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${0}&type=${this.properties.commission ? 'staff_commission' : ''}`,
                })
            } else if (num != 3 && num != 0) {
                wx.navigateTo({
                  url: `/pages/micro_mall/employee_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${0}&dateType=${num}&type=${this.properties.commission ? 'commission' : ''}`,
                })
            } else if (num == 0) {
                wx.navigateTo({
                  url: `/pages/micro_mall/employee_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${0}&type=${this.properties.commission ? 'commission' : ''}`,
                })
            } else if (this.properties.can_cashout){
                wx.navigateTo({
                    url: '/pages/micro_mall/employee_center/distribution_brokerage/brokerage_content/brokerage_content',
                })
            }
        },
    }
}))
 