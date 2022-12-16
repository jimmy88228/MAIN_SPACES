<template>
    <Modal
        class-name="custom-modal-box"
        class="modal-box"
        v-model="modalBool"
        :title="title"
        :okText="okText"
        :transfer="transfer"
        :cancelText="cancelText"
        :mask="mask"
        :loading="loading"
        :closable="closable"
        :mask-closable="maskClosable ? !closable : maskClosable"
        :footer-hide="footerHide"
        :width="width"
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
                return 0
            }
        }, 
        'mask': {
            type: Boolean,
            default: function(){
                return true
            }
        }, 
        'closable': {
            type: Boolean,
            default: function(){
                return false
            }
        },
        'mask-closable': {
            type: Boolean,
            default: function(){
                return true
            }
        },
        'loading': {
            type: Boolean,
            default: function(){
                return false
            }
        }, 
        'isSlotHeader': {
            type: Boolean,
            default: function(){
                return false
            }
        }, 
        'isSlotFooter': {
            type: Boolean,
            default: function(){
                return false
            }
        }, 
        'footerHide': {
            type: Boolean,
            default: function(){
                return false
            }
        },
        'transfer': {
            type: Boolean,
            default: function(){
                return true
            }
        },
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
        .ivu-icon{
            color:#111;
            font-weight: bold;
        }
    }
}
</style>