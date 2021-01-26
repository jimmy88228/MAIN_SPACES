import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        authJson: {}
    },
    mutations: {
        setData(state, params){
            if(params.name){
                state[params.name] = params.data;
            }
            
        }
    }
})

export default store;