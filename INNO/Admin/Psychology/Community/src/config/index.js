import Utils from "@/helper/utils";
import config from "./config";
let _config;
if(process.env.BRAND_CODE){
    try {
        _config = require(`./config.${process.env.BRAND_CODE}`).default;
    } catch (error) {
        console.log(error);
    }
}
if(!_config){
    if (process.env.NODE_ENV === "development") {
        _config = require("./config.debug").default;
    } else {
        _config = require("./config.release").default;
    }
}



export default Utils.merge(config, _config);
