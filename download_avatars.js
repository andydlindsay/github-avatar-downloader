require('dotenv').config();

const request = require('request');
const https = require('https');
const fs = require('fs');
const mkdirp = require('mkdirp');
const log = console.log;

function getRepoContributors(repoOwner, repoName, cb) {
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
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      throw err;
    })
    .pipe(fs.createWriteStream(`${filePath}.jpg`));
}

// get repoOwner and repoName from command line arguments
const repoOwner = process.argv[2];
const repoName = process.argv[3];

if (repoOwner && repoName) {
  log('Welcome to the GitHub Avatar Downloader!');
  getRepoContributors(repoOwner, repoName, (err, result) => {
    log("Errors:", err);
    // create the avatars directory if it does not already exist
    mkdirp('./avatars', (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        result.forEach((contributor) => {
          downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}`);
        });
        log('Result: Download Complete');
      }
    });
  });
} else {
  log('USAGE: node download_avatars.js <repoOwner> <repoName>');
}
