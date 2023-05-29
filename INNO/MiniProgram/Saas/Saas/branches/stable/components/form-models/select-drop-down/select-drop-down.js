// components/form-models/select-drop-down/select-drop-down.js
const app = getApp();
Component(app.BTAB({
    options:{
        styleIsolation:'apply-shared'
    },
    properties: {
        options: {
            type: Array,
            value: []
        }
    },
    data: {
        isShow: false,
        current: {}
    },
    // 组件声明周期
    lifetimes: {
        attached() {
            this.setData({
                current: this.properties.options[0]
            })
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        optionTap(e) {
            let {
                dataset
            } = e.target
            this.setData({
                current: dataset.name,
                isShow: false
            });
            // 调用父组件方法，并传参
            this.triggerEvent("tabsChange", {
                dataset
            })
        },
        openClose() {
            this.setData({
                isShow: !this.data.isShow
            })
        },

        // 此方法供父组件调用
        close() {
            this.setData({
                isShow: false
            })
        }
    }
}))