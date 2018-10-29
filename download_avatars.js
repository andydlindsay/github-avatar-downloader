const request = require('request');
const https = require('https');
const fs = require('fs');
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

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      throw err;
    })
    .pipe(fs.createWriteStream(`avatars/${filePath}.jpg`));
}

const repoOwner = 'jquery';
const repoName = 'jquery';

getRepoContributors(repoOwner, repoName, (err, result) => {
  log("Errors:", err);
  log("Result:");
  result.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, contributor.login);
  });
});
