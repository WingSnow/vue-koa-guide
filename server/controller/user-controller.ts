import Koa from "koa"
import authMaker from '../middlewares/auth/auth-maker'
import config from '../config'

export default async function getUser(ctx: Koa.Context, next: Koa.Next): Promise<void>{
    authMaker(ctx, config.ROLE_USER)
    ctx.body = {code:200, user:ctx.header.currentUser}
}