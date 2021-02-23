import Util from "./common/utils/util";
import BaseOptions from "./config/config";
import Options from "./config/config.prod";//dev,prod

const config = Util.merge(BaseOptions, Options, {
    //test
});
export default config;
