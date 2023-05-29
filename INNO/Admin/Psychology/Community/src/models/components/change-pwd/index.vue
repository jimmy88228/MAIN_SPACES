<template>
    <Modal v-model="modalShow" :width="440" title="修改密码" :footer-hide="true">
        <changePwdForm ref="changePwdForm" @success="changeSuccess" @cancel="changeCancel"></changePwdForm>
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