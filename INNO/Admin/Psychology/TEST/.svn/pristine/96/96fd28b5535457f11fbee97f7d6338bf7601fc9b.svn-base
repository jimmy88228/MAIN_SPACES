<template>
    <div>
        <rewrite-drawer v-model="drawerShow" :inner="true">
            <div class="bold" slot="header">{{title}}</div>
            <div class="edit-cont-area">
                <Form :label-width="100" :model="areaInfo" ref="formDataRef" :rules="ruleValidate">
                    <div class="item-header">区信息</div>
                    <FormItem label="区名称" prop="structure_name">
                        <custom-input class="base-input" v-model="areaInfo.structure_name"></custom-input>
                    </FormItem>
                    <FormItem label="区管理员" v-if="areaInfo.id">
                        <div class="admin-area flex-s-c base-input">
                            <div class="admin-list f-wrap">
                                <div class="admin-item" v-for="(item, index) in adminList" :key="index">
                                    {{item.name}}
                                </div>
                            </div>
                            <a class="add-admin" @click="bindAdmin(areaInfo.id)">更改</a>
                        </div>
                    </FormItem>
                    <div class="item-header">联系方式</div>
                    <FormItem label="联系人" prop="contact">
                        <custom-input class="base-input" v-model="areaInfo.contact"></custom-input>
                    </FormItem>
                    <FormItem label="联系电话" prop="contact_way">
                        <custom-input type="number" :maxlength="11" class="base-input" v-model="areaInfo.contact_way"></custom-input>
                    </FormItem>
                </Form>
                <Spin fix v-if="pageLoading"></Spin>
            </div>
            <div class="edit-foot" slot="footer">
                <Button class="m-r-10" type="primary" @click="checkUpdate">保存</Button>
                <Button @click="confirmUpdate">取消</Button>
            </div>
        </rewrite-drawer>
        <bindAdmin ref="bindAdminRef"></bindAdmin>
    </div>
</template>

<script>
import bindAdmin from "./bind-admin/index";
export default {
    name: "editAreaMaint",
    props: {
        title: {
            type: String,
            default: "标题",
        },
    },
    components: { bindAdmin },
    data() {
        return {
            drawerShow: false,
            structureId: 0,
            areaInfo: {
                id: 0,
                structure_name: "",
                contact: "",
                contact_way: "",
            },
            adminList: [],
            ruleValidate: {
                structure_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写街道名称",
                    },
                ],
                contact: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请完善联系人",
                        trigger: "blur",
                    },
                ],
                contact_way: [
                    {
                        required: true,
                        validator: this._checkPhone,
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        showDrawer({ id }) {
            this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
            this.structureId = id || 0;
            this.drawerShow = true;
            this.areaInfo = {};
            this.onLoadData(id);
        },
        onLoadData(id) {
            if (!id) return Promise.reject();
            this.pageLoading = true;
            return this.$MainApi
                .areaMaintInfo({
                    data: {
                        id: id,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let get_type = data.get_type || {};
                        let areaInfo = {
                            id: data.id,
                            structure_name: data.structure_name,
                            area_type: get_type.area_type,
                            contact: data.contact,
                            contact_way: data.contact_way,
                        };
                        let adminList = [];
                        if (data.get_admin instanceof Array) {
                            adminList = data.get_admin;
                        } else {
                            adminList = [data.get_admin];
                        }
                        this.adminList = this.installAdmin(adminList);
                        this.areaInfo = areaInfo;
                    }
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        installAdmin(data) {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                let get_user = data[i].get_user || {};
                let item = {
                    id: data[i].admin_id,
                    name: get_user.user_name,
                };
                arr.push(item);
            }
            return arr;
        },
        removeAdmin() {},
        bindAdmin(areaId) {
            this.$refs["bindAdminRef"] &&
                this.$refs["bindAdminRef"].showModal({
                    areaId: areaId,
                    confirm: (data) => {
                        this.bindAdminEvent(data);
                    },
                });
        },
        bindAdminEvent(data) {
            if (data.length > 0) {
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].admin_id,
                        name: data[i].admin_name,
                    });
                }
                this.adminList = arr;
            } else {
                this.adminList = [];
            }
            console.log("adminList", this.adminList);
        },
        checkUpdate() {
            this.$refs["formDataRef"].validate((valid) => {
                if (valid) {
                    this.updateAreaInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateAreaInfo() {
            let areaInfo = this.areaInfo || {};
            console.log("areaInfo", areaInfo)
            !Number(areaInfo.id) && delete areaInfo.id;
            let req = Number(areaInfo.id)
                ? "updateAreaMaint"
                : "addAreaMaint";
            this.pageLoading = true;
            return this.$MainApi[req]({
                data: areaInfo,
            })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "操作成功");
                        this.confirmUpdate();
                    } else {
                        this.$Message.warning(res.message || "操作失败");
                    }
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        confirmUpdate() {
            this.drawerShow = false;
            this.$emit("confirm");
        },
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.edit-cont-area{
    border: 1px solid #efefef;
    padding-bottom: 20px;
    .item-header{
        padding-left: 20px;
        height: 60px;
        line-height: 60px;
        width: 100%;
        display: block;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #171717;
        margin-bottom: 20px;
        background: rgba(216, 216, 216, 0.11);
        border-top: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;
    }
    .admin-area {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 5px;
        min-height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        .admin-list {
            display: flex;
            width: 100%;
            padding-right: 10px;
            min-height: 100%;
            .admin-item {
                padding: 0px 10px;
                line-height: 1.5;
                color: @primary-color;
                border: 1px solid fade(@primary-color, 30%);
                border-radius: @default-radius;
                background-color: fade(@primary-color, 10%);
                position: relative;
                margin: 2px;
                .admin-close {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    transform: translate(50%, -50%);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity @transition-time;
                }
            }
            .admin-item:hover .admin-close {
                opacity: 1;
            }
        }
        .add-admin {
            flex-shrink: 0;
        }
    }
}
</style>