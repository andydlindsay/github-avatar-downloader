require('dotenv').config();

const request = require('request');

module.exports = function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      access_token: process.env.GITHUB_TOKEN
    }
  };
  request(options, (err, res, body) => {
    if (JSON.parse(res.body).message) {
      log('Bad Github credentials');
      return;
    }
    cb(err, JSON.parse(body));
  });
}
