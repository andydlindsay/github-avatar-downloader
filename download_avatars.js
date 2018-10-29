const request = require('request');
const https = require('https');
const secrets = require('./secrets');
const log = console.log;

log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };
  request(options, (err, res, body) => {
    cb(err, JSON.parse(body));
  });
}

const repoOwner = 'jquery';
const repoName = 'jquery';

getRepoContributors(repoOwner, repoName, (err, result) => {
  log("Errors:", err);
  var filtered = result.map((contributor) => contributor.avatar_url);
  log("Result:");
  filtered.forEach((avatarUrl) => {
    log(avatarUrl);
  });
});
