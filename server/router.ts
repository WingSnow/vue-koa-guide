import Router from 'koa-router'
import auth from './controller/auth-controller'
import user from './controller/user-controller'

const router: Router = new Router()

router.prefix('/api') // 对所有路由添加'/api'前缀

router.get('/', async (ctx, next) => {
    ctx.body = "Hello Koa and TS."
})

router.get('/user', user)
router.post('/auth', auth)

export default router

