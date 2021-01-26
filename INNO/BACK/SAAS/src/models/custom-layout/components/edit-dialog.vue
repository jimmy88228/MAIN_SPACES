<template>
    <Modal :value="isShow" @input="input" title="布局管理" footer-hide>
        <EditItem name="布局名称" label="必填">
            <Input slot="edit" size="large" v-model="layoutName" clearable/>
        </EditItem>
        <EditItem name="索引名" label="非必填">
            <Input slot="edit" size="large" v-model="layoutIndexName" clearable/>
        </EditItem>
        <div class="cev-toolbar end">
            <Button size="large" type="primary" @click="submit">确认</Button>
        </div>
    </Modal>
</template>

<script>
import BaseDialog from "@/support/components/dialog/base-dialog";
import EditItem from "@/support/components/edit-item";
export default {
    name: "EditDialog",
    mixins: [BaseDialog],
    components: { EditItem },
    data() {
        return {
            layoutName: "",
            layoutIndexName: ""
        };
    },

    methods: {
        submit() {
            this.dismiss();
            setTimeout(() => {
                this.$emit("update:layoutNames", {
                    layoutName: this.layoutName,
                    layoutIndexName: this.layoutIndexName
                });
            }, 400);
        }
    }
};
</script>
