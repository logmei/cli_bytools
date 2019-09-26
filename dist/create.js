'use strict';

var inquirer = require('inquirer');
var config = require('./common/inquirer-config.js');
var projectBuild = require('./common/project-build.js');

module.exports = function (cmd) {
  inquirer.prompt(config.prompts).then(function (p) {
    return projectBuild(p);
  }).catch(function (e) {
    return console.log('项目创建错误', e);
  });
};