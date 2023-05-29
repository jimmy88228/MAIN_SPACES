/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import Utils from './utils';
import ParseArea from './parse-area';

console.log("Utils", Utils)
let AREA = {};

class ParseAddress {

  static getInstance(){
    if (!ParseAddress.instance) {
      ParseAddress.instance = new ParseAddress()
    }
    return ParseAddress.instance
  }

  static ExcludeKeys = ['发件人', '收货地址', '收货人', '收件人', '收货', '手机号码', '邮编', '电话', '所在地区', '详细地址', '地址', '：', ':', '；', ';', '，', ',', '。', '、'];
  
  static Reg = {
    ...Utils.Reg
  };

  get inited() {
    return this._inited || false;
  }

  /**
   * 
   * @param {Array} all_region_list 地区数据
   * @description 此方法将我们小程序的 地区列表 转换成兼容这个插件的AREA数据，注意{code: {region_id, region_name}} code是假的行政编码，如果需要真的，要接口那边返回，再修改这里
   */
  initialAreaData(all_region_list = []) {
    if (this.AREA) return;
    let province_list = {};
    let city_list = {};
    let area_list = {};
    let pIndice = {};
    let cIndice = {};
    let aIndice = {};

    all_region_list.forEach(item => {
      let {region_type = -1, region_id, parent_id} = item;
      switch (region_type) {
        case 1: // 省
          !pIndice[parent_id] && (pIndice[parent_id] = 0);
          item.index = pIndice[parent_id] + 10;
          province_list[region_id] = item;
          pIndice[parent_id]++;
          break;
        case 2: // 市
          !cIndice[parent_id] && (cIndice[parent_id] = 0);
          item.index = cIndice[parent_id] + 10;
          city_list[region_id] = item;
          cIndice[parent_id]++;
          break;
        case 3: // 区
          !aIndice[parent_id] && (aIndice[parent_id] = 0);
          item.index = aIndice[parent_id] + 10;
          area_list[region_id] = item;
          aIndice[parent_id]++;
          break;
        default:
          break;
      }
    })
    pIndice = cIndice = aIndice = null;
    let province_list_obj = {}, city_list_obj = {}, area_list_obj = {};

    for (let id of Object.keys(province_list)) {
      let item = province_list[id];
      province_list_obj[item.index + "0000"] = {
        region_name: item.region_name,
        region: item,
      };
    }

    for (let id of Object.keys(city_list)) {
      try {
        let item = city_list[id];
        let province = province_list[item.parent_id];
        city_list_obj[""+ province.index + item.index + "00"] = {
          region_name: item.region_name,
          region: item,
          parent: province,
        };
      } catch (err) {
        console.log("lost_item", city_list[id])
      }
    }

    for (let id of Object.keys(area_list)) {
      try {
        let item = area_list[id];
        let city = city_list[item.parent_id];
        let province = province_list[city.parent_id]
        area_list_obj["" + province.index + city.index + item.index + ""] = {
          region_name: item.region_name,
          region: item,
          parent: city,
          grand: province,
        };
      } catch (error) {
        console.log("lost_item", area_list[id])
      }
    }

    province_list = city_list = area_list = null;

    this._inited = true;
    AREA = {
      province_list: province_list_obj,
      city_list: city_list_obj,
      area_list: area_list_obj
    }
  }

  /**
   * 
   * @param {Number | String} code 假的行政编码(类似id)
   */
  getRegionByCode(code) {
    const {province_list = {}, city_list = {}, area_list = {}} = AREA || {};
    let target = {}, type = "";
    if (province_list[code]) {
      target = province_list[code];
      type = "province";
    } else if (city_list[code]) {
      target = city_list[code];
      type = "city";
    } else if (area_list[code]) {
      target = area_list[code];
      type = "area";
    }
    return {...target, type}
  }

  constructor(address) {
    if (address) {
      return this.parse(address);
    }
  }

  /**
   * 开始解析
   * @param address string 地址
   * @param parseAll boolean 是否完全解析
   * @returns {Array}
   */
  parse(address, parseAll) {
    let results = [];
    if (address) {
      this.result = {
        mobile: '',
        zip_code: '',
        phone: ''
      };

      this.address = address;
      this.replace();
      this.parseMobile();
      this.parsePhone();
      this.parseZipCode();
      this.address = this.address.replace(/ {2,}/, ' ');
      const firstName = ParseAddress.parseName({details: this.address});

      this.ParseArea = this.ParseArea || new ParseArea();
      results = this.ParseArea.parse(this.address, parseAll);

      for (let result of results) {
        Object.assign(result, this.result);
        result.name = result.name.trim();
        ParseAddress.parseName(result, {firstName});
        ParseAddress.handlerDetail(result);
      }
      if (!results.length) {
        let result = Object.assign(this.result, {
          province: '',
          city: '',
          area: '',
          details: this.address,
          name: '',
          code: '',
          __type: ''
        });
        ParseAddress.parseName(result);
        results.push(result);
      }
    }

    // 将id给出去
    results.forEach(item => {
      if (item.code) {
        item.region = this.getRegionByCode(item.code)
      }
    })
    
    return results;
  }

  /**
   * 替换无效字符
   */
  replace() {
    let {address} = this;
    for (let key of ParseAddress.ExcludeKeys) {
      address = address.replace(new RegExp(key, 'g'), ' ');
    }
    this.address = address.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/ {2,}/g, ' ')
      .replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3').replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
  }

  /**
   * 提取手机号码
   */
  parseMobile() {
    ParseAddress.Reg.mobile.lastIndex = 0;
    const mobile = ParseAddress.Reg.mobile.exec(this.address);
    if (mobile) {
      this.result.mobile = mobile[0];
      this.address = this.address.replace(mobile[0], ' ');
    }
  }

  /**
   * 提取电话号码
   */
  parsePhone() {
    ParseAddress.Reg.phone.lastIndex = 0;
    const phone = ParseAddress.Reg.phone.exec(this.address);
    if (phone) {
      this.result.phone = phone[0];
      this.address = this.address.replace(phone[0], ' ');
    }
  }

  /**
   * 提取邮编
   */
  parseZipCode() {
    ParseAddress.Reg.zipCode.lastIndex = 0;
    const zip = ParseAddress.Reg.zipCode.exec(this.address);
    if (zip) {
      this.result.zip_code = zip[0];
      this.address = this.address.replace(zip[0], '');
    }
  }

  /**
   * 提取姓名
   * @param result
   * @param maxLen 字符串占位 比这个数值短才识别为姓名 汉字2位英文1位
   * @param firstName 最初切分地址识别到的name
   */
  static parseName(result, {maxLen = 11, firstName} = {}) {
    if (!result.name || Utils.strLen(result.name) > 15) {
      const list = result.details.split(' ');
      const name = {
        value: '',
        index: -1
      };
      if (list.length > 1) {
        let index = 0;
        for (const v of list) {
          if (v && !name.value || v && Utils.strLen(name.value) > Utils.strLen(v) || firstName && v === firstName) {
            name.value = v;
            name.index = index;
            if (firstName && v === firstName) break;
          }
          index += 1;
        }
      }
      if (name.value) {
        result.name = name.value;
        list.splice(name.index, 1);
        result.details = list.join(' ').trim();
      }
    }
    return result.name;
  }

  /**
   * 清洗地址详情内的省市区
   * @param result
   */
  static handlerDetail(result) {
    if (result.details.length > 5) {
      const ary = ['province', 'city', 'area'];
      for (const key of ary) {
        const index = result.details.indexOf(result[key]);
        if (index !== 0) continue;
        result.details = result.details.substr(result[key].length);
      }
    }
  }

}

const getAreaData = () => AREA;

export {
  ParseAddress,
  Utils,
  getAreaData
};

export default ParseAddress.getInstance();