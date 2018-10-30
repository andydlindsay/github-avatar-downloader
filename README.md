# GitHub Avatar Downloader & Repo Recommendation

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/` or recommend 5 popular repos based on the given repository.

## Expected Usage

This program should be executed from the command line, in the following manner:

To return contributors' profile images, use:

```
node download_avatars.js <repo owner> <repo name>
```

To return top 5 recommended repos, use:

```
node recommend.js <repo owner> <repo name>
```
