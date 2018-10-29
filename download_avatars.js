const request = require('request');
const https = require('https');
const fs = require('fs');
const mkdirp = require('mkdirp');
const secrets = require('./secrets');
const log = console.log;

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

const repoOwner = process.argv[2];
const repoName = process.argv[3];

if (repoOwner && repoName) {
  log('Welcome to the GitHub Avatar Downloader!');
  getRepoContributors(repoOwner, repoName, (err, result) => {
    log("Errors:", err);
    var mkdirp = require('mkdirp');
    mkdirp('avatars', function(err) {
      if (err) {
        console.error(err);
        return;
      }
      result.forEach((contributor) => {
        downloadImageByURL(contributor.avatar_url, contributor.login);
      });
      log('Result: Download Complete');
    });
  });
} else {
  log('USAGE: node download_avatars.js <repoOwner> <repoName>');
}
