
const BaseComp = function(compOption){
	let co = compOption || {};
	let bco = {
		beforeCreate(...args) {
			co.beforeCreate && co.beforeCreate.call(this, ...args);
		},
		created(...args) {
			co.created && co.created.call(this, ...args);
		},
		beforeMount(...args){
			co.beforeMount && co.beforeMount.call(this, ...args);
		},
		mounted(...args){
			co.mounted && co.mounted.call(this, ...args);
		},
		beforeUpdate(...args){
			co.beforeUpdate && co.beforeUpdate.call(this, ...args);
		},
		updated(...args){
			co.updated && co.updated.call(this, ...args);
		},
		beforeDestroy(...args){
			co.beforeDestroy && co.beforeDestroy.call(this, ...args);
		},
		destroyed(...args){
			co.destroyed && co.destroyed.call(this, ...args);
		}
	}
	
	return {
		...co,
		...bco
	}
}

Page.BaseComp = BaseComp;

export default BaseComp

