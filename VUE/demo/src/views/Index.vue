<template>
  <div class="index">
    <ExtendDemo />
    <GlobalApi />
    <OpsData :prop_data1="data1" :prop_data2="data2"></OpsData>
    <OpsDom />
    <Lifecycle />
    <OpsResource />
    <Combination />
    <OpsElse :params-val="'props paramsVal:' + one" />
    <div>
      <button :jimmy="441" @click="e=>onTap(e,'else')">跳转ELSE</button>
    </div>
    <InstanceProperty :jimmy1="one" :jimmy2="data1">
      <!-- <template slot="head"> --> <!-- 旧 -->
      <template v-slot:head>
        <div>head</div>
      </template>
      <template>
        <div>content</div>
      </template>
      <template v-slot:footer>
        <div>footer</div>
      </template>
    </InstanceProperty>
  </div>
</template>
 

<script>
import ExtendDemo from "@/components/extend.vue";
import GlobalApi from "@/components/globalApi.vue";
import OpsData from "@/components/opsData.vue";
import OpsDom from "@/components/opsDom.vue";
import Lifecycle from "@/components/lifecycle.vue";
import OpsResource from "@/components/opsResource.vue";
import Combination from "@/components/combination.vue";
import OpsElse from "@/components/opsElse.vue";
import InstanceProperty from "@/components/instance_property.vue";

export default {
  name: "index",
  components: {
    ExtendDemo, //Vue.extend声明异步注册组件，Vue.component({})同步注册组件
    GlobalApi,  //全局API--Vue.XXX
    OpsData,    //选项 / 数据
    OpsDom,     //选项 / DOM
    Lifecycle,  //选项 / 生命周期钩子
    OpsResource,//选项 / 资源
    Combination, //选项 / 组合
    OpsElse, //选项 / 其他
    InstanceProperty,

  },
  data() {
    return {
      data1: "jimmy ",
      data2: "jimmy2",
      one:1,
    };
  },
  mounted () {
    // console.log('slots',this.$slots,'\nscopedSlots',this.$scopedSlots,'\n');
  },
  methods: {
    onTap(e,type) {
      console.log(e,type);
      if(type == 'else'){
        this.$router.push({
          name:"Else", 
          query:{
            que_val:442
          }
        })
      }
    }
  },
};
</script>

<style lang="less">
</style>
