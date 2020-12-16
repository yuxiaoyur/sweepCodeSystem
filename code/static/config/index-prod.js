/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.20.223:9001/exhibition-framework'
  // cdn地址 = 域名 + 版本号
  // window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['domain'] = 'http://localhost:9090/les-deptframe-vue/' // 域名
  window.SITE_CONFIG['domain'] = 'http://localhost:9001/exhibition-framework/' // 域名  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})();
