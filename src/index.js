'use strict';
import program from 'commander';
import create from './create.js';
program.version(require('../package.json').version);

program
  .command('create')// 命令
  .alias('c')
  .description('create project(构造项目)')
  .option('-d', '--default', 'skip prompt and use default preset.')
  .action(create);// 命令动作

program.parse(process.argv);
if (!program.args.length) {
  program.help();
}
