<template>
    <div ref="easyImage" :class="{'easy-image':true,'width':boxStyle.width,'height':boxStyle.height,'change-mode':isChangeMode}" :style="boxStyle.style">
        <img ref="easyImageCev1" :src="data1.src" @load="loadImgComplete" :style="{width:img1Width,height:img1Height,opacity:img1Opacity,left:left,top:top}">
        <img ref="easyImageCev2" :src="data2.src" @load="loadImgComplete" :style="{width:img2Width,height:img2Height,opacity:img2Opacity,left:left,top:top}">
    </div>
</template>
<script>
import $ from "jquery";
import "jquery.actual";

export default {
    name: "EasyImage",
    props: ["src", "mode"],
    data() {
        return {
            isChangeMode: false,
            interSrc: "",
            interMode: "",
            showIndex: 0,
            leftValue: 0,
            topValue: 0,
            interWidth: -1,
            interHeight: -1,
            data1: { src: "", width: -1, height: -1 },
            data2: { src: "", width: -1, height: -1 }
        };
    },
    computed: {
        boxStyle() {
            let style = "";
            let width = false;
            let height = false;
            if (this.interWidth >= 0) {
                style += `--width:${this.interWidth}px;`;
                width = true;
            }
            if (this.interHeight >= 0) {
                style += `--height:${this.interHeight}px;`;
                height = true;
            }
            return { style, width, height };
        },
        img1Width() {
            return this.data1.width >= 0 ? `${this.data1.width}px` : "";
        },
        img1Height() {
            return this.data1.height >= 0 ? `${this.data1.height}px` : "";
        },
        img2Width() {
            return this.data2.width >= 0 ? `${this.data2.width}px` : "";
        },
        img2Height() {
            return this.data2.height >= 0 ? `${this.data2.height}px` : "";
        },
        img1Opacity() {
            return this.showIndex === 0 ? 1 : 0;
        },
        img2Opacity() {
            return this.showIndex === 0 ? 0 : 1;
        },
        left() {
            return `${this.leftValue}px`;
        },
        top() {
            return `${this.topValue}px`;
        }
    },
    watch: {
        src(newVal) {
            this.changeSrcOrMode(newVal, this.mode);
        },
        mode(newVal) {
            this.changeSrcOrMode(this.src, newVal);
        }
    },
    mounted() {
        this.changeSrcOrMode(this.src, this.mode);
    },
    methods: {
        getShowView() {
            if (this.showIndex === 0) {
                return this.$refs.easyImageCev1;
            } else {
                return this.$refs.easyImageCev2;
            }
        },
        getPreLoadView() {
            if (this.showIndex === 0) {
                return this.$refs.easyImageCev2;
            } else {
                return this.$refs.easyImageCev1;
            }
        },
        getShowData() {
            if (this.showIndex === 0) {
                return this.data1;
            } else {
                return this.data2;
            }
        },
        getPreLoadData() {
            if (this.showIndex === 0) {
                return this.data2;
            } else {
                return this.data1;
            }
        },
        changeSrcOrMode(src, mode) {
            if (src !== this.interSrc) {
                this.interSrc = src;
                this.interMode = mode;
                let preLoadData = this.getPreLoadData();
                this.resetImg(preLoadData);
                this.$nextTick(() => {
                    this.setImgSrc(preLoadData, src);
                });
            } else if (mode !== this.interMode) {
                this.interMode = mode;
                this._refresh();
            }
        },
        loadImgComplete(e) {
            let view = $(this.getPreLoadView());
            this.srcW = view.actual("width") || 0;
            this.srcH = view.actual("height") || 0;
            this.resetClipSize(); // 恢复
            this.$nextTick(() => {
                this.changeView();
                this.isChangeMode = false;
                this.change(this.srcW || 0, this.srcH || 0);
            });
        },
        change(srcW, srcH) {
            let mode = this.interMode;
            let easyImage = $(this.$refs.easyImage);
            let pW = easyImage.actual("width") || 0;
            let pH = easyImage.actual("height") || 0;
            let interW = -1;
            let interH = -1;
            let imgW = 0;
            let imgH = 0;
            let left = 0;
            let top = 0;
            if (srcW === 0 || srcH === 0) {
                let showdata = this.getShowData();
                this.resetImg(showdata);
                this.resetClipSize();
                return;
            }
            if (pW === 0 && pH === 0) {
                mode = "";
            } else if (pW === 0) {
                mode = "heightFix";
            } else if (pH === 0) {
                mode = "widthFix";
            }
            switch (mode) {
                case "aspectFit":
                    if (srcW / pW > srcH / pH) {
                        imgW = pW;
                        imgH = (srcH / srcW) * pW;
                    } else {
                        imgW = (srcW / srcH) * pH;
                        imgH = pH;
                    }
                    break;
                case "aspectFill":
                    if (srcW / pW > srcH / pH) {
                        imgW = (srcW / srcH) * pH;
                        imgH = pH;
                    } else {
                        imgW = pW;
                        imgH = (srcH / srcW) * pW;
                    }
                    break;
                case "widthFix":
                    imgW = pW;
                    imgH = (srcH / srcW) * pW;
                    pH = interH = imgH;
                    break;
                case "heightFix":
                    imgW = (srcW / srcH) * pH;
                    imgH = pH;
                    pW = interW = imgW;
                    break;
                case "scaleToFill":
                    imgW = pW;
                    imgH = pH;
                    break;
                default:
                    imgW = srcW;
                    imgH = srcH;
                    pW = interW = imgW;
                    pH = interH = imgH;
                    break;
            }
            if (pW > 0) {
                left = (pW - imgW) / 2;
            }
            if (pH > 0) {
                top = (pH - imgH) / 2;
            }
            let showdata = this.getShowData();
            this.setImgSize(showdata, imgW, imgH);
            this.setClipSize(interW, interH);
            this.setPosition(left, top);
        },
        changeView() {
            this.showIndex = this.showIndex === 0 ? 1 : 0;
        },
        setClipSize(w, h) {
            this.interWidth = w;
            this.interHeight = h;
        },
        resetClipSize() {
            this.interWidth = -1;
            this.interHeight = -1;
        },
        setImgSize(data, w, h) {
            this.$set(data, "width", w);
            this.$set(data, "height", h);
        },
        setImgSrc(data, src) {
            this.$set(data, "src", src);
        },
        resetImg(data) {
            this.$set(data, "width", -1);
            this.$set(data, "height", -1);
            this.$set(data, "src", "");
        },
        setPosition(l, t) {
            this.leftValue = l;
            this.topValue = t;
        },
        _refresh() {
            this.resetClipSize(); // 恢复
            this.$nextTick(() => {
                this.isChangeMode = true;
                this.change(this.srcW || 0, this.srcH || 0);
            });
        },
        refresh(dl = 0) {
            if (this.tId) {
                clearTimeout(this.tId);
                delete this.tId;
            }
            dl
                ? (this.tId = setTimeout(() => {
                      delete this.tId;
                      this._refresh();
                  }, dl))
                : this._refresh();
        }
    }
};
</script>
<style scoped lang="less">
    .easy-image {
        padding: 0 !important;
        display: inline-block;
        position: relative;
        overflow: hidden;
        > img {
            z-index: 0;
            position: absolute;
            transition: opacity 0.3s ease-in;
        }
    }
    .easy-image.change-mode > img {
        transition: all 0.3s ease-in;
    }
    .easy-image.width {
        width: var(--width) !important;
    }
    .easy-image.height {
        height: var(--height) !important;
    }
</style>
