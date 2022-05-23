import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Login from '../views/Login.vue'

import userMenus from "@/assets/scripts/UserMenus";
import utils from "../assets/scripts/utils";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

// 拼接动态路由
routes.push(...userMenus.userRoute)

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if(to.path === '/login' || utils.verifyToken()){
        next()
    }
    else{
        // targetUrl记录当前url，以便登录成功后跳转到当前页面
        next({path: '/login', query: {targetUrl: to.fullPath}})
    }
})

export default router
