<template>
  <div class="resource-detail">
    <div class="resource-detail-header flex-b-c">
      <div>{{targetInfo.name}}</div>
      <div><Button type="primary" @click="getResource">分配资源</Button></div>
    </div>
    <div class="resource-detail-content">
      <Tabs :value="tabKey" @on-click="changeTabs">
        <TabPane label="视频内容" name="video">
          <contentView :isView="true" ref="resource-video" type="video"></contentView>
        </TabPane>
        <TabPane label="音频内容" name="audio">
          <contentView :isView="true" ref="resource-audio" type="audio"></contentView>
        </TabPane>
        <TabPane label="文章内容" name="article">
          <contentView :isView="true" ref="resource-article" type="article"></contentView>
        </TabPane>
        <TabPane label="心理咨询师" name="psychic">
          <contentView :isView="true" ref="resource-psychic" type="psychic"></contentView>
        </TabPane>
        <TabPane label="课程任务" name="course">
          <contentView :isView="true" ref="resource-course" type="course"></contentView>
        </TabPane>
        <TabPane label="趣味测试" name="tasteTest">
          <contentView :isView="true" ref="resource-tasteTest" type="tasteTest"></contentView>
        </TabPane>
      </Tabs>
    </div>
    
  </div>
</template>

<script>
import contentView from "@/components/view-components/material-view/view/content-view.vue";
import StringUtil from "@/helper/utils/string-util.js";
export default {
  components: { contentView },
  data() {
    return {
      targetInfo: {},
      tabKey: "video",
      materialData: {},
      reqKey: {
        video: "distributeVideo",
        audio: "distributeAudio",
        article: "distributeArticle",
        psychic:"distributeConsultant",
        course:"courseManagementAllocation",
        tasteTest: "tasteTestAllocation"
      },
      formData: {

      },
    }
  },
  methods: {
    init(){
      let pageQuery = this.pageQuery || {};
      this.targetInfo = {
        id: pageQuery.id,
        name: pageQuery.name
      }
      this.changeTabs('video');
    },
    changeTabs(name){
      if(this.tabKey != name && name) this.tabKey = name;
      this.$refs['resource-' + name] && this.$refs['resource-' + name].refeshData({
        show_type: 'all',
        target_id: this.targetInfo.id || 0
      });
    },
    getResource(){
      this.$UIModule({
        mode: "material-modal",
        props: {
          guideIndex: 1,
          isShowTabs: true,
          isShowClassify: true,
          type: this.tabKey,
          showTab: ['video', 'audio', 'article', 'psychic', 'course', 'tasteTest'],
        },
        options: {
          reqParams: {
            target_id: this.targetInfo.id
          }
        },
        success:(data)=>{
          console.log("data", data.psychic)
          let reqCallback = [];
          if(data.video && data.video.length > 0){
            reqCallback.push(this.setResource('video', StringUtil.getArrIdsStr(data.video)));
          }
          if(data.audio && data.audio.length > 0){
            reqCallback.push(this.setResource('audio', StringUtil.getArrIdsStr(data.audio)));
          }
          if(data.article && data.article.length > 0){
            reqCallback.push(this.setResource('article', StringUtil.getArrIdsStr(data.article)));
          }
          if(data.psychic && data.psychic.length > 0){
            reqCallback.push(this.setResource('psychic', StringUtil.getArrIdsStr(data.psychic)));
          }
          if(data.course && data.course.length > 0){
            let course = data.course.filter(item=>{return item.get_distribution_count==0}); 
            reqCallback.push(this.setResource('course', StringUtil.getArrIdsStr(course).split(",")));
          }
          if(data.tasteTest && data.tasteTest.length > 0){
            let tasteTest = data.tasteTest.filter(item=>{return item.get_distribution_count==0}); 
            reqCallback.push(this.setResource('tasteTest', StringUtil.getArrIdsStr(tasteTest).split(",")));
          }
          if(reqCallback.length > 0){
            Promise.all(reqCallback).then(()=>{
              this.$Message.success("操作成功");
            }).catch(()=>{
              this.$Message.warning("操作失败");
            }).finally(()=>{
              this.changeTabs(this.tabKey);
            })
          }
        }
      })
    },
    getArrIds(arr, idKey = 'id'){
      let str = ""
      if(arr instanceof Array){
        arr.map((item)=>{
          let id = item[idKey];
          if(id){
            str = str ? str + "," + id : id
          }
        })
      }
      return str;
    },
    setResource(type, data){
      let req = this.reqKey[type] || "";
      if(!req || !this.targetInfo.id) return;
      return this.$MainApi[req]({
          data: {
            target_id: this.targetInfo.id,
            add_ids: data,
            del_ids: ""
          },
        })
    },
  },
  mounted(){
    this.init();
  }
};
</script>

<style lang="less" scoped>
.resource-detail{
  display: flex;
  flex-direction: column;
  height:100%;
  .resource-detail-header{
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #171717;
    line-height: 25px;
    padding-left: 10px;
    margin-bottom: 15px;
  }
}
</style>
<style lang="less">
.resource-detail{
  .resource-detail-content{
    flex: 1;
    overflow: hidden;
    .ivu-tabs{
      width:100%;
      height:100%;
      display: flex;
      flex-direction: column;
      position:relative;
      padding-top: 36px;
      .ivu-tabs-bar{
        position:absolute;
        top:0px;
        width:100%;
        left:0px;
      }
      .ivu-tabs-ink-bar{
        display: none;
      }
      .ivu-tabs-content{
        flex: 1;
        height: 100%;
        .ivu-tabs-tabpane{
          height:100%;
        }
      }
    }
  }
}
  
</style>