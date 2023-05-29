class NumManager {
  static getInstance() {
    if (!NumManager.instance) {
      NumManager.instance = new NumManager();
    }
    return NumManager.instance;
  }
  constructor() {
    
  }
  getDiscount(num) {
    num = parseFloat(num);
    let numArr = num.toString().split(".");
    if (numArr[0] == 1) return num;
    num = parseFloat((num * 10).toFixed(2));
    return num;
  }
  
}


export default NumManager.getInstance();