import { CHOOSE_CATEGORY, TYPE_SEARCH_TERM_PLACEHOLDER } from './../consts/messages';
import * as vscode from 'vscode';
import { GitHubApiClient } from '../services/github-api-client';
import BookmarkManager from '../services/bookmark-manager';
import SecretManager from '../services/secret-manager';
import { Category } from '../models/category';

export async function searchRepositories() {
   const accessToken = await SecretManager.instance
      .getAccessToken();
      
   if(accessToken) {
      let searchTerm = await vscode.window.showInputBox({
         value: '',
         placeHolder: TYPE_SEARCH_TERM_PLACEHOLDER,
      });
   
      if(typeof searchTerm !== 'undefined' && searchTerm) {
         searchTerm = searchTerm.toLowerCase();
         const gitHubRepos = await new GitHubApiClient(accessToken)
            .search(searchTerm);
   
         if(gitHubRepos.length > 0) {
            const repoDetails = gitHubRepos.map(repoInfo =>  {
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
            })
            .then((result) => {                 
               if(result!.length > 0) {
                  let resultIds = result!.map(a => a.id);
                  const selectedRepos = gitHubRepos
                     .filter(repo => resultIds.includes(repo.id));

                  var allCategories = BookmarkManager
                     	.instance.categoryRepositories.categories;

                  // Selecting category
                  if(allCategories.length > 1) {
                     pickCategory(allCategories)
                     .then(category => {                     
                        return BookmarkManager.instance
                           .bookmarkRepositories(category?.id!, selectedRepos);
                     });
                  }
                  else {
                     return BookmarkManager.instance
                           .bookmarkRepositories(allCategories[0].id, selectedRepos);                                          
                  }
               }
            });        
         }
      }
   }
}

async function pickCategory(categories: Category[]) {
   var categoriesDetails = categories
   .map(categoryInfo =>  {
         return {
            id: categoryInfo.id,
            label: categoryInfo.name,
            detail: categoryInfo.name,
         };
      });
   
   // Picking a repo from result list
   return await vscode.window.showQuickPick(categoriesDetails, {
      matchOnDescription: true,
      matchOnDetail: true, 
      canPickMany: false,
      title: CHOOSE_CATEGORY,
   });
}