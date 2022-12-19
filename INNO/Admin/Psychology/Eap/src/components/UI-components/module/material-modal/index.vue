<template>
 	<Modal
      class="material-modal-box flex flex-col" 
      v-model="isShowModal"
      :width="width"
      :mask-closable="maskClosable"
      @on-visible-change="onVisibleChange"
      footer-hide
      transfer>
      <div class="material-modal">
        <div class="guide-box flex-c-c C_7f" v-if="fromType == 'distribute'">
          <div class="guide-item pointer" :class="{'active':curGuideIndex==0}" @click="curGuideIndex!=0?distribute():''">
            <span>1.选择主体</span>
            <span>———</span>
          </div>
          <div class="guide-item pointer" :class="{'active':curGuideIndex==1}" @click="curGuideIndex!=1?distribute():''">
            <span>———</span>
            <span>2.资源配置</span>
          </div>
        </div>
        <div class="body flex1" :style="customBodyStyle">
          <transition-group name="fade" >
            <div class="transition-box select-trans-box flex-c-c flex-col" v-show="curGuideIndex==0" key="select">
              <Form :label-width="100" :model="formItem" ref="formDataRef" :rules="ruleValidate">
                  <div class="select-box flex-c-c flex-col">
                    <div class="select-item">
                      <FormItem label="主体类型" prop="subjectType">
                        <Select v-model="formItem.subjectType" class="base-300-44" style="height:44px;">
                            <Option v-for="item in formItem.subjectTypeList" :key="item.id" :value="item.id">{{item.name || ''}}</Option>
                        </Select>
                      </FormItem>
                    </div>
                    <div class="select-item">
                      <FormItem label="主体" prop="subject">
                          <Select v-model="formItem.subject" class="base-300-44" style="height:44px;">
                              <Option v-for="item in formItem.subjectList" :key="item.id" :value="item.id">{{item.name || ''}}</Option>
                          </Select>
                      </FormItem>
                    </div>
                    <div class="select-item">
                      <FormItem label="选择组织" prop="organize">
                          <Select v-model="formItem.organize" class="base-300-44" style="height:44px;">
                              <Option v-for="item in formItem.organizeList" :key="item.id" :value="item.id">{{item.name || ''}}</Option>
                          </Select>
                      </FormItem>
                    </div>
                  </div>
              </Form>
            </div>
            <materialView
              ref="materialView"
              key="material"
              v-show="curGuideIndex==1" 
              :type="type" 
              :isShowTabs="isShowTabs" 
              :isShowClassify="isShowClassify" 
              :fromType="fromType" 
              :isMulti="isMulti"
              :selectedData="selectedData"
              :extraParams="extraParams" 
              :showTabs="showTabs"
              :classifyId="classifyId"></materialView>
          </transition-group>
        </div>
        <div class="footer-box" :class="{'m-b':fromType == 'distribute'}"> 
          <template v-if="fromType == 'distribute'">
            <Button v-if="curGuideIndex == 1" type="default" class="btn-footer" @click="distribute">上一步</Button>
            <Button v-if="curGuideIndex == 0" type="primary" class="btn-footer" @click="distribute">下一步</Button>
            <Button v-if="curGuideIndex == 1" type="primary" class="btn-footer m-l-10" @click="confirm">确认分配</Button>
          </template> 
          <template v-if="fromType != 'distribute'">
            <Button type="primary" class="btn-footer" @click="confirm">确定</Button>
            <Button type="default" class="btn-footer m-l-10" @click="dismiss">取消</Button>
          </template> 
        </div>
      </div>
      
  </Modal>
</template>

<script>
import materialView from '@/components/view-components/material-view/index.vue';
  export default {
    components: {
      materialView,
    },
    props: {
      width:{
        type:Number,
        default:600,
      },
      customBodyStyle:{
        type:String,
        default:"",
      },
      maskClosable: {
        type: Boolean,
        default: ()=>true
      },  
      //VIEW组件
      type: { //video,audio,article,
        type: String,
        default: "video"
      },
      isShowTabs:Boolean,
      showTabs: {
        type: Array,
        default:()=>[]
      },
      isShowClassify:Boolean,
      fromType:{ //distribute,content,material
        type: String,
        default: "" 
      },
      isMulti:Boolean,
      classifyId:{
        type:Number,
        default:0
      }
    },
    data() {
      return {
        isShowModal: false,
        formItem:{
          subjectType:0,
          subject:0,
          organize:0,
          subjectTypeList:[],
          subjectList:[],
          organizeList:[],
        },
        curGuideIndex:-1,
        extraParams:{},
        ruleValidate: {
          subjectType: [
              {
                  required: true,
                  validator: this._checkThanInt,
                  trigger: "blur",
                  message: "请选择主体类型",
              },
          ],
          subject: [
              {
                  required: true,
                  validator: this._checkThanInt,
                  trigger: "blur",
                  message: "请选择主体",
              },
          ],
          organize: [
              {
                  required: true,
                  validator: this._checkThanInt,
                  trigger: "blur",
                  message: "请选择组织",
              },
          ],
        },
        selectedData:{
          video: [],
          audio: [],
          article: [],
          course: []
        },
      }
    },
    methods: {
      initSelectData(data){
        if(data){
          try {
            data = JSON.parse(JSON.stringify(data)) || {};
            for(let i in data){
              if(data[i] instanceof Array){
                this.$set(this.selectedData, i, data[i]);
              }
            }
          } catch (error) {
          }
        }
      },
      showModal(options={}) {
        this.isShowModal = true;
        if(options && options.selectedData) {
          this.initSelectData(options.selectedData);
        }
        this.extraParams = options && options.extraParams||{};
      },
      distribute(){ 
        this.curGuideIndex == 0 ? this.curGuideIndex+=1:this.curGuideIndex-=1;
      },
      confirm() {
        this.$emit("success",this.selectedData,{type:this.$refs.materialView.getCurType()});
        this.dismiss();
      },
      dismiss() {
        this.isShowModal = false; 
      },
      onVisibleChange(bool){
        if(!bool){
          this.$emit('destroy');
        }
      },
    },
    watch:{
      fromType:{
        handler(nV){
          if(nV == 'distribute'){
            this.curGuideIndex = 0
          }else{
            this.curGuideIndex = 1;
          }
        },immediate:true
      },
    }
  }
</script>

<style lang="less" scoped>
.material-modal{
  position: relative;
  // padding: 20px;
  padding-bottom: 55px;
  .guide-box{
    height: 80px;
  }
  .guide-item{
    &.active{
      color:#008ACB;
    }
  }
  .select-trans-box{
    padding-bottom: 100px;
  }
  .transition-box{
    height: 100%;
  }
  .select-item{
    width: 400px;
    margin-bottom: 50px;
  }
  .body{
    height: 560px;
  }
  .footer-box{
    position: absolute;
    right: 30px;
    bottom: 10px;
    &.m-b{
      left: 50%;
      right: unset;
      transform: translateX(-50%);
    }
  }
  .btn-footer{
    width: 100px;
    height: 34px;
    // background: #42A3DB;
    // border-radius: 2px;
    // position: absolute;
    // bottom: 34px;
    // left: 50%;
    // transform: translateX(-50%);
  }
}
</style>