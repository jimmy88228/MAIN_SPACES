<template>
    <Modal
        :class-name="closeMode + '-custom-modal-box' + ' custom-modal-box'"
        class="modal-box"
        v-model="modalBool"
        :title="title"
        :okText="okText"
        :cancelText="cancelText"
        :mask="mask"
        :loading="loading"
        :closable="closable"
        :mask-closable="maskClosable"
        :footer-hide="footerHide"
        :width="width"
        :fullscreen="fullscreen"
        @on-ok="confirm">
        <div class="header-view" slot="header" v-if="isSlotHeader">
            <slot name="header"></slot>
        </div>
        <slot></slot>
        <div slot="footer" v-if="isSlotFooter">
            <slot name="footer"></slot>
        </div>
    </Modal>
</template>

<script>
export default {
    name:"customModal",
    data() {
        return {
            modalBool: false
        }
    },
    props: {
        'fullscreen': Boolean,
        'title': {
            type: String,
            default: ''
        }, 
        'ok-text': {
            type: String,
            default: '确定'
        }, 
        'cancel-text': {
            type: String,
            default: '取消'
        }, 
        'width': {
            type: Number|String,
             default: function(){
                return 500
            }
        }, 
        'mask': {
            type: Boolean,
            default: function(){
                return true
            }
        }, 
        'closable': Boolean,
        'closeMode': { // light // dark
            type: String,
            default: 'dark'
        },
        'mask-closable': {
            type: Boolean,
            default: function(){
                return true
            }
        },
        'loading': Boolean, 
        'isSlotHeader': Boolean, 
        'isSlotFooter': Boolean, 
        'footerHide': Boolean
    },
    methods: {
        show(){
            this.modalBool = true;
            return this;
        },
        dismiss(){
            this.modalBool = false;
            return this;
        },
        confirm() {
            this.$emit('confirm',this);
        }
    },
};
</script>
<style lang="less">
.custom-modal-box{
    .header-view{
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #171717;
        line-height: 25px;
    }
    .ivu-modal-close{
        font-size: 0;
        .ivu-icon{
            color:#111;
            font-weight: bold;
        }
    }
}
.light-custom-modal-box{
    .ivu-modal-close{
        border-radius: 100%;
        background-color:#fff;
        z-index: 10;
        .ivu-icon{
            
            // color:#fff;
        }
    }
}
</style>