import Vue from "vue";
import utils from "@/helper/utils/index";
import LM from "@/helper/manager/login-manager";

const organizeHandle = new Vue({
  data: {
    inited:false,
    orgnh:null,
  },
  computed: {
    organizationOriData(){
      let cache =  this.getCache();
      return cache;
    },
    organizationItems(){
      let cache =  this.getCache('organizationItems');
      return cache.organizationItems||{};
    },
    organizationList(){
      let cache =  this.getCache('organizationList');
      return cache.organizationList||{};
    },
    organizationObj(){
      let cache =  this.getCache('organizationObj');
      return cache.organizationObj||{};
    },
  },
  watch: {},
  created() {},
  methods: {
    init(type,searchq="") {
    if(this.orgnh) return this.orgnh;
    this.orgnh = this.loadData(type,searchq).then(res=>{ 
      if (res.code) {
        let data = res.data || [];
        let items = data.items || [];
        let organizationItems = [],
          organizationList = [],
          organizationObj = {};
        organizationItems = items;
        this.setOrganizationDataList(items, organizationList);
        organizationList.forEach(item => {
          organizationObj[item.id] = item;
        })
        this.setCache({
          organizationItems,
          organizationList,
          organizationObj
        });
        this.inited = true;
        return res;
      }
      return Promise.reject();
    }).finally(()=>{
      setTimeout(() => {
        this.orgnh = null;
      }, 500);
    });
    return this.orgnh;
    },
    getData(type,searchq="",refresh=true){
      return this.getCacheAsync(type,searchq,refresh);
    },
    getFullData(){
      return this.loadData(1);
    },
    getCache(key){
      let cache =  utils.cache.get('adminOrganizationData')||{};
      return key ? cache[key] || {} : cache;
    },
    getCacheAsync(type,searchq="",refresh){
      return new Promise((rs,rj)=>{
        if(!this.inited || refresh){
          this.init(type,searchq).then(()=>{
            rs(this.getCache());
          }).catch(e=>{
            rj(e);
          })
        }else{
          rs(this.getCache());
        }
      })
    },
    setCache({organizationItems,organizationList,organizationObj}){
      let cache = this.getCache();
      organizationItems || (organizationItems=cache.organizationItems||{});
      organizationList || (organizationList=cache.organizationList||{});
      organizationObj || (organizationObj=cache.organizationObj||{});
      utils.cache.set('adminOrganizationData', {
        organizationItems,
        organizationList,
        organizationObj
      });
    },
    removeCache(){
      this.inited = false;
      utils.cache.remove('adminOrganizationData');
    },
    setOrganizationDataList(data, organizationList) {
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children && data[i].children.length > 0) {
            this.setOrganizationDataList(data[i].children, organizationList);
            organizationList.push(data[i]);
          } else {
            organizationList.push(data[i]);
          }
        }
        return data;
      }
    },
    loadData(type,searchq=""){
      // type //1.代表获取全部组织架构，2.获取管理员有权限的组织架构
      // LM.userInfos.is_super_structureids // 0代表全部组织权限，1代表指定组织
      return this.$MainApi.adminOrganizationData({
        data: {
          searchq,
          type: type || ((LM.userInfos && LM.userInfos.is_super_structureids == 1) ?  2 : 1),
          page: 1,
          pageSize: 1000,
        },
      })
    }
  },
});
export default organizeHandle;