import Koa from 'koa'

export default async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    try{
        await next()
    }
    catch(e){
        ctx.status = e.statusCode || e.status || 500;
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
        ctx.body = {code: e.code, message:message}
    }
}