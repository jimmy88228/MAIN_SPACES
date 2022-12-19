<template>
    <editorMain :isShowSave="false" showHeader pageType="REPORT" ref="editorMainRef" fullType="right"></editorMain>
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
          layout_name: "报告建议",
          layout_type: "NONE",
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
          inited:false,
        },
      }
    },
    methods: {
        init(){
            this.loadData();
        },
        loadData() {
            let id = Number(this.pageQuery.id || 0);
            return this.$MainApi
                .scaleReportInfo({
                    data: {
                        id,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        this.inited = true;
                        let data = res.data && res.data || {};
                        let items = data.items || {};
                        data.get_module = items;
                        delete data.items;
                        // console.log('数据',data.get_module[1].module_data); 
						// data.get_module[1].module_data= JSON.stringify(this.defaultData.get_module[1].module_data);
                        this.$refs["editorMainRef"] &&
                    this.$refs["editorMainRef"].initData(data);
                    }
                });
        },
        save(){
            if(!this.inited)return Promise.resolve();
            return this.$refs.editorMainRef.save().then(detail=>{
                return this.saveApi(detail)
            });
        },
        saveApi(detail) {
            detail = JSON.parse(JSON.stringify(detail));
            let pageCompList = detail.pageCompList || [];
            this.$store.commit("setPageLoading", true)
            return this.$MainApi.scaleReportSave({
                    data: {
                        model_id:Number(this.pageQuery.id || 0),
                        module_data: pageCompList
                    },
                })
                .then((res) => {
                    if (res.code) {
                        // this.loadData();
                        return res
                    } else {
                        res.message && this.$Message.warning(res.message);
                        return Promise.reject(res);
                    }
                }).finally(()=>{
                  this.$store.commit("setPageLoading", false)
                })
        },
    },
    // mounted() {
    //     this.loadData();
    // },
};
</script>

<style>
</style>