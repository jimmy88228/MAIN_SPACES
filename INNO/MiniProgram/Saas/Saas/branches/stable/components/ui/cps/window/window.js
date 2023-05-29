// import Promise from "../../../libs/promise/promise.js";
Component({
    externalClasses: ["ext-class"],
    data: {
        showed: false,
        touchCancel: true,
        mask: true,
        maskBg: "",
        justHidden: false,
        maskStyle: "opacity: 0;"
    },
    methods: {
        setHandler(onAttached, onDetached) {
            this.onAttached = onAttached;
            this.onDetached = onDetached;
        },
        setOnDetachedHandler(handler) {
            this.onDetachedHandler = handler;
            return this;
        },
        setMask(enable) {
            this.setData({
                mask: enable
            });
            return this;
        },
        setMaskBg(bg) {
            this.setData({
                maskBg: bg
            });
            return this;
        },
        setMaskTapHandler(handler){
            this.maskTap = handler;
            return this;
          },
        setTouchCancel(enable) {
            this.setData({
                touchCancel: enable
            });
            return this;
        },
        setJustHidden(enable) {
            this.setData({
                justHidden: enable
            });
        },
        setMaskBgHidden(enable){
            if(enable){
                Promise.delay(this._hideBgAnim() || 0).then(()=>{
                    this.setData({
                        justMaskBgHidden: true
                    });
                })
            }else{
                this.setData({
                    justMaskBgHidden: false
                });
                this._showBgAnim();
            }
        },
        attachedToWindow() {
            if (!this.showed) {
                this.showed = true;
                this._clearP();
                this._lockPageScroll();
                this.setData({
                    showed: true
                });
                this.showP = Promise.delay(300).then(() => {
                    this._showBgAnim();
                    this.onAttached && this.onAttached();

                });
                return this.showP;
            } else {
                return Promise.resolve();
            }
        },
        detachedFromWindow() {
            if (this.showed) {
                this.showed = false;
                this._clearP();
                this._unLockPageScroll();
                this.onDetachedHandler && this.onDetachedHandler();
                this.remove = Promise.delay(Math.max(this._hideBgAnim() || 0, (this.onDetached && this.onDetached()) || 0) + 10).then(() => {
                    this.setData({
                        showed: false
                    });
                })
                return this.remove;
            } else {
                return Promise.resolve();
            }
        },
        _lockPageScroll() {
          let page = getCurrentPages().pop();
          page.setData({
            noScroll: true
          });
        },
        _unLockPageScroll() {
          let page = getCurrentPages().pop();
          page.setData({
            noScroll: false
          });
        },
        isShowed() {
            return this.showed;
        },
        _clearP() {
            if (this.showP) {
                //待重写，暂时注释
                // if (this.showP.isPending()) {
                //     this.showP.cancel();
                // }
                this.showP = null;
            }
            if (this.remove) {
                //待重写，暂时注释
                // if (this.remove.isPending()) {
                //     this.remove.cancel();
                // }
                this.remove = null;
            }
        },
        _showBgAnim() {
            this.setData({
                maskStyle: "opacity:1; transition: opacity 200ms ease-in-out;"
            });
        },
        _hideBgAnim() {
            this.setData({
                maskStyle: "opacity:0; transition: opacity 200ms ease-in-out 100ms;"
            });
            return 300;
        },
        _maskTap(){
            if (this && typeof this.maskTap === "function") this.maskTap()
            this.detachedFromWindow()
        },
        
        _noFn() { }
    }
});