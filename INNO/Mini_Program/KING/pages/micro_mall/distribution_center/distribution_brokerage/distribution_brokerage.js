const app = getApp();
const interval = 40;
const times = 30;
import {
    AddSum
} from "../help/addSum.js";

Component(app.BTAB({

    /**
     * 组件的属性列表
     */
    properties: {
        dataDetail: {
            type: Array,
            value: [0.00, 0.00, 0.00, 0.00]
        },
        _value: {
            type: Array,
            value: [0.00, 0.00, 0.00, 0.00]
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
    ready() {
        reset.call(this);
    },
    methods: {
        init(value, intervalTemp = interval, timesTemp = times) {
            reset.call(this);
            this.addId = {};
            for (let i = 0, len = 4; i < len; i++) {
                // if (value[i] > 0) {
                //     let id = 'id' + i;
                //     this.addSum(value[i], i, id, intervalTemp, timesTemp);
                // }
                let id = 'id' + i;
                this.addSum(value[i], i, id, intervalTemp, timesTemp);
            }
        },
        addSum(value, num, id, intervalTemp, timesTemp) {
            if (!this.addId[id]) {
                this.addId[id] = new AddSum(value, num, intervalTemp, timesTemp);
                this.addId[id].init("#brokerage");
            }
        },
        end() {
            for (let item in this.addId) {
                if (this.addId[item]) {
                    this.addId[item].end();
                    delete this.addId[item]
                }
            }
        },
        jump(e) {
            let num = e.currentTarget.dataset.num;
            if (num != 3 && num != 0) {
                wx.navigateTo({
                  url: `/pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${0}&dateType=${num}&type=${this.properties.commission ? 'commission' : ''}`,
                })
            } else if (num == 0) {
                wx.navigateTo({
                  url: `/pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${0}&type=${this.properties.commission ? 'commission' : ''}`,
                })
            } else {
                wx.navigateTo({
                    url: '/pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/brokerage_content',
                })
            }
        },


        // sumFn(label) {
        //     // console.log('Init:', label, ':', this.valueTemp[label]) 
        //     this.middle[label] = parseFloat((this.value[label] / times).toFixed(2));
        //     currentTimes[label] += 1;
        //     // if (!this.timeLabel[label]) {
        //     //     this.middle[label] = parseFloat((this.value[label] / times).toFixed(2));
        //     // }
        //     this.timeLabel[label] = setTimeout(() => {
        //         this.valueTemp[label] += this.middle[label];
        //         // console.log('value:', parseFloat(this.valueTemp[label].toFixed(2)))
        //         this.setData({
        //             [`value[${label}]`]: this.valueTemp[label].toFixed(2) 
        //         })

        //         if (this.valueTemp[label] >= this.value[label] || currentTimes[label] == times) {
        //             console.log('结束');
        //             this.setData({
        //                 [`value[${label}]`]: this.value[label].toFixed(2)
        //             })
        //             // sumReset.call(this, this.value,label);
        //             clearTimeout(this.timeLabel[label])
        //         } else {
        //             // console.log(currentTimes[0])
        //             if(currentTimes[label]>(times-3)){
        //                 slow = 200
        //             }
        //             this.sumFn(label);
        //         }
        //     }, interval + (slow))
        // },

    }
}))

function reset(value) {
    this.setData({
        _value: ['0.00', '0.00', '0.00', '0.00']
    })

}