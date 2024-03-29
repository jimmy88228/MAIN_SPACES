import rewritePage from "./rewrite/rewrite-page/rewrite-page";
import rewriteArea from "./rewrite/rewrite-area/rewrite-area";
import rewriteScreen from "./rewrite/rewrite-screen/rewrite-screen";
import rewriteTabs from "./rewrite/rewrite-tabs/rewrite-tabs";
import rewriteSearch from "./rewrite/rewrite-search/rewrite-search";
import rewriteTooltip from "./rewrite/rewrite-tooltip/rewrite-tooltip";
import imgView from "./view-components/img-view/img-view";
import titleBar from "./view-components/title-bar/title-bar";
import dataSelect from "./view-components/data-select/index";
import dateTime from "./view-components/date-time/index";
import holdLayout from "./view-components/layout/hold-layout";
import customModal from "./view-components/custom-modal/index";
import customInput from "./view-components/custom-input/index";
import dataCascader from "./view-components/data-cascader/index";
function installComponent(Vue){
    if(Vue){
        Vue.component(imgView.name, imgView);
        Vue.component(rewritePage.name, rewritePage);
        Vue.component(rewriteArea.name, rewriteArea);
        Vue.component(rewriteScreen.name, rewriteScreen);
        Vue.component(rewriteTabs.name, rewriteTabs);
        Vue.component(rewriteSearch.name, rewriteSearch);
        Vue.component(titleBar.name, titleBar);
        Vue.component(dataSelect.name, dataSelect);
        Vue.component(dataCascader.name, dataCascader);
        Vue.component(dateTime.name, dateTime);
        Vue.component(rewriteTooltip.name, rewriteTooltip);
        Vue.component(holdLayout.name, holdLayout);
        Vue.component(customModal.name, customModal);
        Vue.component(customInput.name, customInput);
    }
}
export {
	installComponent
}