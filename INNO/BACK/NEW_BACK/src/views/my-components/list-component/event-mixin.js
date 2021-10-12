export default {
  data () {
    return {
      currentStatus: {}
    }
  },
  props: {
    mode: String,
		modeStyle: String, //多tab类型切换
    type: String,
    data: [Array, Object],
		showTab: "",
		reqConfig: "",
    // extraAddtion代表一些外界的条件,比如店铺下的店员
    extraAddtion: {
      type: Object,
      default () {
        return {};
      }
    },
    listKey: String
  },
  methods: {
    // 必须声明的
    showModal() {
      // 数据传递到模板
      this.currentStatus = this.$props;
			if(this.beforeLoad && typeof(this.beforeLoad) == 'function'){
				this.beforeLoad().then(()=>{
					this.$refs.listComponent.showModal();
				})
			} else {
				this.$refs.listComponent.showModal();
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