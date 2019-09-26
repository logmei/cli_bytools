'use strict';
import inquirer from 'inquirer';
import config from './common/inquirer-config.js';
import projectBuild from './common/project-build.js';
import ora from 'ora';

const spinner = ora();
export default cmd => {
  inquirer.prompt(config.prompts)
    .then(p => projectBuild(p, spinner))
    .catch(e => {
      spinner.text = '下载失败';
      spinner.fail();
      console.log(e);
    });
}
;
