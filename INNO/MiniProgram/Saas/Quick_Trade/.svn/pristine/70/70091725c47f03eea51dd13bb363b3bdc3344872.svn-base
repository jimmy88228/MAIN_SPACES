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
    skuList: [], // 规格类型列表
    productList: [],
    selectedItems: [], // 已经选中的规格items
    selectedRef: {}, // 已经选中的规格Ref
    availablePrimeRef: {}, // 可选规格Prime
    canChooseProduct: [], // 有效的产品
    valueInLabel: {}, // 质数，规格枚举值
  },
  methods: {
    initData({skuList, productList}) {
      this.setData({
        skuList,
        productList
      });
      initSku.call(this);
    },

    reset() { // 重置该组件数据
      this.pathFinder = null;
      this.selected = null;
      this.setData({
        selectedItems: [], // 已经选中的规格items
        selectedRef: {}, // 已经选中的规格Ref
        availablePrimeRef: {}, // 可选规格Prime
        canChooseProduct: [], // 有效的产品(目前是指有库存的产品)
        valueInLabel: {}, // 质数，规格枚举值
      })
    },

    onClickSelType(e) { // 点击规格
      let dataset = e.currentTarget.dataset || {};
      if (!this.data.availablePrimeRef[dataset.prime]) return; // 规格是disabled
      let renewData = selectSkuHandle.call(this, dataset);
      this.setData(renewData, () => {
        this.triggerEvent("select", this.getResult())
      });
    },

    autoSelectFirstAvailableProduct() { // 自动选择第一个有效的产品
      return new Promise((rs, rj) => {
        let canChooseProduct = this.data.canChooseProduct || [];
        if (!this.pathFinder) rj("组件未初始化，请先调用initData");
        else if (!canChooseProduct.length) rs(null); // 没有有效的产品可以选
        let targetProduct,
          valueInLabel = this.data.valueInLabel || {};
        for (let product of canChooseProduct) { // 这个循环只是确保一下自动选择的产品是正常的
          let {goods_number = 0, product_specList = []} = product || {};
          if (product_specList && product.product_specList.length) { // 以防接口返回了没有规格的产品
            if (goods_number <= 0) continue; // 没有库存
            else if (product_specList.some(spec => !valueInLabel[spec.spec_id])) continue; // 存在不能选择的规格 
            targetProduct = product;
            break;
          }
        };
        if (!targetProduct) { // 没有正常的产品可以选
          console.log("没有正常的产品可以选", canChooseProduct);
          rj(null);
        }
        let {product_specList = [], skuPrime = []} = targetProduct;
        let event = {currentTarget: {dataset: {}}};
        product_specList.forEach((spec, index) => {
          let dataset = event.currentTarget.dataset;
          dataset.specItem = {name: spec.spec_name, spec_id: spec.spec_id};
          dataset.prime = skuPrime[index];
          dataset.primeIndex = index;
          this.onClickSelType(event);
        });
        wx.nextTick(() => {rs(targetProduct)})
      })
    },

    getResult() { // 获取选择结果
      let {skuList = [], canChooseProduct = [], selectedItems = [], selectedRef} = this.data;
      let result = {finished: false, productInfo: {}, selectedSku: selectedItems};
      if (skuList.length === selectedItems.length) { // 已选择完毕
        result.finished = true;
        canChooseProduct.some(item => {
          let specList = item.product_specList || [];
          if ( specList.length && specList.every(spec => selectedRef[spec.spec_id])) {
            result.productInfo = item;
            return true
          }
        })
      }
      console.log("result", result)
      return result
    }
  }
}))

function initSku() { // 初始化sku数据(不会重置已选择的数据)
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
  this.pathFinder = this.pathFinder || new PathFinder(way, canChooseProduct.map(item => item.skuPrime));
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
  // console.log('选择 进来',primeIndex,'质数：',prime,specItem,this.data.valueInLabel)
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
  // console.log('light',primeIndex,JSON.parse(JSON.stringify(light)),light)
  if (index > -1) {
    // console.log('选中过，直接移除')
    this.pathFinder.remove(prime);
    selected.splice(index, 1);
    selectedItems.splice(index, 1);
  } else if (light[primeIndex].includes(2)) {
    // console.log('同规格中有选中，先移除,再选')
    // 获取需要移除的同行规格
    const removeType = (stateType[primeIndex].specinfo_list)[light[primeIndex].indexOf(2)].spec_id;
    // 获取需要提出的同行规格质数
    const removePrime = valueInLabel[removeType];
    // 移除
    this.pathFinder.remove(removePrime);
    // console.log('remove',removePrime,JSON.parse(JSON.stringify(this.pathFinder)))
    let removeIndex = selected.indexOf(removeType);
    selected.splice(removeIndex, 1);
    selectedItems.splice(removeIndex, 1)
    //移除同行后，添加当前选择规格
    this.pathFinder.add(prime)
    // console.log('add',prime,JSON.parse(JSON.stringify(this.pathFinder)))
    selected.push(specItem.spec_id);
    selectedItems.push(specItem);
  } else {
    // console.log('直接add')
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