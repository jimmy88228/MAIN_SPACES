<template>
    <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
        <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
            <div class="edit-title bold">{{title}}</div>
            <div class="edit-cont" v-bar>
                <div class="edit-cont-area">
                    <div class="flex-b-c edit-cont-title">
                        <div>2022.01.22 22:22</div>
                        <div>待处理中</div>
                    </div>
                    <Form :label-width="100" :model="subscribeInfo" ref="formDataRef" :rules="ruleValidate">
                        <FormItem label="姓名" >{{subscribeInfo.name}}</FormItem>
                        <FormItem label="联系电话">{{subscribeInfo.mobile_phone}}</FormItem>
                        <FormItem label="性别">{{subscribeInfo.sex_str}}</FormItem>
                        <FormItem label="咨询方式" >{{subscribeInfo.way}}</FormItem>
                        <FormItem label="预约咨询师" >{{subscribeInfo.psychiatrist}}</FormItem>
                        <FormItem label="心理描述">{{subscribeInfo.desc}}</FormItem>
                    </Form>
                    <div class="edit-foot">
                        <Button type="primary" @click="checkUpdateInfo">设为已处理</Button>
                        <Button @click="drawerShow = false">返回</Button>
                    </div>
                    <Spin fix v-if="pageLoading"></Spin>
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script>
export default {
    props: {
        title: String,
    },
    data() {
        return {
            drawerShow: false,
            subscribeInfo: {
                id: 0,
                user_id: 0,
                name: "金喜善",
                sex_str: '男',
                way: "语音",
                psychiatrist: "林松",
                mobile_phone: "18902250434",
                desc: "父亲突然患了疾病加上自己被冷暴力分手很内疚自己没有好好珍惜很后悔自己的之前的不懂事不会谈恋爱"
            },
        };
    },
    methods: {
        showDrawer(subscribeInfo = {}) {
            this.drawerShow = true;
            // let _subscribeInfo = {
            //     id: subscribeInfo.id || 0,
            //     gender: subscribeInfo.gender,
            //     member_name: subscribeInfo.member_name || "",
            //     structure_id: subscribeInfo.structure_id || 0,
            //     structure_ids: (subscribeInfo.parent_id_info && subscribeInfo.parent_id_info.length > 0) ? [0, ...subscribeInfo.parent_id_info] : [],
            //     mobile_phone: subscribeInfo.mobile_phone,
            // };
            // this.subscribeInfo = _subscribeInfo;
        },
        checkUpdateInfo() {
            this.$refs["formDataRef"].validate((valid) => {
                if (valid) {
                    this.updateInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateInfo() {
            let subscribeInfo = this.subscribeInfo || {};
            !Number(subscribeInfo.id) && delete subscribeInfo.id;
            let req = Number(subscribeInfo.id) ? "structureMemberUpdate" : "structureMemberAdd";
            this.pageLoading = true;
            return this.$MainApi[req]({
                data: {
                    ...subscribeInfo,
                    structure_id: subscribeInfo.structure_ids.slice(-1)[0],
                },
            })
            .then((res) => {
                if (res.code) {
                    this.$Message.success(res.message || "操作成功");
                    this.drawerShow = false;
                    this.$emit("confirm");
                } else {
                    this.$Message.warning(res.message || "操作失败");
                }
            })
            .finally(() => {
                this.pageLoading = false;
            });
        },
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.page-drawer-area{
  .edit-cont-area{
    border: 0 none !important;
    .edit-cont-title{
        height: 40px;
        background: #F2F2F2;
        border-radius: 4px;
        margin-bottom: 20px;
        padding: 0px 16px;
    }
  }
}
</style>