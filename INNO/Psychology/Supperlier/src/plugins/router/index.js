import PMRouter from "@/support/libs/pm/page-manager";
import * as Pages from "./router";
import Conf from "@/config";
import routesConfig from "@/models/router-config.js";


const DefAnim = {
    openEnter: {
        active: "fadeIn anim-bottom anim-500"
    },
    openLeave: {
        active: "fadeOut anim-top anim-500"
    },
    closeEnter: {
        active: "fadeIn anim-bottom anim-500"
    },
    closeLeave: {
        active: "fadeOut anim-top anim-500"
    }
};
const router = new PMRouter({
    mode: 'hash',
    listenGuide: true,
    title: Conf.TITLE,
    anim: DefAnim,
    routes: [
        {
            path: "/",
            redirect: "/controlpanel"
        },
        {
            name: "Login",
            path: "/login",
            component: Pages.Login,
            title: "登录"
        },
        {
            name: "ControlPanel",
            path: "/controlpanel",
            component: Pages.ControlPanel,
            children: [
                {
                    path: "/controlpanel",
                    redirect: routesConfig.routes[0].path
                },
                ...routesConfig.routes
            ]
        },
        {
            name: "error-404",
            path: '/*',
            component: Pages.ErrorPage,
        }
    ]
});

export const $pm = router.$pm;
export default router;
