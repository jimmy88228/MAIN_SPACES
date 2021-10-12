export default {
  data () {
    return {
			status: {}
		}
  },
  props: {
    mode: String, // 选择的组件名称
    type: String, // 
    data: [Array, Object],
		title: String,
    extraParam: { // extraParam代表一些外界的条件,比如店铺下的店员
      type: Object,
      default () {
        return {};
      }
    }
  },
  methods: {
    // 必须声明的
    showModal() {
      // 数据传递到模板
			if(typeof this.beforeShowModal == "function"){
				 this.beforeShowModal(this.$props).finally(()=>{
					 this.$refs.modalTemplate.showModal();
				 })
			} else {
				this.status = {
					...this.status,
					...this.$props
				};
				this.$refs.modalTemplate.showModal();
			} 
    },
    handleData(data) {
      this.$emit('get-list', data);
    },
    handleDestroy() {
      this.$emit('destroy');
    }
  }
}