<template>
    <Modal
        :value="isShow"
        @input="input"
        :title="isAdd?'添加角色':'编辑角色'"
        class-name="modal-center"
        footer-hide
        transfer
    >
        <div class="dialog-edit-group center">
            <div class="dialog-edit-item">
                <span class="name">名称：</span>
                <Input
                    class="cev"
                    v-focusNext="{ref:'remark'}"
                    v-model="infos.roleName"
                    :maxlength="16"
                    autocomplete="off"
                    :disabled="loading"
                    :clearable="!loading"
                ></Input>
            </div>
            <div class="dialog-edit-item">
                <span class="name">描述：</span>
                <Input
                    ref="remark"
                    class="cev"
                    v-model="infos.remark"
                    type="textarea"
                    :maxlength="16"
                    :disabled="loading"
                    :clearable="!loading"
                ></Input>
            </div>
        </div>
        <div class="cev-toolbar end flex-fixed">
            <Button size="large" type="primary" @click="submit">确认</Button>
        </div>
    </Modal>
</template>
<script>
import StringHelper from "@/helper/utils/string-util";
import { MainApi } from "@/helper/manager/http-manager";
import BaseDialog from "@/support/components/dialog/base-dialog";
export default {
    name: "RoleEditDialog",
    mixins: [BaseDialog],
    data() {
        return {
            row: null,
            infos: {
                roleId: 0,
                roleName: "",
                remark: ""
            },
            loading: false
        };
    },
    computed: {
        isAdd() {
            return !this.infos || !this.infos.roleId;
        }
    },
    methods: {
        setData(row, infos) {
            this.row = row;
            this.infos = infos || {};
            return this;
        },
        submit() {
            let row = this.row;
            let isAdd = this.isAdd;
            let data = this.infos;
            let warn = "";
            if(!StringHelper.trim(data.roleName)){
                warn = "请填写角色名称！";
            } else if(!StringHelper.trim(data.remark)){
                warn = "请填写角色描述！";
            }
            if(warn){
                this.$Message.error(warn);
                return;
            }
            this.loading = true;

            (isAdd ? MainApi.addAdminRole : MainApi.updateAdminRole)({
                data: data
            })
            .then(res => {
                if (res.code === "1") {
                    if (isAdd) {
                        this.$emit("on-added", { ...res.data });
                    } else {
                        this.$emit("on-edited", {
                            row: row,
                            data: { ...res.data }
                        });
                    }
                    this.dismiss();
                } else {
                    return Promise.reject(res.msg);
                }
            })
            .catch(msg => {
                if (StringHelper.trim(msg)) {
                    this.$Message.error(msg || "修改失败");
                }
            })
            .finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>
<style lang="less" scoped>
.eye-btn {
    height: 32px;
    width: 32px;
    margin-left: 5px;
    padding: 0;
    line-height: 32px;
}
</style>
