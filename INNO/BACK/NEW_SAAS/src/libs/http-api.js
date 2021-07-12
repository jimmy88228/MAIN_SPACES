import GoodsApiList from './http-api/goods/index';
import AdminAccount from './http-api/admin/index';
import Order from './http-api/order/index';
import Plugins from './http-api/plugins/index';
import Activity from './http-api/activity'
import Article from './http-api/article/index';
import Weixin from './http-api/wexin/index';
import Store from './http-api/store/index';
import User from './http-api/user/index';
import Qiwei from './http-api/qiwei/index';
import System from './http-api/system/index';
import Coupons from './http-api/coupons/index';
import Common from './http-api/common/index';
import Devices from './http-api/devices/index';
import Datas from './http-api/data/index';
import smart from './http-api/smart/index';
import distribution from './http-api/distribution/index';
import Cloud from './http-api/cloud/index';
import Home from './http-api/home/index';
import matrix from './http-api/matrix/index';
export default {
  apiUrl: {
    ...GoodsApiList,
    ...AdminAccount,
    ...Order,
    ...Plugins,
    ...Activity,
    ...User,
    ...Qiwei,
    ...System,
    ...Article,
    ...Weixin,
    ...Store,
    ...Coupons,
    ...Common,
    ...Devices,
    ...Datas,
    ...smart,
    ...distribution,
    ...Cloud,
		...Home,
		...matrix
  }
}
