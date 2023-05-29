
export default {
    /*loading 框 */
      showLoading(obj, delay = 300) {
        if (!this.isShowLoaded) {
          this.clearLoadingHideLock();
          this.LoadingShowLock = setTimeout(() => {
            this.clearLoadingShowLock();
            uni.showLoading(obj);
          }, delay);
          this.isShowLoaded = true;
        }
      },
      hideLoading(delay= 500) {
        if (this.isShowLoaded) {
          this.clearLoadingShowLock();
          this.clearLoadingHideLock();
          this.LoadingHideLock = setTimeout(() => {
            this.clearLoadingHideLock();
            uni.hideLoading();
          }, delay);
        }
      },


    //辅助
    clearLoadingShowLock() {
        this.LoadingShowLock && clearTimeout(this.LoadingShowLock);
        delete this.LoadingShowLock;
    },
    clearLoadingHideLock() {
        this.LoadingHideLock && clearTimeout(this.LoadingHideLock);
        delete this.LoadingHideLock;
        this.isShowLoaded = false;
    },


    /*土司 */
    showToast(obj) {
        this.clearLoadingShowLock();
        this.clearLoadingHideLock();
        let time = 0;
        if(this.isShowLoaded){
          time = 500;
        }
        setTimeout(()=>{
          if (obj) {
            if (!obj.image && !obj.icon) {
              obj.icon = "none";
            }
            if (!obj.image && obj.icon === "none" && !this.isCanUseNoneIcon) {
              obj.image = "/images/common/err-tip-icon.png";
            }
            obj.duration || (obj.duration = 2000);
            //数据为空
            if(obj.isNoData && !obj.title){
              obj.title = "已经到底啦！"
            }
          }
          uni.showToast(obj);
        },time)
        
    },
    hideToast() {
        uni.hideToast();
    },

    get isCanUseNoneIcon() {
        if (typeof this.cuSOIN === "undefined") {
            this.cuSOIN = true; // SIH.compareVersion("1.9.0") >= 0;
        }
        return this.cuSOIN;
    }
};
