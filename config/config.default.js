/* eslint valid-jsdoc: "off" */

"use strict"

const path = require('path')
const os = require('os')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
    security: {
      csrf: {
        enable: false,
        headerName: "x-csrf-token" // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      }
    },
    multipart: {
      whitelist: [
        // images
        ".jpg",
        ".jpeg", // image/jpeg
        ".png", // image/png, image/x-png
        ".gif", // image/gif
        ".bmp", // image/bmp
        ".wbmp" // image/vnd.wap.wbmp
      ],
      mode: "file",
      tmpdir: path.join(os.tmpdir(), "egg-multipart-tmp", appInfo.name),
      cleanSchedule: {
        // run tmpdir clean job on every day 04:30 am
        // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
        cron: "0 0 0 * * *"
      }
    },
    httpclient: {
      // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
      // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
      // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
      enableDNSCache: false,
      // 对同一个域名进行 DNS 查询的最小间隔时间
      dnsCacheLookupInterval: 10000,
      // DNS 同时缓存的最大域名数量，默认 1000
      dnsCacheMaxLength: 1000,

      request: {
        // 默认 request 超时时间
        timeout: 300000
      },

      httpAgent: {
        // 默认开启 http KeepAlive 功能
        keepAlive: true,
        // 空闲的 KeepAlive socket 最长可以存活 4 秒
        freeSocketTimeout: 4000,
        // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        timeout: 300000,
        // 允许创建的最大 socket 数
        maxSockets: Number.MAX_SAFE_INTEGER,
        // 最大空闲 socket 数
        maxFreeSockets: 256
      },

      httpsAgent: {
        // 默认开启 https KeepAlive 功能
        keepAlive: true,
        // 空闲的 KeepAlive socket 最长可以存活 4 秒
        freeSocketTimeout: 4000,
        // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        timeout: 300000,
        // 允许创建的最大 socket 数
        maxSockets: Number.MAX_SAFE_INTEGER,
        // 最大空闲 socket 数
        maxFreeSockets: 256
      }
    }
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1553838172024_232"

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig
  }
}
