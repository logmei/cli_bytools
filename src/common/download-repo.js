import downloadUrl from 'download'; // https://github.com/rndme/download
import gitClone from 'git-clone';
import rm from 'rimraf';

/**
 * Download repo to dest and callback fn
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */
function download(repo, dest, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = null;
  }
  opts = opts || {};
  const clone = opts.clone || false;
  delete opts.clone;
  repo = normalize(repo);
  const url = repo.url || getUrl(repo, clone);

  if (clone) {
    const options = {
      checkout: repo.checkout,
      shallow: repo.checkout === 'master'
    };
    cloneOptions(opts, options);
    gitClone(url, dest, options, function(err) {
      if (err === undefined) {
        rm.sync(dest + '/.git');
        fn();
      } else {
        fn(err);
      }
    });
  } else {
    const options = {
      extract: true,
      strip: 1,
      mode: '666',
      header: {
        accept: 'application/zip'
      }
    };

    cloneOptions(opts, options);
    cloneOptions(opts.headers, options.header);

    downloadUrl(url, dest, options)
      .then(function(data) {
        fn();
      })
      .catch(function(err) {
        fn(err);
      });
  }
}

function cloneOptions(from, to) {
  if (!from) return;
  Object.keys(from).forEach(v => {
    to[v] = from[v];
  });
}

function normalize(repo) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);
  // console.log('normalize',repo,match)
  if (match) {
    const url = match[2];
    const checkout = match[3] || 'master';
    return {
      type: 'direct',
      url: url,
      checkout: checkout
    };
  } else {
    regex = /^(?:(github|gitlib|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/;

    match = regex.exec(repo);
    // console.log('normalize2',repo,match)
    const type = match[1] || 'github';
    let origin = match[2] || null;
    const owner = match[3];
    const name = match[4];
    const checkout = match[5] || 'master';

    origin = origin === null ? type === 'bitbucket' ? 'bitbucket.org' : type + '.com' : origin;
    return {
      type: type,
      origin: origin,
      owner: owner,
      name: name,
      checkout: checkout
    };
  }
}

function addProtocol(origin, clone) {
  // console.log('addProtocol',origin)
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) return 'git@' + origin;
    else return 'https://' + origin;
  }
}

function getUrl(repo, clone) {
  let url = '';
  let origin = addProtocol(repo.origin, clone);
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

export default download;
