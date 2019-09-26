'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _create = require('./create.js');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(require('../package.json').version);

_commander2.default.command('create') // 命令
.alias('c').description('create project(构造项目)').option('-d', '--default', 'skip prompt and use default preset.').action(_create2.default); // 命令动作

_commander2.default.parse(process.argv);
if (!_commander2.default.args.length) {
  _commander2.default.help();
}