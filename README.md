## 简介

> 参考博客：[Vue Koa开发实战](https://www.jianshu.com/p/8237b4e1cf60)

本文以新手视角，在`Windows平台` 从零开始逐步构建一个`Vue3` +`Koa2` 的web应用，项目主要包括以下内容：

- 基于`Vue3`+`TypeScript` 构建单页面应用，包含登录、用户、管理员视图，由`Vue Router`控制页面跳转
- 使用`Koa2`及相关插件提供API接口
- `Sequelize`数据库访问
- 基于`json web token`的登录验证
- 配置本地运行、打包部署

前端部分使用`Vue CLI`搭建脚手架。



## 安装Node.js

使用`nvm for windows` 进行node版本管理

nvm-windows下载地址：[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

> 本文下载的是v1.1.8安装版

1. 安装nvm，同意协议后进入下一步

2. 选择nvm的本地安装目录，注意nvm的安装路径中不能有中文或空格

> 本文将nvm安装在D:\根目录下（D:\nvm）

3. 下一步设置Node.js的Symlink，即需要设置nodejs的快捷方式存放的目录

> 本文将nodejs快捷方式放置在D:\根目录下（D:\nodejs）

4. 如果电脑上原本安装了nodejs，会出现弹窗询问是否允许nvm管理已下载的node版本

> 本文此前已安装Node v14.18.0，这里选择是

5. 安装完成后可以看到在D:\下生成了以下两个文件夹，原本电脑上的node版本被移入nvm中，并添加了版本号

```
├── nodejs
└── nvm
    └── v14.18.0
```

6. 在nvm安装目录下找到settings.txt文件加上如下两行，设置node和npm镜像为淘宝镜像

```
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

7. 在命令行输入nvm，如果出现nvm版本号和一系列帮助指令，则说明nvm安装成功
8. 如果电脑未安装nodejs的，可以**以管理员身份**运行命令行，然后执行以下命令：

```shell
nvm install lts
nvm use lts
```

#### nvm常用命令

```shell
nvm ls	//	 查看目前已经安装的版本
nvm current // 查看当前使用的版本
nvm install x.x.x	// 安装指定版本的nodejs，使用latest指定最新版，使用lts指定最新LTS版本
nvm use x.x.x // 切换当前使用的版本
```

> ### 问题处理记录
>
> #### 问题
>
> 执行`nvm use x.x.x` 时报错，错误提示为`exit status 1: ��û���㹻��Ȩ��ִ�д˲�����` 。
>
> #### 处理过程
>
> 1. 执行`nvm use lts >D:/nvm/error.txt` ，将错误提示输出到error.txt文件下解决错误提示的乱码问题；
> 2. 打开error.txt，可以看到错误提示为`exit status 1: 你没有足够的权限执行此操作。`；
> 3. 可以判断是权限问题，改成以管理员身份运行命令行，再执行`nvm use x.x.x`，提示`Now using node v14.18.0 (64-bit)`，问题解决。

9. 在命令行执行`node -v`和`npm -v`，分别显示node和npm的版本号，说明nodejs已安装成功
10. 设置npm registry为淘宝镜像，在命令行执行如下命令

```
npm config set registry https://registry.npm.taobao.org
```

配置后可以通过以下命令来验证是否成功

```
npm config get registry
```



## 安装vue-cli

本文采用全局安装的方式安装`VUE CLI`

执行以下命令

```
npm i @vue/cli -g
```

> **注意**：
>
> 在VueCLI 4.x 中，Vue CLI 的包名称由 `vue-cli` 改成了 `@vue/cli`。如果执行`npm i vue-cli`会安装到旧版的Vue CLI。



## 创建git仓库

本文使用`git`进行版本管理，并将代码托管在`gitee`上。

1. 注册gitee账号并登录，新建名称为Vue Koa仓库。
2. 在本地目录下执行以下命令

```
mkdir vue-koa
cd vue-koa
git init
git remote add origin https://gitee.com/***/vue-koa.git(替换为你的gitee仓库地址)
```



## 初始化项目

下面开始使用Vue CLI进行项目的初始化。

> 本文使用的Vue CLI版本为v4.5.13

执行以下命令

```
cd ../
npx vue create vue-koa
```

在VUE CLI创建项目引导程序中依次选择进入自定义配置选项

```
Merge
Manually select features
```

以下是本文采用的配置

![vue-cli-manually-select-features](.\assets\vue-cli-manually-select-features.png)

> `Choose Vue version`: 稍后选择vue版本（2.x或3.x）
> `Babel`: 将ES6编译成ES5
> `TypeScript`: JS超集，主要是类型检查
> `Progressive Web App (PWA) Support`: 
> `Router`: 路由管理
> `Vuex`: 状态管理
> `CSS Pre-processors`: css预编译
> `Linter / Formatter`: 代码检查工具
> `Unit Testing`: 单元测试（需要安装vs build tool），vue单元测试的文档链接 [Vue Test Utils for Vue 3](https://next.vue-test-utils.vuejs.org/)
> `E2E Testing`: 端对端测试

回车后进行详细配置

```
Choose a version of Vue.js that you want to start the project with
  2.x
> 3.x
```
> 选择vue版本，这里选择3.x

```
Use class-style component syntax? (y/N)
> y
```

> 是否使用Class风格装饰器？
> 即原本是：`home = new Vue()`创建vue实例
> 使用装饰器后：`class home extends Vue{}`

```
Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? (Y/n) 
> y
```

> 是否使用Babel与TypeScript一起用于自动检测的填充?

```
Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
> y
```

> 路由是否使用历史模式? 这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面

```
Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default):
  Sass/SCSS (with dart-sass)
  Sass/SCSS (with node-sass)
  Less
> Stylus                          
```

> 使用什么css预编译器？ 本文选择 `stylus`

```
Pick a linter / formatter config: (Use arrow keys)
> ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
  TSLint (deprecated)               
```

> 选择linter配置
>
> `ESLint with error prevention only`: 只进行报错提醒（本文选择这个） 
> `ESLint + Airbnb config`: 不严谨模式
> `ESLint + Standard config`: 正常模式
> `ESLint + Prettier`: 严格模式
> `TSLint (deprecated)`: typescript格式验证工具

```
Pick additional lint features: 
>(*) Lint on save
 ( ) Lint and fix on commit    
```

> 代码检查方式，本文选择保存时检查

```
Where do you prefer placing config for Babel, ESLint, etc.?
  In dedicated config files
> In package.json                                                          
```

> 本文选择将所有的依赖目录放在package.json文件里

```
Save this as a preset for future projects? (y/N)
> n
```

> 是否在以后的项目中使用以上配置？这里选择否

然后项目就会开始进行初始化并安装相关依赖包

项目初始化完成后，输入以下命令

```
cd vue-koa
npm run serve
```

如果顺利，会输出

```
App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.xxx.xxx:8080/
```

此时使用浏览器访问`http://localhost:8080`，显示`Welcom to Your Vue.js + TypeScript App`，则说明项目初始化完成。



在根目录下新建`server`目录，作为koa代码目录（后端目录），在目录下创建`app.js`文件作为入口文件，整体目录结构如下：

```
.
├── doc # 项目说明文档
│   └── ...
├── node_modules
│   └── ...
├── public
│   ├── favicon.ico
│   └── index.html
├── server # 后端源码目录
│   └── app.js # 后端入口
├── src # 前端源码目录
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── router # 路由
│   │   └── index.ts
│   ├── views # 视图
│   │   ├── About.vue
│   │   └── Home.vue
│   ├── App.vue # vue根组件，main.ts中将该组件挂载到index.html中
│   ├── main.ts # 前端入口
│   └── shims-vue.d.ts # 将vue文件类型引入给ts
├── .gitignore
├── babel.config.js
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

下面将初始化内容提交到仓库。

> Vue CLI在初始化项目时会自动生成.gitingore文件和README.md文件。

执行以下命令

```
git add .
git commit -m "init"
git push -u origin master
```



## 接口定义

项目使用`jwt token`做登录验证，用户登录时，前端调用`获取token`接口，使用用户名和密码认证，接口返回经`jwt`加密的`token`；随后，前端发送所有请求均携带该`token`作为已登录凭证

按照标准，`token`类型为`Bearer`，对需要权限认证的接口，`request header`设置字段`{Authorization: 'Bearer <token>'}`；对于认证失败的请求，服务器应当返回401，`response header`设置字段`{'WWW-Authenticate': 'Bearer'}`



后端服务运行在3000端口，提供以下两个接口：

#### 获取token

请求参数

```
Method: POST
Api: /api/auth
Body: {username: <username>, password: <password>}
```

返回值

```json
{
    "code": 200,
    "token": <token>
}
```

#### 获取用户信息

接口需要携带`token`

请求参数

```
Method: GET
Api: /api/user
```

返回值

```
{
	"username": "wingSnow",
	"roles": [
		"user"
	],
	"gender": 'M',
	"age": 18
}
```

## 前端页面构建

前端是一个具有两级导航结构的页面，页面顶部导航栏为一级导航，侧边导航菜单为二级导航。点击顶部导航的菜单项切换侧边导航菜单，点击侧边导航菜单切换页面主体内容。

### 使用WebStorm进行调试

1. 在WebStorm添加运行/调试配置

![webstorm-debug-config](.\assets\webstorm-debug-config.png)

> **辟谣？：**
>
> 1. 网传要修改webstorm内置服务器端口号与前端运行时端口号相同。验证不需要，而且修改后会导致端口号冲突导致运行前端时端口号自动变为8081；
> 2. 网传要配置文件/目录的远程URL为webpack:////src。验证不需要；
> 3. 网传要在chrome中安装插件JetBrains IDE Support。本文使用的是edge浏览器，验证至少在edge浏览器下不需要。

2. 使用`npm run serve`运行项目，注意此时**不要**打开浏览器访问http://localhost:8080。
3. 在WebStorm中运行**调试**`vue debug`，之后会自动打开浏览器，此时就可以在WebStorm中进行断点调试或监控。

![webstorm-debug-run](.\assets\webstorm-debug-run.png)

### 引入UI组件

引入`ant-design-vue`组件库，简化页面排版

> 用法参考[Ant Design Vue](https://2x.antdv.com/docs/vue/introduce-cn)

```
npm i ant-design-vue@next
```

> 由于项目基于Vue3，所以需要使用ant-design-vue 2.x

**完整引入**

修改`src/main.ts`，引用antd的组件和样式文件

```tsx
/* src/main.ts */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

createApp(App)
	.use(router)
	.use(Antd)
	.mount('#app')
```

修改`src/views/Home.vue`的template内容

```vue
/* src/views/Home.vue */

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
	<a-button type="primary">Button</a-button>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>
...
```

现在可以看到页面上已经有了 antd 的蓝色按钮组件。

**按需加载**

本文采用完整引入方式，实际项目中考虑前端性能问题建议按需加载，[参考文档](https://2x.antdv.com/docs/vue/getting-started-cn#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)。



### 引入Logger组件

本文采用`vue-logger-plugin`来方便打印log。

> 用法参考[vue-logger-plugin - npm](https://www.npmjs.com/package/vue-logger-plugin)

```
npm i vue-logger-plugin
```

> **提示**：原博客中采用的vuejs-logger组件只支持vue2.x，因此在本文中不适用。

修改`src/main.ts`，引用logger组件并进行配置

```tsx
/* src/main.ts */

import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import { createLogger } from 'vue-logger-plugin'

const isProduction = process.env.NODE_ENV === 'production';

const options = {
    level: isProduction ? 'error' : 'debug'
}

const app = createApp(App)
app.config.productionTip = false

app.use(createLogger(options))
app.use(Antd)

app.mount('#app')
```

修改`src/views/Home.vue`的script内容

```vue
/* src/views/Home.vue */

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { useLogger } from 'vue-logger-plugin'	// 引入logger的useLogger方法

import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  }
})

export default class Home extends Vue {
	private logger = useLogger()
	msg = '测试消息'
	
	logTest(){
		this.logger.debug('Debug Message')
		this.logger.info('Info Message', { name: '测试' })
		this.logger.warn('Warn Message', this.msg, 123)
		this.logger.error('Error Message')
		this.logger.log('Log Message')
	}
	
}
</script>
```

然后将logTest()事件绑定到Button的click事件中

```html
<a-button type="primary" @click="logTest">Button</a-button>
```

现在我们点击页面上的蓝色按钮，可以看到浏览器控制台输出如下

![logger-test-without-debug](.\assets\logger-test-without-debug.png)

可以发现Debug Message没有正常输出（尽管我们在main.js中已经将logger的打印级别设置为debug），这是因为在Chrome和Edge浏览器的控制台消息显示默认级别是过滤debug的。

> 本文使用的是Edge浏览器

![logger-test-with-debug](.\assets\logger-test-with-debug.png)

通过修改显示级别，可以看到所有消息都正常输出了。

### 建立目录结构

**路由结构分析**

> 在本项目，我们设定有**登录页**，登录成功后跳转到**内容页**，内容页包括**普通用户**视图和**管理员**视图；
>
> 在**普通用户**视图下，用户可以通过菜单切换**“我的订单”**、**“我的收藏”**、**“基本信息”**和**“密码管理”**页面，其中**“基本信息”**和**“密码管理”**收纳在父级菜单**“个人中心”**下；我们设定父级菜单是不可点击的；
>
> 而在**管理员**视图下，菜单包括**“商品管理”**和**“用户管理”**两个选项，点击它们可以跳转到对应的页面。

```
App
├── Login # 登录页面
└── Home # 内容页面
    ├── user # 普通用户
    │   ├── myOrder # 我的订单
    │   ├── myCollection # 我的收藏
    │   └── (userCenter) # 个人中心
    │       ├── info # 基本信息
    │       └──	password # 密码管理
    └── admin # 管理员
        ├── itemList # 商品列表
        └── userManagement # 用户管理
```

据此，我们在`src`目录下建立如下目录结构

```
src
├── assets
│   ├── scripts # 通用/辅助的scripts
│   │   ├── IMenuItem.ts # 菜单数据接口
│   │   └── UserMenus.ts # 使用json动态生成菜单及路由
│   └── logo.png
├── components
│   ├── BreadCrumbComponent.vue # 面包屑组件
│   ├── MenuComponent.vue # 顶部导航栏主菜单组件
│   └── SideMenuComponent.vue # 侧边菜单组件
├── router
│   └── index.ts # 路由
├── views
│   ├── Home
│   │   ├── Content.vue # 
│   │   ├── Home.vue # 
│   │   └── SideMenuContent.vue #
│   └── Login.vue #
├── App.vue
├── main.ts
└── shims-vue.d.ts
```

**目录结构分析**

- `/App.vue`: 页面的根目录，只包含一个`router-view`，提供一级路由切换，导航到登录页、登录成功后的内容页、以及未来可能需要增加的注册页、404页面等。
- `/views/Login.vue`: 登录页面，该视图包括顶栏、底部页脚，中部是登录页面的主体，目前我们仅在其中设置一个按钮，在点击后z直接跳转到内容页。实际的登录逻辑我们在稍后再实现。
- `/views/Home/Home.vue`: 该视图是内容视图的主页，顶部是导航栏及主菜单，中部是`router-view`，提供二级路由切换，如点击主菜单的“普通用户”，导航到`/user`，`router-view`渲染对应的内容。我们将主菜单定义为`MenuComponent.vue`组件以便后续扩展。
- `/views/Home/SideMenuContent.vue`: 该视图采用侧边布局，左侧是二级导航栏，使用组件`subMenuComponent.vue`渲染二级菜单，右侧包括一个面包屑（显示当前页面在系统层级结构中的位置）组件`breadcrumbComponent.vue`和一个`router-view`，点击二级菜单导航到不同的内容页面，`router-view`渲染对应的内容。我们将`Home`和`SideMenuContent`分开，这样未来需要出现不包括侧边栏的内容页时可以方便扩展。
- `/views/Home/Content.vue`：最终内容统一使用该视图渲染。目前我们仅设置一个简单的显示一行文字的视图作为内容页面，点击二级菜单后`router-view`统一渲染该页面，只是文字的内容不同。
- `/router/index.ts`: 在本项目中，包括菜单结构、面包屑、路由等多处需要使用到页面结构，因此采用json统一动态生成菜单数据和路由数据的方案（在`UserMenus.ts`中进行管理），因此在路由文件中需要将固定路由（如登录页、404页等）和动态路由进行拼接。

### 代码分析

#### IMenuItem.ts

```typescript
/* src/assets/scripts/IMenuItem.ts */

export default interface IMenuItem {
    label: string
    path: string
    name: string
    component?: string
    isMenu?: boolean
    isRoute?: boolean
    children?: IMenuItem[]
}
```

定义菜单数据接口，本项目使用菜单数据动态生成菜单和路由。其属性包括

```
label: 显示名称
path: 路由路径
name: 名称，其作为路由名称和菜单的key
component?: 组件名称 （?表示其是可选的）
isMenu?: 是否菜单，如果不是菜单，则该节点及其子节点均不会生成菜单，只生成路由
isRoute?: 是否路由，如果不是路由，则该接待你不会生成路由，但其子节点仍会生成路由（作为该节点的父节点的子节点）
children?: 子菜单
```

#### UserMenus.ts

本项目采用的菜单数据源如下：

```json
[
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
            "component": "Content",
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
]
```

```typescript
/* src/assets/scripts/UserMenus.ts */

import IMenuItem from "@/assets/scripts/IMenuItem";
import {RouteRecordRaw} from "vue-router";
import Home from '@/views/Home/Home.vue'

// 菜单原始数据，实际项目中可以通过服务端返回（以便进行权限控制）
const mock_data = `...`

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
                    // 根据component用Import动态引入组件
                    component: () => import(`@/views/Home/${item.component}.vue`), 
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
```

动态生成菜单和路由数据

#### Login.vue

```vue
/* src/views/Login.vue */

<template>
    <a-layout class="login">
        <a-layout-header>
            <div class="logo"/>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
                <a-button type="primary" @click="login">Login</a-button>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Vue-Koa ©2021 Created by WingSnow
        </a-layout-footer>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import {useLogger} from "vue-logger-plugin";

@Options({

})

export default class Login extends Vue {
    private logger = useLogger()

    login() {
        this.logger.log("Login")
        this.$router.push({path: '/'})
    }
}
</script>

<style lang="stylus" scoped>
.site-layout-content
    min-height 280px
    padding 24px
    background #fff

.logo
    float left
    width 120px
    height 31px
    margin 16px 24px 16px 0
    background rgba(255, 255, 255, 0.3)

.ant-row-rtl .logo
    float right
    margin 16px 0 16px 24px

[data-theme='dark'] .site-layout-content
    background: #141414

</style>
```

如前文所述，登录页的结构包括顶栏、登录页面主体及底栏，登录页面主体目前仅包括一个`Login`按钮，其点击事件绑定该组件的`Login()`事件，点击后通过`this.$router.push({path: '/'})`跳转到内容页主页。

![view-login](.\assets\view-login.png)



#### Home.vue

```vue
/* src/views/Home/Home.vue */

<template>
    <a-layout>
        <a-layout-header class="header">
            <div class="logo"/>
            <menu-component :menus="mainMenus"></menu-component>
        </a-layout-header>
        <router-view></router-view>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import MenuComponent from "@/components/MenuComponent.vue"
import userMenu from "@/assets/scripts/UserMenus";

@Options({
    components: {MenuComponent}
})
export default class Home extends Vue {
    mainMenus = userMenu.mainMenus
}
</script>

<style lang="stylus" scoped>
.logo
    float left
    width 120px
    height 31px
    margin 16px 24px 16px 0
    background rgba(255, 255, 255, 0.3)

.ant-row-rtl .logo
    float right
    margin 16px 0 16px 24px

.site-layout-background
    background #fff

</style>
```

内容视图的主页包括顶部导航栏和一个用于渲染内容的`router-view`，顶部导航栏内包括一个菜单栏，其被抽象为`MenuComponent`组件。值得一提的是，我们在`Home`组件中使用`userMenu.mainMenus`来初始化组件的`mainMenus`，并将其作为参数传入`MenuComponent`组件。

> 可以看到，本项目的Vue组件采用class风格编写，正如我们在项目初始化时选择的那样。这使得我们在处理组件的date、methods和computed properties更加方便，例如data的属性可以直接定义为class的属性。更多关于vue-class-component的介绍可以查阅官方文档[ Vue Class Component ](https://class-component.vuejs.org/)。

#### MenuComponent.vue

```vue
/* src/components/MenuComponent.vue */

<template>
    <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="menuSelectedKeys"
        :style="{ lineHeight: '64px' }"
    >
        <a-menu-item
            v-for="item in menus"
            :key="item.name"
        >
            <router-link :to="item.path">
                {{ item.label }}
            </router-link>
        </a-menu-item>
    </a-menu>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import IMenuItem from "@/assets/scripts/IMenuItem";

@Options({
    props: {
        menus: Array
    }
})
export default class MenuComponent extends Vue {
    menus!: IMenuItem[]
    _menuSelectedKeys!: string[]

    get menuSelectedKeys(): string[]{
        const routePath = this.$route.path.split('/')
        return this.menus.map(item => item.name).filter(item => routePath.includes(item))
    }

    set menuSelectedKeys(value: string[]){
        this._menuSelectedKeys = value
    }
}
</script>
```

这是顶部导航栏的主菜单组件。需要注意的点包括在使用`vue-class-component`时`props`的用法，`ant-design-vue`的`a-menu`组件和`vue router`的`router-link`组件嵌套使用的用法。

使用`vue-class-component`定义`props`时，我们需要在`@Options`装饰器中对props进行定义，然后在class中将其设为class的属性（这样我们才能使用this.进行访问）。
typescript默认启用了`strictPropertyInitialization`选项，它要求类中的所有属性都需要初始化（可以选择定义时初始化或者在构造器中初始化），在本案例中，`menus`属性实际上会被自动地使用props进行初始化，因此这里采用非空断言（!）来规避这一问题。

为了解决直接通过url访问子页面/访问上一页时菜单选中项不正确的问题，将`a-menu`组件的`selectedKeys`属性绑定到计算属性`menuSelectedKeys`，根据route.path动态返回（而不是在点击菜单时设置选中项）。`selectedKeys`需要绑定到一个可写的数组，因此该计算属性需要设置`set`方法，但就本项目而言，该`set`方法并无实际意义。

> 为使这一方案生效，路由（path）和菜单的key（name）需要是一一对应的。

另外注意`a-menu`组件的`selectedKeys`需要进行双向绑定，因此必须使用`v-model:selectedKeys`而不能使用`:selectedKeys`（其相当于`v-bind:selectedKeys`，只是单向绑定元素）。

![view-home](.\assets\view-home.png)

#### SlideMenuContent.vue

接下来，让我们点击主菜单，`router-link`组件会使页面跳转到`to`属性绑定的路由，使Home.vue的`router-view`渲染`SlideMenuContent.vue`视图。

> 当点击 `<router-link> `时，会在内部调用`$router.push(...)`

```vue
/* src/views/Home/SlideMenuContent.vue */

<template>
    <a-layout>
        <sub-menu-component></sub-menu-component>
        <a-layout style="padding: 0 24px 24px">
            <bread-crumb-component></bread-crumb-component>
            <router-view></router-view>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import IMenuItem from "@/assets/scripts/IMenuItem";
import SubMenuComponent from "@/components/SideMenuComponent.vue";
import BreadCrumbComponent from "@/components/BreadCrumbComponent.vue";

@Options({
    components: {SubMenuComponent, BreadCrumbComponent}
})
export default class sideMenuContent extends Vue {
}
</script>
```

这个视图本身很简单，它只是将`SubMenuComponent`组件（侧边栏）、`BreadCrumbComponent`组件（面包屑）和一个`router-view`组件（用于渲染页面的实际内容）拼接起来，需要关注的这些组件的内部实现。

#### SubMenuComponent.vue

```vue
/* src/components/MenuComponent.vue */

<template>
    <a-layout-sider width="200" style="background: #fff">
        <a-menu
            mode="inline"
            v-model:selectedKeys="menuSelectedKeys"
            v-model:openKeys="openKeys"
            :style="{ height: '100%', borderRight: 0 }"
        >
            <template v-for="item in menus" :key="item.name">
                <a-sub-menu
                    v-if="item.children"
                    :key="item.name"
                >
                    <template #title>
                        <span>
                            {{ item.label }}
                        </span>
                    </template>
                    <a-menu-item
                        v-for="subItem in item.children"
                        :key="subItem.name"
                    >
                        <router-link :to="subItem.path">
                            {{ subItem.label }}
                        </router-link>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item
                    v-else
                    :key="item.name"
                >
                    <router-link :to="item.path">
                        {{ item.label }}
                    </router-link>
                </a-menu-item>
            </template>

        </a-menu>
    </a-layout-sider>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import IMenuItem from "@/assets/scripts/IMenuItem";
import userMenu from "@/assets/scripts/UserMenus";

@Options({
})
export default class SubMenuComponent extends Vue {
    _menuSelectedKeys!: string[]
    _openKeys!: string[]

    get menuSelectedKeys(): string[]{
        return this.$route.matched.map(item => (item.name as string)).slice(-1)
    }

    set menuSelectedKeys(value: string[]){
        this._menuSelectedKeys = value
    }

    get openKeys(): string[]{
        const pathRoute = userMenu.getParentMenus(this.menuSelectedKeys[0])
        return pathRoute? pathRoute: []
    }

    set openKeys(value: string[]){
        this._openKeys = value
    }

    get menus(): IMenuItem[]{
        return userMenu.getSubMenus(this.$route.matched[1].path)
    }
}
</script>
```

基于与`MenuComponent.vue`相同的考虑，这一菜单的`selectedKeys`属性也选择绑定到计算属性上，这里我们采用`$route.matched`来获取路由的path，从结果来说它与我们在`MenuComponent.vue`使用的`$route.path.split('/')`没有什么区别。本项目中侧边菜单的key就是path的最后一级，所以我们直接返回最后一项即可。

> js的Array.slice(start, end)方法参数为负数时，表示从后往前截取，-1是最后一个元素。

由于我们的侧边菜单可能有子菜单（我们通过菜单数据是否存在`children`属性来决定渲染`<a-sub-menu>`组件还是`<a-menu-item>`），我们还需要定义`openKeys`属性。例如当我们选中`/普通用户/个人中心/基本信息`时，需要将`个人中心`添加到`openKeys`数组中。因此我们定义了`userMenu.getParentMenus`方法，它会返回一个包含入参所有父级菜单的name的数组，例如输入基本信息（info），会返回['info', 'userCenter', 'user']。

在计算属性`menus`中，我们使用`$route.matched[1].path`作为入参，当path时`/user/info`时，`$route.matched`会获得一个长度为3的数组，其各项的path分别为`/`、`/user`、`/user/info`。`userMenu.getSubMenus`方法会返回入参的子菜单数据，我们根据这个数据设置侧边菜单栏。

#### BreadCrumbComponent.vue

```vue
/* src/components/BreadCrumbComponent.vue */

<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item
            v-for="item in breadcrumbs"
            :key="item.name"
        >
            <router-link :to="item.path">
                {{ item.label }}
            </router-link>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
})
export default class BreadCrumbComponent extends Vue {
    get breadcrumbs(): { name: string, path: string, label: string }[]{
        return this.$route.matched.map(item => {
            return {
                name: item.name as string,
                path: item.path as string,
                label: item.meta.label as string
            }
        })
    }
}
</script>
```

在面包屑组件中定义了`breadcrumbs`计算属性，它根据`$route.matched`构造用于生成面包屑的数组，我们将路径的中文名称存放在路由的`meta`属性中并在此处使用

> 可以注意定义返回值的写法，它是可选的（你可以使用any[]代替它），但可以让我们在使用`this.breadcrumbs`时得到更好的提示

#### Content.vue

```vue
/* src/views/Home/Content.vue */

<template>
    <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
        <div class="content">
            <h1>This is an {{ $route.meta.label }} page</h1>
        </div>
    </a-layout-content>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class Content extends Vue {}
</script>
```

最后是`Content`视图，在`SideMenuCotent`中点击侧边菜单后，`router-view`就会渲染这个视图，它通过读取`$route.meta.label`来动态设置页面内容。

![view-content](.\assets\view-content.png)

#### router/index.ts

```typescript
/* src/router/index.ts */

import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Login from '../views/Login.vue'

import userMenus from "@/assets/scripts/UserMenus";

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

export default router
```

在路由文件中需要拼接固定路由（目前只有`Login`）和动态生成的路由，返回的`router`在`App.vue`中引入注册

### 构建

当我们使用vue-cli初始化项目时，默认生成的`package.json`的`scripts`包含有`"build": "vue-cli-service build"`命令，它使我们可以使用以下语句对vue项目进行构建

```
npx run build
```

默认情况下构建结果会放在根目录的`dist`目录下，但是由于我们的项目还包括后端，为了让前后端的构建结果都放在`dist`目录下，我们修改成koa项目（后端）构建结果放在`dist`，vue项目（前端）构建结果放在`dist/dist`，。

在根目录新建文件`vue.config.js`并进行配置，将前端的构建结果放在`dist/dist`

```javascript
/* vue.config.js */

module.exports = {
    outputDir: 'dist/dist',
	assetsDir: 'assets'
}
```

顺便进行后端的构建配置，后端代码也使用`typescripte`编写，所以我们可以使用tsc进行构建。修改vue-cli默认生成的`tsconfig.json`文件。

```json
/* tsconfig.json */

{
    // ...
    // 修改"module"
    "module": "commonjs",
    // ...
    // 添加"outDir"
    "outDir": "dist",
    // ...
    // 修改"inculde"
    "include": [
   		 "server/**/*.ts"
  	],
    // ...
}
```



## 后端服务构建

后端服务需要实现以下功能：

- 数据库访问
- 一个路由组件，提供接口定义章节定义的两个接口，以及接口的访问权限控制
- 一组中间件，负责请求的预处理和后处理

### 安装依赖

```
npm i koa koa-router koa-json
npm i --save-dev @types/koa @types/koa-router @types/koa-json @types/koa-static
npm i --save-dev ts-node nodemon
```

> **注意：**
>
> - 使用typescript时，koajs 与常见插件的类型声明都要在@types 下安装
> - 为了实现热更新，我们使用`nodemon`监控文件的改变，使用`ts-node`启动项目
> - `koa-json`用于自动序列化`ctx.body`中的Object对象；`koa-bodyparser`用于将`ctx`中的`formData`解析到`ctx.request.body`中；`koa-static`用于配置静态资源目录

然后在`package.json`中添加启动脚本

```json
/* package.json */

{
  "scripts": {
    "watch-server": "nodemon --watch server -e ts,tsx --exec 'ts-node' ./server/app.ts"
  }
}
```

稍后就可以使用`npm run watch-server`启动后端服务，且每次修改`server`目录下的文件后就会自动重新编译。

修改`server/app.ts`

```typescript
/* server/app.ts */

import Koa from 'koa'
import Router from 'koa-router'
import BodyParser from 'koa-bodyparser'
import Json from 'koa-json'

const app: Koa = new Koa()
const router: Router = new Router()

router.get('/', async (ctx, next) => {
    ctx.body = "Hello Koa and TS."
    await next()
})

app.use(Json()).use(BodyParser())
    .use(router.routes())

app.listen(3000)

console.log("Server running on http://localhost:3000");
```

然后执行

```
npm run watch-server
```

使用浏览器访问http://localhost:3000，可以看到显示`Hello Koa and TS.`的页面。

修改`ctx.body = "Hello Koa and TS."`并保存后，会看到自动重新编译，刷新之后页面也随之更新。

### 连接数据库

本项目使用`sqlite`数据库存储用户数据，在数据库中有三张表：用户表`Users`、角色`Roles`以及授权表`UserRole`;使用`sequelize`框架进行数据库操作。

首先安装`sequelize`（typescript版本）和数据库驱动

```
npm install --save-dev @types/validator
npm install sequelize reflect-metadata sequelize-typescript
npm i sqlite3
npm i --save-dev @types/sqlite3
```

- `sequelize-typescript`依赖`reflect-metadata`和`sequelize`且需要手动安装。

- 并需要在`tsconfig.json`中配置以下选项：

```json
/* tsconfig.json */

"target": "es6", // or a more recent ecmascript version
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

> ### 问题处理记录
>
> **问题**
>
> 将npm版本升级到8.x之后安装sqlite3时报错`Undefined variable module_name in binding.gyp`
>
> **解决方案**
>
> 使用`npm i -g npm@6`降级npm版本之后问题解决

以下例子对`sequelize-typescript`的用法作简单介绍，详细介绍可查看[Sequelize 中文文档](https://www.sequelize.com.cn/)及[sequelize-typescript - npm](https://www.npmjs.com/package/sequelize-typescript#table-api)。

> 需要先在执行目录下的`database`子目录下新建`sequelize_test.db`数据库文件

```typescript
import {Sequelize} from 'sequelize-typescript'
import {Table, Column, Model, BelongsToMany, ForeignKey} from "sequelize-typescript"

// 定义sequelize模型
@Table
export class Book extends Model {
    @Column
    name!: string

    @BelongsToMany(() => Author, () => BookAuthor)
    authors!: Array<Author & {BookAuthor: BookAuthor}>;
}

@Table
export class Author extends Model {
    @Column
    name!: string

    @BelongsToMany(() => Book, () => BookAuthor)
    books!: Array<Book & {BookAuthor: BookAuthor}>;
}

// 定义联结表以维护Book和Author的多对多关系
@Table({
    tableName: 'BookAuthor'
})
export class BookAuthor extends Model {
    @ForeignKey(() => Book)
    @Column
    bookId!: number

    @ForeignKey(() => Author)
    @Column
    authorId!: number
}

async function test(){
    // 用sqlite uri创建sequelize实例
    const sequelize = new Sequelize('sqlite://database/sequelize_test.db')
    // 将模型添加到sequelize实例
    sequelize.addModels([Book, Author, BookAuthor])

    // 同步模型
    // 会在目标数据库下新增表名为Books、Authors、BookAuthor的三个表
    //
    // 除非在@Table.options.tableName中给定表名（如BookAuthor中所示），
    // 否则sequelize会进行表名推断，默认会将表名设置为类名的复数
    //
    // 除非使用@PrimaryKey指定主键列，否则sequelize会在给定的列以外增加主键列`id`，
    // 默认增加的主键列是INTEGER且自增的（区别于数据库本身的自增，这里的自增是sequelize内部的行为）
    // 在联结表BookAuthor中，sequelize默认会将(bookId, authorId)设为主键
    // sequelize还会默认增加createdAt和updatedAt列
    await Book.sync()
    await Author.sync()
    await BookAuthor.sync()

    // 使用Model.create()执行简单insert操作
    await Author.create({name: '曹雪芹'})

    // 使用Model.bulkCreate()执行批量insert
    await Book.bulkCreate([
        {name: '红楼梦'},
        {name: '废艺斋集稿'}
    ])

    // 注意以下代码中Model和Model实例的区分
    const book = await Book.create({name:'三国演义'})
    // 查找Author表中是否已有该作者
    let author = await Author.findOne({where: {name: '罗贯中'}})
    // 如果没有则创建作者
    if(!author) author = await Author.create({name:'罗贯中'})
    // 应用联结，会在联结表BookAuthor中插入数据
    // 注意$add的参数，第一个是Model名，第二个是Model实例
    await book.$add('Author',author)

    // 基于相同的原理，为曹雪芹的著作建立联结
    Book.findOne({where: {name: '红楼梦'}})
        .then(async (book) => {
            const author = await Author.findOne({where: {name: '曹雪芹'}})
            if(book) await book.$add('Author', author as Author)
        })

    Book.findOne({where: {name: '废艺斋集稿'}})
        .then(async (book) => {
            const author = await Author.findOne({where: {name: '曹雪芹'}})
            if(book) await book.$add('Author', author as Author)
        })

    // 执行关联查找（inner join）
    Book.findAll({
        include: [{model: Author,where:{name: '曹雪芹'}}
        ]}).then(
            (books) => {
                if(books && books.length > 0){
                    books.forEach((book) => {
                        book.authors.forEach((author) => {
                            console.log(`The author of ${book.name} is ${author.name}.`)
                        })
                    })
                }
        }
    )
}

test()
```

我们在`server`目录下新建`secrets`文件夹用于放置数据库文件，并将该目录加入到根目录的`.gitignore`中。

下面来创建数据库

下载并安装`sqlite`[SQLite Home Page](https://www.sqlite.org/index.html)，并配置系统环境以便使用。（略）

> 本文使用的sqlite版本为3.36

在`secrets`目录的命令行执行

```
> sqlite3
sqlite > .open vue-koa-database.db
```

在`server`目录下新建`schema`目录用以存储数据库相关文件

#### Model定义

```typescript
/* server/schema/User.ts */

import {Table, PrimaryKey, Column, Model, BelongsToMany, AllowNull, Default} from "sequelize-typescript"
import Role from "./Role";
import UserRole from "./UserRole";

@Table
class User extends Model {
    @PrimaryKey
    @Column
    id!: string

    @AllowNull(false)
    @Column
    username!: string

    @AllowNull(false)
    @Column
    password!: string

    @Column
    name!: string

    @BelongsToMany(() => Role, () => UserRole)
    roles!: Role[];
}

export default User
```

```typescript
/* server/schema/Role.ts */

import {Table, PrimaryKey, Column, Model, BelongsToMany, AllowNull, Default} from "sequelize-typescript"
import UserRole from "./UserRole";
import User from "./User";

@Table
class Role extends Model {
    @PrimaryKey
    @Column
    id!: string

    @AllowNull(false)
    @Column
    name!: string

    @Default(false)
    @Column
    isAdmin!: boolean

    @BelongsToMany(() => User, () => UserRole)
    user!: User[];
}

export default Role
```

```typescript
/* server/schema/UserRole.ts */

import {Table, Column, Model,  ForeignKey} from "sequelize-typescript"
import User from "./User";
import Role from "./Role"

@Table({
    tableName: 'UserRole'
})
export class UserRole extends Model {
    @ForeignKey(() => User)
    @Column
    userId!: string

    @ForeignKey(() => Role)
    @Column
    roleId!: number
}

export default UserRole
```

#### Sequelize实例

```typescript
/* server/schema/db.ts */

import {Sequelize} from 'sequelize-typescript'
import path from 'path'
import User from "./User";
import Role from "./Role";
import UserRole from "./UserRole";

const sequelize = new Sequelize(
    {
		dialect: 'sqlite',
		storage: path.join(__dirname,'../secrets/vue-koa-database.db'),
        logging:false // sequelize默认会打印执行过程的SQL以便调试，可以通过设置options.logging来自定义
    })
sequelize.addModels([User, Role, UserRole])

export {sequelize, User, Role, UserRole}
```

**模型同步**

临时创建一个ts文件并执行模型同步以自动创建数据库表

```typescript
import {User, Role, UserRole} from "./schema/db";

(async () => {
    await User.sync()
    await Role.sync()
    await UserRole.sync()
})()
```

执行完成后`sqlite`的表结构如下

```
sqlite> select * from sqlite_master where type="table";

table|Users|Users|2|CREATE TABLE `Users` (`id` VARCHAR(255) PRIMARY KEY, `username` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `name` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)

table|Roles|Roles|4|CREATE TABLE `Roles` (`id` VARCHAR(255) PRIMARY KEY, `name` VARCHAR(255) NOT NULL, `isAdmin` TINYINT(1) DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)

table|UserRole|UserRole|6|CREATE TABLE `UserRole` (`userId` VARCHAR(255) NOT NULL REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `roleId` VARCHAR(255) NOT NULL REFERENCES `Roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, UNIQUE (`userId`, `roleId`), PRIMARY KEY (`userId`, `roleId`))
```

接下来就可以方便地使用以上模型进行数据库访问。

### 实现接口

按照**接口定义**章节的描述，需要实现两个接口，其中/api/user需要鉴权，/api/auth可在未登录状态访问

整体思路及代码结构如下：

- `/server/middlewares/auth`目录存放权限验证相关代码，`jwt-resolver.ts`解析请求的`Header`，解密`authorization`属性得到`User`对象（包括id、username和roles属性），将对象绑定到`Header`的`currentUser`属性。`auth-maker.ts`导出一个`check`方法，接受`ctx`对象和一个`requireRole`属性，当`ctx.request.currentUser`不具备`requireRole`时抛出异常；可以将该方法放在需要权限验证的`controller`代码开始处

- `/server/controller`下的两个`controller`对应两个接口


-  `/server/middlewares/error-handler.js`拦截所有异常，并为`statusCode`为401的请求设置`response header->{ 'WWW-Authenticate': 'Bearer' }`

#### User Service

在`server`目录下增加`service`文件夹，并创建`user-service.ts`文件

在该文件中实现以下方法：

1. `async getUserById(id: string, includeRoles = false): User | null`: 返回id对应的User对象，如果不存在返回null；includeRoles参数决定是否关联查询出user拥有的roles
2. `async getUserByUsername(username: string, includeRoles = false): User | null`: 返回username对应的User对象，如果不存在返回null
3. `async checkUser(username: string, password: string): User | null`: 返回username和password对应的User对象（不含roles），如果不存在返回null
4. `async getRoles(id: string): string[] `: 返回id对应的User具有的Roles的id数组，如果不存在则更新数据库，**增加普通用户权限**并返回

```typescript
/* server/service/user-service.ts */

import {User, Role} from "../schema/db";
import config from "../config";

// 返回id对应的User对象，如果不存在返回null；includeRoles参数决定是否关联查询出user拥有的roles
async function getUserById(id: string, includeRoles = false): Promise<User | null> {
    return User.findOne({
        include: includeRoles ? [Role] : [],
        where: {id: id}
    })
}

async function getUserByUsername(username: string, includeRoles = false): Promise<User | null> {
    return User.findOne({
        include: includeRoles? [Role]: [],
        where: {username: username}
    })
}

// 返回username和password对应的User对象，如果不存在返回null
async function checkUser(username: string, password: string): Promise<User | null> {
    return User.findOne({where: {username: username, password: password}
    })
}

//  返回id对应的User具有的Roles（字符串数组），如果不存在则更新数据库，增加普通用户权限并返回
async function getRoles(id: string): Promise<string[]> {
    // 检查是否存在该id对应的用户，如果不存在则返回空数组
    const user = await User.findOne({where: {id: id}})
    if (!user) return []

    const roles = await user.$get('roles')
    if (roles.length <= 0) {
        const normalRole = await getNormalUser()
        await user.$add('Role', normalRole)
        roles.push(normalRole)
    }
    return roles.map(role => role.name)
}

async function getNormalUser(): Promise<Role> {
    const normalRole = await Role.findOne({where: {name: config.ROLE_USER}})
    if(normalRole) return normalRole
    else throw Error('Role NormalUser is not initial.')
}

export {getUserById, getUserByUsername, checkUser, getRoles}
```

**user-service测试**

安装`uuid`用作自增主键

```
npm i uuid
npm i --save-dev @types/uuid
```

> 在typescript下，uuid用法如下：
>
> ```typescript
> import { v1 as uuid } from 'uuid' // or v3, v5...
> 
> console.log(uuid())
> ```

执行以下代码并执行以插入测试数据

```typescript
import {User, Role} from "./schema/db";
import { v1 as uuid } from 'uuid'

(async () => {
    const role = await Role.create({id: uuid(), name: 'NormalUser'})
    await User.create({id: uuid(), username: 'kong', password:'abc123', name: '孙悟空'})

    const user = await User.create({id: uuid(), username: 'tang', password:'abc123', name: '唐僧'})
    await user.$add('Role', role)
})()
```

执行以下测试代码

```typescript
import {getUserById, checkUser, getRoles} from "./service/user-service"

(async () => {
    console.log('===getUser===')
    let user = await getUserById('9bc4b960-2fe5-11ec-99c4-27f712e3dd68') // 改成插入时uuid()生成的孙悟空的id
    if(user) console.log(user.name)

    console.log('===checkUser===')
    user = await checkUser('kong', 'abc123')
    console.log(user? user.name: '用户名或密码错误')
    user = await checkUser('kong', 'abc')
    console.log(user? user.name: '用户名或密码错误')

    console.log('===getRoles===')
    const role = await getRoles('9bc4b960-2fe5-11ec-99c4-27f712e3dd68')
    console.log(role.map(item => item.name))
})()
```

运行结果如下：

```
===getUser===
孙悟空
===checkUser===
孙悟空
用户名或密码错误
===getRoles===
[ 'NormalUser' ]
```

#### 权限中间件

安装`jsonwebtoken`

```
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```

在`/server/secrtes`下创建文件`jwt-key.txt`，用于存储`jwt`的密钥，并在`/server`目录下创建`config.ts`来加载它

```typescript
/* server/config.ts */

import fs from 'fs'
import path from 'path'

export default {
    SECRET: fs.readFileSync(path.resolve(__dirname, 'secrets', 'jwt-key.txt'))
    EXP_TIME: '1h',
    ROLE_USER: 'NormalUser' // 角色NormalUser的ID
}
```

在config.ts中我们还设置了jwt的超时时间`EXP_TIME`以及角色NormalUser的ID`ROLE_USER`两个常量，以便后续调用。

在`/server/middlewares/auth`目录下创建文件`jwt-resolver.ts`，用于解密`Header`的`authorization`字段，得到`user`对象

```typescript
/* server/middlewares/auth/jwt-resolver.ts */

import jwt from 'jsonwebtoken'
import config from '../../config'
import Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    const authHeader = ctx.header.authorization // 从header中取出token
    if(authHeader){
        const [authType, jwtToken] = authHeader.split(' ')
        if(authType.toLowerCase() === 'bearer'){
            // 解密token
            jwt.verify(jwtToken, config.SECRET,(error, decoded) => {
                if(error){
                    const errorCode = error.name
                    if(errorCode === 'TokenExpiredError'){
                        // todo: token自动续期 https://zhuanlan.zhihu.com/p/163053370
                        ctx.throw(401, {code: 4010})
                    }
                    else if(errorCode === 'JsonWebTokenError'){
                        ctx.throw(401, {code: 4011})
                    }
                }
                else{
                    // 将解析得到的user对象绑定到currentUser
                    ctx.header.currentUser = JSON.stringify(decoded)
                }
            })
        }
    }
    await next()
}
```

**todo: 增加token自动续期的功能** 

> https://zhuanlan.zhihu.com/p/163053370

在同一目录下创建`auth-maker.ts`，用于校验是否具备权限

```typescript
/* server/middlewares/auth/auth-maker.ts */

import Koa from "koa";

export default (ctx: Koa.Context, requireRole: string): void => {
    const userJSON = ctx.header.currentUser
    if(userJSON){
        try{
            const user = JSON.parse(userJSON as string)
            if(user.roles){
                if(!user.roles.includes(requireRole)){
                    ctx.throw(403, {code: 4030})
                }
            }
        }
        catch(e){
            console.error(e)
            ctx.throw(401, {code: 4014})
        }
    }
    else ctx.throw(401, {code: 4014})
}
```

### 配置路由

创建`/server/controller`目录来放置接口的具体实现代码。

#### auth-controller.ts

`auth-controller.ts`实现了`/api/auth`接口，访问数据库检验`username`和`password`是否合法：

```typescript
/* server/controller/auth-controller.ts */

import jwt from 'jsonwebtoken'
import Koa from "koa"
import {checkUser, getRoles} from "../service/user-service"
import config from "../config"

export default async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    const auth = ctx.request.body
    const user = await checkUser(auth.username, auth.password)
    if(!user){
        ctx.throw(401, {code:4012})
    }
    const roles = await getRoles(user.id)
    const token = {
        id: user?.id,
        username: user?.username,
        name: user?.name,
        roles: roles
    }
    ctx.status = 200
    const tokenSign = jwt.sign(token, config.SECRET, {expiresIn: config.EXP_TIME}) // 签名token
    ctx.body = {code:200, message: 'Login Success', token: tokenSign}
}
```

#### user-controller.ts

`user-controller.ts`与上面类似，只是在入口处进行权限验证：

```typescript
/* server/controller/user-controller.ts */

import Koa from "koa"
import authMaker from '../middlewares/auth/auth-maker'
import config from '../config'

export default async function getUser(ctx: Koa.Context, next: Koa.Next): Promise<void>{
    authMaker(ctx, config.ROLE_USER) // 验证用户是否具有普通用户权限
    ctx.body = ctx.header.currentUser // 如果有则返回jwt解密后的用户信息
}
```

#### router.ts

接下来在`server`目录下创建router.ts，用于配置路由信息

```typescript
/* server/router.ts */

import Router from 'koa-router'
import auth from './controller/auth-controller'
import user from './controller/user-controller'

const router: Router = new Router()

router.prefix('/api') // 对所有路由添加'/api'前缀

router.get('/', async (ctx, next) => {
    ctx.body = "Hello Koa and TS."
})

router.get('/user', user) // 指定访问'/api/user'的请求由user方法处理
router.post('/auth', auth)

export default router
```

### 异常捕捉

在`/middlewares/error-handler.ts`中`catch`在整个koa处理过程中抛出的异常，并根据错误码设置返回信息

```typescript
/* server/middlewares/error-handler.ts */

import Koa from 'koa'

export default async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    try{
        await next()
    }
    catch(e){
        ctx.status = e.statusCode || e.status || 500;
        // 如果是401，根据接口定义要设置response header
        switch (ctx.status) {
            case 401:
                ctx.set({'WWW-Authenticate': 'Bearer'})
                break
        }
        // 根据错误码设置返回信息
        let message
        switch (e.code) {
            case 4010:
                message = 'token expired'
                break
            case 4011:
                message = 'invalid token'
                break
            case 4012:
                message = 'incorrect username or password'
                break
            case 4013:
                message = 'not logged in'
                break
            case 4030:
                message = 'permission denied'
                break
        }
        ctx.body = message
    }
}
```

### 引入以上组件

将以上的组件添加到`app.ts`中

```typescript
/* server/app.ts */

import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import Json from 'koa-json'

import errorHandler from './middlewares/error-handler'
import jwtResolver from './middlewares/auth/jwt-resolver'
import router from './router'

const app: Koa = new Koa()

// errorHandler要最先引入
app.use(errorHandler)
    .use(BodyParser())
    .use(Json())
    .use(jwtResolver)
    .use(router.routes())

app.use(Json()).use(BodyParser())
    .use(router.routes())

app.listen(3000)

console.log("Server running on http://localhost:3000");
```

完成上述工作后，后端目录结构如下：

```
server
├── controller
│   ├── auth-controller.ts
│   └── user-controller.ts
├── middlewares
│   ├── auth
│   │   ├── auth-maker.ts
│   │   └── jwt-resolver.ts
│   └── error-handler.ts
├── schema
│   ├── db.ts
│   ├── Role.ts
│   ├── User.ts
│   └── UserRole.ts
├── secrets
│   ├── jwt-key.txt
│   └── vue-koa-database.db
├── service
│   └── user-service.ts
├── app.ts
├── config.ts
└── router.ts
```

### 使用Postman进行接口测试

> 假定数据库中仍保留之前user-service测试时产生的数据

- `api/auth`

登录成功返回token

![postman-test-1](.\assets\postman-test-1.png)

登录成功返回失败

![postman-test-2](.\assets\postman-test-2.png)

- `/api/user`

将上一个接口测试返回的token添加到请求的Header，**注意请求token的格式为`Bearer <Token>`**

token验证成功，返回用户信息

![postman-test-3](.\assets\postman-test-3.png)

不带token，返回未登录

![postman-test-4](.\assets\postman-test-4.png)

token验证失败

![postman-test-5](.\assets\postman-test-5.png)



## 前后端对接

在**前端页面构建**章节中已经实现了基本的页面跳转逻辑，本节在此基础上对接后端服务，实现登录验证。

前端登录流程：

- 用户在登录界面点击登录，前端将用户名和密码发送给`/api/auth`接口获取token
- 将获取到的token存储到浏览器的`sessionStorage`
- 前端访问后端接口的请求都携带该token
- 设置路由守卫，跳转到受保护路由时检测`sessinStorage`，若token无效则跳转到登录界面

项目使用`fetch`发送`http`请求，为了确保所有请求均携带token，并能响应token过期、无效等情况，可以对`fetch`做简单的封装放到`utils.js`中

另外，前后端分离会导致跨域问题，简单来说：假设前端服务运行在`localhost:8080`，后端服务运行在`localhost:3000`端口，由于浏览器中的页面是由8080端口的前端服务返回，那么页面的`js`代码只能发送到`localhost:8080`的请求，在页面中调用3000端口的`api`属于跨域。

解决这个问题的方式总体有三种：

1. 声明允许跨域
2. 使用反向代理代理转发，如使用`nginx`将发送到8080端口，`/api`前缀的请求转发到3000端口，使得在浏览器“看来”请求并没有跨域
3. 消除跨域，将前端代码打包成静态文件，挂到后端服务下

这里采用第二种，在前端定义一个代理，转发`/api`前缀的请求，在`vue.config.js`中添加：

```javascript
/* vue.config.js */

module.exports = {
	devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
                changeOrigin: true
            }
        }
    }
}
```

### 登录验证

登录验证逻辑在`Login.vue`中，首先修改`<template>`部分，增加用户名和密码输入框，并使用ant-design-vue的表单验证功能增加输入框的必填校验

```vue
/* src/views/Login.vue */

<template>
    <a-layout class="login">
        <a-layout-header>
            <div class="logo"/>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <a-form
                ref="LoginForm"
                :model="formData"
                :rules="rules"
                :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"
                :label-col="{ span:4 }" :wrapper-col="{ span: 8 }"
            >
                <a-form-item label="Username" name="username">
                    <a-input autocomplete="off" v-model:value="formData.username"/>
                </a-form-item>
                <a-form-item label="Password" name="password">
                    <a-input-password autocomplete="off" v-model:value="formData.password"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 8, offset: 4 }">
                    <a-button type="primary" @click="login"
                              :disabled="formData.username === '' || formData.password === ''"
                    >Login</a-button>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 8, offset: 4 }">
                    <a-alert v-show="message.length > 0" :message="message" :type="loginSuccess? 'success': 'error'" />
                </a-form-item>

            </a-form>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Vue-Koa ©2021 Created by WingSnow
        </a-layout-footer>
    </a-layout>
</template>
<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import {useLogger} from "vue-logger-plugin";
import utils from '../assets/scripts/utils'

@Options({
    data() {
        return {
            targetUrl: this.$route.query.targetUrl
        }
    }
})

export default class Login extends Vue {
    private logger = useLogger()

    targetUrl!: string

    message = ''
    loginSuccess = false

    formData = {  // 表单数据
        username: '',
        password: ''
    }
    rules = { //表单验证规则
        username: [
            {required: true, message: 'Please input your username.', trigger: 'blur'}
        ],
        password: [
            {required: true, message: 'Please input your password.', trigger: 'blur'}
        ]
    }

    login(): void {
        const userInfo = {
            username: this.formData.username,
            password: this.formData.password
        }

        // 通过设置html元素的ref属性，之后就可以在this.$refs中取到该元素，从而调用ant-design-vue赋予表单元素的validateFields方法
        this.$refs.LoginForm.validateFields()
            .then(() => {
                fetch("api/auth", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(({
                        username: userInfo.username,
                        password: userInfo.password
                    }))
                })
                    .then(res => {
                        this.loginSuccess = res.ok  // 当res.statusCode是2xx时res.ok是true，否则为false
                        return res.json()
                    })
                    .then(res => {
                        this.message = res.message
                        if(res.code === 200){
                            utils.saveToken(res.token)  // 将token保存在sessionStorage
                            setTimeout(()=>{
                                this.onAuthSuccess()
                            },500)
                        }
                        else{
                            utils.clearToken()  // 登录失败时清空token
                        }
                    })
            })
    }

    onAuthSuccess(): void{
        if(!utils.getToken()) return
        if (this.targetUrl) { //判断用户是直接访问登录页还是被重定向登录页
            this.$router.push({ path: this.targetUrl });
        } else {
            this.$router.push({ path: "/" });
        }
    }
}
</script>
```

由于登录验证不需要携带token验证，所以直接使用`fetch`发送请求，根据`response`的ok值以及接口返回的`message`属性设置提示信息。

这里使用到了`ant-design-vue`的表单验证功能（详细用法参考[ 表单验证 | Ant Design Vue ](https://next.antdv.com/components/form-cn#components-form-demo-validation)）以及`vue`的模板引用功能（详见[模板引用 | Vue.js ](https://v3.cn.vuejs.org/guide/component-template-refs.html)）

登录成功后，我们将返回的token保存在`sessionStorage`中，并根据`targetUrl`重定向到目标页面或首页。

这里还引入了`utils`工具类，用以提供token操作方法。

```typescript
/* src/assets/scripts/utils.ts */

function saveToken(token: string): void{
    sessionStorage.setItem("token", token);
}

function getToken(): string | null{
    return sessionStorage.getItem("token")
}

function clearToken(): void{
    sessionStorage.removeItem("token");
}

export default {saveToken, getToken, clearToken}
```

**启动前后端服务后**，访问http://localhost:8080/login进行测试

- 表单验证

![login-validate](.\assets\login-validate.png)

- 登录失败

![login-fail](.\assets\login-fail.png)

- 登录成功

![login-success](.\assets\login-success.png)

### 路由守卫

在`router/index.ts`中添加路由守卫，在路由跳转前判断是否受保护，以及`sessionStorage`中是否存储了有效token

```typescript
/* src/router/index.ts */

router.beforeEach((to, from, next) => {
    if(to.path === '/login' || utils.verifyToken()){
        next()
    }
    else{
        // targetUrl记录当前url，以便登录成功后跳转到当前页面
        next({path: '/login', query: {targetUrl: to.fullPath}})
    }
})
```

```typescript
/* src/assets/scripts/utils.ts */

function verifyToken(): boolean{
    return !!getToken()
}

export default {saveToken, getToken, clearToken,  verifyToken}
```

### 封装fetch

这部分主要做三件事：发送请求前将`token`设置到`header`；收到响应后处理；若请求失败，返回`reject`的`promise`，由调用方处理报错信息。

```typescript
/* src/assets/scripts/utils.ts */

async function wrappedFetch(resource: RequestInfo, init: RequestInit): Promise<any> {
    const token = getToken()
    if (token) {
        init.headers = {'Authorization': 'Bearer ' + token} //添加header
    }
    const res = await fetch(resource, init)
    if (res.ok) {
        return res.json()
    } else {
        return Promise.reject({
            resource: resource,
            status: res.status,
            statusText: res.statusText
        })
    }
}
```

本文以`普通用户-个人中心-基本信息`页面为例，新增`UserInfo.vue`

```vue
/* src/views/Home/UserInfo.vue */

<template>
    <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
        <a-descriptions title="用户信息">
            <a-descriptions-item label="用户名">{{userInfo.username}}</a-descriptions-item>
            <a-descriptions-item label="姓名">{{userInfo.name}}</a-descriptions-item>
            <a-descriptions-item label="角色">
                <template v-for="role in userInfo.roles">
                    {{role}}
                </template>
            </a-descriptions-item>
        </a-descriptions>
    </a-layout-content>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component"
import utils from "../../assets/scripts/utils";
import {message} from "ant-design-vue";

@Options({})
export default class UserInfo extends Vue {
    userInfo = {
        username: '',
        name: '',
        roles: []
    }

    getUserInfo(): void{
        utils.wrappedFetch("/api/user", {method: "GET"})
            .then(res => {
                const resObj = JSON.parse(res.user);
                [this.userInfo.username, this.userInfo.name, this.userInfo.roles] = [resObj.username, resObj.name, resObj.roles]
            })
            .catch(err => {
                message.error(`${err.resource} | Error ${err.status}: ${err.statusText}`) //处理请求失败的情况，调用ant-design-vue的全局提示组件显示报错信息
            })
    }

    mounted(){	// 在组件挂载时获取数据
        this.getUserInfo()
    }

}
</script>
```

并修改`UserMenus.ts`中的菜单数据源

```json
{
    "label": "基本信息",
    "path": "/user/info",
    "name": "info",
    "component": "UserInfo", // 修改为使用上面定义的组件
    "isMenu": true,
    "isRoute": true
}
```

修改完成后，页面展示如下：

![view-userInfo](.\assets\view-userInfo.png)



## 打包部署

在`前端页面构建`的`构建`一节中，已经通过修改`vue.config.js` 和`tsconfig.json`完成了前后端的构建配置。对于前端vue部分，我们使用`vue-cli-service `进行构建，对于后端koa部分，我们使用`tsc`进行构建（将ts代码编译为js）。

配置`package.json`中的启动脚本：

- `serve-vue` 开发环境启动前端
- `serve-koa` 开发环境启动后端
- `build` 构建前端
- `compile` 编译后端
- `buildAll` 构建前后端
- `start` 生产环境启动项目

```json
/* package.json */

"scripts": {
    "serve-vue": "vue-cli-service serve",
	"serve-koa": "nodemon --watch server -e ts,tsx --exec ts-node ./server/app.ts",
    "build": "vue-cli-service build",
    "compile": "tsc",
	"buildAll": "npm run compile && npm run build",
	"start": "cd dist && node app.js"
  }
```

还需要在后端代码中使用`koa-static`配置静态资源服务器，当所有路由匹配失败时尝试加载静态资源。

> **注意：**
>
> 在router.ts中（以及处理请求`api/auth`和`api/user`的`auth-controller`/`user-controller`中）不要调用await next()。因为只有路由匹配失败时才需要加载静态资源，如果路由匹配成功，则不应该再调用后续的`koa-static`获取静态资源。

另外由于前端使用了`Vue Router`的history路由模式，形如`/login`的请求（hash模式下对应为`/index.html# /login`）是无法找到对应的静态资源的。该请求的本质是请求`/index.html`页面，然后执行前端路由`router.push('/login')`。所以需要添加`historyApiFallback`，将所有未匹配到后端路由的（前端）路由映射到`index.html`

```bash
npm i koa2-history-api-fallback
```

> 由于koa2-history-api-fallback库的作者没有提供`@types/koa2-history-api-fallback`，所以我们需要自己编写typescript声明文件.d.ts
>
> 1.修改`tsconfig.json`的path属性，表示寻找类型声明文件的顺序
>
> ```json
> /* tsconfig.json */
> 
> "paths": {
>       "@/*": [
>         "src/*"
>       ],
> 	  "*": ["./node_modules.@types","./types/*"]
>     }
> ```
>
> 2. 在项目根目录添加`types`文件夹，并在其下添加并实现声明文件，声明文件名称为`index.d.ts`，文件夹名称和库名称一致
>
> ```typescript
> /* types/koa2-history-api-fallback/index.d.ts*/
> 
> import * as Koa from "koa";
> 
> declare function koa2HistoryApiFallback(): Koa.Middleware;
> declare namespace koa2HistoryApiFallback { }
> export = koa2HistoryApiFallback;
> ```

修改`app.ts`如下，注意`history-api-fallback`和`static`中间件要放在`router`之后：

```typescript
import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import Json from 'koa-json'
import koa2HistoryApiFallback from 'koa2-history-api-fallback'

import errorHandler from './middlewares/error-handler'
import jwtResolver from './middlewares/auth/jwt-resolver'
import router from './router'
import serve from "koa-static";
import path from "path";

const app: Koa = new Koa()

// errorHandler要最先引入
app.use(errorHandler)
    .use(BodyParser())
    .use(Json())
    .use(jwtResolver)
    .use(router.routes())
    // history-api-fallback 和 static 要在 router 之后
    .use(koa2HistoryApiFallback())
    .use(serve(path.resolve('dist')))

app.listen(3000)

console.log("Server running on http://localhost:3000");
```

至此，全部配置就完成了，我们运行`npm run buildAll`进行打包和编译。

> 在vue打包过程中会提示打包结果size过大，这主要是因为我们完整引入了antd。

打包完成后，可以看到项目根目录下新增了`dist`文件夹，文件夹内是后端koa的ts代码编译成js代码的结果，使我们可以直接用`node app.js`来执行；而`dist/dist`目录下这是用`vue-cli-service`打包之后的前端vue代码。

需要注意的是，我们的后端服务还依赖`secrets`目录下的`jwt-key`和sqlite数据库文件才能执行，我们将整个`secrets`目录复制到`dist`目录下。

然后再运行`npm run start`

访问http://localhost:3000，可以看到自动跳转到前端登录页，并且可以正常登录和获取用户信息。



## 写在最后

至此，本项目已经基本完成了`vue`前端和`koa`后端的web应用构建。这个项目主要还是侧重于基础环境的搭建，基本没什么业务逻辑，写完之后整体看下来结构很简单，但是因为其中涉及到很多内容都是边学边查边写的（而且还被百度查到的各种“解决方案”带着绕了很多弯路），所以还是遇到了很多问题，所幸最后都解决了。

由于涉及到很多新知识（因为菜），即使问题解决了也终究是一知半解，必然存在很多局限和错误，希望以后有机会回来重温并解决吧...

