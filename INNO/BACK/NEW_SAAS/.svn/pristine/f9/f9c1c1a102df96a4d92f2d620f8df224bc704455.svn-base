import MaterialCenter from '@/views/my-components/material-center';
import Template from '@/views/my-components/list-component';
import Viewer from 'v-viewer';
import iviewArea from 'iview-area';
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
import SlideVerify from 'vue-monoplasty-slide-verify';
import ViewUI from 'view-design';
// 不加载多语言 import '@/locale';
import 'view-design/dist/styles/iview.css';
import 'viewerjs/dist/viewer.css';
import VueI18n from 'vue-i18n';

function installAll(Vue) {
  // 素材管理器
  Vue.use(MaterialCenter);
  Vue.use(Template);
  // 图片查看器
  Vue.use(Viewer);
  Viewer.setDefaults({
    title: [1, (image, imageData) => `${image.alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`]
  });
  //联动地区组件
  Vue.use(iviewArea);
  // 引入vuescroll
  Vue.use(vuescroll);
  // 滑动验证组件
  Vue.use(SlideVerify);
  // iView配置
  Vue.use(ViewUI);
  Vue.prototype.$Message.config({
    duration: 3
  });
  Vue.use(VueI18n);
}

export {
  installAll
}
