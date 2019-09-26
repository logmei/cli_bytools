'use strict';

var download = require('./download-repo.js');
var config = require('./inquirer-config.js');

module.exports = function (p) {
  download(config.tpl[p.template].url, p.name, {}, function (err) {
    if (err) {
      console.log('下载失败');
    } else {
      console.log('下载成功');
    }
  });
};