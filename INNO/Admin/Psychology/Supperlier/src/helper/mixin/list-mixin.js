import Conf from "@/config";
import utils from "@/helper/utils/index.js";
const MaxLimit = 5;
export default {
    data() {
        return {
            page: Conf.PAGE_START,
            pageSize: Conf.PAGE_SIZE_DEF,
            pageSizeOpts: Conf.PAGE_SIZE_OPTS,
            dateRange: null,
            keywords: null,
            orderBy: null,
            tableLoading: false,
            data: null,
            asyncId:null,
            asyncList:[],
        };
    },
    computed: {
        showPage() {
            return this.total > Conf.PAGE_SIZE_MIN;
        },
        total() {
            return (this.data && this.data.total) || 0;
        },
        list() {
            return (this.data && this.data.list) || [];
        }
    },

    methods: {
        clearOptions() {
            this.orderBy = null;
            this.keywords = null;
            this.dateRange = null;
            this.onClearOptions && this.onClearOptions();
        },
        loadData(index, pageSize, extra={}) {
            if(!extra.hideLoading)this.tableLoading = true;
            if(!index){
                index = parseInt(utils.getUrlQuery("page")) || Conf.PAGE_START;
            }
            return this.onLoadData && this.onLoadData(index, this.createListParams(index,pageSize))
            .then((res)=>{
                this.page = index || Conf.PAGE_START;
                this.tableLoading = false;
                this.resetBar();
                // this.setRouteQuery(this.page);
                return Promise.resolve(res);
            }).catch((err)=>{
                this.tableLoading = false;
                return Promise.reject(err);
            })
        },
        asyncLoadData(index = Conf.PAGE_START , pageSize = Conf.PAGE_SIZE_DEF,total = 0) {
            clearTimeout(this.asyncId);
            return this.beforeAsyncLoadData(index,total).then(res=>{
                if(res.code){
                    total = res.data && res.data.total || 0;
                    return Promise.all(this.dispatchAsync(index,pageSize,total)).then(res=>{
                        let list = [];
                        res && res.forEach(item=>{
                            let items = item.data && item.data.items||[];
                            list = [].concat(list,items);
                        })
                        this.asyncList = [].concat(this.asyncList,list);
                        if((index+MaxLimit-1) * pageSize < total){
                            this.asyncId = setTimeout(() => {
                                this.asyncLoadData(index+MaxLimit, pageSize,total);
                            }, 2000)
                        }else{
                            console.log('已load完',this.asyncList);
                        } 
                    });
                }
                return res;
            })
        },
        beforeAsyncLoadData(index,total){
            if(index == 1 && this.onLoadData){
                return this.onLoadData(index, this.createListParams(index,1),{async:true})
            }else{
                return Promise.resolve({code:true,data:{total}})
            }
        },
        dispatchAsync(page,pageSize,total){
            let PromiseArr = [];
            for(let i = page,len=page+MaxLimit;i<len;i++){
                if((i*pageSize<total) || ((i-1)*pageSize<total) && i*pageSize>total){
                    PromiseArr.push(this.dispatchItem(i,pageSize))
                }
            }
            return PromiseArr;
        },
        dispatchItem(index,pageSize){
            return this.onLoadData(index, this.createListParams(index,pageSize),{async:true})
            // return this.loadData(index,pageSize,{hideLoading:true},{async:true})
        },
        handleUpdate() {
            this.loadData(this.page);
        },
        handleAdded() {
            this.clearOptions();
            this.loadData();
        },
        handlePageSizeChange(e) {
            this.pageSize = e;
            this.loadData();
        },
        handleSortChange(e) {
            if (!e) {
                this.orderBy = null;
            } else {
                this.orderBy = `${e.key || ""} ${e.order || ""}`;
            }
            this.loadData();
        },
        getItem(index) {
            if (!this.list || index < 0 || index >= this.list.length) {
                return;
            }
            return this.list[index];
        },
        delItem(index) {
            if (!this.list || index < 0 || index >= this.list.length) {
                return;
            }
            this.list.splice(index, 1);
        },
        delItems(ids, idKey){
            ids = ids || [];
            idKey = idKey || 'id';
            let list = this.data.list || [];
            let total = this.data.total || 0;
            let _list = [];
            for(let i = 0; i < list.length; i++){
                let id = list[i][idKey];
                if(ids.indexOf(id) == -1){
                    _list.push(list[i])
                }
            }
            this.data.list = _list || [];
            total = total - ids.length;
            this.data.total = total ? total : 0;
        },
        createListParams(index,pageSize) {
            let data = {
                page: index,
                pageSize: pageSize || this.pageSize
            };
            return data;
        },
        resetBar(){
            let tableBody = document.getElementsByClassName("ivu-table-body") || [];
            for(let i = 0; i < tableBody.length; i++){
                if(tableBody[i]){
                    tableBody[i].scroll(0,0)
                }
            }
        },
        setRouteQuery(index){
            let params = utils.getUrlQuery() || {};
            let href = window.location.href || "";
            let hrefHost = href.split("?")[0] || "";
            let paramsStr = "", url = "";
            params.page = index;
            for(let i in params){
                paramsStr = paramsStr ?  paramsStr + '&' + i + '=' + params[i] : i + '=' + params[i]
            }
            url = paramsStr ? hrefHost + '?' + paramsStr : hrefHost
            window.history.replaceState(null, '', url)
        }
    }
};
