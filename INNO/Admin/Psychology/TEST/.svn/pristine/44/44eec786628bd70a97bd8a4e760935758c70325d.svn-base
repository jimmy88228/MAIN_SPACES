<template>
  <custom-modal ref="modal" :width="700" :isSlotFooter="true">
    <div class="class-linkage-cont">
      <div class="cont-l">
        <div class="flex-b-c cont-l-header">
          <p class="cont-title">选择导出范围：</p>
          <p><Button class="set-graduate" @click="setGraduate" :type="dataType == 1 ? 'primary' : 'default'">切换为毕业班级</Button></p>
        </div>
        <div class="cont-l-view">
          <classLinkageView 
          :multiple="multiple" 
          :dataType="dataType"
          ref="classLinkageViewRef" 
          :isCheckMode="true" 
          :islimitChild="islimitChild"
          @on-checkData="onCheckData"
          ></classLinkageView>
        </div>
      </div>
      <div class="cont-r">
        <div class="cont-title cont-r-header m-l-10">已选范围：</div>
        <div class="cont-r-view">
          <vue-scroll>
            <div class="p-r-20">
              <div class="" v-for="(sItem, sIndex) in selectCampusData" :key="sItem.campus_id" >
                <div class="p-5 p-l-10">{{sItem.campus_name}}</div>
                <div class="selected-item" v-for="(item, index) in sItem.selectData" :key="item.id" v-show="item.showed">
                  <div class="class-img">
                    <img :src="organizeSelectedDef" />
                  </div>
                  <p class="w-break flex-s-c">
                    <span v-if="item.class_id">{{item.grade}}</span>
                    <span>{{item.title || item.name}}</span>
                    <span v-if="item.class_id"> ({{item.school_year}}级)</span>
                  </p>
                  <div class="item-close pointer C_B2" @click="removeCheck(item, index)"><Icon :size="18" type="md-close" /></div>
                </div>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="default" @click="dismiss">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </custom-modal>
</template>

<script>
import classLinkageView from "../class-linkage-view/index.vue";
import organizeSelectedDef from "@/assets/images/organize.selected.def.png";
export default {
  props: {
    multiple: Boolean,
  },
  components: { classLinkageView },
  data(){
    return {
      checkData: [],
      islimitChild: true,
      dataType: 0 // 0正常数据， 1 毕业班级数据
    }
  },
  computed: {
    organizeSelectedDef(){
      return organizeSelectedDef
    },
    selectCampusData(){
      let selectCampusData = [], campusJson = {};
      this.checkData.map((item)=>{
        let campus_id = item.campus_id;
        let campus_name = item.campus_name;
        if(!campusJson[campus_id] && campusJson[campus_id]!= 0){
          campusJson[campus_id] = selectCampusData.length;
          selectCampusData.push({
            campus_id: campus_id,
            campus_name: campus_name,
            selectData: []
          })
        }
        try {
          selectCampusData[campusJson[campus_id]].selectData.push(item)
        } catch (error) {}
      })
      console.log("selectCampusData", selectCampusData)
      return selectCampusData;
    }
  },
  methods:{
    showModal(checkData = []){
      this.$refs["modal"] && this.$refs["modal"].show();
      this.dataType = 0;
      this.$refs["classLinkageViewRef"] && this.$refs["classLinkageViewRef"].getView(checkData)
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss();
    },
    setGraduate(){
      this.dataType = this.dataType ? 0 : 1;
      this.$nextTick(()=>{
        this.$refs["classLinkageViewRef"] && this.$refs["classLinkageViewRef"].getGradeData();
      })
    },
    removeCheck(item, index){
      this.$refs["classLinkageViewRef"] && this.$refs["classLinkageViewRef"].removeCheck(false, item)
    },
    onCheckData(data){
      this.checkData = data || [];
      console.log("data", data)
    },
    confirm(){
      this.$emit("confirm", JSON.parse(JSON.stringify(this.checkData)));
      this.dismiss();
    }
  }
}
</script>

<style lang="less" scoped>
.class-linkage-cont{
  display: flex;
  width: 100%;
  height: 570px;
  .cont-l{
    flex-shrink: 0;
    width: 50%;
    margin-right: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .cont-r{
    flex-shrink: 0;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .cont-title{
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
    display: flex;
    align-items: center;
  }
  .cont-l-header, .cont-r-header{
    padding: 10px  0px;
    flex-shrink: 0;
    height: 52px;
  }
  
  .cont-l-view{
    flex: 1;
    width: 100%;
    overflow: hidden;
    background: rgba(216,216,216,0.11);
    border-radius: 4px;
    border: 2px solid #F2F2F2;
    padding: 10px;
  }
  .cont-r-view{
    flex: 1;
    width: 100%;
    overflow: hidden;
    background: rgba(216,216,216,0.11);
    border-radius: 4px;
    border: 2px solid #F2F2F2;
    padding: 10px;
  }
}
.selected-item{
  position: relative;
  display: flex;
  padding: 10px;
  padding-right: 30px;
}
.class-img{
  width: 24px;
  height: 24px;
  position: relative;
  margin: 0px 5px;
  border-radius: 100%;
  overflow: hidden;
  background-color:#E1F3FD;
  img{
    width: 70%;
    height: 70%;
    display: block;
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.item-close{
  position:absolute;
  top: 50%;
  right: 0px;
  padding: 3px;
  transform: translateY(-50%);
}
// .set-graduate{
//   background: #FBFBFB;
//   border-radius: 4px;
//   border: 1px solid #F6F6F6;
// }
</style>