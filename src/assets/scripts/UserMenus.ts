import IMenuItem from "@/assets/scripts/IMenuItem";
import {RouteRecordRaw} from "vue-router";
import Home from '@/views/Home/Home.vue'

// 菜单原始数据，实际项目中可以通过服务端返回（以便进行权限控制）
const mock_data = `[
  {
    "label": "普通用户",
    "path": "/user",
    "name": "user",
    "component": "SideMenuContent",
    "isMenu": true,
    "isRoute": true,
    "children": [
      {
        "label": "我的订单",
        "path": "/user/myOrder",
        "name": "myOrder",
        "component": "Content",
        "isMenu": true,
        "isRoute": true
      },
      {
        "label": "我的收藏",
        "path": "/user/myCollection",
        "name": "myCollection",
        "component": "Content",
        "isMenu": true,
        "isRoute": true
      },
      {
        "label": "个人中心",
        "path": "/user/userCenter",
        "name": "userCenter",
        "component": "Content",
        "isMenu": true,
        "isRoute": false,
        "children": [
          {
            "label": "基本信息",
            "path": "/user/info",
            "name": "info",
            "component": "UserInfo",
            "isMenu": true,
            "isRoute": true
          },
          {
            "label": "密码管理",
            "path": "/user/password",
            "name": "password",
            "component": "Content",
            "isMenu": true,
            "isRoute": true
          }
        ]
      }
    ]
  },
  {
    "label": "管理员",
    "path": "/admin",
    "name": "admin",
    "component": "SideMenuContent",
    "isMenu": true,
    "isRoute": true,
    "children": [
      {
        "label": "商品列表",
        "path": "/admin/itemList",
        "name": "itemList",
        "component": "Content",
        "isMenu": true,
        "isRoute": true
      },
      {
        "label": "用户管理",
        "path": "/admin/userManagement",
        "name": "userManagement",
        "component": "Content",
        "isMenu": true,
        "isRoute": true
      }
    ]
  }
]`

// 根据菜单数据递归生成路由数据
const getUserRoute = (routesSrc: IMenuItem[], isChild: boolean): Array<RouteRecordRaw> => {
    const routes = []
    if(!isChild){
        // 始终将Home作为内容页路由的根节点
        routes.push({
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                label: '首页'
            },
            children: getUserRoute(routesSrc, true)
        })
    }
    else{
        routesSrc.forEach((item) => {
            if(!item.isRoute){
                if(item.children){
                    routes.push(...getUserRoute(item.children, true))
                }
            }
            else{
                routes.push({
                    // 在生成菜单时，需要使用path作为菜单的链接，因此数据源的path需要带父级路径
                    // 但是作为路由的path时则不需要（也不需要前面的/），所以要对path进行截取
                    // 也可以修改数据源的定义，在生成菜单链接时拼接父级菜单路径
                    path: item.path.slice(item.path.lastIndexOf('/')+1),
                    name: item.name,
                    component: () => import(`@/views/Home/${item.component}.vue`), // 根据component用Import动态引入组件
                    meta: {
                        label: item.label   // 设置路由的meta包含菜单的显示名称，在Content.vue中读取
                    },
                    children: item.children? getUserRoute(item.children, true): null // 对子菜单进行递归
                })
            }
        })
    }
    return routes
}

// 递归获取lPathName的所有父级菜单
const getParentMenus = (menus: IMenuItem[], lPathName: string): string[] | undefined => {
    for (const item of menus){
        if(item.name == lPathName)  return [ item.name ]
        else if (item.children){
            const lPath = getParentMenus(item.children, lPathName)
            if(lPath){
                lPath.push(item.name)
                return lPath
            }
        }
    }
}

class UserMenus{
    menusObj: IMenuItem[]
    mainMenus: IMenuItem[]
    userRoute: Array<RouteRecordRaw>

    constructor() {
        this.menusObj = JSON.parse(mock_data)
        this.mainMenus = this.menusObj.filter((item)=>{return item.isMenu})
        this.userRoute = getUserRoute(this.menusObj, false)
    }

    getSubMenus(pPath: string): IMenuItem[]{
        const filterMenusObj = this.menusObj.find((item) => item.path === pPath)
        if(!filterMenusObj) return []
        const subMenusObj = filterMenusObj.children
        return subMenusObj && subMenusObj.length > 0? subMenusObj: []
    }

    getParentMenus(lPath: string): string[] | undefined{
        return getParentMenus(this.menusObj, lPath)
    }
}

const userMenu = new UserMenus()
export default userMenu