import Vue from "vue";

const dimensionHelper = new Vue({
  data: {
    dimensionData: [],
    loadDataHold: null,
    typeData:{
        gauge:{
            name:"维度",
            reqUrl:"scaleDimensionInfo",
            nameKey:"dimension_name",
            saveUrl:"scaleDimensionSave",
        },
        funnyTest:{
            name:"类型",
            reqUrl:"tasteTestTypeList",
            nameKey:"name",
            saveUrl:"tasteTestTypeSave",
        },
    }
  },
  methods: {
    loadData(id,type) {
        console.log('list-data,loaddata',id,type)
        if (!id) return Promise.reject();
        if (this.loadDataHold) {
            return this.loadDataHold;
        }
        this.loadDataHold = this.$MainApi[this.typeData[type].reqUrl]({
                data:this.getParams(id,type),
                other: {
                    isErrorMsg: true
                  }
            })
            .then((res) => {
                if (res.code) {
                    let data = res.data || {};
                    let items = [];
                    if(data.items instanceof Array){
                        for(let i = 0; i < data.items.length; i++){
                            items.push({
                                ...this.getData(data.items[i],type)
                            })
                        }
                    }
                    this.dimensionData = items;
                }
            }).finally(()=>{
                setTimeout(()=>{
                    this.loadDataHold = null;
                }, 200)
            })
        return this.loadDataHold;
    },
    getParams(id,type){
        let params = {};
        switch (type) {
            case "gauge":
                params={id};
                break;
            case "funnyTest":
                params={
                    testId: id,
                    type: "dimension",
                    page: 1,
                    pageSize: 1,
                    isAll: 1
                };
                break;
            
            default:
                break;
        }
        return params
    },
    getData(item,type){
        let data = {};
        switch (type) {
            case "gauge":
                data={
                    id: item.id||0,
                    dimension_name: item.dimension_name||"",
                    nameKey:this.typeData[type].nameKey,
                    model_id: item.model_id||0,
                };
                break;
            case "funnyTest":
                data={
                    id: item.id||0,
                    testId:item.test_id||0,
                    name: item.name||"",
                    nameKey:this.typeData[type].nameKey,
                    remark:item.remark||"",
                    type: "dimension"
                };
                break; 
            default:
                break;
        }
        return data
    },
  }
})

export default dimensionHelper;