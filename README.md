## GitMarker for Visual Studio Code

<p align="center">
	<a href="https://marketplace.visualstudio.com/items?itemName=Falberthen.gitmarker" target="_blank">
		<img src="https://raw.githubusercontent.com/falberthen/gitmarker/master/resources/gitmarker.png" alt="GitMarker Logo" />
	</a>
</p>

<br/>

<a href="https://marketplace.visualstudio.com/items?itemName=Falberthen.gitmarker" target="_blank">GitMarker</a> is an extension for `Visual Studio Code` to ease GitHub users searching and bookmarking repositories and grouping them by custom categories. In addition, it highlights some relevant metadata you want to keep track of, such as stars, licenses, forks, and so on.

Did you like it? Please give it a star ⭐ and support the project.

---

<br/>
<img src="/images/gitmarker-1.gif">
<br/>
<img src="/images/gitmarker-2.gif">
<br/>
<img src="/images/gitmarker-3.gif">
<br/>
<img src="/images/gitmarker-4.gif">
<br/>

## Features
You can easily search repositories on GitHub by a term and add the selected results to categories you created. Results will be cached until next search.
- Synchronize to update with the latest repository data, one by one, or enable the Auto Sync feature!
- You will know if a bookmarked repository was deleted or became private by the author.
- Manage your bookmarks with Export and Import.
- GIT clone capabilities (GIT installed is required)


### Setup settings

- *Auto Sync Enabled*: synchronizes your bookmarks every time the extension is activated. `default: true`.
- *Default Clone Path*: it will set the path for every time you hit the *Clone repository* button. Otherwise, GitMarker will popup a dialog where you can choose the folder you want the repository to be cloned.
- *Use Default Clone Path*: enables/disables using the Default Clone Path, defined above. `default: false`.
- *Search Results Per Page*: sets the number of records per page when searching repositories on GitHub. `maximum: 100`.

<br/>

## Notes
GitMarker uses [GitHub API](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api) for its features, like searching and synchronizing repositories. According to the documentation:

> Unauthenticated clients can make 60 requests per hour. To get more requests per hour, we'll need to authenticate. In fact, doing anything interesting with the GitHub API requires authentication.

I recommend you set a [Personal Access Token (PAT)](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) on GitMarker to have the best experience. Once it's all set, GitMarker stores it in the <b>secret storage</b> to ensure your token will not be read or misused by other extensions.

<br/>

## Change Log and development
The extension was fully developed with <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a> using Visual Studio Code and its <a href="https://code.visualstudio.com/api" target="_blank">Extension API</a>. You can learn more about the process with <a href="https://falberthen.github.io/posts/gitmarker-pt1/" target="_blank">this</a> series of articles, which I detail step by step.

[Check the changelog](CHANGELOG.md) if you're interested in following the development progression, new features added, and bug fixes.