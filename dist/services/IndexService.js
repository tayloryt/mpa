"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @fileoverview 实现index的数据模型
 * @author yt
 */

/**
 * IndexModel类,生产一段异步的数据
 * @class
 */
class IndexService {
  /**
   * @constructor
   * @param {string} app koa2的上下文环境
   */
  constructor(app) {
    this.app = app;
  }
  /**
   * 获取具体的API的接口数据
   * @returns {Promise}返回的异步处理结果
   * @example
   * return new Promise
   * getData();
   */


  getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("hello IndexAction");
      }, 1000);
    });
  }

}

exports.default = IndexService;