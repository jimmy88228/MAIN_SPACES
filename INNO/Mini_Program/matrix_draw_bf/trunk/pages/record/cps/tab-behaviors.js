export default Behavior({
    properties: {
        show: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        created() {
            this._show = false;
        },
        attached() {
            this.init = true;
            changeShow.call(this, this.properties.show);
        }
    },
    observers: {
        show(show) {
            changeShow.call(this, show);
        }
    },
    methods: {
        onTabShow() { },
        onTabHide() { }
    }
});
function changeShow(show) {
    if (!this.init || this._show == show) return;
    this._show = show;
    if (show) {
        this.onTabShow();
    } else {
        this.onTabHide();
    }
}