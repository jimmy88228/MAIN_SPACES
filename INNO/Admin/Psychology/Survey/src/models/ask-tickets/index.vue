<template>
    <rewrite-tabs :data="tabsData" :currTab="currTab">
        <publishForm slot="publish"></publishForm>
        <draftsForm slot="drafts"></draftsForm>
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
        
    },
    mounted() {
    },
};
</script>

<style>
</style>