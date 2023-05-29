<template>
    <rewrite-tabs :data="tabsData" :currTab="currTab" @changeTab="changeTab">
        <publishForm slot="publish" ref="publish"></publishForm>
        <draftsForm slot="drafts" ref="drafts"></draftsForm>
        <div slot="extra">
            <Button @click="addTickets" type="primary">新增问券</Button>
        </div>
    </rewrite-tabs>
</template>

<script>
import draftsForm from "./components/drafts/index.vue";
import publishForm from "./components/publish/index.vue";
export default {
    name: "memberManage",
    components: {
        draftsForm,
        publishForm
    },
    data() {
        return {
            currTab: "publish",
            tabsData: [
                {
                    label: "已发布",
                    name: "publish"
                },
                {
                    label: "草稿箱",
                    name: "drafts"
                }
            ],
        };
    },
    methods: {
        changeTab(name){
            this.$refs[name] && this.$refs[name].init();
        },
        addTickets(){
            this.$router.push({
                name: "askTicketsDetail",
                query: {},
            });
        }
    },
    mounted() {
    },
};
</script>

<style>
</style>