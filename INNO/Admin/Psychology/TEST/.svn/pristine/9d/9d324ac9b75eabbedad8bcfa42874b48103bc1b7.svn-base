import Vue from "vue";

const GradeHelper = new Vue({
  data:{
    gradeList: {},
    gradeData: {}
  },
  methods: {
    schoolInitGrade(){
      this.$MainApi.schoolInitGrade({
        data: {}
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let items = data.items || {};
          this.gradeData = this.installData(items)
          this.gradeList = items;
        }
      })
    },
    installData(data = {}){
      data = JSON.parse(JSON.stringify(data)) || {}
      for(let i in data){
        let typeData = data[i] || [];
        typeData.map((item)=>{
          delete item.sort;
          item.count = '';
        })
      }
      return data;
    }
  },
  mounted(){
    this.schoolInitGrade();
  }
})

export default GradeHelper;