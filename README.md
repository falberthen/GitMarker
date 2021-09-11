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

#### Search repositories on GitHub by a term and, add the selected results to categories

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/welcome.png">
<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/repo-search.png">


#### Syncronize it to update with the latest repository metadata (or enable the Auto Sync feature!)

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/my-repos.png"> 

#### Import / Export your bookmarks

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/menu-options.png"> 

#### Clone a repository with a few clicks!

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/clone.png"> 
<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/clone-into-folder.png"> 

#### Setup settings

- *Default Clone Path*: it will set the path for every time you hit the *Clone repository* button. Otherwise, GitMarker will popup a dialog where you can choose the folder you want the repository to be cloned.
- *Use Default Clone Path*: enables/disables using the Default Clone Path, defined above. `default: false`.
- *Search Results Number*: sets the number of records per page when searching repositories on GitHub. `maximum: 100`.
- *Enable Auto Sync*: synchronizes your bookmarks every time the extension is activated. `default: false`.

<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/images/settings.png"> 

## Notes

GitMarker uses [GitHub API](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api) for its features, like searching and synchronizing repositories. According to the documentation:

> Unauthenticated clients can make 60 requests per hour. To get more requests per hour, we'll need to authenticate. In fact, doing anything interesting with the GitHub API requires authentication.

I recommend you need to set a [Personal Access Token (PAT)](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) on GitMarker to have the best experience. Once it's all set, GitMarker stores it in the <b>secret storage</b> to ensure your token will not be read or misused by other extensions.

## Change Log

[Check Changelog](CHANGELOG.md)