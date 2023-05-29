
import lPainter from "@/components/lime-painter/l-painter/l-painter.vue";
import lPainterView from "@/components/lime-painter/l-painter-view/l-painter-view.vue";
import lPainterText from "@/components/lime-painter/l-painter-text/l-painter-text.vue";
import lPainterImage from "@/components/lime-painter/l-painter-image/l-painter-image.vue";
import lPainterQrcode from "@/components/lime-painter/l-painter-qrcode/l-painter-qrcode.vue";
import globalCom from '@/components/global-component.vue';
import pageNav from '@/components/page-nav/page-nav.vue'

function installComponent(Vue){
  if(Vue){
      Vue.component('l-painter', lPainter);
      Vue.component('l-painter-view', lPainterView);
      Vue.component('l-painter-text', lPainterText);
      Vue.component('l-painter-image', lPainterImage);
      Vue.component('l-painter-qrcode', lPainterQrcode); 
      Vue.component(globalCom.name, globalCom);
      Vue.component(pageNav.name, pageNav);
    }
}
export {
	installComponent
}