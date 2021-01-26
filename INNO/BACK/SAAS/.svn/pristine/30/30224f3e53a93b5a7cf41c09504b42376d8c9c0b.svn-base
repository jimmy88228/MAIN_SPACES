import Utils from "@/helper/utils";
import config from "./config";
let _config;
if (process.env.NODE_ENV === "development") {
    _config = require("./config.debug").default;
} else {
    _config = require("./config.release").default;
}

export default Utils.merge(config, _config);
