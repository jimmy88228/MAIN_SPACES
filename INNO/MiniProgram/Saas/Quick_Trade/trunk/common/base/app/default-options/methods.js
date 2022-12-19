import {BP} from "../../page/index";
import {BC} from "../../component/index";
import SC from "../../../helper/state-controller/index";
import StorageH from "../../../helper/storage-handler/index"
import PH from "../../../helper/params-handler/index"
import ApiRefs from "../../../manager/http-manager/index"
import SH from "../../../helper/style-helper/index";
import SIH from "../../../helper/system-info-helper/index";
import LM from "../../../manager/login-manager/index";
import Conf from "../../../../config/index";
import SMH from "../../../helper/show-message-helper/index";
import StoreH from "../../../helper/store-helper/index";

export default {
  get BP(){return BP}, // BasePage
  get BC(){return BC}, // BaseComponent
  get SC(){return SC}, // state-controller
  get StorageH(){return StorageH}, // storage-handler
  get PH(){return PH}, // params-handler
  get Http(){return ApiRefs}, // request
  get SH(){return SH}, // style-helper
  get SIH(){return SIH}, // system-info-helper
  get LM(){return LM}, // login-manager
  get Conf(){return Conf}, // login-manager
  get SMH(){return SMH}, // show-message-helper
  get StoreH(){return StoreH}, // StoreH
}