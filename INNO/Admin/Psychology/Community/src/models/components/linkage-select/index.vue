<template>
    <div class="linkage-select-area">
        <div class="flex-c-c">
            <FormItem label="组织" :label-width="50">
                <data-cascader placeholder="请筛选组织" ref="organizeCascader" class="base-320 organize" type="organize" v-model="searchForm.prent_structure_ids" valueKey="id" labelKey="structure_name" @change="changeOrganize" @dismiss="dismiss" :showDefault="true"
          :defaultData="{id: -1, structure_name: '未知'}"></data-cascader>
            </FormItem>
        </div>
    </div>
</template>

<script>
export default {
    name: "linkage-select",
    props: {
        searchForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        hideSelect: {
            // 手动限制显示
            type: Array,
            default: () => {
                return []
            },
        },
    },
    data() {
        return {
            area_id: 0,
            timer: null,
        };
    },
    methods: {
        initData() {
            let _structureType = this._structureType;
            if (_structureType) {
                switch (_structureType) {
                    case "structure":
                        this.$set(
                            this.searchForm,
                            "structure_id",
                            0
                        );
                        break;
                }
            }
        },
        checkIsShow(type){
            if(this.hideSelect.length > 0){
               return this.hideSelect.indexOf(type) == -1
            } else { return true }
        },
        changeSelect(type, isInit) { // 初始化时不初始化传进来的值
            // console.log("changeSelect", type,isInit);
            // this.$nextTick(() => {
            //     switch (type) { 
            //         case "":
            //             break;
            //         default:
            //             break;
            //     }
            // });
        },
        changeOrganize(data) {
            if(data instanceof Array){
                let id = data.slice(-1)[0] || 0;
                this.$set(this.searchForm, "structure_id", id)
                this.timer = setTimeout(()=>{
                    this.$emit("on-change", this.searchForm);
                    this.timer = null;
                }, 300);
            }
        },
        dismiss(){
            this.$emit("dismiss", this.searchForm);
        },
    },
    mounted() {
        this.initData();
    },
};
</script>

<style lang="less" scoped>
.linkage-select-area {
    display: inline-block;
    vertical-align: middle;
    .screen-item {
        width: 150px;
    }
    .organize{
        // min-width: 300px;
    }
}
</style>