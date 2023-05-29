module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/standard"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-var": "error", //禁用var，用let和const代替
        indent: ["off", 4], //缩进风格
        quotes: ["warn", "double"], //引号类型
        semi: ["error", "always"], //语句强制分号结尾
        "generator-star-spacing": "off", //生成器函数*的前后空格
        "space-before-function-paren": "off", //函数定义时括号前面要不要有空格
        "vue/no-parsing-error": [
            "warn",
            {
                "x-invalid-end-tag": false
            }
        ],
        "vue/no-unused-components": "warn",
        "no-extra-boolean-cast": "warn", //禁止不必要的bool转换
        "no-extend-native": "off", //禁止扩展native对象
        "no-array-constructor": "off", //禁止使用数组构造器
        "operator-linebreak": "off", //换行时运算符在行尾还是行首
        "padded-blocks": "off", //块语句内行首行尾是否要空行
        "promise/param-names": "off",
        "no-undef": "off", //不能有未定义的变量
        "no-new-object": "off", //禁止使用new Object()
        "comma-dangle": "warn", //对象字面量项尾不能有逗号
        "no-unused-vars": "warn", //不能有声明后未被使用的变量或参数
        "no-throw-literal": "off" //禁止抛出异常字面量
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};
