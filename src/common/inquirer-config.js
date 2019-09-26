module.exports = {
  prompts: [// momander的提示语
    {
      name: 'name',
      type: 'input',
      default: 'my-project',
      message: '请输入项目名称'
    },
    {
      name: 'version',
      type: 'input',
      default: '1.0.0',
      message: '请输入版本号'
    },
    {
      name: 'description',
      type: 'input',
      default: '',
      message: '请输入项目描述'
    },
    {
      name: 'author',
      type: 'input',
      default: 'logmei',
      message: '请输入作者'
    },
    {
      name: 'template',
      type: 'list',
      choices: ['simple_module', 'node_module'],
      default: 'simple_module',
      message: '请选择模板'
    }
  ],
  tpl: { // 模板列表
    simple_module: {
      url: 'github:logmei/simple_vue_project/#_simple',
      branch: '_simple'
    },
    node_module: {
      url: 'github:logmei/simple_node_project',
      branch: 'master'
    }
  }
};
