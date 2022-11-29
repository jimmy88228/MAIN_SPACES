<template>
 	<Modal
      class="material-modal-box flex flex-col hold-modal-zindex" 
      v-model="isShowModal"
      :width="width"
      :mask-closable="maskClosable"
      @on-visible-change="onVisibleChange"
      footer-hide
      transfer>
      <div class="content-material-modal material-modal">
        <div class="modal-header">
          <div class="modal-title bold">{{title}}</div>
          <div class="guide-box flex-c-c C_7f" v-if="fromType == 'distribute'">
            <div class="guide-item pointer" :class="{'active':curGuideIndex==0}" @click="curGuideIndex!=0?distribute():''">
              <span>1.选择主体</span>
              <span class="m-l-10">———</span>
            </div>
            <div class="guide-item pointer" :class="{'active':curGuideIndex==1}" @click="curGuideIndex!=1?distribute():''">
              <span class="m-r-10">———</span>
              <span>2.资源配置</span>
            </div>
          </div>
        </div>
        <div class="body flex1" :style="customBodyStyle">
          <transition-group name="fade" class="body-transform">
            <div class="transition-box select-trans-box flex-c-c flex-col" v-show="curGuideIndex==0" key="select">
              <Form :label-width="100" :model="formItem" ref="formDataRef" :rules="ruleValidate">
                  <div class="select-box flex-c-c flex-col">
                    <div class="select-item">
                      <FormItem label="主体类型" prop="subjectType">
                        <Select size="large" v-model="formItem.subjectType" class="base-320" @on-change="changeSubjectType">
                            <Option v-for="(item, index) in formItem.subjectTypeList" :key="index" :value="index">{{item.customer_type || ''}}</Option>
                        </Select>
                      </FormItem>
                    </div>
                    <div class="select-item">
                      <FormItem label="主体" prop="subject">
                          <Select size="large" v-model="formItem.subject" class="base-320" @on-change="changeSubject">
                              <Option v-for="item in formItem.subjectList" :key="item.customer_id" :value="item.customer_id">{{item.customer_name || ''}}</Option>
                          </Select>
                      </FormItem>
                    </div>
                    <div class="select-item">
                      <FormItem label="选择组织" prop="organize">
                          <Select size="large" v-model="formItem.organize" class="base-320" :loading="organizeLoading">
                              <Option v-for="item in formItem.organizeList" :key="item.target_id" :value="item.target_id">{{item.target_name || ''}}</Option>
                          </Select>
                      </FormItem>
                    </div>
                  </div>
              </Form>
            </div>
            <materialView
              ref="materialViewRef"
              class="transition-box"
              key="material"
              v-show="curGuideIndex==1" 
              :tabList="tabList"
              :type="type"
              :isLimitTab="isLimitTab" 
              :isShowTabs="isShowTabs" 
              :isShowClassify="isShowClassify" 
              :fromType="fromType" 
              :isMulti="isMulti"
              :extraParams="{ target_id: formItem.organize }"
              :selectData="selectData"></materialView>
          </transition-group>
        </div>
        <div class="footer-box" :class="{'m-b':fromType == 'distribute'}"> 
          <template v-if="fromType == 'distribute'">
            <Button v-if="curGuideIndex == 1" type="default" class="btn-footer" @click="distribute">上一步</Button>
            <Button v-if="curGuideIndex == 0" type="primary" class="btn-footer" @click="distribute">下一步</Button>
            <Button v-if="curGuideIndex == 1" type="primary" class="btn-footer m-l-10" @click="confirm">确认分配</Button>
          </template> 
          <template v-if="fromType != 'distribute'">
            <div class="flex-b-s">
              <div class="choose-tip flex-s-c" >
                <div class="" v-if="!isLimitTab && hasSelect">已选
                  <span class="m-l-10" v-for="(item, index) in tabList" :key="item.id" v-if="selectData[item.key] && selectData[item.key].length">{{item.tip}}&nbsp;<span style="color:#333;">{{selectData[item.key].length}}</span></span>
                </div>
              </div>
              <div>
              <Button type="default" class="btn-footer " @click="dismiss">取消</Button>
              <Button type="primary" class="btn-footer m-l-10" @click="confirm">确认分配</Button>
              </div>
            </div>
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
        default:900,
      },
      title: {
        type: String,
        default: "资源分配"
      },
      guideIndex:{
        type:Number,
        default: 0,
      },
      customBodyStyle:{
        type:String,
        default:"",
      },
      maskClosable: {
        type: Boolean,
        default: true
      },
      
      //VIEW组件 // isLimitTab, isShowTabs存在重复，后续调整
      showTab: { // 限制展示
        type: Array,
        default: ()=>{
          return [];
        }
      },
      isLimitTab: Boolean, // 是否限制展示tab, 改了方案，单个也不展示
      type: { //video,audio,article,psychic
        type: String,
        default: "video"
      },
      isShowTabs:{
        type: Boolean,
        default: false
      },
      isShowClassify:{
        type: Boolean,
        default: false
      },
      fromType:{ //distribute,content,material
        type: String,
        default: "" 
      },
      isMulti: {
        type: Boolean,
        default: ()=>true
      },
      cusTabList:{
        type: Array,
        default: ()=>[]
      }
    },
    data() {
      return {
        isShowModal: false,
        customerData: [],
        formItem:{
          subjectType:0,
          subject:0,
          organize:0,
          subjectTypeList:[],
          subjectList:[],
          organizeList:[],
        },
        curGuideIndex: 0,
        organizeLoading: false,
        ruleValidate: {
          subjectType: [
              {
                  required: true,
                  validator: this._checkInt,
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
        tempTabList: [{
          id:1,
          key:"video",
          tip: "视频",
          name:"视频内容",
        },{
          id:2,
          key:"audio",
          tip: "音频",
          name:"音频内容",
        },{
          id:3,
          key:"article",
          tip: "文章",
          name:"文章内容",
        },{
          id:4,
          key:"psychic",
          tip: "心理咨询师",
          name:"心理咨询师",
        }, {
          id:5,
          key:"course",
          tip: "课程任务",
          name:"课程任务",
        },
        {
          id:6,
          key:"tasteTest",
          tip: "趣味测试",
          name:"趣味测试",
        },
        {
          id:7,
          key:"exam",
          tip: "测验",
          name:"测验内容",
        }],
        selectData: {
          video: [],
          audio: [],
          article: [],
          psychic: [],
          course:[],
          tasteTest: [],
          exam: []
        },
      }
    },
    computed:{
      hasSelect(){
        let selectData = this.selectData || {};
        let selectNum = 0;
        for(let i in selectData){
          selectNum = selectNum + (selectData[i].length || 0)
        }
        return selectNum;
      },
      tabList(){
        if(this.cusTabList && this.cusTabList.length > 0){
          return this.cusTabList || [];
        } else {
          let tempTabList = this.tempTabList || [];
          let tabList = [];
          for(let i = 0; i < tempTabList.length; i++){
            let key = tempTabList[i].key;
            if(!this.showTab || this.showTab.length == 0  || this.showTab.indexOf(key) != -1){
              tabList.push(tempTabList[i]);
            }
          }
          return tabList;
        }
      }
    },
    methods: {
      init(){
        let guideIndex = this.guideIndex || 0;
        this.curGuideIndex = guideIndex || 0;
        this.$nextTick(()=>{
          if(this.curGuideIndex == 0){
            this.getCustomerGroup();
          } else if(this.curGuideIndex == 1){
            this.$refs.materialViewRef && this.$refs.materialViewRef.loadData();
          }
        })
      },
      initSelectData(selectData){
        try {

          this.selectData = JSON.parse(JSON.stringify(selectData));
        } catch (error) {}
      },
      showModal(options = {}) {
        let { selectData, reqParams } = options;
        reqParams = reqParams || {};
        this.isShowModal = true;
        this.initSelectData(selectData);
        let target_id = reqParams.target_id || 0;
        this.formItem.organize = target_id;
        this.init();
      },
      distribute(){
        if(this.curGuideIndex == 0 && !this.formItem.organize){
          this.$Message.warning("请选择主体组织");
          return;
        }
        this.curGuideIndex == 0 ? this.curGuideIndex+=1:this.curGuideIndex-=1;
        if(this.curGuideIndex == 1){
          this.$refs.materialViewRef && this.$refs.materialViewRef.changeTabs();
        }
      },
      confirm() {
        // 没有选择数据的情况下
        if(!this.hasSelect){
          if(this.isShowTabs && !this.isLimitTab){
            this.$Message.warning(`请选择内容`);
          } else {
            let tip = "";
            this.tabList.map((item)=>{
              if(item.key == this.type){
                tip = item.tip;
                return;
              }
            })
            this.$Message.warning(`请选择${tip}`);
          }
          return;
        }
        console.log("selectData", this.selectData)
        this.$emit("success",this.selectData, { target_id: this.formItem.organize });
        setTimeout(()=>{
          this.dismiss();
        }, 200)
      },
      dismiss() {
        this.isShowModal = false; 
      },
      onVisibleChange(bool){
        if(!bool){
          this.$emit('destroy');
        }
      },
      getCustomerGroup(){
        return this.$MainApi
        .getCustomerGroupType({
          data: {},
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || [];
            this.customerData = data;
            let subjectTypeList = JSON.parse(JSON.stringify(data));
            subjectTypeList.map((item)=>{
              delete item.customer_info;
            })
            this.formItem.subjectTypeList = subjectTypeList;
            this.changeSubjectType(0);
          }
        })
      },
      changeSubjectType(value){
        let subjectList = [];
        if(value || value == 0){
          subjectList = this.customerData[value].customer_info || [];
        }
        this.formItem.subjectList = subjectList;
      },
      changeSubject(value){
        this.getTargetList(value);
      },
      getTargetList(customerId){
        this.organizeLoading = true;
        return this.$MainApi
        .getTargetList({
          data: {
            is_all: 1,
            customer_ids: "",  //多主体下的组织
            customer_id: customerId, //单主体下的所有组织 
            getMultimediaNumber: 0
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || [];
            let items = data.items || [];
            this.formItem.organizeList = items;
          }
        }).finally(()=>{
          this.organizeLoading = false;
        })
      }
    },
    watch:{
    },
    mounted(){}
  }
</script>

<style lang="less" scoped>
.material-modal{
  position: relative;
  padding-bottom: 55px;
  .modal-header{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 80px;
    .modal-title{
      min-width: 132px;
      text-align: center;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #171717;
      line-height: 25px;
      position: absolute;
      top:50%;
      left:0px;
      transform: translateY(-50%);
    }
  }
  .guide-box{
    height: 80px;
    color:#7F7F7F;
  }
  .guide-item{
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 20px;
    &.active{
      color:#008ACB;
    }
  }
  .select-trans-box{
    padding-bottom: 50px;
  }
  .transition-box{
    height: 100%;
  }
  .select-item{
    width: 400px;
    margin-bottom: 25px;
  }
  .body{
    width:100%;
    height: 520px;
    position:relative;
    .body-transform{
      display: block;
      position: absolute;
      top:0px;
      left:0px;
      width:100%;
      height: 100%;
      overflow: hidden;
    }
  }
  .footer-box{
    position: absolute;
    left: 0px;
    bottom: 10px;
    width:100%;
    text-align: right;
    padding-left: 150px;
    &.m-b{
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
  .choose-tip{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8E8E8E;
    line-height: 22px;
  }
}
</style>
<style lang="less">
.content-material-modal{
  .body{
    .select-item{
      .ivu-select-dropdown{
        max-height:180px;
      }
    }
  }
}
  
</style>