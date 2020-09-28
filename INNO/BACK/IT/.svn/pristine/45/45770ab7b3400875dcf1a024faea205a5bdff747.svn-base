import Vue from "vue";
const PreviewImgManager = new Vue({
    data() {
        return {
            isShow: false,
            imgList: null,
            index: 0
        };
    },
    methods: {
        showPre() {
            this.isShow = true;
            return this;
        },
        setImgList(imgList, index) {
            if (Object.prototype.toString.call(imgList) === "[object Array]") {
                this.imgList = [...imgList];
                index || (index = 0);
                this.index = index < 0 || index >= imgList.length ? 0 : index;
            } else {
                this.imgList = [imgList];
                this.index = 0;
            }
            return this;
        },
        closedPre() {
            this.imgList = null;
            this.index = 0;
            this.isShow = false;
        }
    }
});

export default PreviewImgManager;
