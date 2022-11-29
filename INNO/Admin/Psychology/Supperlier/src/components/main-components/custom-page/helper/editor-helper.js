import Vue from "vue";
const editorHelp = new Vue({
    data:{
        editorData: [],
        editData: {},
        currentIndex: -1
    },
    computed: {
    },
    methods: {
        initData(data){
            console.log("event buds", data)
            if(data instanceof Array){
                this.editorData = data || [];
            }
            return this.editorData
        },
        getEditData(currentIndex){

        },
        getCurrentData(editorData, currentIndex){
            if(editorData instanceof Array){
                this.currentData = editorData[currentIndex] || {};
            }
            this.currentIndex = currentIndex;
            return this.currentData
        }
    },
    watch:{
    //   editorData: {
    //       handler(nV){
    //           if(this.currentIndex != -1 && nV instanceof Array){
    //               this.currentData = nV[0] || {};
    //           }
    //       },
    //       immediate: true
    //   },
    //   currentIndex:{
    //       handler(nV, oV){

    //       },
    //       immediate: true
    //   } 
    }
})


export default editorHelp;