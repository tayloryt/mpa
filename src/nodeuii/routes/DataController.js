import {
    GET,
    route,
    POST
} from 'awilix-koa';
@route('/data')
class DataController {
    @route('/test')
    @GET()
    async testAction(ctx, next) {
        ctx.body = await ctx.render("index/pages/test.html");
    }
}
export default DataController;