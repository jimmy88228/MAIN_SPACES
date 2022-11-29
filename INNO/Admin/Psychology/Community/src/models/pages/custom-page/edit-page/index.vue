<template>
    <editorMain :showHeader="true" pageType="NONE" ref="editorMainRef" @on-save="save"></editorMain>
</template>
<script>
import editorMain from "@/components/main-components/custom-page/editor-main";
export default {
    components: {
        editorMain,
    },
    data() {
        return {
            defaultData: {
                layout_name: "首页",
                layout_type: "NONE",
                setting: {
                    backgroundColor: "#fff",
                },
                get_module: [
                    {
                        module_name: "图片广告",
                        module_type: "IMAGE-AD",
                        setting: {
                            widgetRemark: "",
                            backgroundColor: "#fff",
                            backgroundImage: "",
                            backgroundPosition: "bottom",
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeftRight: 0,
                            paddingLeftRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            is_enable: 1,
                        },
                        dynamic_setting: {
                            type: "t1",
                            autoPlay: true,
                            row: 1,
                            interval: 0,
                            indicator: "none",
                            showTitle: true,
                            open_slide: false,
                            currTab: "tab0",
                            showStyle: 1,
                        },
                        module_data: {
                            imagesGroup: [
                                {
                                    images: [
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_01.jpg",
                                        },
                                    ],
                                },
                            ],
                        },
                        is_deletable: 1,
                    },
                    {
                        module_name: "图片广告",
                        module_type: "IMAGE-AD",
                        setting: {
                            widgetRemark: "",
                            backgroundColor: "#fff",
                            backgroundImage: "",
                            backgroundPosition: "bottom",
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeftRight: 0,
                            paddingLeftRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            is_enable: 1,
                        },
                        dynamic_setting: {
                            type: "t1",
                            autoPlay: true,
                            row: 3,
                            interval: 0,
                            indicator: "none",
                            showTitle: true,
                            open_slide: false,
                            currTab: "tab0",
                            showStyle: 1,
                        },
                        module_data: {
                            imagesGroup: [
                                {
                                    images: [
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_02_01.jpg",
                                        },
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_02_02.jpg",
                                        },
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_02_03.jpg",
                                        },
                                    ],
                                },
                            ],
                        },
                        is_deletable: 1,
                    },
                    {
                        module_name: "图片广告",
                        module_type: "IMAGE-AD",
                        setting: {
                            widgetRemark: "",
                            backgroundColor: "#fff",
                            backgroundImage: "",
                            backgroundPosition: "bottom",
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeftRight: 0,
                            paddingLeftRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            is_enable: 1,
                        },
                        dynamic_setting: {
                            type: "t1",
                            autoPlay: true,
                            row: 1,
                            interval: 0,
                            indicator: "none",
                            showTitle: true,
                            open_slide: false,
                            currTab: "tab0",
                            showStyle: 1,
                        },
                        module_data: {
                            imagesGroup: [
                                {
                                    images: [
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_03_01.jpg",
                                        },
                                    ],
                                },
                            ],
                        },
                        is_deletable: 1,
                    },
                    {
                        module_name: "图片广告",
                        module_type: "IMAGE-AD",
                        setting: {
                            widgetRemark: "",
                            backgroundColor: "#fff",
                            backgroundImage: "",
                            backgroundPosition: "bottom",
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeftRight: 0,
                            paddingLeftRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            is_enable: 1,
                        },
                        dynamic_setting: {
                            type: "t1",
                            autoPlay: true,
                            row: 3,
                            interval: 0,
                            indicator: "none",
                            showTitle: true,
                            open_slide: false,
                            currTab: "tab0",
                            showStyle: 1,
                        },
                        module_data: {
                            imagesGroup: [
                                {
                                    images: [
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_04_01.jpg",
                                        },
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_04_02.jpg",
                                        },
                                        {
                                            img: "http://devimgtest.innourl.com/wechat_applet_image/survey/custom-page/m_04_03.jpg",
                                        },
                                    ],
                                },
                            ],
                        },
                        is_deletable: 1,
                    },
                ],
            },
        };
    },
    methods: {
        loadData() {
            let pageId = Number(this.pageQuery.pageId) || 0;
            if (!pageId) {
                this.$refs["editorMainRef"] &&
                    this.$refs["editorMainRef"].initData({});
                return Promise.reject();
            }
            return this.$MainApi
                .pageInfo({
                    data: {
                        id: pageId,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.$refs["editorMainRef"] &&
                            this.$refs["editorMainRef"].initData(data);
                    }
                });
        },
        save(detail) {
            detail = JSON.parse(JSON.stringify(detail));
            let compPageInfo = detail.compPageInfo || {};
            let pageCompList = detail.pageCompList || [];
            let req = Number(compPageInfo.id) ? "pageUpdate" : "pageAdd";
            this.$store.commit("setPageLoading", true);
            return this.$MainApi[req]({
                data: {
                    ...compPageInfo,
                    module_data: pageCompList,
                    structure_id: parseInt(this.pageQuery && this.pageQuery.strucId || 0)
                },
            })
                .then((res) => {
                    if (res.code) {
                        if(!Number(compPageInfo.id)){
                            this.$router.back();
                        }
                        this.$Message.success(res.message || "编辑成功");
                    } else {
                        this.$Message.warning(res.message || "编辑失败");
                    }
                })
                .finally(() => {
                    this.$store.commit("setPageLoading", false);
                });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>