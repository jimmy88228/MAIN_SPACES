<template>
  <hold-layout :isFull="true" class="psychiatrist-detail-area">
    <rewrite-tabs :data="tabsViewData" :currTab="currTab" @changeTab="changeTab">
        <template slot="base">
            <baseForm ref="baseRef" :formData="formData" :specializeData="specializeData" :counselorServiceData="counselorServiceData" @saveCallback="loadData()"></baseForm>
        </template>
        <template slot="schedule">
            <scheduleForm ref="scheduleRef" :today="today" :scheduleData="scheduleData" @reLoad="loadData(true)"></scheduleForm>
        </template>
    </rewrite-tabs>
  </hold-layout>
</template>

<script>
import baseForm from "./base/index";
import scheduleForm from "./schedule/index";
export default {
  components: { baseForm, scheduleForm },
  data(){
    return {
      tabsData: [
        {
          name: 'base',
          label: '基础信息',
          disabled: false
        },
        {
          name: 'schedule',
          label: '坐班表',
          disabled: false
        }
      ],
      currTab: "",
      formData: {
        consultant_id:0,
        profile_picture: "",
        name: "",
        mobile_phone: "",
        qualification: "",
        good_at_skilled: [],
        personal_info: "",
        training_info: "",
        work_info: "",
        good_at_info: "",
        experience_hour: 0,
        experience_year: '',
        language: "",
        address:"",
        service_data: [],
      },
      specializeData: {},
      counselorServiceData: [],
      scheduleData: {},
      today: ""
    }
  },
  computed: {
    tabsViewData(){
      let tabsData = this.tabsData || [];
      for(let i = 0; i < tabsData.length; i++){
        if(tabsData[i].name == 'schedule'){
          tabsData[i].disabled = this.pageQuery.id ? false : true
        }
      }
      return tabsData;
    }
  },
  methods: {
    changeTab(name){
        this.currTab = name;
        // this.$refs[name +'Ref'] && this.$refs[name +'Ref'].initData();
    },
    getSpecializeInSkilled(){
      return this.$MainApi
        .specializeInSkilled({
          data: {},
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.specializeData = data.items || {}
          }
        });
    },
    getCounselorService(){
      return this.$MainApi
        .counselorService({
          data: {},
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.counselorServiceData = data.items || [];
          }
        });
    },
    loadData(is_Working = false){
      let pageQuery = this.pageQuery || {};
      let consultant_id = Number(pageQuery.id) || 0;
      if(!consultant_id){ return; }
        this.formData.consultant_id = consultant_id;
        if(!is_Working) {this.$store.commit("setPageLoading", true);}
        return this.$MainApi
        .psychologicalInfo({
          data: {
            consultant_id: consultant_id,
            is_Working: is_Working ? 1 : 0
          },
          other: {
            isErrorMsg: true
          }
        })
      .then((res) => {
        if (res.code) {
          let data = res.data || {};
          delete data.create_time;
          delete data.update_time;
          this.today = data.today;
          if(!is_Working){
            this.formData = data;
            this.scheduleData = this.setScheduleData(data.schedule_data);
          } else {
            this.scheduleData = this.setScheduleData(data.items);
          }
        }
      }).finally(()=>{
        this.$store.commit("setPageLoading", false);
      })
    },
    setScheduleData(data){
      if(data instanceof Array && data.length){
        let scheduleData = {};
        for(let i = 0; i < data.length; i++){
          let item = data[i] || [];
          for(let j = 0; j < item.length; j++){
            let schedule_day = item[j].schedule_day;
            if(!scheduleData[schedule_day]){
              scheduleData[schedule_day] = [];
            }
            // 增加剔除最后秒数
            if(item[j].begin_time){
              let beginTimeArr = item[j].begin_time.split(":");
              beginTimeArr.length > 2 && beginTimeArr.splice(-1, 1);
              this.$set(item[j], 'beginTime', beginTimeArr.join(":"))
            }
            if(item[j].end_time){
              let endTimeArr = item[j].end_time.split(":");
              endTimeArr.length > 2 && endTimeArr.splice(-1, 1);
              this.$set(item[j], 'endTime', endTimeArr.join(":"))
            }
            this.$set(item[j], 'itemId', item[j].beginTime + "-" + item[j].endTime);
            scheduleData[schedule_day].push(item[j])
          }
        }
        console.log("scheduleData", scheduleData)
        return scheduleData;
      }
      return {}
    }
  },
  mounted(){
    this.getSpecializeInSkilled();
    this.getCounselorService().finally(()=>{
      this.loadData();
    })
  }
}
</script>