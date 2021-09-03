import * as vscode from 'vscode';
import { inject, injectable } from 'inversify';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { 
	CHOOSE_CATEGORY_MSG, 
	LAST_SEARCHED_TERM_MSG, 
	NO_REPOS_FOUND_MSG, TYPE_SEARCH_TERM_PLACEHOLDER 
} from '../consts/messages';
import { SEARCH_REPOSITORIES } from '../consts/commands';
import { GitHubApiClient } from '../services/github-api-client';
import { Category } from '../models/category';
import { Command } from './base/command';
import { PersonalAccessTokenManager } from '../services/pat-manager';
import { GITMARKER_CONFIG, SEARCH_RESULTS_NUMBER } from '../consts/application';

@injectable()
export class SearchRepositories implements Command {

	constructor
	(
		@inject(TYPES.accessTokenManager) 
		private accessTokenManager: PersonalAccessTokenManager
	) {}

	get id() {
		return SEARCH_REPOSITORIES;
	}

	async execute() {
		const accessToken = await this.accessTokenManager
			.getToken();

		if(accessToken) {
			let searchTerm = await vscode.window.showInputBox({
				value: '',
				placeHolder: TYPE_SEARCH_TERM_PLACEHOLDER,
			});

			if(typeof searchTerm !== 'undefined' && searchTerm) {
				searchTerm = searchTerm.toLowerCase();
				this.setStatusBarMessage(`Searching for ${searchTerm}...`!);

				const config = vscode.workspace
					.getConfiguration(GITMARKER_CONFIG);
	
				const searchResultsPerPage = config
					.get(SEARCH_RESULTS_NUMBER);

				const gitHubRepos = await new GitHubApiClient(accessToken)
					.search(searchTerm, searchResultsPerPage as number);

				if(gitHubRepos.length === 0) {
					this.setStatusBarMessage(`${LAST_SEARCHED_TERM_MSG} "${searchTerm}".`);
					vscode.window.showInformationMessage(`${NO_REPOS_FOUND_MSG} ${searchTerm}.`);
					return;
				}				

				this.setStatusBarMessage(`${LAST_SEARCHED_TERM_MSG} "${searchTerm}".`!);
				const repoDetails = gitHubRepos.map(repoInfo =>  {
					const label = repoInfo.stargazersCount > 0 
					? `${repoInfo.name} ⭐${repoInfo.stargazersCount}` 
					: `${repoInfo.name}`;

					return {
						id: repoInfo.id,
						label: label, 
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
					if(result) {						
						let resultIds = result.map(a => a.id);
						const selectedRepos = gitHubRepos
							.filter(repo => resultIds.includes(repo.id));

						const allCategories = BookmarkManager.instance
								.categoryRepositories.categories;

						// Add to the single category
						if(allCategories.length === 1) {							
							return BookmarkManager.instance
								.bookmarkRepositories(allCategories[0].id, selectedRepos); 
						}

						// Selecting category
						this.pickCategory(allCategories)
						.then(category => {
							return BookmarkManager.instance
								.bookmarkRepositories(category?.id!, selectedRepos);
						});
					}
				});			
			}			
		}
	}

	async pickCategory(categories: Category[]) {
		const categoriesDetails = categories
		.map(categoryInfo =>  {
				return {
					id: categoryInfo.id,
					label: `📁 ${categoryInfo.name}`
				};
			});
	
		// Picking a repo from result list
		return await vscode.window.showQuickPick(categoriesDetails, {
			matchOnDescription: true,
			matchOnDetail: true,
			canPickMany: false,
			title: CHOOSE_CATEGORY_MSG,
		});
	}

	setStatusBarMessage(message: string) {
		vscode.window.setStatusBarMessage(message);
	}	
}
