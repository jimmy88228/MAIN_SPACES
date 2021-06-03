const app = getApp();
Component({
    properties: {
        specsData: {
            type: null,
            observer(obj) {
                this.setSpecsData(obj || {});
            }
        }
    },
    data: {
        specs: [],
    },
    ready() {
        this.isReady = true;
        this.setSpecsData(this.data.specsData || {});
    },
    methods: {
        setSpecsData({ specs, products }) {
            if (!this.isReady) {
                return
            }
            specs || (specs = []);
            products || (products = []);

            let productMap = {};
            let powerSet = {}
            createData(products, productMap, powerSet);

            this.specs = specs;
            this.productMap = productMap;
            this.powerSet = powerSet;

            this.checkSelect();
            this.checkSpecs();
        },
        clickSpecValue(e) {
            let pos = e.currentTarget.dataset.position;
            if (this.selectValues[pos.specId] == pos.specValueId) {
                delete this.selectValues[pos.specId]
            } else {
                this.selectValues[pos.specId] = pos.specValueId;
            }
            this.checkSpecs();
        },
        checkSelect() {
            let newSelectValues = {};
            if (this.selectValues) {
                let oldSelectValues = this.selectValues;
                let specs = this.specs;
                for (let i = 0, sn = specs.length; i < sn; i++) {
                    let spec = specs[i];
                    let selectId = oldSelectValues[spec.id];
                    if (!selectId) {
                        continue;
                    }
                    for (let j = 0, svn = spec.values.length; j < svn; j++) {
                        let specValue = spec.values[j];
                        if (selectId == specValue.id) {
                            newSelectValues[spec.id] = specValue.id;
                            continue;
                        }
                    }
                }

            }
            this.selectValues = newSelectValues;
        },
        checkSpecs() {
            let specs = this.specs;
            let powerSet = this.powerSet;
            let selectValues = this.selectValues;
            for (let i = 0, sn = specs.length; i < sn; i++) {
                let spec = specs[i];
                let selectOrderIds = [];
                let selectId = selectValues[spec.id];
                for (let key in selectValues) {
                    key != spec.id && selectOrderIds.push(selectValues[key])
                }
                for (let j = 0, svn = spec.values.length; j < svn; j++) {
                    let specValue = spec.values[j];
                    if (selectId == specValue.id) {
                        specValue.selected = true;
                    } else {
                        specValue.selected = false;
                        let key = selectOrderIds.concat(specValue.id).sort(sort).join(",");
                        specValue.disabled = !powerSet[key]
                    }
                }
            }
            this.setData({ specs: specs })
            this.checkProduct();
        },
        checkProduct() {
            let productMap = this.productMap;
            let selectValues = this.selectValues;
            let selectOrderIds = [];
            for (let key in selectValues) {
                selectOrderIds.push(selectValues[key])
            }
            let key = selectOrderIds.sort(sort).join(",");
            let product = productMap[key];
            if (this.product != product) {
                this.product = product;
                this.triggerEvent("choseProduct", { product: this.product })
            }
        },
        checkComplete() {
            if (this.product) {
                return this.product;
            }
            let specs = this.specs;
            let selectValues = this.selectValues;
            for (let i = 0, sn = specs.length; i < sn; i++) {
                let spec = specs[i];
                let selectId = selectValues[spec.id];
                if (selectId) {
                    continue;
                }
                this.showError(spec.id);
                throw `请选择 '${spec.name}'`;
            }
        },
        getProduct() {
            return this.product;
        },
        showError(id) {
            wx.MyAnims.error(this, `#spec-values-${id}`);
        },
    }
});

function createData(products, productMap, powerSet) {
    for (let i = 0, n = products.length; i < n; i++) {
        let product = products[i];
        let specids;
        try {
            specids = createSpecids(product.specIds);
        } catch (e) { continue; }
        createPowerSet(specids, powerSet);
        let productKey = specids.join(",");
        productMap[productKey] = product;
    }
}
function createSpecids(specIdsStr) {
    let specids = [];
    let temps = specIdsStr.split(",")
    for (let i = 0, n = temps.length; i < n; i++) {
        let temp = temps[i];
        let id = parseInt(temp.split(":")[1]);
        specids.push(id);
    }
    return specids.sort(sort);
}

function sort(v1, v2) { return v1 - v2 }

function createPowerSet(specids, powerSet) {
    let powerSetList = [[]];
    for (let i = 0, sn = specids.length; i < sn; i++) {
        for (let j = 0, pn = powerSetList.length; j < pn; j++) {
            powerSetList.push(powerSetList[j].concat(specids[i]));
        }
    }
    for (let i = 0, n = powerSetList.length; i < n; i++) {
        let list = powerSetList[i];
        if (list.length > 0) {
            powerSet[list.join(",")] = 1;
        }
    }
}
