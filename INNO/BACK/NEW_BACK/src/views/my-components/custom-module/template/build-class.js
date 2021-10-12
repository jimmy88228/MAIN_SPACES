class CommonModule {
  static getAdList() {
    let uid = CommonModule.prototype.createUid(6);
    return {
      uid: uid,
      pic: '',
      name: '',
      linkType: 1,
      catData: [],
      catId: 0,
      vcatData: [],
      vcatId: 0,
      goodData: [],
      goodId: 0,
      groupGoodData: [],
      groupGoodId: 0,
      presaleGoodData: [],
      presaleGoodId: 0,
      timeLimitData: [],
      timeLimitGoodId: 0,
      linkId: 0,
      linkUrl: '',
      pageData: [],
      customPageId: 0,
      couponData: [],
      couponId: 0,
      lotteryData: [],
      lotteryId: 0,
      brandData: [],
      brandId: 0
    };
  }
  constructor(data) {
    if (data && Object.prototype.toString.call(data) !== '[object Object]') throw new TypeError('必须是对象数据类型!');
    this.uid = this.createUid(6);
    let initData = {
      type: this.type,
      uid: this.uid,
      lineType: 1,
      adList: [{
        pic: '',
        name: '',
        linkType: 1,
        catData: [],
        catId: 0,
        vcatData: [],
        vcatId: 0,
        goodData: [],
        goodId: 0,
        groupGoodData: [],
        groupGoodId: 0,
        presaleGoodData: [],
        presaleGoodId: 0,
        timeLimitData: [],
        timeLimitGoodId: 0,
        linkId: 0,
        linkUrl: '',
        pageData: [],
        customPageId: 0,
        couponData: [],
        couponId: 0,
        lotteryData: [],
        lotteryId: 0,
        brandData: [],
        brandId: 0
      }]
    };
    if (data) {
      // 初始化数据
      data.uid = this.uid;
      let list = CommonModule.getAdList();
      for (let k in list) {
        data['adList'].forEach(item => {
          if (item[k] == null) {
            if (k === 'uid') {
              item['uid'] = this.createUid(6);
            } else {
              item[k] = list[k];
            }
          } else {
            // 根据func_type 判断赋值的内容,数据来源related_id+related_data
            this.initParams(item);
          }
        });
      }
      for (let k in data) {
        this[k] = data[k];
      }
    } else {
      for (let k in initData) {
        this[k] = initData[k];
      }
    }
  }
  createUid(len = 32) {
    const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const maxPos = $chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
  }
  initParams(data) {
    let callbacks = {
      'CA': () => {
        data.catData = data.related_data;
        data.catId = data.related_id;
      },
      'VC': () => {
        data.vcatData = data.related_data;
        data.vcatId = data.related_id;
      },
      'GOODS': () => {
        data.goodData = [data.related_data];
        data.goodId = data.related_id;
      },
      'COLLAGEGOODS': () => {
        data.groupGoodData = [data.related_data];
        data.groupGoodId = data.related_id;
      },
      'PRESELLGOODS': () => {
        data.presaleGoodData = [data.related_data];
        data.presaleGoodId = data.related_id;
      },
      'SK': () => {
        data.timeLimitData = [data.related_data];
        data.timeLimitGoodId = data.related_id;
      },
      'TOJUMP': () => {
        data.linkId = +data.related_id;
      },
      'CMPAGE': () => {
        data.pageData = [data.related_data];
        data.customPageId = data.related_id;
      },
      'COUPON': () => {
        data.couponData = [data.related_data];
        data.couponId = data.related_id;
      },
      'Lottery': () => {
        data.lotteryData = [data.related_data];
        data.lotteryId = data.related_id;
      },
      'BRANDGOODS': () => {
        data.brandData = [data.related_data];
        data.brandId = data.related_id;
      }
    }
    callbacks[data.linkType] && callbacks[data.linkType]();
  }
}

class AdModule extends CommonModule{
  constructor(data) {
    super(data);
    this.type = 1;
  }
}

class BannerModule extends CommonModule {
  constructor(data) {
    super(data);
    this.type = 2;
  }
}

export {
  AdModule,
  BannerModule
};
