
const maskStyles = {
    enterTo: "opacity: 1; transition: opacity 300ms ease-in-out;",
    leaveTo: "opacity: 0; transition: opacity 300ms ease-in-out;",
    duration: 300
};
Component({
    externalClasses: ["ext-class"],
    properties: {
        touchCancel: Boolean,
        mask: Boolean,
        maskBg: String
    },
    data: {
        showed: false,
        maskStyle: maskStyles.leaveTo
    },
    lifetimes: {
        created() {
            this.showed = false;
        }
    },
    methods: {
        init({ onAttached, onDetached, options }) {
            this.onAttached = onAttached;
            this.onDetached = onDetached;
            this.setOptions(options);
        },
        setOptions(options) {
            if (!options) return;
            const keys = ["touchCancel", "mask", "maskBg"];
            let data;
            keys.forEach(key => {
                if (!(key in options)) return;

                const val = options[key] || null;
                if (val === this.data[key]) return;

                data || (data = {});
                data[key] = val;
            });
            if (data)
                this.setData(data);
        },
        attachedWindow(anim = true) {
            if (this.showed) return;
            this.showed = true;
            if (anim) {
                let delay = 30;
                this.onAttached && this.onAttached(delay);
                this.setData({ showed: true, tempShowed: true });
                this.promiseDelay(delay).then(() => {
                    if (!this.showed) return;
                    this.setData({ maskStyle: maskStyles.enterTo });
                })
            } else {
                this.onAttached && this.onAttached(0);
                this.setData({ showed: true, tempShowed: true, maskStyle: maskStyles.enterTo });
            }
        },
        detachedWindow(anim = true) {
            if (!this.showed) return;
            this.showed = false;
            if (anim) {
                const delayMs = Math.max(maskStyles.duration || 0, (this.onDetached && this.onDetached()) || 0);
                this.setData({ maskStyle: maskStyles.leaveTo, tempShowed: false });
                this.promiseDelay(delayMs).then(() => {
                    if (this.showed) return;
                    this.setData({ showed: false });
                });
            } else {
                this.onDetached && this.onDetached();
                this.setData({ showed: false, tempShowed: false, maskStyle: maskStyles.leaveTo });
            }
        },
        onTouchMask() {
            this.detachedWindow();
        },
        noAction() { },


        //真机测试的setTimeout有时会延时1秒多，无法接受。用下面的方法用来代替setTimeout。借助wxs来触发。
        promiseDelay(delay, val) {
            return new Promise(rs => {
                const timer = this.wxsSetTimeout(() => {
                    this.wxsClearTimeout(timer);
                    rs(val);
                }, delay);
            })
        },
        wxsSetTimeout(cb, delay) {
            if (delay <= 0) {
                cb();
                return;
            }
            //原生和wxs都走，快的生效
            const wxsTimeoutCbs = (this.wxsTimeoutCbs || (this.wxsTimeoutCbs = {}));
            const id = setTimeout(() => this.wxsTimeout(id), delay);
            wxsTimeoutCbs[id] = cb;
            //wxs需要在web和jscore间通信，也有几十毫秒的延时。所以相应减20
            this.setData({ wxsTimeoutParam: { id, delay: Math.max(delay - 20, 0) } });
            return id;
        },
        wxsClearTimeout(id) {
            if (this.wxsTimeoutCbs && id in this.wxsTimeoutCbs) {
                clearTimeout(id);//清除原生Timeout
                delete this.wxsTimeoutCbs[id];//清除wxdTimeout
            }
        },
        wxsTimeout(id) {
            if (this.wxsTimeoutCbs && id in this.wxsTimeoutCbs) {
                this.wxsTimeoutCbs[id]();
                clearTimeout(id);//清除原生Timeout
                delete this.wxsTimeoutCbs[id];//清除wxdTimeout
            }
        }
    }
});