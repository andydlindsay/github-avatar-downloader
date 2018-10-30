require('dotenv').config();

const request = require('request');
const log = console.log;

const getRepoContributors = require('./get_repo_contributors');

function getStarredRepos(username, cb) {
  const options = {
    url: `https://api.github.com/users/${username}/starred`,
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      access_token: process.env.GITHUB_TOKEN
    }
  }
  request(options, (err, res, body) => {
    cb(err, JSON.parse(body));
  });
}

function returnTop5Repos(repoObj) {
  // convert repoObj to an array
  var repoArray = [];
  for (var repo in repoObj) {
    repoArray.push([ repo, repoObj[repo] ]);
  }
  repoArray.sort((a, b) => {
    return b[1] - a[1];
  });
  return repoArray.slice(0, 5);
}

function renderArrayToConsole(inputArray) {
  for (var i = 0; i < inputArray.length; i++) {
    log(`[ ${inputArray[i][1]} stars ] ${inputArray[i][0]}`);
  }
}

// get repoOwner and repoName from command line arguments
const repoOwner = process.argv[2];
const repoName = process.argv[3];

if (repoOwner && repoName) {
  getRepoContributors(repoOwner, repoName, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length) {
      var starredRepos = {};
      var contributorCount = 0;
      result.forEach((contributor) => {
        getStarredRepos(contributor.login, (err, repos) => {
          if (err) {
            throw err;
          }
          repos.forEach((repo) => {
            if (starredRepos.hasOwnProperty(repo.full_name)) {
              starredRepos[repo.full_name] += 1;
            } else {
              starredRepos[repo.full_name] = 1;
            }
          });
          contributorCount++;
          if (contributorCount === result.length) {
            var top5 = returnTop5Repos(starredRepos);
            renderArrayToConsole(top5);
          }
        });
      });

    } else {
      log('Specified repo does not exist');
    }
  });
} else {
  log('USAGE: node recommend.js <repo owner> <repo name>');
}