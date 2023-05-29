const app = getApp();
Component(app.BTAB({
    properties: {
        dataDetail:{
            type:Object,
            value:{}
        },
        commission:{
            type:Boolean,
            value:false
        },
    },
    data: {

    },
    ready(){
        let staff_unpay = this.data.brand_info.icon_url + "micro_mall/staff/staff_unpay.png";
        let staff_frozen = this.data.brand_info.icon_url + "micro_mall/staff/staff_frozen.png";
        let staff_suc = this.data.brand_info.icon_url + "micro_mall/staff/staff_suc.png";
        let staff_return = this.data.brand_info.icon_url + "micro_mall/staff/staff_return.png";
        let staff_right = this.data.brand_info.icon_url + "micro_mall/staff/staff_right.png";
        this.setData({
            staff_unpay: staff_unpay,
            staff_frozen: staff_frozen,
            staff_suc: staff_suc,
            staff_return: staff_return,
            staff_right: staff_right,
        })
     },
    methods: {
        jump(e) {
            let currentIndex = e.currentTarget.dataset.num;
            wx.navigateTo({
              url: `/pages/micro_mall/employee_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${currentIndex}&type=${this.properties.commission ? 'commission' : ''}`,
            })
        }
    }
}))