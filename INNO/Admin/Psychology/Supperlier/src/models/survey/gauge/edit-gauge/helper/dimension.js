import Vue from "vue";

const dimensionHelper = new Vue({
  data: {
    dimensionData: [],
    loadDataHold: null
  },
  methods: {
    loadData(modelId) {
        if (!modelId) return Promise.reject();
        if (this.loadDataHold) {
            return this.loadDataHold;
        }
        this.loadDataHold = this.$MainApi
            .scaleDimensionInfo({
                data: {
                    id: modelId,
                },
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
                                // description: data.items[i].description,
                                dimension_name: data.items[i].dimension_name,
                                id: data.items[i].id,
                                model_id: data.items[i].model_id
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
    }
  }
})

export default dimensionHelper;