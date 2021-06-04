export default Behavior({
    properties: {
        show: {
            type: Boolean,
            value: false,
            observer: function(val) {
                val ? this.show() : this.dismiss();
            }
        },
        touchCancel: {
            type: Boolean,
            value: true,
            observer: function(val) {
                this.setTouchCancel(val);
            }
        },
        justHidden: {
            type: Boolean,
            value: false,
            observer: function(val) {
                this.setJustHidden(val);
            }
        },
        mask: {
            type: [Boolean],
            value: true,
            observer: function(val) {
                this.setMask(val);
            }
        },
        maskBg: {
            type: [String],
            observer: function(val) {
                this.setMaskBg(val);
            }
        }
    },
    ready() {
        this.getWindow(w =>
            w.setHandler(() => this.onAttached && this.onAttached(), () => this.onDetached && this.onDetached())
        );
    },
    methods: {
        getWindow(f) {
            if (!this.w) {
                this.w = this.selectComponent(".window");
            }
            if (this.w) {
                return f(this.w);
            }
        },
        setOnDetachedHandler(handler) {
            this.getWindow(w => w.setOnDetachedHandler(handler));
            return this;
        },
        setMask(enable) {
            this.getWindow(w => w.setMask(enable));
            return this;
        },
        setMaskBg(bg) {
            this.getWindow(w => w.setMaskBg(bg));
            return this;
        },
        setTouchCancel(enable) {
            this.getWindow(w => {
                w.setTouchCancel(enable);
            });
            return this;
        },
        setJustHidden(enable) {
            this.getWindow(w => w.setJustHidden(enable));
            return this;
        },
        setMaskBgHidden(enable){
            this.getWindow(w => w.setMaskBgHidden(enable));
            return this;
        },
        show() {
            return this.getWindow(w => w.attachedToWindow()) || Promise.reject();
        },
        dismiss() {
            return this.getWindow(w => w.detachedFromWindow()) || Promise.reject();
        },
        isShowed() {
            return this.getWindow(w => w.isShowed());
        },
        lockPageScroll() {
            return this.getWindow(w => w._lockPageScroll())
        },
        unLockPageScroll() {
            return this.getWindow(w => w._unLockPageScroll())
        },
        _noFn() {}
    }
});