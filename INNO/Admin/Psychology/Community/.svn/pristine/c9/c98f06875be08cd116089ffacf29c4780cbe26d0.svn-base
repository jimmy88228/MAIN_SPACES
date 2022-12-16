import Conf from "@/config";
import DateUtil from "@/helper/utils/date-util";
import StringUtil from "@/helper/utils/string-util";
export default {
    data() {
        return {
            pageIndex: Conf.PAGE_START,
            pageSize: Conf.PAGE_SIZE_DEF,
            pageSizeOpts: Conf.PAGE_SIZE_OPTS,
            dateRange: null,
            keywords: null,
            orderBy: null,
            loading: false,
            data: null
        };
    },
    computed: {
        showPage() {
            return this.count > Conf.PAGE_SIZE_MIN;
        },
        count() {
            return (this.data && this.data.count) || 0;
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
        loadData(index = Conf.PAGE_START) {
            return this.onLoadData && this.onLoadData(index, this.createListParams(index));
        },
        handleUpdate() {
            this.loadData(this.pageIndex);
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
        createListParams(index) {
            let data = {
                pageIndex: index,
                pageSize: this.pageSize
            };
            if (StringUtil.trim(this.orderBy)) {
                data.orderBy = this.orderBy||"";
            }
            if (StringUtil.trim(this.keywords)) {
                data.keywords = this.keywords||"";
            }
            if (this.dateRange && this.dateRange.length > 0) {
                if (this.dateRange[0]) {
                    data.stime = DateUtil.format(this.dateRange[0], "yyyy-MM-dd HH:mm:ss") || "";
                }
                if (this.dateRange[1]) {
                    data.etime = DateUtil.format(this.dateRange[1], "yyyy-MM-dd HH:mm:ss") || "";
                }
            }
            return data;
        }
    }
};
