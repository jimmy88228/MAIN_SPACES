/**
 * 站点管理 用到的
 */

const site = {
  state: {
    	// 全站的配置数据
    	info: {},
    	// 当前页的配置数据
    	pageInfo: {}
  },
  mutations: {
    setSite (state, info) {
        	state.info = info;
    },
    setPageInfo (state, pageInfo) {
        	state.pageInfo = pageInfo;
    }
  }
};

export default site;
