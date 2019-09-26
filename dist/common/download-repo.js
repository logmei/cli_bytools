'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _download = require('download');

var _download2 = _interopRequireDefault(_download);

var _gitClone = require('git-clone');

var _gitClone2 = _interopRequireDefault(_gitClone);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Download repo to dest and callback fn
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */
// https://github.com/rndme/download
function download(repo, dest, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = null;
  }
  opts = opts || {};
  var clone = opts.clone || false;
  delete opts.clone;
  repo = normalize(repo);
  var url = repo.url || getUrl(repo, clone);

  if (clone) {
    var options = {
      checkout: repo.checkout,
      shallow: repo.checkout === 'master'
    };
    cloneOptions(opts, options);
    (0, _gitClone2.default)(url, dest, options, function (err) {
      if (err === undefined) {
        _rimraf2.default.sync(dest + '/.git');
        fn();
      } else {
        fn(err);
      }
    });
  } else {
    var _options = {
      extract: true,
      strip: 1,
      mode: '666',
      header: {
        accept: 'application/zip'
      }
    };

    cloneOptions(opts, _options);
    cloneOptions(opts.headers, _options.header);

    (0, _download2.default)(url, dest, _options).then(function (data) {
      fn();
    }).catch(function (err) {
      fn(err);
    });
  }
}

function cloneOptions(from, to) {
  if (!from) return;
  Object.keys(from).forEach(function (v) {
    to[v] = from[v];
  });
}

function normalize(repo) {
  var regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  var match = regex.exec(repo);
  // console.log('normalize',repo,match)
  if (match) {
    var url = match[2];
    var checkout = match[3] || 'master';
    return {
      type: 'direct',
      url: url,
      checkout: checkout
    };
  } else {
    regex = /^(?:(github|gitlib|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/;

    match = regex.exec(repo);
    // console.log('normalize2',repo,match)
    var type = match[1] || 'github';
    var origin = match[2] || null;
    var owner = match[3];
    var name = match[4];
    var _checkout = match[5] || 'master';

    origin = origin === null ? type === 'bitbucket' ? 'bitbucket.org' : type + '.com' : origin;
    return {
      type: type,
      origin: origin,
      owner: owner,
      name: name,
      checkout: _checkout
    };
  }
}

function addProtocol(origin, clone) {
  // console.log('addProtocol',origin)
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) return 'git@' + origin;else return 'https://' + origin;
  }
}

function getUrl(repo, clone) {
  var url = '';
  var origin = addProtocol(repo.origin, clone);
  // console.log('getUrl',origin,repo)
  if (/^git\@/i.test(origin)) {
    origin = origin + ':';
  } else {
    origin = origin + '/';
  }

  if (clone) {
    url = origin + repo.owner + '/' + repo.name + '.git';
  } else {
    if (repo.type === 'github') {
      url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip';
    } else if (repo.type === 'gitlab') {
      url = origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout;
    } else if (repo.type === 'bitbucket') {
      url = origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip';
    }
  }
  return url;
}

exports.default = download;