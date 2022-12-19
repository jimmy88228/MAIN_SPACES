import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/**
 * 只记录全局的临时状态
 */ 
const store = new Vuex.Store({
	state: {
		waitingunReadCount: "",
		platformCount:0
	},
	mutations: {
		// 设置等待中未读总数
		setWaitingunReadCount(state, val){
			state.waitingunReadCount = val;
		},
		setPlatformCount(state,val){
			state.platformCount = val
		}
	},
	actions: {
	
	},
	getters:{
		watchPlatformCount:state=>{
			return state.platformCount
		}
	}
})

export default store
