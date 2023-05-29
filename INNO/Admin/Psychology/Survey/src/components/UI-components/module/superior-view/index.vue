<template>
  <custom-modal ref="modal" class="hold-modal-zindex" :isSlotHeader="true" :closable="true" :isSlotFooter="true" :width="400">
    <div slot="header">{{ title || '选择上级' }}</div>
    <div class="superior-cont">
      <div class="superior-cont-stay">
        <vue-scroll class="superior-tree" >
          <div>
            <Tree :data="superiorData" :multiple="false" :load-data="loadChildrenData" @on-select-change="selectChange"></Tree>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div slot="footer" class="flex-b-c">
      <div class="m-r-10">
        <div v-if="chooseItem.id">已选择：{{chooseItem.title}}</div>
      </div>
      <div class="flex">
        <Button class="operate-btn m-r-5" @click="dismiss">取消</Button>
        <Button class="operate-btn" type="primary" @click="onOk">添加</Button>
      </div>
    </div>
  </custom-modal>
</template>

<script>
export default {
  name: "superior-view",
  props: {
    title: String,
    chooseType: {
      type: Array,
      default(){
        return ['area', 'street'] // area, street
      }
    }
  },
  data(){
    return {
      superiorData: [],
      chooseItem: {},
    }
  },
  methods: {
    showModal() {
      this.$refs["modal"] && this.$refs["modal"].show();
      this.initData();
    },
    initData(){
      let _structureType = this._structureType || "";
      switch(_structureType){
        case "edu_customer": //主体
          this.$MainApi.adminAreaData({
              data: {
                  main_id: this._mainId,
              },
          }).then((res)=>{
            if(res.code){
              let data = res.data || [];
              let items = data.items || [];
              items.map((item)=>{
                item.title = item.area_name;
                item.id = item.area_id;
                if(this.chooseType.indexOf('street') != -1){
                  item.loading = false;
                  item.children = [];
                }
              })
              this.superiorData = items;
            }
          })
          break;
        case "edu_area": // 区
          this.superiorData = [{
            title: this._structureName,
            loading: false,
            structure_type: "edu_area",
            id: this._structureId,
            children: []
          }]
          break;
      }
    },
    loadChildrenData(selectItem, callback){
      if(!selectItem.id){
        callback([]);
        return;
      }
      return this.$MainApi.adminStreetData({
            data: {
                area_id: selectItem.id,
            },
        }).then((res)=>{
          if(res.code){
            let data = res.data || [];
            let items = data.items || [];
            items.map((item)=>{
              item.title = item.street_name;
              item.id = item.street_id;
            })
            if(!items.length){
              callback([{
                disabled: true,
                title: "暂无数据",
                id: 0
              }]);
            } else {
              callback(items);
            }
          } else {
            callback([]);
          }
        }).catch(()=>{
          callback([]);
        })
    },
    selectChange(selection, item){
      this.chooseItem = item;
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss();
    },
    onOk() {
      if(!this.chooseItem.id){
        this.$Message.warning("请选择上级");
      }
      this.dismiss()
      console.log("chooseItem", this.chooseItem)
      this.$emit("success", [this.chooseItem]);
    },
    onCancel() {
      this.dismiss()
      this.$emit("fail");
    },
  }
}
</script>

<style lang="less" scoped>
.superior-cont{
  max-height: 300px;
  display: flex;
  width: 100%;
}
.superior-cont-stay{
  width: 100%;
  flex: 1;
}
.superior-tree{
  padding: 10px;
  width: 100%;
  height: 100%;
  /deep/.ivu-tree-empty{
    text-align: center;
  }
  /deep/.ivu-tree-title{
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
}

</style>