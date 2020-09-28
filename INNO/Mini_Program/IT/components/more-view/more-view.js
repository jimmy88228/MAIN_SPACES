Component({
    properties: {
        data: {
            type: Object,
            observer() {
                if (!this.isAttached) return;
                this.change();
            }
        }
    },
    attached() {
        this.isAttached = true;
        this.change();
    },
    methods: {
        change() {
            let data = this.properties.data;
            let loading = data.loading;
            let end = data.end;
            let mode = end ? "end" : (loading ? "loading" : undefined);
            if (mode) {
                this.setData({ [mode]: true });
                wx.nextTick(() => {
                    this.mode = mode;
                    this.setData({ mMode: mode });
                });
            } else {
                this.mode = null;
                this.setData({ mMode: null });
            }
        },
        transitionend(e) {
            let mode = e.currentTarget.dataset.mode;
            if (!mode) {
                this.setData({ [mode]: mode == this.mode });
            }
        }
    }
});
