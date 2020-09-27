import Vue from "vue";

export default {
    vueDataMerge(oldData, newData) {
        for (let key in newData) {
            if (key in oldData) {
                oldData[key] = newData[key];
            } else {
                Vue.set(oldData, key, newData[key]);
            }
        }
        return oldData;
    }
};
