<template>
    <div class="rewrite-search">
        <div class="rewrite-search-area">
            <div class="search-prepend">
                <slot name="prepend">
                    <div class="p-l-10 p-r-10">
                        <Icon type="md-search" />
                    </div>
                </slot>
            </div>
            <Input :value="value" on-enter="search" :search="true" @on-change="changeInput" :placeholder="placeholder" clearable enter-button @on-search="search" @on-clear="search" class="rewrite-search-input" @keydown.native.enter.prevent></Input>
            <div class="search-append" @click="search">
                <slot name="append">
                    <a>{{searchTxt}}</a>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "rewrite-search",
    model: {
        prop: "value",
        event: "change",
    },
    props: {
        value: {
            type: String,
            default() {
                return "";
            },
        },
        placeholder: {
            type: String,
            default: "",
        },
        searchTxt: {
            type: String,
            default: "搜索",
        },
    },
    data() {
        return {
            inputValue: "",
        };
    },
    methods: {
        changeInput(event) {
            let target = event.target || {};
            this.inputValue = target.value || "";
            this.$emit("change", this.inputValue);
        },
        search() {
            this.$emit("search", this.inputValue);
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/variables.less";
.rewrite-search {
    display: inline-block;
    .rewrite-search-area {
        display: flex;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0px;
        background-color: #fff;
        transition: all 0.35s;
        .search-prepend {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            // padding: 0px 10px;
            font-size: 18px;
            color: #515a6e;
            .ivu-select {
                .ivu-select-selection,
                .ivu-select-selection:focus {
                    border: 0 none;
                    outline: none;
                    background: none;
                    box-shadow: unset;
                }
            }
        }
        .rewrite-search-input {
            border: 0 none;
            width:100%;
            .ivu-input,
            .ivu-input:focus {
                border: 0 none;
                outline: none;
                background: none;
                box-shadow: unset;
            }
            .ivu-input-group-append{
              display: none;
            }
        }
        .search-append {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0px 10px;
            font-size: 12px;
            white-space: nowrap;
            border-left: 1px solid #ddd;
        }
    }
    .rewrite-search-area:hover {
        // border-color: @primary-color;
    }
    // .ivu-input-group-with-prepend .ivu-input {
    //     border-left: 0px;
    // }
    // .ivu-input-group-prepend {
    //     background: #fff;
    //     padding: 0px;
    //     width: auto;
    //     display: flex;
    //     align-items: center;
    // }
    // .ivu-input-group-prepend .ivu-btn,
    // .ivu-input-group-prepend .ivu-select {
    //     margin: 0px;
    //     position: relative;
    //     background: none;
    //     color: #b2b2b2;
    // }
    // .ivu-input-group-prepend .ivu-btn {
    //     margin-top: -1px;
    //     margin-bottom: -1px;
    // }
    // .ivu-input-group-prepend .ivu-btn .ivu-icon {
    //     position: absolute;
    //     top: 50%;
    //     left: 50%;
    //     transform: translate(-50%, -50%);
    //     font-size: 120%;
    // }
    // .ivu-input-group-append {
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    // }
}
</style>