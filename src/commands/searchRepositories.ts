import { TYPE_SEARCH_TERM_PLACEHOLDER } from './../consts/messages';
import * as vscode from 'vscode';
import { GitHubApiClient } from '../services/github-api-client';
import { TreeDataItem } from '../models/tree-data-item';
import BookmarkManager from '../services/bookmark-manager';
import SecretManager from '../services/secret-manager';

export async function searchRepositoriesCommand(dataItem: TreeDataItem) {
   const accessToken = await SecretManager.instance
      .getAccessToken();
      
   if(accessToken) {
      let searchTerm = await vscode.window.showInputBox({
         value: '',
         placeHolder: TYPE_SEARCH_TERM_PLACEHOLDER,
      });
   
      if(typeof searchTerm !== 'undefined' && searchTerm) {
         searchTerm = searchTerm.toLowerCase();
         let gitHubRepos = await new GitHubApiClient(accessToken)
            .search(searchTerm);
   
         if(gitHubRepos.length > 0) {
            let repoDetails = gitHubRepos.map(repoInfo =>  {
               return {
                  id: repoInfo.id,
                  label: repoInfo.name,
                  detail: repoInfo.description,
                  link: repoInfo.url          
               };
            });
      
            // Picking a repo from result list
            await vscode.window.showQuickPick(repoDetails, {
               matchOnDescription: true,
               matchOnDetail: true, 
               canPickMany: true,
               title: `${gitHubRepos.length} items found for ${searchTerm}`,
               onDidSelectItem: item => {}
            }).then((selection) => {
               selection?.forEach(pickedRepo  => {
                  const selectedRepo = gitHubRepos
                     .filter(e=>e.id === pickedRepo.id)[0];
   
                  if(selectedRepo) {
                     BookmarkManager.instance
                        .bookmarkRepository(dataItem, selectedRepo);
                  }
               });
            });
         }
      }
   }	
}