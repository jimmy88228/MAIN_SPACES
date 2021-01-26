const Article = r => require.ensure([], () => r(require("@/models/article/pages/index")), "article");
const ArticleEdit = r => require.ensure([], () => r(require("@/models/article/pages/edit")), "article");

const menuInfos = {
    menu: "Article"
};
const routes = [{
    name: "Article",
    path: "/article",
    component: Article,
    meta: {
        ...menuInfos,
        title: "文章列表"
    }
}, {
    name: "ArticleAdd",
    path: "/article/add",
    component: ArticleEdit,
    meta: {
        ...menuInfos,
        title: "新建文章",
        isAdd: true
    }
}, {
    name: "ArticleEdit",
    path: "/article/edit",
    component: ArticleEdit,
    meta: {
        ...menuInfos,
        title: "编辑文章"
    }
}];

const menus = [{
    name: "Article",
    title: "文章管理",
    icon: "icon-article",
    to: "Article"
}];

export default {
    routes,
    menus
};
