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
