const download = require('./download-repo.js');
const config = require('./inquirer-config.js');
// const handlebars = require('handlebars');
const chalk = require('chalk');
const ora = require('ora');

module.exports = (p) => {
  console.log(chalk.green('开始下载'));
  const spinner = ora('开始下载模板....').start();
  download(config.tpl[p.template], p.name, {}, err => {
    if (err) {
      spinner.fail();
      console.log(chalk.red('下载失败'));
      console.log(err);
    } else {
      spinner.succeed();
      console.log('下载成功');
    }
  });
};
