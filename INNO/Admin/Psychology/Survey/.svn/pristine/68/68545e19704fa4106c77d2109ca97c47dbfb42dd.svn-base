<template>
  <div class="tag-label flex flex-wrap">
    <slot name="content" v-bind:tagData="tagData" v-bind:handleClose="handleClose">
      <div v-show="viewTagData.length == 0" class="_tip p-l-15">
        请选择
      </div>
      <template v-if="viewTagData.length>0">
        <div
          class="tag-box"
          v-for="item in viewTagData"
          :key="item.id">
          <span class="tag-name">
            {{nameKey && item[nameKey] || item.name || ""}}
          </span>
          <div @click="handleClose(item.id)" class="close pointer" v-if="!disabledDel && !item._disabled">
            <div class="row"></div>
            <div class="col"></div>
          </div>
        </div>
      </template>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    data:{
      type:Array|String,
      default:function(){
        return []
      }
    },
    nameKey:{
      type:String,
      default:"name"
    },
    'disabled-del':{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      isAnimate: false,
      tagData: [],
    }
  },
  computed: {
    viewTagData(){
      let tagData = this.tagData || [];
      let _arr = []
      for(let i = 0; i < tagData.length; i++){
        if(tagData[i].id >= 0){
          _arr.push(tagData[i]);
        }
      }
      return _arr;
    }
  },
  methods: {
    reset () {
      this.tagData = [];
    },
    handleClose (id) {
      const index = this.tagData.findIndex(item => item.id === id);
      this.tagData.splice(index, 1);
      this.$emit('del-tag', this.tagData);
    }
  },
  watch: {
    data: {
      handler (nV) {
            if(nV){
                if(nV instanceof Array){
                    this.tagData = nV.length > 0 ? [...nV] : [];
                } else {
                    this.tagData = [nV];
                }
            }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.tag-label{
  width: 100%;
  padding: 5px 0;
  .tag-box{
    position: relative;
    margin:2px 10px 2px 0;
  }
  .tag-name{
    padding: 8px 16px;
    border-radius: 2px;
    font-size: 14px;
    background: #EFFAFF;
    color: #008ACB;
  }
  .close{
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    transform: rotate(-45deg) translate(50%,50%);
    overflow: hidden;
    margin-right: 3px;
    margin-top: -4px;
  }
  .row{
    position: absolute;
    width: 70%;
    height: 1px;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .col{
    position: absolute;
    height: 70%;
    width: 1px;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
