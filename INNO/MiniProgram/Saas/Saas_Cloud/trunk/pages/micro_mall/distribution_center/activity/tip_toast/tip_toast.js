// pages/micro_mall/distribution_center/activity/tip_toast/tip_toast.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        progressData: {
            type: Object,
            observer:function(newVal){
                // console.log('newVal', newVal)
                let percent = ((newVal.current / newVal.total) * 100).toFixed(0) + "%"
                // if (percent=='100%'){
                //    setTimeout(()=>{
                //        this.setData({
                //            showed: false
                //        })
                //    },800)
                // }
                this.setData({
                    showData: {
                        ...newVal,
                        percent: percent
                    }
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        showed: false,
        showData: {
            current: 0,
            total: 0,
            percent: 0
        }
    },
    // observers: {
    //     'progressData': function(newVal, oldVal) {
    //         let percent = ((newVal.current / newVal.total) * 100).toFixed(0) + "%"
    //         this.setData({
    //             showData: {
    //                 ...newVal,
    //                 percent: percent
    //             }
    //         })
    //     }
    // }, 
    methods: {
        displayHandle(show) {
            this.setData({
                showed: show || false
            })
        }
    }
})