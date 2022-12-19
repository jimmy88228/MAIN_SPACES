<template>
    <!--maskClosable为true时，存在关闭按钮closable，则屏蔽mask点击，否则恢复默认状态-->
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
        <div :class="{'hide-t-b-padding': hideTBPadding}">
            <slot></slot>
        </div>
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
                return 600
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
        'maskClosable': {
            type: Boolean,
            default: function(){
                return true
            }
        },
        'hideTBPadding': Boolean
    },
    computed: {

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
    .hide-t-b-padding{
        margin-top: -30px;
        margin-bottom: -30px;
    }
}
</style>