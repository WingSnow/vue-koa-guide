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