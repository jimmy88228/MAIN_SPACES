// StyleHelper主要是给出 所有Page节点 和 一个tabBar节点 的Style
import tabBarStyle, {tabBarSize} from "./tabBar";
import pageStyle from "./page";
import iconBase64 from "./base64"

class StyleHelper {
  static getInstance() {
    if (!StyleHelper.instance){
      StyleHelper.instance = new StyleHelper();
    }
    return StyleHelper.instance
  }

  styleObjToStr(styleObj = {}) {
    let styleStr = "";
    for (let key of Object.keys(styleObj)) {
      styleStr += `--${key}: ${styleObj[key]};`;
    }
    return styleStr
  }

  get pageStyle() {
    if (!this.pageStyleStr) this.pageStyleStr = this.styleObjToStr({...tabBarSize, ...pageStyle});
    return this.pageStyleStr
  }

  get pageStyleObj(){
    return pageStyle
  }

  get tabBarStyle() {
    if (!this.tabBarStyleStr) this.tabBarStyleStr = this.styleObjToStr(tabBarStyle);
    return this.tabBarStyleStr
  }

  get base64(){
    return iconBase64
  }
}

export default StyleHelper.getInstance();