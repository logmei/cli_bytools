import download from './download-repo.js';
import config from './inquirer-config.js';
import fs from 'fs';
import handlebars from 'handlebars';
import chalk from 'chalk';
import { exec } from 'child_process';
import ora from 'ora';
import Settings from './update-settings.js'

function updateSettings(name){
  Settings[name].forEach(v => {
      const fileName = `${name}${v}`;
      const content = fs.readFileSync(fileName).toString();
      const result = handlebars.compile(content)(p);
      fs.writeFileSync(fileName, result);
  })
}

export default (p, spinner) => {
  console.log(chalk.green('开始下载'));
  spinner.text = '开始下载模板....';
  spinner.start();
  download(config.tpl[p.template], p.name, {}, err => {
    if (err) {
      spinner.fail();
      console.log(chalk.red('下载失败'));
      console.log(err);
    } else {
      spinner.succeed();
      console.log(chalk.green('下载成功'));
      let spinnerInstall = ora('修改配置项....\n').start();

      updateSettings(p.name);
      // console.log('\r\n');
      console.log(chalk.green('项目创建完毕'));
      spinnerInstall.succeed();
      if (p.install === 'install_dependence') {
        spinnerInstall = ora('开始安装依赖....').start();
        exec(`cd ${p.name} && npm install`, (error, stdout, stderr) => {
          if (error) {
            console.log(chalk.red('安装依赖失败'));
            console.log(error);
            spinnerInstall.fail();
          }
          spinnerInstall.succeed();
          console.log(chalk.green('安装依赖成功'));
        });
      }
    }
  });
};
