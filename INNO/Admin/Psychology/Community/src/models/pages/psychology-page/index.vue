<template>
    <editorMain :hideBack="true" :showHeader="false" ref="editorMainRef" pageType="PSYC_HANDBOOK" @on-save="save"></editorMain>
</template>
<script>
import editorMain from "@/components/main-components/custom-page/editor-main";
export default {
    name: "userCenter",
    components: {
        editorMain,
    },
    data(){
      return {
        defaultData: {
          id: 0,
          layout_name: "心理手册",
          layout_type: "PSYC_HANDBOOK",
          setting: {
            backgroundColor: "#efefef",
            backgroundImage: "",
            backgroundRepeat: "",
            backgroundSize: "",
            backgroundPosition: "",
          },
          wx_share_title: "",
          wx_share_img: "",
          get_module: [],
        }
      }
    },
    methods: {
        loadData() {
            return this.$MainApi
                .manualMentalView({
                    data: {},
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {//res.data || 
                        let data = res.data || this.defaultData || {};
                        // data.get_module[1].module_data= JSON.stringify(this.defaultData.get_module[1].module_data);
                        this.$refs["editorMainRef"] &&
                    this.$refs["editorMainRef"].initData(data);
                    }
                });
        },
        save(detail) {
            detail = JSON.parse(JSON.stringify(detail));
            let compPageInfo = detail.compPageInfo || {};
            let pageCompList = detail.pageCompList || [];
            this.$store.commit("setPageLoading", true)
            return this.$MainApi.manualMentalSave({
                    data: {
                        ...compPageInfo,
                        module_data: pageCompList
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "编辑成功");
                        this.loadData();
                    } else {
                        this.$Message.warning(res.message || "编辑失败");
                    }
                }).finally(()=>{
                  this.$store.commit("setPageLoading", false)
                })
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>