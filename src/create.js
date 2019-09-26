'use strict';
const inquirer = require('inquirer');
const config = require('./common/inquirer-config.js');
const projectBuild = require('./common/project-build.js');

module.exports = cmd => {
  inquirer.prompt(config.prompts)
    .then(p => projectBuild(p))
    .catch(e => console.log('项目创建错误', e));
}
;
