<template>
    <div :style="display ? { 'display': display} : ''">
        <div class="image-box-area" :class="img ? 'has-img' : ''" :style="[{'width':imgWidth},{'paddingTop': imgHeight}, {'display': disabled && showImgView && multiple ? 'none' : display}]" >
            <div class="image-box" :style="boxStyle" @click="handleSelect" >
                <div class="images" v-viewer>
                    <img :src="img" class="img" v-show="img" />
                </div>
                <Icon type="md-add" class="add-icon" size="20" color="#178ED0" v-show="(!img ? true : false)"></Icon>
                <transition name="fade">
                    <div class="mask">
                        <Icon type="ios-eye-outline" size="24" color="#fff" @click.stop="viewInfo()" />
                        <template v-if="!isView">
                            <Icon type="ios-create-outline" size="24" color="#fff" @click.stop="handleSelect" alt="编辑图片" />
                            <Icon type="ios-trash-outline" size="24" color="#fff" @click.stop="handleDel()" alt="清空图片" />
                        </template>
                    </div>
                </transition>
            </div>
        </div>
        <template v-if="showImgView && multiple" >
            <div class="image-box-area" :class="item ? 'has-img' : ''" :style="[{'width':imgWidth},{'paddingTop': imgHeight}, {'display': display}]" v-for="(item, index) in imgs" :key="index">
                <div class="image-box" :style="boxStyle">
                    <div class="images" :class="'images' + index" v-viewer>
                        <img :src="item" class="img" v-show="item" />
                    </div>
                    <transition name="fade">
                        <div class="mask">
                            <Icon type="ios-eye-outline" size="24" color="#fff" @click.stop="viewInfo(index)" />
                            <template v-if="!isView">
                                <Icon type="ios-trash-outline" size="24" color="#fff" @click.stop="handleDel(index)" alt="清空图片" />
                            </template>
                        </div>
                    </transition>
                </div>
            </div>
        </template>
        <div class="small_font" :style="[{'display': display}]">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "imgView",
    props: {
        img: [String],
        imgs: Array,
        isView: {
            type: Boolean,
            default: false,
        },
        isCustomChoose: {
            type: Boolean,
            default: false,
        },
        multiple: {
            // 多选
            type: Boolean,
            default: false,
        },
        boxStyle: [String],
        width: {
            type: Number | String,
            default: 80,
        },
        height: Number | String,
        display: {
            type: String,
            default: "inline-block",
        },
        uploadType: {
            type: String,
            default: ""
        },
        showImgView:{
            type: Boolean,
            default: false,
        },
        maxLength: Number,
        disabled: Boolean
    },
    data() {
        return {
            showAction: false,
        };
    },
    computed: {
        imgWidth() {
            let width = this.width || "70px";
            let result = /^\d+$/.test(width);
            if (result) {
                return width + "px";
            } else {
                return width;
            }
        },
        imgHeight(){
            let height = this.height || this.imgWidth;
            let result = /^\d+$/.test(height);
            if (result) {
                return height + "px";
            } else {
                return height;
            }
        }
    },
    methods: {
        handleSelect() {
            if (this.isCustomChoose) {
                this.$emit("selectImg");
            } else {
                this.$UIModule({
                    mode: "upload-view",
                    props: {
                        isMulti: this.multiple,
                        extraParams: {
                            type: this.uploadType || ""
                        }
                    },
                    options: {
                        chooseIds: [],
                    },
                    success:(data)=>{
                        this.$emit("selectImg", data);
                    }
                });
            }
        },
        handleDel(index) {
            if((index || index == 0) && this.multiple){
                this.imgs.splice(index, 1)
            } else {
                this.$emit("delImg");
            }
        },
        // handleOver() {
        //     this.showAction = this.img;
        // },
        // handleOut() {
        //     this.showAction = false;
        // },
        viewInfo(index) {
            if((index || index == 0) && this.$el.querySelector(".images" + index)){
                const viewer = this.$el.querySelector(".images" + index).$viewer;
                viewer.show();
            } else {
                const viewer = this.$el.querySelector(".images").$viewer;
                viewer.show();
            }
            
        },
    },
    mounted() {},
    watch: {
        img: {
            handler(nV) {
                if (!nV) this.showAction = false;
            },
            immediate: true,
            deep: true,
        },
    },
};
</script>

<style lang="less" scoped>
// 添加图片默认占位符
.image-box-area {
    position: relative;
    margin-right: 10px;
    .image-box {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        border: 1px solid #eee;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        background: center center no-repeat;
        background-size: contain;
        font-size: 0px;
        &.noneBorder{
            border-color: transparent;
        }
        .images {
            font-size: 0px;
            width: 100%;
            height: 100%;
            .img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 5px;
                object-fit: contain;
            }
        }
        .add-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            line-height: 80px;
        }
        .mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 5px;
            display: none;
        }
    }
}
.image-box-area.has-img:hover{
    .mask{
        display: flex;
    }
}
</style>
