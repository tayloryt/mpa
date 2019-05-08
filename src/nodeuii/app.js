import Koa from 'koa';
import config from "./config";
import {
    createContainer,
    Lifetime
} from 'awilix';
import {
    loadControllers,
    scopePerRequest
} from 'awilix-koa';
import errorHandler from './middwares/errorHandler.js';
import log4js from 'log4js';
import path from 'path';
import serve from 'koa-static';
import render from 'koa-swig';
import co from 'co';
log4js.configure({
    appenders: {
        cheese: {
            type: 'file',
            filename: __dirname + '/logs/yt.log'
        }
    },
    categories: {
        default: {
            appenders: ['cheese'],
            level: 'error'
        }
    }
});
const logger = log4js.getLogger('cheese');
const app = new Koa();
//创建IOC容器
const container = createContainer();
//每一次请求
app.use(scopePerRequest(container));
//装载所有的Service到容器里去
container.loadModules([__dirname + "/services/*.js"], {
    formatName: "camelCase",
    resolverOptions: {
        lifetime: Lifetime.SCOPED
    }
})
app.context.render = co.wrap(render({
    root: config.viewDir,
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html'
}));
errorHandler.error(app, logger);
//自动化装载路由
app.use(loadControllers(__dirname + "/routes/*.js", {
    cwd: __dirname
}));
app.use(serve(config.staticDir));
app.listen(config.port, () => {
    console.log(`start server on ${config.port}`)
})