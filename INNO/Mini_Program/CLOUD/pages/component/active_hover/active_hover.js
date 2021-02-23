const app = getApp();

Component({

    properties: {
        miniCodeImgUrl: {
            type: String,
            value: ''
        },
        showActiveHover: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                this.setData({
                    show: newVal
                })
            }
        }
    },

    data: {
        show: false
    },

    methods: {
        closedHover() {
            this.setData({
                show: false
            })
        }
    }

})