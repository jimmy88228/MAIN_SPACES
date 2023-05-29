<template>
  <div class="rewrite-screen" :class="{'opacirt-bg': isOpacityBg }">
      <rewrite-area>
        <div v-for="(item, index) in baseData" :key="index">
            <template>
                <rewrite-search v-model="searchForm[item.key]" @search="search" placeholder="请输入名称搜索"></rewrite-search>
            </template>
        </div>
      </rewrite-area>
  </div>
</template>

<script>
import rewriteArea from '../rewrite-area/rewrite-area.vue'
export default {
  components: { rewriteArea },
    props: {
        baseData: {
            type: Array,
            default(){
                return [];
            }
        },
        isOpacityBg: {
            type: Boolean,
            default: false
        }
    },
    name: "rewrite-screen",
    data(){
        return {

        }
    },

}
</script>
<style lang="less" scoped>
.rewrite-area{
    background: #FCFBFE;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    padding: 8px 11px;
}
.opacirt-bg{
    background: none;
    border: 0 none;
}
</style>