'use strict';

const Controller = require('egg').Controller;

class ObjectDetectionController extends Controller {
    async create() {
        const ctx = this.ctx;
        // 调用 service 创建一个 topic
        const resultJson = await ctx.service.objectDetection.create();
        // 设置响应体和状态码
        ctx.body = resultJson;
        ctx.status = 201;
      }

    async update() {
        const ctx = this.ctx
        if(ctx.params.id == 'config') {
          const result = await ctx.service.objectDetection.update(ctx.request.body)
          ctx.body = result
          ctx.status = 200
        } else {
          ctx.state = 404
        }
    }
}

module.exports = ObjectDetectionController;