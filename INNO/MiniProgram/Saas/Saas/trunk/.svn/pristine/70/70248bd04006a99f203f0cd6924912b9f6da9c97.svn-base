Component({
    properties: {},
    data: {
        showToast: false
    },
    methods: {
        showToastDiy(obj) {
            this.clearLoadingHideLock(); //若连续点击 -> clearTimeout
            showToastDiyFn.call(this, obj)
        },
        clearLoadingHideLock() {
            this.LoadingHideLock && clearTimeout(this.LoadingHideLock);
            delete this.LoadingHideLock;
        },
    }
})

function showToastDiyFn(obj) {
    if (obj) {
        if (!obj.image && !obj.icon) {
            obj.icon = "none";
        }
        if (!obj.image && obj.icon === "none") {
            obj.image = "/images/micro_mall/cn/err_tip_icon.png";
        }
        obj.duration || (obj.duration = 2000);
        obj.title || (obj.title = '');
        if (obj.title && obj.title.length > 8) {
            obj.longText = true;
        } else if (obj.title && obj.title.length <= 4) {
            obj.shortText = true
        }
        this.setData({
            showToast: true,
            obj: obj,
            showImage: obj.image ? true : false
        })
        hideLoadingFn.call(this, obj);
    }
}

function hideLoadingFn(obj = {}) {
    let that = this;
    this.LoadingHideLock = setTimeout(() => {
        that.setData({
            showToast: false,
        })
    }, obj.duration)
}