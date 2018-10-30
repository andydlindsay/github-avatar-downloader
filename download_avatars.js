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
    if (JSON.parse(res.body).message) {
      log('Bad Github credentials');
      return;
    }
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
    if (err) {
      throw err;
    }
    if (result.length) {
      // create the avatars directory if it does not already exist
      mkdirp('./avatars', (err) => {
        if (err) {
          console.error(err);
          return;
        }
        result.forEach((contributor) => {
          downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}`);
        });
        log('Result: Download Complete');
      });
    } else {
      log('Specified repo does not exist');
    }
  });
} else {
  log('USAGE: node download_avatars.js <repoOwner> <repoName>');
}
