"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _awilix = require("awilix");

var _awilixKoa = require("awilix-koa");

var _errorHandler = require("./middwares/errorHandler.js");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _log4js = require("log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaSwig = require("koa-swig");

var _koaSwig2 = _interopRequireDefault(_koaSwig);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_log4js2.default.configure({
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

const logger = _log4js2.default.getLogger('cheese');

const app = new _koa2.default(); //创建IOC容器

const container = (0, _awilix.createContainer)(); //每一次请求

app.use((0, _awilixKoa.scopePerRequest)(container)); //装载所有的Service到容器里去

container.loadModules([__dirname + "/services/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: _awilix.Lifetime.SCOPED
  }
});
app.context.render = _co2.default.wrap((0, _koaSwig2.default)({
  root: _config2.default.viewDir,
  autoescape: true,
  cache: 'memory',
  // disable, set to false
  ext: 'html'
}));

_errorHandler2.default.error(app, logger); //自动化装载路由


app.use((0, _awilixKoa.loadControllers)(__dirname + "/routes/*.js", {
  cwd: __dirname
}));
app.use((0, _koaStatic2.default)(_config2.default.staticDir));
app.listen(_config2.default.port, () => {
  console.log(`start server on ${_config2.default.port}`);
});