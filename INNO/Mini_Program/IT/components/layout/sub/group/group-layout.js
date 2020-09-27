import LayoutBehaviors from "../layout-behaviors";
Component({
    behaviors: [LayoutBehaviors],
    properties: {
        layoutData: {
            type: Object,
            value: {},
            observer: function(value) {
                this.setData({
                    mainStyle: this.initStyle(value.style),
                    params: value.parameters || {},
                    childs: value.child || []
                });
            }
        }
    }
});
