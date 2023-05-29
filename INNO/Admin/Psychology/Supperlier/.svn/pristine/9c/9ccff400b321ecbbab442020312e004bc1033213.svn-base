<template>
    <div>
        <Form :label-width="100" ref="formDataRef" :model="formData" :rules="ruleValidate">
            <FormItem label="人员名称" prop="admin_name">
                <custom-input class="base-input" v-model="formData.admin_name"></custom-input>
            </FormItem>
            <FormItem label="授权角色">
                <div>{{currentRole.role_id ? currentRole.get_role && currentRole.get_role.role_name : '--'}}</div>
            </FormItem>
            <FormItem label="关联班级" prop="class_name" v-if="type == 'edu_class'">
                {{formData.class_name || "--"}}
            </FormItem>
            <FormItem label="手机号" prop="admin_phone">
                <custom-input class="base-input" v-model="formData.admin_phone"></custom-input>
            </FormItem>
        </Form>
    </div>
</template>

<script>
export default {
    name: "editMember",
    props: {
        formData: {
            type: Object,
            default: () => {
                return {
                    admin_id: 0,
                    admin_name: "",
                    admin_phone: "",
                    class_name: ""
                };
            },
        },
        type: {
            type: String,
            default: "",
        },
    },
    computed: {
        currentRole() {
            if (!this.type) return {};
            let currentRole = {};
            let roleData = this._adminRoleData || [];
            for (let i = 0; i < roleData.length; i++) {
                let item = roleData[i] || {};
                if (item.structure_type == this.type) {
                    currentRole = item || {};
                    break;
                }
            }
            return currentRole;
        },
    },
    data() {
        return {
            ruleValidate: {
                admin_name: [
                    {
                        required: true,
                        message: "请完善人员名称",
                        validator: this._checkString,
                        trigger: "blur",
                    },
                ],
                admin_phone: [
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
        validate() {
            return new Promise((rs, rj) => {
                this.$refs["formDataRef"].validate((valid) => {
                    if (valid) {
                        rs();
                    } else {
                        this.$Message.warning("请完善信息");
                        rj();
                    }
                });
            });
        },
    },
    mounted() {},
    watch: {
        formData: {
          handler(nV){
            console.log("页面form formData", nV)
          },
          deep: true,
          immediate: true
        }
    },
};
</script>

<style>
</style>