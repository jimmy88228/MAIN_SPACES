<template>
    <div class="material-view">
        <div class="flex-b-c p-15">
            <div>
                <upload :type="type" :extraParams="extraParams" @uploadSuccess="uploadSuccess" @uploadProgress="uploadProgress" :isMulti="isMulti"></upload>
            </div>
            <!-- <rewrite-search v-model="keyWord" @search="search"></rewrite-search> -->
        </div>
        <div class="material-main">
            <!-- <div class="main-l">

      </div> -->
            <div class="main-r">
                <div class="material-list">
                    <vue-scroll>
                        <materialItem 
                        :data="item" 
                        v-for="(item, index) in  materialList" 
                        :selected="chooseIds.indexOf(item.src) != -1" 
                        :key="index" 
                        @selectImg="chooseImg"></materialItem>
                    </vue-scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import materialItem from "./material-item.vue";
import upload from "./upload.vue";
export default {
    name: "material-view",
    components: { materialItem, upload },
    props: {
        type: {
            type: String,
            default: "IMAGE",
        },
        chooseIds: {
          type: Array,
          default:()=>{return [];}
        },
        isMulti: {
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
    data() {
        return {
            keyWord: "",
            materialList: [],
        };
    },

    methods: {
        search() {},
        initData(chooseIds){
        },
        chooseImg(item) {
          let chooseIds = this.chooseIds;
          let selectIndex = chooseIds.indexOf(item.src);
            if(selectIndex != -1){
              this.$delete(chooseIds, selectIndex);
            } else {
              if(this.isMulti){
                chooseIds.push(item.src);
              } else {
                chooseIds = [item.src];
              }
            }
            this.$emit("chooseChange", chooseIds);
            console.log("选择", chooseIds)
        },
        uploadProgress(data){
          this.materialList = data || [];
        },
        uploadSuccess(data) {
            this.materialList = data || [];
            if(!this.isMulti && this.materialList.length > 0){
                this.$root.chooseIds = [this.materialList[0].src]
            }
        },
    },
};
</script>

<style lang="less" scoped>
.material-view {
    .material-main {
        width: 100%;
        display: flex;
        padding: 10px;
        border-top: 1px solid #efefef;
        .main-l {
            width: 100px;
            flex-shrink: 0;
        }
        .main-r {
            width: 100%;
            .material-list {
                height: calc(100vh - 500px);
            }
        }
    }
}
</style>