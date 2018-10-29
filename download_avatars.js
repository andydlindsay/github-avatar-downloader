const request = require('request');
const https = require('https');
const log = console.log;

log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
  request(url, (err, res, body) => {
    cb(err, body);
  });
}

const repoOwner = 'jquery';
const repoName = 'jquery';

getRepoContributors(repoOwner, repoName, (err, result) => {
  log("Errors:", err);
  log("Result:", result);
});
