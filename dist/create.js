'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _inquirerConfig = require('./common/inquirer-config.js');

var _inquirerConfig2 = _interopRequireDefault(_inquirerConfig);

var _projectBuild = require('./common/project-build.js');

var _projectBuild2 = _interopRequireDefault(_projectBuild);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spinner = (0, _ora2.default)();

exports.default = function (cmd) {
  _inquirer2.default.prompt(_inquirerConfig2.default.prompts).then(function (p) {
    return (0, _projectBuild2.default)(p, spinner);
  }).catch(function (e) {
    spinner.text = '下载失败';
    spinner.fail();
    console.log(e);
  });
};