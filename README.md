# GitMarker for Visual Studio Code

[![](https://vsmarketplacebadge.apphb.com/version-short/Falberthen.gitmarker.svg)](https://marketplace.visualstudio.com/items?itemName=Falberthen.gitmarker)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/Falberthen.gitmarker.svg)](https://marketplace.visualstudio.com/items?itemName=Falberthen.gitmarker)
[![](https://vsmarketplacebadge.apphb.com/rating-short/Falberthen.gitmarker.svg)](https://marketplace.visualstudio.com/items?itemName=Falberthen.gitmarker)

<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/resources/gitmarker.png" alt="GitMarker Logo" />
</p>


GitMarker is a [Visual Studio Code](https://code.visualstudio.com/) [extension](https://marketplace.visualstudio.com/VSCode) to ease GitHub users searching and bookmarking GitHub repositories, grouping them by categories you create.
In addition to offering quick access to your bookmarked repositories, it highlights some relevant metadata you might want to keep tracked.

## Features

- Search repositories on GitHub by a term and, add the selected results to categories

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/welcome.png">
<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/repo-search.png">


- Syncronize it to update with the latest repository metadata

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/my-repos.png"> 

- Import / Export your bookmarks

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/menu-options.png"> 

## Requirements

Since GitMarker uses the [GitHub API](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api) for searching repositories, you need to provide a [personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token). It will be required when using the search feature for the first time, but also can be set up anytime. Once it's all set, GitMarker stores it in the <b>secret storage</b> to ensure your token will not be read or misused by other extensions.

## Change Log

[Check Changelog](CHANGELOG.md)
