<template>
  <div class="problems-view-area">
    <div class="view-cont">
      <div class="view-detail flex-e-c" v-if="problemsInfo.status != 1">
        <div class="edit-area" :class="isEdit ? 'editIng' : ''">
          <div class="edit-area-move">
            <div @click="changeState" class="edit-point flex-e-c">
              <Icon type="md-settings" class="m-r-5"/>编辑题目
            </div>
            <div class="edit-point flex-b-c">
              <Button @click.stop="onClearData" style="height:100%;width:80px;padding:0;" class="m-r-10" type="default">删除全部</Button>
              <Button @click="changeState" style="width:50%;height:100%;" type="primary">保存编辑</Button>
            </div>
          </div>
        </div>
      </div>
      <vue-scroll ref="problemsViewScroll" class="problems-view" >
      <!-- <div class="problems-view" v-bar> -->
        <div class="problems-list">
          <draggable class="draggable-box" :list="problemsData" v-bind="dragOptions" :group="{name:'itemBox'}" @start="dragStart" @end="dragEnd" @change="dragChange" handle=".handle-move">
            <div class="problems-item-area" :id="'problemsItem' + index" v-for="(item, index) in problemsData" :key="index" @click="selectModule(index)">
              <moduleContain :selected="operateInfo.currIndex == index">
                <problemsItem :itemInfo="item" :isEdit="isEdit"></problemsItem>
              </moduleContain>
              <div class="handle-area" v-if="isEdit" @click.stop="_func">
                <Poptip
                placement="left"
                confirm
                title="确定删除该模块么？"
                @on-ok="removeModule(index)">
                    <a class="handle-remove" ><Icon size="20" type="ios-trash" /></a>
                </Poptip>
                <a class="handle-move"><Icon size="20" type="ios-menu"  /></a>
              </div>
            </div>
          </draggable>
          <div class="empty-area" v-if="!problemsData || problemsData.length == 0">空空如也~请新建题目</div>
        </div>
      <!-- </div> -->
      </vue-scroll>
      <div class="problems-operate" v-if="problemsInfo.status != 1">
        <Button class="operate-btn" @click="importData">批量新建</Button>
        <Button class="operate-btn" @click="createData">新建题目</Button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import problemsItem from "./component/problems-item/index.vue";
import moduleContain from "./component/container/module-contain.vue";
export default {
  components: {
    draggable,
    moduleContain,
    problemsItem
  },
  props: {
    operateInfo: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    problemsInfo: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    problemsData: {
      type: Array,
      default:()=>{
        return []
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        chosenClass: "chosen",
      };
    },
  },
  data(){
    return {
      isEdit: false,
      defaultData: {
        id: 0,
        question: "",
        picture: "",
        sort: 0,
        rest_questions: 0,
        option_data: []
      }
    }
  },
  methods:{
    onClearData(){
      this.modalTipPop({content:"是否要删除全部题目"}).then(()=>{
        this.$emit('onClearData');
      })
    },
    selectModule(index){
      if(this.operateInfo.currIndex != index){
        this.operateInfo.currIndex = index;
      }
    },
    dragChange(e) {
      if (e.added) {
        // 添加时更新选中项
        let newIndex = e.added.newIndex;
        if(this.operateInfo.currIndex < 0){
          this.operateInfo.currIndex = newIndex;
        } else if (!(this.operateInfo.currIndex < newIndex)) {
          this.operateInfo.currIndex += 1;
        }
      }
    },
    dragStart(e) {
      this.selectModule(e.oldIndex);
    },
    dragEnd(e) {
      this.selectModule(e.newIndex);
    },
    changeState(){
      this.isEdit = !this.isEdit;
    },
    removeModule(index){
      if(index || index == 0){
        this.problemsData.splice(index, 1);
        this.operateInfo.currIndex = -1;
      }
    },
    importData(){
      this.$emit("importData");
    },
    createData(){
      let defaultData = JSON.parse(JSON.stringify(this.defaultData || {}));
      this.problemsData.push(defaultData);
      if(this.problemsData.length == 1 && this.operateInfo.currIndex == -1){
        this.operateInfo.currIndex = 0;
      }
      this.scrollIntoView(this.problemsData.length - 1);
    },
    scrollIntoView(index){
      if(index || index == 0){
        this.$nextTick(()=>{
          if(this.$refs["problemsViewScroll"]){
            let problemsViewScroll = this.$refs["problemsViewScroll"];
            let offsetTop = (problemsViewScroll.$el && problemsViewScroll.$el.offsetTop) || 0;
            let currItem = document.getElementById('problemsItem' + index);
            let scroll = currItem.offsetTop - offsetTop;
            problemsViewScroll.scrollTo({y: scroll}, 300)
          }
        })
      }
    }
  },
  watch:{
    'operateInfo.currIndex':{
      handler(nV, oV){
        this.scrollIntoView(nV);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.problems-view-area{
  width: 357px;
  height: 100%;
  background:#fff;
  margin: 0px 15px;
  .view-cont{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .view-detail{
    padding: 15px;
  }
  .edit-area{
    position: relative;
    width: 100%;
    height: 30px;
    overflow: hidden;
    cursor: pointer;
  }
  .edit-area-move{
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top:0px;
    left: 0px;
    transition: transform .35s;
  }
  .edit-point{
    width:100%;
    height: 100%;
    flex-shrink: 0;
    padding: 1px;
  }
  .editIng{
    .edit-area-move{
      transform: translateX(-100%);
    }
  }
  .problems-view{
    flex: 1;
    // overflow: unset !important;
  }
  .problems-list{
    padding: 10px;
    padding-right: 15px;
  }
  .problems-item-area{
    position:relative;
  }
  .handle-area{
    z-index: 2;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    a {
      display: inline-block;
      padding: 5px;
      color:#D5D2D3;
    }
  }
  .handle-move{
    cursor: move;
  }
  .problems-operate{
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
  }
  .operate-btn{
    width: 156px;
    height: 44px;
    background-color:#FAF6FC;
    border: 0 none;
  }
}
</style>