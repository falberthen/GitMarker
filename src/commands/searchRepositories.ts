import * as vscode from 'vscode';
import { GitHubApiClient } from '../services/github-api-client';
import { BookmarkManager } from '../services/bookmark-manager';
import { TreeDataItem } from '../models/tree-data-item';
import { commands } from '../consts/commands';
import AuthSettings from '../services/secret-manager';
import { storageKeys } from '../consts/storageKeys';

export async function searchRepositoriesCommand(bookmarkManager: BookmarkManager, category: TreeDataItem) {

   const accessToken = await AuthSettings.instance
      .getSecret(storageKeys.accessToken);

   if(!accessToken) { 
      vscode.window.showErrorMessage('A GitHub access_token must be provided');
      vscode.commands.executeCommand(commands.setAccessToken);
      return;
   }      

	let searchTerm = await vscode.window.showInputBox({
		value: '',
		placeHolder: 'Type a term to search on GitHub',
	});

   if(typeof searchTerm !== 'undefined' 
      && searchTerm) {

      searchTerm = searchTerm.toLowerCase();

      var gitHubRepos = await GitHubApiClient
         .search(searchTerm, accessToken);

      if(gitHubRepos.length > 0) {
         var repoDetails = gitHubRepos.map(repoInfo => {
            return {
               id: repoInfo.id,
               label: repoInfo.name,
               detail: repoInfo.description,
               link: repoInfo.url
            };
         });
   
         // Picking repo from result list
         var pickedRepo = await vscode.window.showQuickPick(repoDetails, {
            matchOnDetail: true
         });
         
         const selectedRepo = gitHubRepos
            .filter(e=>e.id === pickedRepo?.id)[0];

         if(selectedRepo) {
            bookmarkManager.addBookmark(category, selectedRepo);
         }         
      }      
   }
}