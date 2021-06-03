const InitOptions = {
    touchCancel: true,
    mask: true,
    maskBg: null
}

export default Behavior({
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        touchCancel: {
            type: Boolean,
            value: InitOptions.touchCancel
        },
        mask: {
            type: Boolean,
            value: InitOptions.mask
        },
        maskBg: {
            type: String,
            value: InitOptions.maskBg
        },
    },
    lifetimes: {
        created() {
            this._wdOptions = { ...InitOptions };
            this._wdConfigs = { key: ".window" };
            Object.defineProperties(this, {
                showed: { get: () => this._wd.showed }
            })
        },
        attached() {
            let wd = this._wd;
            if (wd) return;
            const cfs = this._wdConfigs
            wd = this.selectComponent(cfs.key);
            if (!wd) return;
            this._wd = wd;
            initWindow(this, wd);
        },
    },
    observers: {
        "show": function (show) {
            console.log('进来 show',show)
            changeShow(this, show, true);
        },
        "touchCancel, mask, maskBg": function (touchCancel, mask, maskBg) {
            this.setOptions({ touchCancel, mask, maskBg })
        }
    },
    methods: {
        windowConfig(obj) {
            this._wdConfigs = { ...this._wdConfigs, ...obj }
        },
        setOptions(options) {
            if (this._wd)
                this._wd.setOptions(options)
            else {
                this._wdOptions = { ...this._wdOptions, ...options }
            }
        },
        attachedView() {
            this.onAttached && this.onAttached();
        },
        detachedView() {
            this.onDetached && this.onDetached();
            return 0;
        },
        listenShowState(handler) {
            this._listenShowState = handler;
            return this;
        },
        show() {
            this.setData({ show: true });
            return this;
        },
        hide() {
            this.setData({ show: false });
            return this;
        },
        dismiss() {
            return this.hide();
        },
        wait(cb) {
            this._waitT && delete this._waitT;
            if (cb) {
                this._waitT = cb;
                return this;
            }
            else
                return new Promise(rs => this._waitT = rs);
        },
        promiseDelay(delay, val) {
            return this._wd.promiseDelay(delay, val);
        },
        noAction() { },
    }
});

function initWindow(target, wd) {
    wd.init({
        options: target._wdOptions,
        onAttached: delay => {
            target.attachedView(delay);
            target.triggerEvent("attached");
            const lss = target._listenShowState;
            try {
                lss && lss(true);
            } catch (e) { }
        },
        onDetached: () => {
            target._waitT && target._waitT() && delete target._waitT;
            const delay = target.detachedView();
            target.triggerEvent("detached");
            const lss = target._listenShowState;
            try {
                lss && lss(false);
            } catch (e) { }
            return delay;
        }
    });
    changeShow(target, target.data.show, false);
}

function changeShow(target, show, anim) {
    const wd = target._wd;
    console.log('进来',wd,target.showed , show)
    if (!wd || target.showed == show) return;
    show ? wd.attachedWindow(anim) : wd.detachedWindow(anim);
}