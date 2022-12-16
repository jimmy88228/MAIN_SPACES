<template>
  <Modal v-model="isShowModel" :width="700" class="upload-modal">
    <div class="" slot="header">
      选择素材-{{isMulti ? '多选' : '单选'}}模式
    </div>
    <div class="">
       <Tabs v-model="selectTabs" name="material-tab">
        <TabPane label="图片素材" name="IMAGE">
          <materialView :extraParams="extraParams" ref="materialViewRef" type="IMAGE" :chooseIds="chooseIds" :isMulti="isMulti" @chooseChange="chooseChange"></materialView>
        </TabPane>
        <!-- <TabPane label="视频素材" name="VIDEO">
          <materialView type="VIDEO"></materialView>
        </TabPane> -->
    </Tabs>
    </div>
    <div class="" slot="footer">
      <Button @click="isShowModel = false">取消</Button>
      <Button type="primary" @click="confirmChoose">确定</Button>
    </div>
  </Modal>
</template>

<script>
import materialView from "./material.vue";
export default {
  name: "uploadModal",
  components: { materialView },
  props: {
    isMulti:{
      type: Boolean,
      default: false
    },
    extraParams: {
        type: Object,
        default: ()=>{
            return {}
        }
    }
  },
  data(){
    return {
      selectTabs: "IMAGE",
      isShowModel: false,
      chooseIds: [],
    }
  },
  methods: {
    showModal(params = {}){
      let chooseIds = params.chooseIds;
      this.isShowModel = true;
      if(typeof(chooseIds) == "string"){
        chooseIds = [chooseIds]
      }
      this.chooseIds = chooseIds;
      this.$refs["materialViewRef"].initData(chooseIds);
    },
    chooseChange(chooseIds){
      this.chooseIds = chooseIds;
    },
    confirmChoose(){
      let chooseIds = (this.isMulti ? this.chooseIds : this.chooseIds[0]) || '';
      console.log('confirmChoose',chooseIds)
      let verify = true;
      if(chooseIds instanceof Array){
        if(!chooseIds[0]){
          verify = false;
        }
      }else if(!chooseIds){
        verify = false;
      }
      if(!verify){
        this.$Message.error("请至少选择一张图片");
        return
      }
      this.$emit("success", chooseIds);
      this.isShowModel = false;
    }
  }
}
</script>
<style>

</style>