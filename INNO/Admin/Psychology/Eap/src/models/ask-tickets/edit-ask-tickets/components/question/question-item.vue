<template>
  <div>
    <questionEdit 
    ref="questionEditRef" 
    :operateData="operateData" 
    :questionItem="questionItem" 
    :index="index" 
    v-show="operateData.editIndex === index" 
    @confirmEdit="confirmEdit"></questionEdit>
    <questionView 
    :questionItem="questionItem" 
    :operateData="operateData" 
    :index="index" 
    v-show="operateData.editIndex !== index" 
    @removeQuestion="removeQuestion"></questionView>
  </div>
</template>

<script>
import questionView from "./question-view.vue";
import questionEdit from "./question-edit.vue";
export default {
  components: { questionView, questionEdit },
  props: {
    index: Number,
    operateData: {
      type: Object,
      default(){
        return {}
      }
    },
    questionItem: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {}
  },
  methods: {
    confirmEdit(detail){
      this.$emit('confirmEdit', {
        index: this.index,
        item: detail.item
      });
    },
    removeQuestion(){
      this.$emit("removeQuestion", this.index);
    },
    checkForm(detail){
      return this.$refs["questionEditRef"] && this.$refs["questionEditRef"].checkForm(detail);
    }
  }
}
</script>

<style>

</style>