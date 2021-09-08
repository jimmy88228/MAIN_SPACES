class PromManager {
  static getInstance() {
    if (!PromManager.instance) {
      PromManager.instance = new PromManager();
    }
    return PromManager.instance;
  }
  constructor() {
    this.limitRuleType = this.limitRuleType || {
      1: "返券",
      2: "赠品",
      3: "包邮",
      4: "返积分",
      5: "返积分",
      6: "折扣",
      7: "一口价",
      8: "满减",
      9: "免件"
    }
    this.keyTip = this.keyTip || {//规定排列顺序
      "7":  { key: 0, showDetail: true}, 
      "8":  { key: 1, showDetail: true},
      "6":  { key: 2, showDetail: true},
      "9":  { key: 3, showDetail: true},
      "2":  { key: 4 },
      "1":  { key: 5 },
      "4,5":{ key: 6 },
      "3":  { key: 7 }
    }
  }
  getGiftRule(giftType){
    let key1 = "6,7,8,9", key2 = "4,5";
    if(key2.indexOf(giftType) != -1){
      return key2;
    }
    return giftType;
  }
}
export default PromManager.getInstance();