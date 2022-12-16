<template>
    <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
        <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
            <div class="edit-title bold">{{title}}</div>
            <div class="edit-cont" v-bar>
                <div class="edit-cont-area">
                    <div class="item-header">人员信息</div>
                    
                    <Form :label-width="100" :model="memberInfo" ref="formDataRef">
                        <FormItem label="姓名" >{{memberInfo.member_name}}</FormItem>
                        <FormItem label="预警等级" >{{memberInfo.level_name}}</FormItem>
                        <FormItem label="注册时间" >{{memberInfo.create_time}}</FormItem>
                        <FormItem label="婚姻状况" >{{memberInfo.marriage_str}}</FormItem>
                        <FormItem label="性别" >{{memberInfo.gender_str}}</FormItem>
                        <FormItem label="用户所属" >{{memberInfo.prent_structure_name}}</FormItem>
                    </Form>
                    <div class="edit-foot">
                        <Button type="primary" @click="getPsychologicalFile">查看档案</Button>
                        <Button @click="dismiss()">取消</Button>
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
            memberInfo: {},
        };
    },
        methods: {
        dismiss(){
            this.drawerShow = false;
        },
        showDrawer(memberInfo = {}) {
            this.drawerShow = true;
            this.getMemberView(memberInfo.user_id);
        },
        getMemberView(user_id){
            this.pageLoading = true;
            return this.$MainApi
                .registeredUserView({
                    data: {
                        user_id: user_id
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let items = data.items || {};
                        this.memberInfo = items;
                    }
                }).finally(()=>{
                    this.pageLoading = false
                })
        },
        getPsychologicalFile(){
            if(this.memberInfo.user_id){
                this.$UIModule({
                    mode: "clause-view",
                    success: () => {
                        this.$router.push({
                            name: "registerMemberPsychicFiles",
                            query: {
                                userId: this.memberInfo.user_id || 0,
                                type: "register"
                            },
                        });
                    },
                });
                
            } else {
                this.$Message.warning("无效用户ID")
            }
        }
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.page-drawer-area{
  .edit-cont-area{
    border: 0 none !important;
  }
}
</style>