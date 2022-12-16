<template>
    <div class="upload-img-box">
        <template v-if="single">
            <div v-if="imgLength>0" class="upload-img-item">
                <EasyImage class="upload-img-item-cav" :src="mImgs" mode="aspectFit"/>
                <button class="upload-img-btn1" @click="show()">预览</button>
                <Upload class="upload-img-btn2" :show-upload-list="false" :before-upload="handleBeforeUpload" action="/">编辑</Upload>
                <button class="upload-img-btn3" @click="del">删除</button>
            </div>
        </template>
        <span ref="uploadImgAnim" v-else class="upload-img-grid">
            <template v-for="(url,index) in mImgs">
                <div :key="url" class="upload-img-item" v-if="index<imgCount">
                    <EasyImage class="upload-img-item-cav" :src="url" mode="aspectFit"/>
                    <button class="upload-img-btn1" @click="show(index)">预览</button>
                    <Upload class="upload-img-btn2" @click="edit(index)" :show-upload-list="false" :before-upload="e=>handleBeforeUpload(e,index)" action="/">编辑</Upload>
                    <button class="upload-img-btn3" @click="del(index)">删除</button>
                </div>
            </template>
        </span>
        <Upload
            v-if="imgLength<imgCount"
            ref="upload"
            class="upload-img-btn"
            type="drag"
            :show-upload-list="false"
            :before-upload="handleBeforeUpload"
            action="/"
            :multiple="imgCount>1"
        >
            <div class="upload-img-btn-cev">
                <Icon type="ios-cloud-upload" size="36" style="color: #3399ff"></Icon>
                <p>点击或拖拽到此</p>
            </div>
        </Upload>
    </div>
</template>

<script>
import EasyImage from "@/support/components/easy-image";
import Sortable from "sortablejs";
import StringUtil from "@/helper/utils/string-util";
import { MainApi } from "@/helper/manager/http-manager";
export const TYPES = {
    UTILS: "UTILS",
    COMMODITY: "COMMODITY",
    CUSTOM_LAYOUT: "CUSTOM_LAYOUT",
    SHARE: "SHARE"
};
export default {
    name: "UploadImgGroup",
    components: { EasyImage },
    props: {
        count: {
            type: Number,
            default: 9
        },
        single: Boolean,
        type: {
            type: String,
            default: TYPES.UTILS
        },
        imgs: [Array, String],
        maxSize: Number,
        imgChange: Object
    },
    mounted() {
        this.setData(this.imgs);
        if (this.$refs.uploadImgAnim) {
            Sortable.create(this.$refs.uploadImgAnim, {
                // forceFallback: true,
                animation: 200,
                onEnd: e => {
                    this.move(e.newIndex, e.oldIndex);
                }
            });
        }
    },
    watch: {
        imgs(val) {
            this.setData(val);
        }
    },
    data() {
        return { mImgs: null };
    },
    computed: {
        imgCount() {
            return this.single ? 1 : this.count;
        },
        imgLength() {
            return this.single
                ? this.mImgs
                    ? 1
                    : 0
                : (this.mImgs && this.mImgs.length) || 0;
        }
    },
    methods: {
        setData(data) {
            this.mImgs = data;
        },
        onChange(nIndex = "", oIndex = "", type) {
            this.$emit("update:imgChange", {nIndex, oIndex, type});
            this.$emit("update:imgs", this.mImgs);
        },
        move(newIndex, oldIndex) {
            let item = this.mImgs[oldIndex];
            this.mImgs.splice(oldIndex, 1);
            this.mImgs.splice(newIndex, 0, item);
            this.onChange(newIndex, oldIndex);
        },
        del(index) {
            if (this.single) {
                this.mImgs = null;
            } else {
                this.mImgs.splice(index, 1);
            }
            this.onChange(index, "", "del");
        },
        show(index) {
            this.PreviewImgManager.setImgList(this.imgs, index).showPre();
        },
        push(img, index) {
            if (this.single) {
                this.mImgs = img;
            } else {
                this.mImgs || (this.mImgs = []);
                if (index === undefined) {
                    this.mImgs.push(img);
                } else {
                    this.mImgs.splice(index, 1, img);
                }
            }
            this.onChange(index, "", "edit");
        },
        handleBeforeUpload(file, index) {
            if (this.maxSize > 0 && this.maxSize < file.size / 1024) {
                this.$Message.error(`图片大小超过了${this.maxSize}KB的限制`);
            }
            let param = new FormData();
            param.append("file", file, file.name);
            MainApi.uploadImage({
                params: {
                    type: this.type
                },
                data: param
            })
                .then(res => {
                    if (res.code === "1") {
                        let pa = res.data[0];
                        if (pa.code === "1") {
                            this.push(pa.data, index);
                        } else {
                            return Promise.reject(pa.msg);
                        }
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringUtil.trim(msg)) {
                        this.$Message.error(msg || "上传失败");
                    }
                });
            return false;
        }
    }
};
</script>

<style lang="less" scoped>
    @import "~@/assets/css/variables.less";
    .upload-img-box {
        user-select: none;
    }
    .upload-img-item,
    .upload-img-btn {
        display: inline-block;
        border: 1px dashed;
        border-color: #ddd;
        border-radius: 4px;
        overflow: hidden;
        height: 100px;
        width: 100px;
    }
    .upload-img-btn:hover {
        border-color: @primary-color;
    }
    .upload-img-btn-cev {
        height: 100px;
        width: 100px;
        font-size: 12px;
        display: inline-block;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .upload-img-grid {
        .upload-img-item {
            margin-right: 8px;
        }
    }
    .upload-img-item {
        background: #fff;
        position: relative;
        > .upload-img-item-cav {
            height: 100px;
            width: 100px;
        }
        > .upload-img-btn1,
        > .upload-img-btn2,
        > .upload-img-btn3 {
            cursor: pointer;
            position: absolute;
            background: rgba(0, 0, 0, 0.4);
            border: none;
            padding: 2px 5px;
            color: #ddd;
        }
        > .upload-img-btn1 {
            left: 0;
            top: 0;
            transform: translate(-100%, -100%);
        }
        > .upload-img-btn2 {
            right: 0;
            top: 0;
            transform: translate(100%, -100%);
        }
        > .upload-img-btn3 {
            left: 0;
            bottom: 0;
            transform: translate(-100%, 100%);
        }
    }
    .upload-img-item {
        > .upload-img-btn1,
        > .upload-img-btn2,
        > .upload-img-btn3 {
            transition: all 0.3s;
        }
    }
    .upload-img-item:hover {
        > .upload-img-btn1,
        > .upload-img-btn2,
        > .upload-img-btn3 {
            transform: translate(0, 0);
        }
    }
</style>
