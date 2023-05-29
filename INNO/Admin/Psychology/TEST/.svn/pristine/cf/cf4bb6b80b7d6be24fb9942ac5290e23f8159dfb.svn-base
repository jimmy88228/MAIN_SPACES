import screenArea from "./module/comm/screen";
export default {
  components: {
    screenArea,
  },
  data () {
    return {
			status: {},
      isShowExtra: false,
      defailtSearchForm: {}
		}
  },
  props: {
    type: {// radio, checkBox 
     type: String,
     default: "radio", 
    },
    data: [Array, Object],
		title: String,
		limitSelectNum: [Number, String],
    hideSelect: Boolean,
    // extraParam: { // extraParam代表一些外界的条件,比如店铺下的店员
    //   type: Object,
    //   default () {
    //     return {};
    //   }
    // }
  },
  methods: {
    // 必须声明的
    showModal(options) {
      // // 数据传递到模板
			// if(typeof this.beforeShowModal == "function"){
			// 	 this.beforeShowModal(this.$props).finally(()=>{
			// 		 this.status = {
			// 			 ...this.$props
			// 		 }
			// 		 this.$refs.modalTemplate.showModal();
			// 	 })
			// } else {
			// 	this.status = {
			// 		...this.status,
			// 		...this.$props
			// 	}
			// 	this.$refs.modalTemplate.showModal(this.this.$props);
			// }
      console.log("this.props", this.$props)
      this.$refs.modalTemplate.showModal(options);
    },
    holdDefaultParams(){
      if(this.searchForm instanceof Object){
        this.defailtSearchForm = JSON.parse(JSON.stringify(this.searchForm));
      }
    },
    cancelHandle() {
      this.$emit('cancel');
    },
    handleData(data) {
      this.$emit('ok', data);
    },
    handleDestroy() {
      this.$emit('destroy');
    }
  },
  mounted(){
    this.holdDefaultParams();
  }
}