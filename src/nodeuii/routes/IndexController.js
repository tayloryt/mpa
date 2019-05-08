import {
  route,
  GET,
  POST
} from 'awilix-koa';
@route('/')
@route('/index.html')
class indexController {
  constructor({
    indexService
  }) {
    //注入indexService
    this.indexService = indexService;
  }
  @GET()
  async indexAction(ctx, next) {
    const result = await this.indexService.getData();
    ctx.body = {
      result
    };
  }
}
export default indexController;