<template>
  <div class="" style="width: 143px;">
    <p class="m-b-5">
      <Select v-model="linkInfo.code" size="small" style="width:100%;" clearable @on-change="changeLink">
        <Option v-for="item in linkSelect" :value="item.code" :key="item.code">{{item.name}}</Option>
      </Select>
    </p>
    <div class="">
      <template v-if="linkInfo.code == 'CUSTOM-URL'">
        <Input size="small" class="m-b-5" v-model="linkInfo.remark" placeholder="备注"></Input>
        <Input size="small" class="m-b-5" v-model="linkInfo.url" placeholder="跳转路径"></Input>
      </template>
      <template v-if="linkInfo.code == 'CONTENT-REPOSITORY' && linkInfo.type">
        <div class="flex-s-c text-flow">
          <Tag class="flex-s0" color="blue">{{typeInfo[linkInfo.type]}}</Tag>
          <a @click="changeLink(linkInfo.code,false)" class="text-flow" :title="curLinkTitle">{{curLinkTitle||"请选择"}}</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script> 
const BASE_INFO = {
  code: "",
  remark: "",
  id: "",
  data:[],
  url: "",
  type:"",
};
export default {
  props: {
    usabledLink: {
      type: Array,
      default : () => {
        return []
      }
    },
    disabledLink: {
      type: Array,
      default : () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default:() => {
        return {}
      }
    },
    itemInfo: {
      type: Object,
      default:() => {
        return {}
      }
    }
  },
  computed: {
    linkSelect(){
      let linkList = this.linkList || [];
      let _linkList = [];
      if(this.usabledLink.length > 0){// 可用的交集
        _linkList = linkList.filter((item)=>{ return this.usabledLink.indexOf(item.code) != -1})
      } else {
        _linkList = linkList || []
      }
      if(this.disabledLink.length > 0){
        _linkList = _linkList.filter((item)=>{ return this.disabledLink.indexOf(item.code) == -1})
      }
      _linkList = _linkList.filter(item=>{
        if(this.pageInfo.layout_type == "PSYC_HANDBOOK"){
          return item.code != 'SUBSCRIBE-COUNSEL'
        }else {
          return true
        }
      });
      return _linkList || []
    },
    linkInfo(){
      if(!this.itemInfo.link){
        this.itemInfo.link = JSON.parse(JSON.stringify(BASE_INFO));
      }
      return this.itemInfo && this.itemInfo.link || {}; 
    },
    curLinkTitle(){
      return this.linkInfo.data && this.linkInfo.data[0] && this.linkInfo.data[0].title || "";
    },
  },
  data(){
    return {
      linkList: [
        {
          code: "CUSTOM-URL",
          name: "自定义地址"
        },
        {
          code: "CONTENT-REPOSITORY",
          name: "内容库"
        },
        {
          code: "SUBSCRIBE-COUNSEL",
          name: "预约咨询"
        },
      ],
      typeInfo:{
        'video':"视频",
        'audio':"音频",
        'article':"文章",
      },
      selectedData:{}
    }
  },
  methods:{
    init(){
      for(let item in this.linkInfo){ //重置数据
        if(item!='code'){
          this.$set(this.linkInfo, item, BASE_INFO[item]);
        }
      }
      this.selectedData = this._deepCopy(this.MATERIAL_TYPE_DATA);
    },
    changeLink(code,isInit=true){
      isInit && this.init();
      if(code == 'CUSTOM-URL'){
        this.$set(this.linkInfo, "remark", "");
        this.$set(this.linkInfo, "id", "");
        this.$set(this.linkInfo, "url", "");
      }else if(code == 'CONTENT-REPOSITORY'){
        this.showMaterial();
      }else if(code == 'SUBSCRIBE-COUNSEL'){
        
      }
      console.log("changeLink",code, this.linkInfo)
    },
    showMaterial(){
      let type = this.linkInfo.type || "video";
      this.selectedData = this._deepCopy(this.MATERIAL_TYPE_DATA);
      if(this.linkInfo.data && this.linkInfo.data.length>0){ //检测是否有数据
        this.selectedData[type] = this.linkInfo.data || [];
      }
      let strucId = Number(this.pageQuery.strucId||0),
          extraParams = { structure_id:strucId == 0 ? [0]:[0,strucId]};
          this.$UIModule({
            mode: "material-modal",
            props: {
                title: "选择内容",
                isMulti: false,
                type,
                width:1080,
                guideIndex: 1,
                isShowTabs: true,
                isShowClassify: true,
                fromType:"customPages",
                showTab: ['video','audio', 'article']
                // type,
                // isMulti: false,
                // width:1080,
                // fromType:"customPages",
                // isShowTabs:true,
            },
            options: {selectedData:this.selectedData,extraParams}, //已选数据,接口传参
            success: (data,extra={}) => {
                this.selectedData = JSON.parse(JSON.stringify(data||{}));
                for(let i in this.selectedData){
                  let item = this.selectedData[i] || [];
                  if(item.length){
                    let id = item[0] && item[0].id || 0;
                    this.$set(this.linkInfo, "id", id);
                    this.$set(this.linkInfo, "type", i);
                    this.$set(this.linkInfo, "data", item);
                    break;
                  }
                }
                // data || (data = {});
                // let type = extra.type || "";
                // let arr = data[type] || [];
                // let id = arr[0] && arr[0].id || 0;
                // this.$set(this.linkInfo, "id", id);
                // this.$set(this.linkInfo, "type", type);
                // this.$set(this.linkInfo, "data", arr);
                console.log("success",extra,data,this.linkInfo); 
            },
          });
    }
  }
}
</script>

<style lang="less" scoped>
</style>