import {
  getPrime,
  PathFinder
} from './helper';
const App = getApp();
Component(App.BC({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    type: [ // type: 规格类型
      ['男裤', '女裤'],
      ['黑色', '白色'],
      ['S', 'L'],
    ],
    selected: [], // 已经选中的规格
    selectedRef: {}, // 已经选中的规格Ref
    availablePrimeRef: {}, // 可选规格Prime
    productList: [{
        // 当前SKU的可选数量
        stock: 1,
        // 当前SKU包含的规格
        skuName: ["男裤", "黑色", "L"],
      },
      {
        stock: 1,
        skuName: ["男裤", "白色", "L"],
      },
      {
        stock: 1,
        skuName: ["女裤", "白色", "S"],
      },
      {
        stock: 1,
        skuName: ["女裤", "白色", "L"],
      },
    ],
    canUseSku: [], // 有效的产品
    valueInLabel: {}, // 质数，规格枚举值
  },
  lifetimes: {
    detached() {
      this.pathFinder && (this.pathFinder = null);
    }
  },
  ready() {
    // 获取全部规格
    const {
      type
    } = this.data;
    // 抹平规格内容
    const types = type.flat();
    // 通过抹平规格，获取规格对应质数
    const prime = getPrime(types.length);
    // 质数对应规格数 枚举值处理
    const valueInLabel = {};
    types.forEach((item, index) => {
      valueInLabel[item] = prime[index];
    });

    // 根据规格坐标，排序质数坐标
    const way = type.map((i) => {
      return i.map(ii => valueInLabel[ii]);
    });
    const sku = this.data.productList.map(item => ({
      stock: item.stock,
      skuName: item.skuName,
      skuPrime: item.skuName.map(ii => valueInLabel[ii])
    }))
    // 筛选可选的 SKU
    const canUseSku = sku.filter(item => item.stock);
    // 初始化规格展示内容
    console.log("asd")
    this.pathFinder = this.pathFinder || new PathFinder(way, canUseSku.map(item => item.skuPrime));
    // 获取不可选规格内容
    const unDisabled = this.pathFinder.getWay().flat();
    const availablePrimeRef = {};
    unDisabled.forEach(item => item && (availablePrimeRef[item] = true));

    this.setData({
      canUseSku,
      availablePrimeRef,
      valueInLabel,
    });
  },
  methods: {
    /**
     * 点击选择规格
     * @param {String} type 
     * @param {Number} prime 
     */
    onClickSelType(e) {
      let dataset = e.currentTarget.dataset || {};
      let renewData = selectSkuHandle.call(this, dataset);
      this.setData(renewData, () => {this.triggerEvent("select", this.getResult())});
    },

    getResult() {
      return {finished: 0, productInfo: {}, lackOfSkuType: ""}
    }
  }
}))

function selectSkuHandle({type, prime, primeIndex}) {
  // 获取已经选中的规格,质数，规格枚举值,以及原本规格名称
  const {
    selected,
    valueInLabel,
    type: stateType
  } = this.data;
  // 检查此次选择是否在已选内容中
  const index = selected.indexOf(type);
  // 获取已经有的矩阵值
  const light = this.pathFinder.light;
  // 如果未选中则提供选中，如果选中移除
  if (index > -1) {
    this.pathFinder.remove(prime);
    selected.splice(index, 1);
  } else if (light[primeIndex].includes(2)) {
    // 如果同规格中，有选中，则先移除选中，
    // 获取需要移除的同行规格
    const removeType = stateType[primeIndex][light[primeIndex].indexOf(2)];
    // 获取需要提出的同行规格质数
    const removePrime = valueInLabel[removeType];
    // 移除
    this.pathFinder.remove(removePrime)
    selected.splice(selected.indexOf(removeType), 1);
    //移除同行后，添加当前选择规格
    this.pathFinder.add(prime)
    selected.push(type);
  } else {
    this.pathFinder.add(prime);
    selected.push(type);
  }

  // 更新不可选规格
  const availablePrimeRef = {};
  this.pathFinder.getWay().flat().forEach(item => item && (availablePrimeRef[item] = true));
  const selectedRef = {};
  selected.forEach(item => selectedRef[item] = true);
  return {
    selectedRef,
    selected,
    availablePrimeRef,
  }
}