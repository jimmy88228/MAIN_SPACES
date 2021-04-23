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
        let tabs = this.data.tabs||[];
        this.tabLenPc = parseInt(100/tabs.length);
        this.setData({
            left: this.data.currentIndex * this.tabLenPc + '%',
            width:this.tabLenPc + '%',
            showTab:true
        });
        if (this.data.currentIndex == 0) {
            loadData.call(this)
        }
    },
    methods: {
        handleTab: function(e) {
            let currentIndex = e.currentTarget.dataset.num;
            this.setData({
                currentIndex: currentIndex,
                left: currentIndex * this.tabLenPc + '%;'
            }) 
            this.triggerEvent('switch', currentIndex)
        },
    }
}))

function loadData() {
    this.setData({
        left: this.data.currentIndex * this.tabLenPc + '%'
    });
}