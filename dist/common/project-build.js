'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadRepo = require('./download-repo.js');

var _downloadRepo2 = _interopRequireDefault(_downloadRepo);

var _inquirerConfig = require('./inquirer-config.js');

var _inquirerConfig2 = _interopRequireDefault(_inquirerConfig);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _child_process = require('child_process');

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _updateSettings = require('./update-settings.js');

var _updateSettings2 = _interopRequireDefault(_updateSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateSettings(p) {
  _updateSettings2.default[p.template].forEach(function (v) {
    var fileName = '' + p.name + v;
    var content = _fs2.default.readFileSync(fileName).toString();
    var result = _handlebars2.default.compile(content)(p);
    _fs2.default.writeFileSync(fileName, result);
  });
}

exports.default = function (p, spinner) {
  console.log(_chalk2.default.green('开始下载'));
  spinner.text = '开始下载模板....';
  spinner.start();
  (0, _downloadRepo2.default)(_inquirerConfig2.default.tpl[p.template], p.name, {}, function (err) {
    if (err) {
      spinner.fail();
      console.log(_chalk2.default.red('下载失败'));
      console.log(err);
    } else {
      spinner.succeed();
      console.log(_chalk2.default.green('下载成功'));
      var spinnerInstall = (0, _ora2.default)('修改配置项....\n').start();

      updateSettings(p);
      // console.log('\r\n');
      console.log(_chalk2.default.green('项目创建完毕'));
      spinnerInstall.succeed();
      if (p.install === 'install_dependence') {
        spinnerInstall = (0, _ora2.default)('开始安装依赖....').start();
        (0, _child_process.exec)('cd ' + p.name + ' && npm install', function (error, stdout, stderr) {
          if (error) {
            console.log(_chalk2.default.red('安装依赖失败'));
            console.log(error);
            spinnerInstall.fail();
          }
          spinnerInstall.succeed();
          console.log(_chalk2.default.green('安装依赖成功'));
        });
      }
    }
  });
};