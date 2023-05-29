<template>
    <Modal v-model="modalShow" class="hold-modal-zindex" :width="400" title="修改密码" :footer-hide="true">
        <div class="p-10">
            <changePwdForm ref="changePwdForm" @success="changeSuccess" @cancel="changeCancel"></changePwdForm>
        </div>
    </Modal>
</template>

<script>
import changePwdForm from "./form.vue";
export default {
    components: { changePwdForm },
    data() {
        return {
            modalShow: false,
        };
    },
    methods: {
        showModal() {
            this.modalShow = true;
        },
        changeSuccess(){
            this.modalShow = false;
        },
        changeCancel(){
            this.modalShow = false;
        }
    },
};
</script>

<style>
</style>