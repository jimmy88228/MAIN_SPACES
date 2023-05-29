import Vue from "vue";
import utils from "@/helper/utils/index";
import LM from "@/helper/manager/login-manager";

const thirdPartyHandle = new Vue({
  data: {
  },
  computed: {
  },
  watch: {},
  created() {},
  methods: {
    getBackstageToken(){
      return this.$MainApi.getBackstageToken({
        data: {}
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          return data
        }
        return Promise.reject();
      })
    }
  },
});
export default thirdPartyHandle;