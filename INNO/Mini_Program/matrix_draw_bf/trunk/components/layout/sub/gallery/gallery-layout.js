import LayoutBehaviors from "../layout-behaviors";
Component({
    behaviors: [LayoutBehaviors],
    properties: {
        layoutData: {
            type: Object,
            value: {},
            observer: function(value) {
                this.setData({
                    style: this.initStyle(value.style),
                    params: this.initParams(value.parameters),
                    childs: value.child || [],
                    indicatorDots: !!value.child && value.child.length > 0
                });
            }
        }
    },
    methods: {
        initParams(params) {
            return {
                interval: params["interval"] || 5000,
                duration: params["duration"] || 1000,
                autoplay: params["autoplay"] ? true : false
            };
        }
    }
});
