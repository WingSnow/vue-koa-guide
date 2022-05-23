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
            ctx.throw(401, {code: 4013})
        }
    }
    else ctx.throw(401, {code: 4013})
}