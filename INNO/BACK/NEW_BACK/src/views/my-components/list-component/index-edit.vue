<template>
  <div class="edit-select">
    <slot name="content" v-bind:tagData="tagData" v-bind:handleClose="handleClose">
      <Tag
        color="primary"
        type="dot"
        closable
        :fade="isAnimate"
        @on-close="handleClose(item.id)"
        size="large"
        class="flex_tag"
        v-for="item in viewTagData"
        :key="item.id">
        {{item.name}}
      </Tag>
    </slot>
    <template v-if="showBtn">
      <slot></slot>
    </template>
  </div>
</template>

<script>
export default {
  props: ['data', 'type'],
  data () {
    return {
      isAnimate: false,
      tagData: [],
    }
  },
  computed: {
    showBtn () {
      return (this.type === 'radio' && this.tagData.length === 0) || this.type === 'checkbox';
    },
    viewTagData(){
      let tagData = this.tagData || [];
      let _arr = []
      for(let i = 0; i < tagData.length; i++){
        if(tagData[i].id > 0){
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
			console.log("id", id);
      const index = this.tagData.findIndex(item => item.id === id);
			console.log("index", index);
      this.tagData.splice(index, 1);
			console.log(JSON.parse(JSON.stringify("tagData", this.tagData)));
      this.$emit('del-tag', this.tagData);
    }
  },
  watch: {
    data: {
      handler (nV) {
            //console.log("nV", nV instanceof Array, " ---", nV, "---===" , nV && nV.length);
            if(nV){
                if(nV instanceof Array){
                    this.tagData = nV.length > 0 ? [...nV] : [];
                } else {
                    this.tagData = [nV];
                }
                console.log("watch", this.tagData);
            }
      },
      immediate: true
    }
  }
}
</script>
