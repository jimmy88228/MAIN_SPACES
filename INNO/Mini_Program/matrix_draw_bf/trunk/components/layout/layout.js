const app = getApp()
Component({
    properties: {
        data: {
            type: Array,
            value: [],
            observer(val) {
                this.setAdData(val);
            }
        },
    },

    data: {
        dataArray: []
    },

    methods: {
        setAdData(data) {
            this.setData({
                dataArray: this.initData(data)
            });
        },

        initData(arr) {
            return arr ? arr.map(res => {
                try {
                    res.layoutData = JSON.parse(res.modelJson);
                } catch (e) {
                    res.layoutData = [];
                }
                return res;
            }) : [];
        }
    }
})
