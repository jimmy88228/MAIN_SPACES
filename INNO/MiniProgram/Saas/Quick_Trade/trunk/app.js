import "./common/support/polyfill/promise";
import {createMainApp} from "./common/base/app/index";
import storeH from "./common/helper/store-helper/index"
import LM from "./common/manager/login-manager/index"
App(createMainApp({
  onLaunch(ops) {
    console.log("App.onLaunch", ops);
    LM.loginAsync().ignore(()=>{
      LM.checkIfStaff(false);
      LM.checkIfStore(false);
      storeH.changeVisitStore(ops.query||{}).ignore((res)=>{
        storeH.getVisitStore();
      });
    })
  }
}))
