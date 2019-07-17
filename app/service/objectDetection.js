const Service = require("egg").Service
const FormStream = require('formstream')
const fs = require('fs');
const path = require('path')

class ObjectDetectionService extends Service {

  async uploadImage() {
    const form = new FormStream();
    form.field('modelName', this.ctx.request.body.modelName)
    form.field('modelVersion', this.ctx.request.body.modelVersion)
    const file = this.ctx.request.files[0]
    form.file('file', file.filepath, file.filename)

    return this.ctx.curl(
      `https://mlfproduction-retrain-od-inference.cfapps.eu10.hana.ondemand.com/api/v2alpha1/image/object-detection/`,
      {
        method: "post",
        headers: form.headers({
          Authorization: this.ctx.headers.authorization
        }),
        stream: form,
        dataType: "json",
      }
    )
  }

  async create() {
    let result = await this.uploadImage()
    // // 检查调用是否成功，如果调用失败会抛出异常
    this.checkSuccess(result)
    return result.data
  }

  async update(reqBody) {
    const mlPath = path.resolve(__dirname, '../public/ml.json')
    const mlConfig = JSON.parse(fs.readFileSync(mlPath).toString())
    for (let prop of Object.keys(reqBody)) {
      if (mlConfig[prop]) {
        mlConfig[prop] = reqBody[prop]
      }
    }
    fs.writeFileSync(mlPath, JSON.stringify(mlConfig))
    return mlConfig
  }

  // 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : "unknown error"
      this.ctx.throw(result.status, errorMsg)
    }
  }
}

module.exports = ObjectDetectionService
