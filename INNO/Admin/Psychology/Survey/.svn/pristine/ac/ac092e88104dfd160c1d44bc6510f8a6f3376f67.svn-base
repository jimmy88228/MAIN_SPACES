import Conf from "@/config";
import utils from "@/helper/utils/index.js";
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
            listAllData:[],
            mixinSelectData:[]
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
        loadData(index) {
            this.tableLoading = true;
            if(!index){
                index = parseInt(utils.getUrlQuery("page")) || Conf.PAGE_START;
            }
            return this.onLoadData && this.onLoadData(index, this.createListParams(index))
            .then((res)=>{
                this.page = index || Conf.PAGE_START;
                this.tableLoading = false;
                this.resetBar();
                // this.setRouteQuery(this.page);
                if(typeof(this._clearListSelect) == 'function'){
                    this._clearListSelect();
                }
                return Promise.resolve(res);
            }).catch((err)=>{
                this.tableLoading = false;
                return Promise.reject(err);
            })
        },
        loadAllData(diy=false){
            // if(this.listAllData.length>0){return Promise.resolve(this.listAllData)}
            return this.onLoadData && this.onLoadData(1,this.createListParams(1,2000),true)
            .then((res)=>{
                if(diy)return res;
                if(res && res.code){
                    let data = res.data || {};
                    let items = data.items || [];
                    for(let i = 0,len=items.length;i<len;i++){
                        items[i]._check = true;
                    }
                    this.listAllData = items;
                }
                return this.listAllData;
            })
        },
        handleUpdate() {
            console.log("page", this.page);
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
        createListParams(index,page) {
            let data = {
                page: index,
                pageSize: page||this.pageSize
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
