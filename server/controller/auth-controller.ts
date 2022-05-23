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