<template>
  <div>
    <!-- <div style="width: 300px;display:flex;min-height: 50px;max-height:300px;border: 1px solid #efefef;">
      <div style="flex:1;overflow:hidden;">
        <div style="width: 100%;height:100%;" v-bar>
          <div style="height: 800px;"></div>
        </div>
      </div>
    </div> -->
    <!-- <data-cascader ref="organizeCascader" v-model="data" class="base-320" type="organize" valueKey="id" labelKey="structure_name" @dismiss="dismiss"></data-cascader> -->
  </div>
</template>

<script>
export default {
  name: "home-page",
  data(){
    return {
      data: [],
    }
  },
  methods:{
    showOrganize(){
        this.$UIModule({
            mode: "organize-modal",
            
        })
    },
    dismiss(){
      console.log("关闭", this.data)
    }
  },
  mounted(){
    // this.showOrganize();
  }
}
</script>

<style>

</style>