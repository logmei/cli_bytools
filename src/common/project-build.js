const download = require('./download-repo.js');
const config = require('./inquirer-config.js');

module.exports = (p) => {
  download(config.tpl[p.template].url, p.name, {}, err => {
    if (err) {
      console.log('下载失败');
    } else {
      console.log('下载成功');
    }
  });
};
