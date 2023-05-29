import MyProxy from "./proxy"; 

let nullFn = () => {};
function IllegalAPIException(name) {
    this.message = "No Such API [" + name + "]";
    this.name = "IllegalAPIException";
}
const UniApi = new MyProxy(uni, {
    get: function(target, property) {
				if(target[property]){
					return obj => {
						return target[property](obj).then((result)=>{
							let [err, res]  = result;
							if(err){
								return Promise.reject(err);
							} else {
								return Promise.resolve(res);
							}
						})
						
					}
				} else {
					throw new IllegalAPIException(property);
				}
    }
});
export default UniApi;
