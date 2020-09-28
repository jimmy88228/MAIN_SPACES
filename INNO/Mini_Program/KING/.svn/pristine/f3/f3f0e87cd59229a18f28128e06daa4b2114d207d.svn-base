const app = getApp();
Component(app.BTAB({
    properties: {
        tabs:{
            type: Array
        },
        currentIndex: {
            type: Number,
            value: 0,
            observer: function(val) {
                // console.log('new:', val);
                loadData.call(this)
            }
        }, 
    },
    data: {
        cashRecord: [],
    },
    ready() {
        this.setData({
            left: this.data.currentIndex * 20 + '%'
        });
        if (this.data.currentIndex == 0) {
            loadData.call(this)
        }
    },
    methods: {
        handleTab: function(e) {
            let currentIndex = e.currentTarget.dataset.num;
            let leftTemp = currentIndex * 20;
            this.setData({
                currentIndex: currentIndex,
                left: leftTemp + '%;'
            })
            this.triggerEvent('switch', currentIndex)
        },
    }
}))

function loadData() {
    this.setData({
        left: this.data.currentIndex * 20 + '%'
    });
}