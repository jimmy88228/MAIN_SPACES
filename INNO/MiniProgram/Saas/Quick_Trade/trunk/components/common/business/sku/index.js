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
    skuList: [ // 规格类型列表

    ],
    productList: [],
    selectedItems: [], // 已经选中的规格items
    selectedRef: {}, // 已经选中的规格Ref
    availablePrimeRef: {}, // 可选规格Prime
    canChooseProduct: [], // 有效的产品
    valueInLabel: {}, // 质数，规格枚举值
  },
  lifetimes: {
    detached() {
      this.pathFinder && (this.pathFinder = null);
    }
  },
  ready() {

  },
  methods: {
    initData({skuList, productList}) {
      this.setData({
        skuList,
        productList
      }, initSku.bind(this))
    },

    onClickSelType(e) {
      let dataset = e.currentTarget.dataset || {};
      if (dataset.disabled) return;
      let renewData = selectSkuHandle.call(this, dataset);
      this.setData(renewData, () => {
        this.triggerEvent("select", this.getResult())
      });
    },

    getResult() {
      let {skuList = [], canChooseProduct = [], selectedItems = [], selectedRef} = this.data;
      let result = {finished: false, productInfo: {}, selectedSku: selectedItems};
      if (skuList.length === selectedItems.length) { // 已选择完毕
        result.finished = true;
        canChooseProduct.some(item => {
          if (item.product_specList.every(spec => selectedRef[spec.spec_id])) {
            result.productInfo = item;
            return true
          }
        })
      }
      return result
    }
  }
}))

function initSku() {
  let {skuList, productList} = this.data;
  let skuCount = 0;
  const valueInLabel = {};
  skuList.forEach(spu => {
    let skus = spu.specinfo_list || [];
    skus.forEach(skuItem => {
      let {spec_id} = skuItem;
      valueInLabel[spec_id] = getPrime(skuCount);
      skuCount++
    })
  })
  // 根据规格坐标，排序质数坐标
  const way = skuList.map((i) => {
    return i.specinfo_list.map(ii => valueInLabel[ii.spec_id]);
  });
  const sku = productList.map(item => ({
    skuPrime: item.product_specList.map(ii => valueInLabel[ii.spec_id]),
    ...item
  }))
  // 筛选可选的 SKU
  const canChooseProduct = sku.filter(item => item.goods_number);
  // 初始化规格展示内容
  this.pathFinder = new PathFinder(way, canChooseProduct.map(item => item.skuPrime));
  // 获取不可选规格内容
  const unDisabled = this.pathFinder.getWay().flat();
  const availablePrimeRef = {};
  unDisabled.forEach(item => item && (availablePrimeRef[item] = true));

  this.setData({
    canChooseProduct,
    availablePrimeRef,
    valueInLabel,
  });
}

function selectSkuHandle({
  specItem,
  prime,
  primeIndex
}) {
  // 获取已经选中的规格,质数，规格枚举值,以及原本规格名称
  const {
    selectedItems,
    valueInLabel,
    skuList: stateType
  } = this.data;
  const selected = this.selected || [];
  // 检查此次选择是否在已选内容中
  const index = selected.indexOf(specItem.spec_id);
  // 获取已经有的矩阵值
  const light = this.pathFinder.light;
  // 如果未选中则提供选中，如果选中移除
  if (index > -1) {
    this.pathFinder.remove(prime);
    selected.splice(index, 1);
    selectedItems.splice(index, 1);
  } else if (light[primeIndex].includes(2)) {
    // 如果同规格中，有选中，则先移除选中，
    // 获取需要移除的同行规格
    const removeType = (stateType[primeIndex].specinfo_list)[light[primeIndex].indexOf(2)].spec_id;
    // 获取需要提出的同行规格质数
    const removePrime = valueInLabel[removeType];
    // 移除
    this.pathFinder.remove(removePrime)
    selected.splice(selected.indexOf(removeType), 1);
    selectedItems.splice(selected.indexOf(removeType), 1)
    //移除同行后，添加当前选择规格
    this.pathFinder.add(prime)
    selected.push(specItem.spec_id);
    selectedItems.push(specItem);
  } else {
    this.pathFinder.add(prime);
    selected.push(specItem.spec_id);
    selectedItems.push(specItem)
  }

  // 更新不可选规格
  const availablePrimeRef = {};
  this.pathFinder.getWay().flat().forEach(item => item && (availablePrimeRef[item] = true));
  const selectedRef = {};
  selected.forEach(item => selectedRef[item] = true);

  this.selected = selected;
  return {
    selectedRef,
    selectedItems,
    availablePrimeRef,
  }
}