<template>

  <div class="organize-list fs-14">
    <div class="organize-item" v-for="(item, index) in organizeList" :key="index">
      <div class="item-name invalid">{{item.name}}</div>
      <div class="item-cont text-c">
        <p class="cont-tit invalid">已参与{{item.name}}</p>
        <p class="cont-num bold fs-32">{{item.already}}</p>
      </div>
      <div class="flex-a-c text-c">
        <div class="item-foot">
          <p class="foot-tit invalid">应参与{{item.name}}</p>
          <p class="foor-num">{{item.count}}</p>
        </div>
        <Divider type="vertical" />
        <div class="item-foot">
          <p class="foot-tit invalid">未参与{{item.name}}</p>
          <p class="foot-num">{{item.notIn}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      organizeList: []
    }
  },
  methods:{
    onLoadData(){
      let activityId = Number(this.pageQuery.activityId);
      let type = this.pageQuery.type;
      if(!activityId) return Promise.reject();
      let schoolId = Number(this.pageQuery.schoolId);
      let req = type == 'task' ? 'assessmentTaskSchedule' : 'appraisalSchedule';
      let reqData = { activityid: activityId };
      if(type == 'task') reqData.school_id = schoolId;
      this.$MainApi[req]({
        data: reqData,
        other: {
          isShowLoad: true
        }
      }).then((res)=>{
        if(res.code){
          let data = res.data || [];
          this.organizeList = data;
        }
      })
    },
    getProgressDetail(){

    }
  },
  mounted(){
    this.onLoadData();
  }
}
</script>

<style lang="less" scoped>
  .organize-list{
    font-family: PingFangSC-Regular;
    .organize-item{
      background-color:#fff;
      border-radius: 12px;
      padding:18px;
      display: inline-block;
      margin-right:28px;
      margin-bottom:25px;
      cursor: pointer;
      .item-name{
        margin-bottom: 11px;
      }
      .item-cont{
        min-height:100px;
        .cont-tit{
          margin-bottom: 6px;
        }
        .cont-num{
          font-family: Helvetica;
        }
      }
      .item-foot{
        width: 120px;
        .foot-tit{
          margin-bottom: 5px;
        }
      }
    }
  }
</style>