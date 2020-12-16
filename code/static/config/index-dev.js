/**
 * 开发环境(打包配置文件)
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:9001/exhibition-framework'
    window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.189:9001/exhibition-framework'

  // cdn地址 = 域名 + 版本号
  // window.SITE_CONFIG['domain'] = 'http://localhost:9001/exhibition-framework' // 域名
  window.SITE_CONFIG['domain'] = 'http://192.168.0.189:9001/exhibition-framework' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})();
