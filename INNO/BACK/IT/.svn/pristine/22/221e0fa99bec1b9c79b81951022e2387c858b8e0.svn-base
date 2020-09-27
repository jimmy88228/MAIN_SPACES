<template>
    <Modal
        :value="isShow"
        @input="input"
        :title="isAdd?'添加账号':'编辑账号'"
        class-name="modal-center"
        footer-hide
        transfer
    >
        <div class="dialog-edit-group center">
            <div v-if="isAdd" class="dialog-edit-item">
                <span class="name">账号：</span>
                <Input
                    class="cev"
                    v-focusNext="{ref:'userName'}"
                    v-model="account"
                    :maxlength="16"
                    autocomplete="off"
                    :disabled="loading"
                    :clearable="!loading"
                ></Input>
            </div>
            <div class="dialog-edit-item">
                <span class="name">账号名：</span>
                <Input
                    ref="userName"
                    class="cev"
                    v-focusNext="{ref:'password'}"
                    v-model="userName"
                    :maxlength="16"
                    autocomplete="off"
                    :disabled="loading"
                    :clearable="!loading"
                ></Input>
            </div>
            <div class="dialog-edit-item">
                <span class="name">密码：</span>
                <div class="cev">
                    <Input
                        ref="password"
                        v-focusNext="{action:'submit'}"
                        :type="showPwd?'text':'password'"
                        v-model="password"
                        :maxlength="16"
                        autocomplete="off"
                        :disabled="loading"
                        :clearable="!loading"
                    ></Input>
                </div>
                <Button
                    class="eye-btn"
                    @mousedown.native="e=>showPwd=true"
                    @mouseup.native="e=>showPwd=false"
                    :disabled="loading"
                >
                    <i class="iconfont" :class="showPwd?'icon-pw-show':'icon-pw-hide'"></i>
                </Button>
            </div>
            <div v-if="isAdd" class="dialog-edit-item">
                <span class="name">状态：</span>
                <div class="cev">
                    <i-switch v-model="enable" :disabled="loading">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </div>
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
    name: "AdminEditDialog",
    mixins: [BaseDialog],
    data() {
        return {
            row: null,
            infos: null,
            account_: "",
            userName: "",
            password: "",
            enable_: 0,
            showPwd: false,
            loading: false
        };
    },
    computed: {
        isAdd() {
            return !this.infos || !this.infos.id;
        },
        account: {
            get() {
                return this.account_;
            },
            set(e) {
                this.account_ = e;
                this.$nextTick(() => {
                    this.account_ = (e || "").replace(/[\W]+/g, "");
                });
            }
        },
        enable: {
            get() {
                return this.enable_ > 0;
            },
            set(e) {
                this.enable_ = e ? 1 : 0;
            }
        }
    },
    methods: {
        setData(row, infos) {
            this.row = row;
            this.infos = infos || null;
            this.account_ = (this.infos && this.infos.account) || "";
            this.userName = (this.infos && this.infos.userName) || "";
            this.enable_ = (this.infos && this.infos.enable) || 0;
            this.password = "";
            return this;
        },
        submit() {
            let row = this.row;
            let isAdd = this.isAdd;
            let data = {};
            if (isAdd) {
                if (StringHelper.trim(this.account_)) {
                    data.account = this.account_;
                }
                data.enable = this.enable_;
            } else {
                data.id = this.infos.id;
            }
            if (StringHelper.trim(this.userName)) {
                data.userName = this.userName;
            }
            if (StringHelper.trim(this.password)) {
                data.password = this.password;
            }
            this.loading = true;

            (isAdd ? MainApi.postAdminAdd : MainApi.postAdminUpdate)({
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
