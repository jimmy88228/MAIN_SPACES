<template>
    <editorMain :showHeader="false" :hideBack="true" ref="editorMainRef" pageType="MINE" @on-save="save"></editorMain>
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
          layout_name: "个人中心",
          layout_type: "MINE",
          setting: {
            backgroundColor: "#efefef",
            backgroundImage: "",
            backgroundRepeat: "",
            backgroundSize: "",
            backgroundPosition: "",
          },
          wx_share_title: "",
          wx_share_img: "",
          get_module: [
            {
              id: 0,
              module_name: "个人中心头部",
              module_type: "USER-HEADER",
              dynamic_setting: {},
              module_data: {},
              setting: {
                backgroundColor: "#fff",
                backgroundImage: "",
                backgroundRepeat: "",
                backgroundSize: "",
                backgroundPosition: "",
                marginTop: 0,
                marginBottom: 10,
                marginLeftRight: 0,
                paddingLeftRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                is_enable: 1,
                widgetRemark: ""
              },
              sort: 1,
              is_deletable: 0
            },
            {
              id: 0,
              module_name: "个人中心功能",
              module_type: "USER-SERVICE",
              dynamic_setting: {},
              module_data: {
                serviceList: [
		              {
                    code: "SURVEY-ACTIVITY",
                    icon: "",
                    is_enable: 1,
                    name: "测评活动",
                    tip: "提示",
                    type_name: "测评活动"
                  },
                  {
                    code: "SURVEY-RECORD",
                    icon: "https://surveyadmin.innourl.com/v/files/public/SURVEY_INNO/edu/images/custom_page/20220421/1650522456940fcX1Ql.png",
                    is_enable: 1,
                    name: "测评记录",
                    tip: "提示",
                    type_name: "测评记录"
                  },
                  {
                    code: "USERINFO-EDIT",
                    icon: "https://surveyadmin.innourl.com/v/files/public/SURVEY_INNO/edu/images/custom_page/20220421/1650522467701qKB7Do.png",
                    is_enable: 1,
                    name: "信息编辑",
                    tip: "提示",
                    type_name: "信息编辑"
                  },
                  {
                    code: "MY-SUBSCRIBE",
                    icon: "",
                    is_enable: 1,
                    name: "我的预约",
                    tip: "提示",
                    type_name: "我的预约"
                  },
                ]  
              },
              setting: {
                backgroundColor: "",
                backgroundImage: "",
                backgroundRepeat: "",
                backgroundSize: "",
                backgroundPosition: "",
                marginTop: 0,
                marginBottom: 10,
                marginLeftRight: 0,
                paddingLeftRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                is_enable: 1,
                widgetRemark:""
              },
              sort: 2,
              is_deletable: 0
            }
          ],
        }
      }
    },
    methods: {
        loadData() {
            return this.$MainApi
                .viewUserCenter({
                    data: {},
                    other: {
                      isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = JSON.parse(JSON.stringify(res.data || this.defaultData || {}));
                        if(res.data){
                          data = this.dataHandle(res.data) || {};
                        // data.get_module[1].module_data.serviceList[0].icon = this.defaultData.get_module[1].module_data.serviceList[0].icon;
                        // data.get_module[1].module_data.serviceList[1].icon = this.defaultData.get_module[1].module_data.serviceList[1].icon;
                        // data.get_module[1].module_data.serviceList[2].icon = this.defaultData.get_module[1].module_data.serviceList[2].icon;
                        // data.get_module[1].module_data.serviceList[3].icon = this.defaultData.get_module[1].module_data.serviceList[3].icon;
                          // data = this.defaultData;
                        }
                        this.$refs["editorMainRef"] && this.$refs["editorMainRef"].initData(data);
                    }
                });
        },
        dataHandle(reqData = {}){
          if(reqData){
            let get_module = reqData.get_module || [];
            let _moduleArr = [], _moduleDataArr = []; // _moduleArr,_moduleDataArr下标一一对应
            let defaultData = JSON.parse(JSON.stringify(this.defaultData || {}));
            let default_module = defaultData.get_module || [];
            let modules = [];
            for(let i = 0; i < get_module.length; i++){
              let module_data = typeof(get_module[i].module_data) == 'string' ? JSON.parse(get_module[i].module_data) || {} : {};
              if(get_module[i].module_type){
                let serviceList = module_data.serviceList || []; // 后续拓展为各模块key不一样判断
                let _serviceData = {},hasData = false;
                for(let j = 0; j < serviceList.length; j++){
                  if(serviceList[j].code){
                    _serviceData[serviceList[j].code] = serviceList[j];
                    if(!hasData) hasData = true;
                  }
                }
                _moduleArr.push(get_module[i].module_type);
                _moduleDataArr.push(hasData ? _serviceData : '')
              }
            }
            // 通过模块的indexOf _moduleArr中module_type数据集，判断是否存在某个模块
            // 存在模块再对应需求，判断之间的数据条件做替换
            // 不存在则添加is_enable = 0的默认模块
            for(let i = 0; i < default_module.length; i++){
              let module = default_module[i] || [];
              let hasIndex = _moduleArr.indexOf(module.module_type);
              if(hasIndex == -1){
                module.setting.is_enable = 0;
                modules.push(module);
              } else { // 存在保存过的模块
                if(module.module_type == 'USER-SERVICE'){
                  let module_data = module.module_data || {};
                  let serviceList = module_data.serviceList || [];
                  let serviceData = []
                  for(let j = 0; j < serviceList.length; j++){
                    let item = serviceList[j] || {};
                    let code = item.code;
                    if(code){ // 不存在模块，从默认数据里拿，存在的模块不做更改
                      if(!_moduleDataArr[hasIndex] || (_moduleDataArr[hasIndex] && !_moduleDataArr[hasIndex][code])){
                        item.is_enable = 0;
                      } else {
                        item = _moduleDataArr[hasIndex][code]
                      }
                      serviceData.push(item);
                    }
                  }
                  module.module_data.serviceList = serviceData;
                  modules.push(module);
                } else {
                  modules.push(get_module[hasIndex])
                }
              }
            }
            reqData.get_module = modules;
            return reqData;
          } else {
            return {}
          }
        },
        getArrDifference(arr1, arr2) {
          return arr1.concat(arr2).filter(function (v, i, arr) {
            return arr.indexOf(v.module_type) === arr.lastIndexOf(v.module_type);
          });

        },
        save(detail) {
            detail = JSON.parse(JSON.stringify(detail));
            let compPageInfo = detail.compPageInfo || {};
            let pageCompList = detail.pageCompList || [];
            this.$store.commit("setPageLoading", true)
            return this.$MainApi.saveUserCenter({
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