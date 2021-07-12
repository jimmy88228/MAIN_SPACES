import Vue from 'vue';

// 接口返回的时间格式
Vue.filter('initDate', (value) => {
  if (!value) return '';
  return value.split(' ')[0];
});
Vue.filter('initTime', (value) => {
  if (!value) return '';
  return value.split(' ')[1];
});
